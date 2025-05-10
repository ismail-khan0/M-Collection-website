// app/account/orders/[id]/page.js
'use client';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import OrderDetails from '../../../Components/OrderDetails';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    redirect(`/signin?callbackUrl=/account/orders/${id}`);
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders?id=${id}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchOrder();
    }
  }, [id, status]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <OrderDetails order={order} />
    </div>
  );
}