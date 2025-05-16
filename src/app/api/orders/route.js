import Order from '../../../../model/order';
import connectMongoDB from '../../../../lib/connectMongoDB ';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth.config';

function parsePrice(price) {
  if (typeof price === 'number') return price;
  if (typeof price !== 'string') return 0;
  const numericString = price.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(numericString);
  return isNaN(parsed) ? 0 : parsed;
}

export async function GET(req) {
  await connectMongoDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');

    if (id) {
      const order = await Order.findById(id).populate('user items.productId');
      if (!order) {
        return new Response(JSON.stringify({ success: false, error: 'Order not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ success: true, order }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      let query = { user: session.user.id };
      if (status && status !== 'all') {
        query.status = status;
      }

      const orders = await Order.find(query).sort({ createdAt: -1 });
      return new Response(JSON.stringify({ success: true, orders }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in orders GET API:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  await connectMongoDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      totalDiscount,
      totalPrice,
    } = await req.json();

    const orderNumber = Math.floor(100000 + Math.random() * 900000);

    const newOrder = new Order({
      orderNumber,
      user: session.user.id,
      items: items.map((item) => ({
        productId: item.id,
        name: item.name,
        image: item.image,
        price: parsePrice(item.price),
        discountPrice: item.discountPrice ? parsePrice(item.discountPrice) : null,
        quantity: item.quantity || 1,
        category: item.category || 'Uncategorized', // ✅ Add category here
      })),
      shippingAddress,
      paymentMethod,
      subtotal: parsePrice(subtotal),
      totalDiscount: parsePrice(totalDiscount),
      totalPrice: parsePrice(totalPrice),
      status: 'pending',
      payment: {
        status: paymentMethod === 'cod' ? 'pending' : 'completed',
        amount: parsePrice(totalPrice),
      },
    });

    await newOrder.save();

    return new Response(JSON.stringify({ success: true, order: newOrder }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in orders POST API:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
