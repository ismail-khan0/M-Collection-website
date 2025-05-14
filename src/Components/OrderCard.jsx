// components/OrderCard.js
'use client';
import Link from 'next/link';
import { format } from 'date-fns';

export default function OrderCard({ order }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 p-4 flex justify-between items-center">
        <div>
          <span className="font-medium">Order #{order.orderNumber}</span>
          <span className="text-sm text-gray-500 ml-4">
            {format(new Date(order.createdAt), 'MMM dd, yyyy')}
          </span>
        </div>
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
            {order.status}
          </span>
          <span className="ml-4 font-medium">Rs.{order.totalPrice.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
            <p className="mt-1 text-sm">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state}<br />
              {order.shippingAddress.country} - {order.shippingAddress.zipCode}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Payment</h3>
            <p className="mt-1 text-sm capitalize">{order.paymentMethod}</p>
            <p className="text-sm">
              Status: <span className="capitalize">{order.payment.status}</span>
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Order Summary</h3>
            <p className="mt-1 text-sm">
              {order.items.length} item(s)<br />
              Total: Rs.{order.totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Items</h3>
          <div className="space-y-3">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Rs.{item.discountPrice || item.price} × {item.quantity}
                  </p>
                </div>
              </div>
            ))}
            {order.items.length > 2 && (
              <p className="text-sm text-gray-500">
                +{order.items.length - 2} more items
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Link
            href={`/account/orders/${order._id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View Order Details
          </Link>
        </div>
      </div>
    </div>
  );
}