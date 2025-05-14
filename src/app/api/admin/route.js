// app/api/admin/login/route.js
import { NextResponse } from 'next/server';
import User from '@/model/user';
import bcrypt from 'bcryptjs';
import connectMongoDB from '@/lib/connectMongoDB';
import { signIn } from 'next-auth/react';

export async function POST(req) {
  try {
    await connectMongoDB();
    const { email, password } = await req.json();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify admin status
    if (!user.isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin access denied' },
        { status: 403 }
      );
    }

    // Create session
    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/admin/dashboard',
    });

    return NextResponse.json(
      { success: true, message: 'Admin login successful' }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}