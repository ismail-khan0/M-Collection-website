import Message from "@/model/Message";
import { connectMongoDB } from "@/lib/connectMongoDB";

export async function GET(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const recipientId = searchParams.get('recipientId');
    
    if (!recipientId) {
      return new Response(JSON.stringify({ error: 'Recipient ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const messages = await Message.find({
      $or: [
        { recipientId, senderId: req.user.id },
        { recipientId: req.user.id, senderId: recipientId }
      ]
    }).sort({ createdAt: 1 });

    return new Response(JSON.stringify({ messages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch messages' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}