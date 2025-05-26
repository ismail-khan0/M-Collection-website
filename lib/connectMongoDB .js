import mongoose from 'mongoose';

const connection = {};

export default async function connectMongoDB() {
  if (connection.isConnected) return;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI not defined in environment variables');
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    connection.isConnected = db.connections[0].readyState;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}