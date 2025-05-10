// components/OrderDetails.js
'use client';
import { format } from 'date-fns';

export default function OrderDetails({ order }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-medium mb-3">Shipping Address</h2>
          <p>{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.street}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
          <p>{order.shippingAddress.country} - {order.shippingAddress.zipCode}</p>
          <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-medium mb-3">Payment Information</h2>
          <p className="capitalize">{order.paymentMethod}</p>
          <p>Status: <span className="capitalize">{order.payment.status}</span></p>
          <p className="mt-2">Order Date: {format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-medium mb-3">Order Items</h2>
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 grid grid-cols-12 p-3 font-medium">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          {order.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 p-3 border-t">
              <div className="col-span-6 flex items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-center">
                Rs.{item.discountPrice || item.price}
              </div>
              <div className="col-span-2 flex items-center justify-center">
                {item.quantity}
              </div>
              <div className="col-span-2 flex items-center justify-end">
                Rs.{((item.discountPrice || item.price) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <div className="w-full md:w-1/3">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-medium mb-3">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs.{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span className="text-red-500">-Rs.{order.totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-medium">
                <span>Total:</span>
                <span>Rs.{order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}