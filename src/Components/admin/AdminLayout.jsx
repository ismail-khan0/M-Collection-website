export default function AdminLayout({
  children,
  activeTab,
  setActiveTab,
  editingProduct,
}) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "add"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => {
            setActiveTab("add");
          }}
        >
          Add Product
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "manage"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("manage")}
        >
          Manage Products
        </button>
        {editingProduct && (
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "edit"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("edit")}
          >
            Edit Product
          </button>
        )}
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "orders"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
      </div>

      {children}
    </div>
  );
}