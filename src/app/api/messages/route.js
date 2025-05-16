// app/api/chat/messages/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth.config";
import ChatMessage from "../../../../model/chatMessage";
import connectMongoDB from "../../../../lib/connectMongoDB ";


export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoDB();

  try {
    const messages = await ChatMessage.find({
      $or: [
        { senderId: session.user.id },
        { recipientId: session.user.id }
      ]
    }).sort({ createdAt: 1 });

    return Response.json({ 
      messages: messages.map(msg => ({
        ...msg.toObject(),
        _id: msg._id.toString(),
        senderId: msg.senderId.toString(),
        recipientId: msg.recipientId?.toString()
      }))
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoDB();

  try {
    const { message } = await req.json();

    const newMessage = await ChatMessage.create({
      message,
      sender: "user",
      senderId: session.user.id,
      senderName: session.user.name,
      recipient: "admin",
      recipientId: null, // or your admin ID if you have one
      read: false,
    });

    return Response.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
