// app/api/admin/users/route.js
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import User from '../../../../../model/user';
import connectMongoDB from '../../../../../lib/connectMongoDB ';

export async function GET() {
  await connectMongoDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await User.find({ isAdmin: false }).select('name email');
    return Response.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}