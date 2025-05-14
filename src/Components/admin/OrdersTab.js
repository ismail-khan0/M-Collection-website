import OrderCard from "./OrderCard";

export default function OrdersTab({
  orders,
  isLoading,
  orderStatusFilter,
  onStatusFilterChange,
  onUpdateStatus,
  onDeleteOrder,
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>
      <div className="mb-4">
        <label className="mr-2">Filter by status:</label>
        <select
          value={orderStatusFilter}
          onChange={onStatusFilterChange}
          className="p-2 border rounded"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDeleteOrder}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No orders found</p>
          )}
        </div>
      )}
    </div>
  );
}