import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import ChatMessage from "../../../../../model/chatMessage";
import connectMongoDB from "../../../../../lib/connectMongoDB ";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  // Improved validation
  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    return Response.json({ error: "Valid User ID is required" }, { status: 400 });
  }

  await connectMongoDB();

  try {
    let userIdObj;
    try {
      userIdObj = new ObjectId(userId); // Throws error if invalid
    } catch (error) {
      return Response.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Rest of your logic...
    const messages = await ChatMessage.find({
      $or: [
        { senderId: userIdObj, recipient: "admin" },
        { recipientId: userIdObj, sender: "admin" }
      ]
    }).sort({ createdAt: 1 });

    await ChatMessage.updateMany(
      { senderId: userIdObj, read: false },
      { $set: { read: true } }
    );

    return Response.json({
      messages: messages.map((msg) => ({
        id: msg._id.toString(),
        message: msg.message,
        sender: msg.sender,
        senderId: msg.senderId.toString(),
        senderName: msg.senderName || (msg.sender === "user" ? "User" : "Support Agent"),
        recipientId: msg.recipientId?.toString(),
        timestamp: msg.createdAt.toISOString(),
        read: msg.read,
      })),
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoDB();

  try {
    const { message, recipientId } = await req.json();

    if (!message || !recipientId) {
      return Response.json(
        { error: "Message and recipient ID are required" },
        { status: 400 }
      );
    }

    const newMessage = await ChatMessage.create({
      message,
      sender: "admin",
      senderId: session.user.id,
      senderName: "Support Agent",
      recipientId,
      read: true,
    });

    return Response.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}