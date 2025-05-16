'use client';
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { socket } from "../../../../lib/socket";
import { useRouter } from "next/navigation";

export default function AdminChat() {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/admin/signin");
      return;
    }
    if (session && !session.user?.isAdmin) {
      router.push("/unauthorized");
      return;
    }

    setLoading(false);
    socket.connect();

    const onConnect = () => {
      setIsConnected(true);
      socket.emit("join-admin-room");
      loadConversations();
    };

    const onPrivateMessage = (message) => {
      if (selectedUser?.id === message.senderId || selectedUser?.id === message.recipientId) {
        setMessages((prev) => [...prev, message]);
      }
      
      setConversations(prev => prev.map(conv => 
        conv.user.id === message.senderId || conv.user.id === message.recipientId
          ? { 
              ...conv, 
              lastMessage: message.message, 
              timestamp: message.timestamp,
              unread: message.sender !== 'admin'
            }
          : conv
      ));
    };

    const onConversationUpdate = (update) => {
      setConversations(prev => {
        const existing = prev.find(c => c.user.id === update.userId);
        if (existing) {
          return prev.map(c => 
            c.user.id === update.userId 
              ? { 
                  ...c, 
                  lastMessage: update.lastMessage, 
                  timestamp: update.timestamp,
                  unread: update.unread
                } 
              : c
          );
        } else {
          return [
            {
              user: update.user || { id: update.userId, name: "User" },
              lastMessage: update.lastMessage,
              timestamp: update.timestamp,
              unread: update.unread
            },
            ...prev
          ];
        }
      });
    };

    socket.on("connect", onConnect);
    socket.on("private-message", onPrivateMessage);
    socket.on("conversation-update", onConversationUpdate);

    const loadConversations = async () => {
      try {
        const res = await fetch("/api/admin/conversations");
        if (!res.ok) throw new Error("Failed to fetch conversations");
        const data = await res.json();
        
        setConversations(data.conversations);
        
        if (data.conversations.length > 0 && !selectedUser) {
          setSelectedUser(data.conversations[0].user);
        }
      } catch (err) {
        setError("Failed to load conversations");
      }
    };

    return () => {
      socket.off("connect", onConnect);
      socket.off("private-message", onPrivateMessage);
      socket.off("conversation-update", onConversationUpdate);
      socket.disconnect();
    };
  }, [status, session, router]);

  useEffect(() => {
    if (selectedUser && selectedUser.id) {
      const loadMessages = async () => {
        try {
          const res = await fetch(
            `/api/admin/messages?userId=${selectedUser.id}`
          );
          if (!res.ok) throw new Error("Failed to fetch messages");
          const data = await res.json();

          const formattedMessages = data.messages.map((msg) => ({
            ...msg,
            senderId: msg.senderId.toString(),
            timestamp: msg.timestamp || new Date(msg.createdAt).toISOString(),
          }));

          setMessages(formattedMessages);
          
          setConversations(prev => prev.map(conv => 
            conv.user.id === selectedUser.id 
              ? { ...conv, unread: false } 
              : conv
          ));
        } catch (err) {
          console.error("Error loading messages:", err);
          setError("Failed to load messages");
        }
      };

      loadMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedUser || !session) return;

    const newMessage = {
      message: input,
      sender: "admin",
      senderId: session.user.id,
      senderName: "Support Agent",
      recipientId: selectedUser.id,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          recipientId: selectedUser.id,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      socket.emit("private-message", {
        ...newMessage,
        recipient: "user",
        recipientId: selectedUser.id
      });

      setConversations((prev) =>
        prev.map((conv) =>
          conv.user?.id === selectedUser.id
            ? {
                ...conv,
                lastMessage: input,
                timestamp: new Date().toISOString(),
                unread: false,
              }
            : conv
        )
      );
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.slice(0, -1));
      setInput(newMessage.message);
      setError("Failed to send message");
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return formatTime(timestamp);
    } else if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans bg-gray-50">
      {/* Sidebar */}
      <aside className="w-1/3 border-r bg-white">
        <div className="p-4 text-blue-600 font-bold text-lg border-b">
          Support Dashboard
        </div>
        <div>
          {conversations.length === 0 ? (
            <p className="p-4 text-gray-500">No conversations yet</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.user?.id}
                onClick={() => setSelectedUser(conv.user)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 ${
                  selectedUser?.id === conv.user?.id ? "bg-blue-50" : ""
                } ${conv.unread ? "font-semibold" : ""}`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {conv.user?.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1">
                  <p className={`${conv.unread ? "text-blue-600" : "text-gray-800"}`}>
                    {conv.user?.name || "Unknown User"}
                  </p>
                  <p
                    className={`text-sm truncate ${
                      conv.unread ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {conv.lastMessage || "No messages yet"}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-xs text-gray-400">
                    {conv.timestamp ? formatDate(conv.timestamp) : ""}
                  </p>
                  {conv.unread && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1"></span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Chat Section */}
      <main className="w-2/3 flex flex-col">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b bg-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {selectedUser.name?.charAt(0) || "?"}
                </div>
                <h2 className="font-semibold text-blue-600">
                  {selectedUser.name || "Unknown User"}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400"></span>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No messages yet. Start the conversation.
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                        msg.sender === "admin"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.sender !== "admin" && (
                        <p className="font-semibold text-sm">
                          {msg.senderName || selectedUser?.name || "User"}
                        </p>
                      )}
                      <p>{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1 text-right">
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 border-t bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                disabled={!input.trim()}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to start chatting.
          </div>
        )}
      </main>
    </div>
  );
}