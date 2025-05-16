// app/api/admin/conversations/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth.config';

// Force dynamic rendering - crucial for API routes with auth/database
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Verify session
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Dynamic imports for database modules
    const { default: connectMongoDB } = await import('../../../../../lib/connectMongoDB ');
    const { default: ChatMessage } = await import('../../../../../modelchatMessage');
    const { default: User } = await import('../../../../../model/user');

    await connectMongoDB();

    // Simplified aggregation for better build compatibility
    const conversations = await ChatMessage.aggregate([
      {
        $match: {
          $or: [
            { sender: 'user', recipient: 'admin' },
            { sender: 'admin', recipient: 'user' }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
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
          lastMessage: { $first: '$message' },
          timestamp: { $first: '$createdAt' },
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
      }
    ]);

    // Parallel user fetching with error handling
    const enrichedConversations = await Promise.all(
      conversations.map(async (msg) => {
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
        } catch (error) {
          console.error(`Error processing user ${msg._id}:`, error);
          return null;
        }
      })
    );

    return NextResponse.json({ 
      conversations: enrichedConversations.filter(Boolean) 
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}