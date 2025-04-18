
import connectMongoDB from "lib/connectMongoDB ";
import User from "model/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { email } = await req.json();
    const user = await User.findOne({ email }).select("_id");
    console.log("User", user);

    // Return plain boolean or existence status
    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.log("API error in userExists:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
