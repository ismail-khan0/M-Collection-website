// model/chatMessage.js
import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'admin'],
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  senderName: {
    type: String
  },
  recipient: {
    type: String,
    enum: ['user', 'admin']
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for faster queries
chatMessageSchema.index({ senderId: 1, createdAt: 1 });
chatMessageSchema.index({ recipientId: 1, createdAt: 1 });
chatMessageSchema.index({ read: 1 });

const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;