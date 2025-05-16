import User from '../../../../model/user';
import connectMongoDB from '../../../../lib/connectMongoDB ';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth.config';

export async function GET(req) {
  await connectMongoDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const user = await User.findById(session.user.id).populate('wishlist');
    return new Response(JSON.stringify({ success: true, wishlist: user.wishlist }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in wishlist API:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(req) {
  await connectMongoDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { productId } = await req.json();
    const user = await User.findById(session.user.id);
    const index = user.wishlist.indexOf(productId);

    if (index >= 0) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    return new Response(JSON.stringify({ success: true, wishlist: user.wishlist }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in wishlist API:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}