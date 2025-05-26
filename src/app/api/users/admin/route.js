import connectMongoDB from "../../../../../lib/connectMongoDB ";
import User from "../../../../../model/user";

export const dynamic = 'force-dynamic'; // Essential for API routes

export async function GET() {
  try {
    // Debug: Log environment variables (remove in production)
    console.log("MONGODB_URI:", process.env.MONGODB_URI ? "exists" : "missing");
    
    await connectMongoDB();
    
    const admin = await User.findOne({ isAdmin: true }).select("_id").lean();
    
    if (!admin) {
      return Response.json({ 
        success: false,
        error: "Admin user not found" 
      }, { 
        status: 404 
      });
    }

    return Response.json({ 
      success: true,
      adminId: admin._id.toString() 
    });
  } catch (error) {
    console.error("Error in GET /api/user/admin:", error);
    return Response.json({ 
      success: false,
      error: "Internal server error",
      message: error.message 
    }, { 
      status: 500 
    });
  }
}