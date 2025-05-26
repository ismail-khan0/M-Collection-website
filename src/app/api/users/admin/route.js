import connectMongoDB from "../../../../../lib/connectMongoDB ";
import User from "../../../../../model/user";
export async function GET() {
  try {
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