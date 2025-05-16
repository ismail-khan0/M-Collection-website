// app/api/admin/conversations/route.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/config';
import ChatMessage from '../../../../../model/chatMessage';
import User from '../../../../../model/user';
import connectMongoDB from '../../../../../lib/connectMongoDB ';
import { NextResponse } from 'next/server';

export async function GET() {
  // Verify admin authentication
  let session;
  try {
    session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }
  } catch (authError) {
    console.error('Authentication error:', authError);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }

  // Connect to database
  try {
    await connectMongoDB();
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    );
  }

  // Fetch conversations
  try {
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

    const conversations = (await Promise.all(
      userMessages.map(async (msg) => {
        try {
          const user = await User.findById(msg._id).select('name email');
          return user ? {
            user: {
              id: user._id.toString(),
              name: user.name,
              email: user.email
            },
            lastMessage: msg.lastMessage,
            timestamp: msg.timestamp,
            unread: msg.unreadCount > 0
          } : null;
        } catch (userError) {
          console.error('Error fetching user:', userError);
          return null;
        }
      })
    )).filter(c => c !== null);

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}