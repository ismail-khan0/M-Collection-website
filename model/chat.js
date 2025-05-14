import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for admin participant
chatSchema.virtual('adminParticipant', {
  ref: 'User',
  localField: 'participants',
  foreignField: '_id',
  justOne: true,
  match: { isAdmin: true }
});

// Virtual for non-admin participant
chatSchema.virtual('userParticipant', {
  ref: 'User',
  localField: 'participants',
  foreignField: '_id',
  justOne: true,
  match: { isAdmin: false }
});

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

export default Chat;