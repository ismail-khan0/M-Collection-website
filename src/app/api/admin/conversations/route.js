// app/api/admin/conversations/route.js
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth.config';
import ChatMessage from '../../../../../model/chatMessage';
import User from '../../../../../model/user';
import connectMongoDB from '../../../../../lib/connectMongoDB ';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectMongoDB();

  try {
    // Get all unique users who have communicated with admin
    const userMessages = await ChatMessage.aggregate([
      {
        $match: {
          $or: [
            { sender: 'user', recipient: 'admin' },
            { sender: 'admin', recipient: 'user' }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', 'user'] },
              '$senderId',
              '$recipientId'
            ]
          },
          lastMessage: { $last: '$message' },
          timestamp: { $last: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ['$sender', 'user'] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { timestamp: -1 }
      }
    ]);

    const conversations = await Promise.all(
      userMessages.map(async (msg) => {
        const user = await User.findById(msg._id).select('name email');
        if (!user) return null;
        
        return {
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email
          },
          lastMessage: msg.lastMessage,
          timestamp: msg.timestamp,
          unread: msg.unreadCount > 0
        };
      })
    );

    return Response.json({ 
      conversations: conversations.filter(c => c !== null) 
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return Response.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}