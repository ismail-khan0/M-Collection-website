import mongoose from "mongoose";
import Cors from 'cors'; // Install using: npm install cors

// Initialize CORS middleware
const cors = Cors({
  origin: ["https://deploy-mern-lwhq.vercel.app"],
  methods: ["POST", "GET"],
  credentials: true
});

const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to MongoDB");
      return;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    throw error; // Rethrow to handle in API routes
  }
};

export default connectMongoDB;