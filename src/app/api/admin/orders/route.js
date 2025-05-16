import Order from '../../../../../model/order';
import connectMongoDB from '../../../../../lib/connectMongoDB ';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth.config';

export async function GET(req) {
  await connectMongoDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const id = searchParams.get('id');

    if (id) {
      // Get single order
      const order = await Order.findById(id).populate('user', 'name email');
      if (!order) {
        return new Response(JSON.stringify({ success: false, error: 'Order not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ success: true, order }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get all orders with optional status filter
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    return new Response(JSON.stringify({ success: true, orders }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in admin orders API:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(req) {
  await connectMongoDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }), 
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get the order ID from query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    // Get the request body
    const { status, paymentStatus } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Order ID is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!status) {
      return new Response(
        JSON.stringify({ success: false, error: 'Status is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updateData = { status };
    if (paymentStatus) {
      updateData['payment.status'] = paymentStatus;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate('user', 'name email');

    if (!updatedOrder) {
      return new Response(
        JSON.stringify({ success: false, error: 'Order not found' }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, order: updatedOrder }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating order:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(req) {
  await connectMongoDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }), 
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Order ID is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return new Response(
        JSON.stringify({ success: false, error: 'Order not found' }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Order deleted successfully' }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting order:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}