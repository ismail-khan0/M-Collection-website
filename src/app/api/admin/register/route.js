import User from "../../../../../model/user";
import bcrypt from "bcryptjs";
import connectMongoDB from "../../../../../lib/connectMongoDB ";

export async function POST(request) {
  try {
    await connectMongoDB();

    const { fullname, email, password, isAdmin } = await request.json();

    if (!fullname || !email || !password) {
      return Response.json(
        { error: 'Full name, email and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false
    });

    return Response.json(
      {
        id: user._id,
        name: user.fullname,
        email: user.email,
        isAdmin: user.isAdmin
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}