import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearWishlist } from '@/app/redux/wishlistSlice';

const OrderConfirmation = ({ orderDetails, onContinue }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear wishlist when component mounts (order is confirmed)
    dispatch(clearWishlist());
  }, [dispatch]);

  if (!orderDetails) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500">Order details are missing.</p>
        <button
          onClick={() => router.push('/products')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // Group items by category
  const itemsByCategory = orderDetails.items.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl mx-auto p-4 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircleIcon className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
      <p className="text-gray-600 mb-6">Thank you for your purchase</p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
        <h3 className="font-medium mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Order Number:</span>
            <span className="font-medium">#{orderDetails.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span className="capitalize">{orderDetails.paymentMethod}</span>
          </div>
          <div className="flex justify-between font-medium pt-3 border-t">
            <span>Total:</span>
            <span>Rs.{orderDetails.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white p-6 rounded-lg border mb-6 text-left">
        <h3 className="font-medium mb-4">Purchased Categories</h3>
        <div className="space-y-4">
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <div key={category} className="border-b pb-4 last:border-b-0">
              <h4 className="font-medium text-gray-800 capitalize">{category}</h4>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-12 object-contain bg-gray-100 rounded"
                    />
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Rs.{item.discountPrice || item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg mb-6 text-left">
        <h3 className="font-medium mb-2">Shipping Address</h3>
        <p>{orderDetails.address.fullName}</p>
        <p>{orderDetails.address.street}</p>
        <p>
          {orderDetails.address.city}, {orderDetails.address.state}{' '}
          {orderDetails.address.zipCode}
        </p>
        <p>{orderDetails.address.country}</p>
        <p className="mt-2">Phone: {orderDetails.address.phone}</p>
      </div>

      <button
        onClick={() => router.push('/products')}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmation;