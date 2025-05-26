import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth.config';
import User from '../../../../../model/user';
import connectMongoDB from '../../../../../lib/connectMongoDB ';

export const dynamic = 'force-dynamic'; // Prevent prerendering

export async function GET() {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await User.find({ isAdmin: false }).select('name email');
    return Response.json({ users });
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}