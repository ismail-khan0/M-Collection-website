import connectMongoDB from "../../../../lib/connectMongoDB ";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../../model/user"; // or correct path to user model


export async function POST(req) {
  try {
    const body = await req.json();
    const { fullname, email, password } = body;
    const hashPassword= await bcrypt.hash(password,10)
    await connectMongoDB();
    console.log("MongoDB connection established");
    
    await User.create({ fullname, email, password:hashPassword });
    console.log("Creating user:", { fullname, email, password: hashPassword });

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    console.error("Error during user registration:", error);
    
    
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    )
  }
}
