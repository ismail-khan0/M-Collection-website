export default function OrderCard({ order, onUpdateStatus, onDelete }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">Order #{order.orderNumber}</h3>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs capitalize ${
            order.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : order.status === "processing"
              ? "bg-blue-100 text-blue-800"
              : order.status === "shipped"
              ? "bg-purple-100 text-purple-800"
              : order.status === "delivered"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Shipping Address */}
        <div className="bg-gray-50 p-3 rounded">
          <h4 className="font-medium mb-2">Shipping Address</h4>
          <p>{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.street}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.zipCode}
          </p>
          <p>{order.shippingAddress.country}</p>
          <p className="mt-1">Phone: {order.shippingAddress.phone}</p>
        </div>

        {/* Payment Info */}
        <div className="bg-gray-50 p-3 rounded">
          <h4 className="font-medium mb-2">Payment</h4>
          <p className="capitalize">{order.paymentMethod}</p>
          <div className="mt-2">
            <p>Subtotal: Rs.{order.subtotal.toFixed(2)}</p>
            <p>Discount: -Rs.{order.totalDiscount.toFixed(2)}</p>
            <p className="font-medium">
              Total: Rs.{order.totalPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-gray-50 p-3 rounded">
          <h4 className="font-medium mb-2">Items ({order.items.length})</h4>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 object-contain mr-2"
                />
                <div>
                  <p className="text-sm line-clamp-1">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    Rs.{item.discountPrice || item.price} x {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <select
          value={order.status}
          onChange={(e) => onUpdateStatus(order._id, e.target.value)}
          className="p-2 border rounded text-sm"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          onClick={() => onDelete(order._id)}
          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
        >
          Delete
        </button>
        <button
          onClick={() => {}}
          className="text-blue-600 hover:underline text-sm"
        >
          View Details
        </button>
      </div>
    </div>
  );
}