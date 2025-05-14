// app/chat/page.jsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { socket } from '../../../lib/socket';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);
  const { data: session } = useSession();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/support');
      return;
    }

    // Initialize socket connection
    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      // Join private room with user ID
      socket.emit('join-private-room', { 
        userId: session.user.id,
        username: session.user?.name 
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for messages
    socket.on('private-message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Listen for admin status
    socket.on('admin-status', (status) => {
      setAdminOnline(status);
    });

    // Load previous messages
    const loadMessages = async () => {
      try {
        const res = await fetch('/api/messages');
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };
    loadMessages();

    // Clean up on unmount
    return () => {
      socket.off('private-message');
      socket.off('admin-status');
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [session, router]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage = {
      message: messageInput,
      sender: 'user',
      senderId: session.user.id,
      senderName: session.user?.name,
      timestamp: new Date().toISOString()
    };

    // Optimistically add message to local state
    setMessages((prev) => [...prev, newMessage]);
    
    try {
      // Save message to database
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageInput,
          sender: 'user',
          senderId: session.user.id
        }),
      });

      // Send message via socket
      socket.emit('private-message', {
        ...newMessage,
        recipient: 'admin' // Send to admin
      });

      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove optimistic update if failed
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Support Chat</h1>
        <div className="flex justify-between items-center">
          <p className="text-sm">Welcome, {session?.user?.name}</p>
          <div className="flex items-center">
            <span className={`h-2 w-2 rounded-full mr-2 ${adminOnline ? 'bg-green-400' : 'bg-red-400'}`}></span>
            <span className="text-xs">{adminOnline ? 'Admin online' : 'Admin offline'}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No messages yet</p>
            <p className="text-sm">Start a conversation with our support team</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white border border-gray-300'}`}
              >
                {msg.sender !== 'user' && (
                  <p className="font-semibold text-sm">Support Agent</p>
                )}
                <p>{msg.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-300 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!isConnected}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={!messageInput.trim() || !isConnected}
          >
            Send
          </button>
        </div>
        {!isConnected && (
          <p className="text-red-500 text-xs mt-1">Connecting to chat server...</p>
        )}
      </form>
    </div>
  );
}