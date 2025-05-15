"use client";

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { socket } from '../../../lib/socket.js';
import { useRouter } from 'next/navigation';

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
      return;
    }

    if (status !== 'authenticated') return;

    socket.connect();

    const onConnect = () => {
      setIsConnected(true);
      socket.emit('join-private-room', {
        userId: session.user.id,
        username: session.user?.name
      });
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onPrivateMessage = (data) => {
      setMessages(prev => [...prev, {
        ...data,
        timestamp: data.timestamp || new Date().toISOString()
      }]);
    };

    const onAdminStatus = (status) => {
      setAdminOnline(status);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('private-message', onPrivateMessage);
    socket.on('admin-status', onAdminStatus);

    const loadMessages = async () => {
      try {
        const res = await fetch('/api/messages');
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp || new Date(msg.createdAt || Date.now()).toISOString()
          })));
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMessages();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('private-message', onPrivateMessage);
      socket.off('admin-status', onAdminStatus);
      socket.disconnect();
    };
  }, [session, status, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !session) return;

    const newMessage = {
      message: messageInput,
      sender: 'user',
      senderId: session.user.id,
      senderName: session.user?.name,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageInput,
          sender: 'user',
          senderId: session.user.id
        }),
      });

      socket.emit('private-message', {
        ...newMessage,
        recipient: 'admin'
      });

      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => prev.slice(0, -1));
    }
  };

  const formatTime = (timestamp) => {
    try {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96 bg-gray-50">
        
     <div className={`text-white px-4 py-1 flex justify-between items-center ${adminOnline ? 'bg-green-200' : 'bg-red-200'}`}>
  <div className="flex items-center space-x-2 text-sm text-gray-600">
    <span className={`h-2 w-2 rounded-full ${adminOnline ? 'bg-green-400' : 'bg-red-400'}`}></span>
    <span>{adminOnline ? 'Admin online' : 'Admin offline'}</span>
  </div>
</div>


      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <p>No messages yet</p>
            <p className="text-sm">Start a conversation with our support team</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={`${msg.timestamp}-${index}`} 
              className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs p-3 rounded-lg ${msg.sender === 'user' 
                  ? 'bg-blue-500 text-white rounded-br-none' 
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}
              >
                {msg.sender !== 'user' && (
                  <div className="font-semibold text-sm mb-1">Support Agent</div>
                )}
                <div>{msg.message}</div>
                <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={handleSendMessage} 
        className="border-t border-gray-200 p-3 bg-white"
      >
        <div className="flex">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
           className="flex-1 border border-gray-300 rounded-l-lg p-1 focus:outline-none  focus:ring-blue-500"
            placeholder="Type your message..."
            disabled={!isConnected}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors"
            disabled={!messageInput.trim() || !isConnected}
          >
            Send
          </button>
        </div>
        {!isConnected && (
          <p className="text-xs text-red-500 mt-1">Connecting to chat server...</p>
        )}
      </form>
    </div>
  );
}
