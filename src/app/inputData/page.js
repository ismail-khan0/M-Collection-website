"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProductForm from "../../Components/admin/ProductForm";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("add");
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [filters, setFilters] = useState({
    gender: "",
    category: "",
    displaySetting: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/signin");
    } else if (status === "authenticated" && !session?.user?.isAdmin) {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (activeTab === "manage") {
      fetchProducts();
    } else if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab, filters, orderStatusFilter]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let url = "/api/products?";
      if (filters.gender) url += `gender=${filters.gender}&`;
      if (filters.category) url += `category=${filters.category}&`;

      // Add display setting filters
      const mapping = {
        carousel: "showInCarousel",
        browse: "showInBrowseCategories",
        shop: "showInShopByCategory",
        kids: "showInKidsCategories",
        iconic: "showInIconicBrands",
        favourite: "showInFavouriteBrands",
        explore: "showInExploreMore",
      };

      const displayKey = mapping[filters.displaySetting];
      if (displayKey) url += `${displayKey}=true&`;

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // In your AdminPage component
  // In your AdminPage component
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const url = `/api/admin/orders${
        orderStatusFilter !== "all" ? `?status=${orderStatusFilter}` : ""
      }`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (!orderId || !newStatus) {
      alert("Both order ID and status are required");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === "cancelled" && {
            paymentStatus: "refunded",
          }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update order");
      }

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: newStatus,
                payment: {
                  ...order.payment,
                  ...(newStatus === "cancelled" && { status: "refunded" }),
                },
              }
            : order
        )
      );

      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (formData) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to add product");

      alert("Product added successfully!");
      setActiveTab("manage");
    } catch (error) {
      console.error("Submission error:", error);
      alert(`Error: ${error.message}\nCheck console for details`);
    }
  };

  const handleUpdateProduct = async (formData) => {
    try {
      const response = await fetch(`/api/products?id=${editingProduct._id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update product");
      }

      alert("Product updated successfully!");
      setEditingProduct(null);
      setActiveTab("manage");
      fetchProducts();
    } catch (error) {
      console.error("Update error:", error);
      alert(`Error: ${error.message}\nCheck console for details`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products?id=${productId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete product");
      }

      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Error: ${error.message}\nCheck console for details`);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setActiveTab("edit");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteOrder = async (orderId) => {
    if (
      !confirm(
        "Are you sure you want to delete this order? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete order");
      }

      // Remove the deleted order from local state
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );

      alert("Order deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Error: ${error.message}\nCheck console for details`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "add"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => {
            setEditingProduct(null);
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

      {/* Tab Content */}
      <div>
        {activeTab === "add" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <ProductForm onSubmit={handleAddProduct} />
          </div>
        )}

        {activeTab === "edit" && editingProduct && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <ProductForm
              initialData={{
                ...editingProduct,
                image: editingProduct.image,
              }}
              onSubmit={handleUpdateProduct}
              isEditing={true}
            />
          </div>
        )}

        {activeTab === "manage" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Manage Products</h2>

            {/* Filter Controls */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1">Gender</label>
                  <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">All Genders</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="gifts">Gifts</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Category</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">All Categories</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Shirts">Shirts</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Trousers">Trousers</option>
                    <option value="Shorts">Shorts</option>
                    <option value="Jackets">Jackets</option>
                    <option value="Sweatshirts">Sweatshirts</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Watches">Watches</option>
                    <option value="Bags">Bags</option>
                    <option value="Sunglasses">Sunglasses</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Display Setting</label>
                  <select
                    name="displaySetting"
                    value={filters.displaySetting}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">All Products</option>
                    <option value="carousel">In Carousel</option>
                    <option value="browse">In Browse Categories</option>
                    <option value="shop">In Shop by Category</option>
                    <option value="kids">In Kids Categories</option>
                    <option value="iconic">In Iconic Brands</option>
                    <option value="favourite">In Favourite Brands</option>
                    <option value="explore">In Explore More</option>
                  </select>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">Image</th>
                      <th className="py-2 px-4 border">Title</th>
                      <th className="py-2 px-4 border">Price</th>
                      <th className="py-2 px-4 border">Category</th>
                      <th className="py-2 px-4 border">Gender</th>
                      <th className="py-2 px-4 border">Display Settings</th>
                      <th className="py-2 px-4 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="py-2 px-4 border">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="h-16 object-contain"
                            />
                          </td>
                          <td className="py-2 px-4 border">{product.title}</td>
                          <td className="py-2 px-4 border">${product.price}</td>
                          <td className="py-2 px-4 border">
                            {product.category}
                          </td>
                          <td className="py-2 px-4 border capitalize">
                            {product.gender}
                          </td>
                          <td className="py-2 px-4 border">
                            <div className="flex flex-wrap gap-1">
                              {product.showInCarousel && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  Carousel
                                </span>
                              )}
                              {product.showInBrowseCategories && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                  Browse
                                </span>
                              )}
                              {product.showInShopByCategory && (
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                  Shop
                                </span>
                              )}
                              {product.showInKidsCategories && (
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                  Kids
                                </span>
                              )}
                              {product.showInIconicBrands && (
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                  Iconic
                                </span>
                              )}
                              {product.showInFavouriteBrands && (
                                <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">
                                  Favourite
                                </span>
                              )}
                              {product.showInExploreMore && (
                                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                                  Explore
                                </span>
                              )}
                              {!product.showInCarousel &&
                                !product.showInBrowseCategories &&
                                !product.showInShopByCategory &&
                                !product.showInKidsCategories &&
                                !product.showInIconicBrands &&
                                !product.showInFavouriteBrands &&
                                !product.showInExploreMore && (
                                  <span className="text-gray-500 text-xs">
                                    None
                                  </span>
                                )}
                            </div>
                          </td>
                          <td className="py-2 px-4 border">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="py-4 text-center text-gray-500"
                        >
                          No products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>
            <div className="mb-4">
              <label className="mr-2">Filter by status:</label>
              <select
                value={orderStatusFilter}
                onChange={(e) => {
                  setOrderStatusFilter(e.target.value);
                  fetchOrders();
                }}
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
                    <div key={order._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">
                            Order #{order.orderNumber}
                          </h3>
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
                        <div className="bg-gray-50 p-3 rounded">
                          <h4 className="font-medium mb-2">Shipping Address</h4>
                          <p>{order.shippingAddress.fullName}</p>
                          <p>{order.shippingAddress.street}</p>
                          <p>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}{" "}
                            {order.shippingAddress.zipCode}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                          <p className="mt-1">
                            Phone: {order.shippingAddress.phone}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded">
                          <h4 className="font-medium mb-2">Payment</h4>
                          <p className="capitalize">{order.paymentMethod}</p>
                          <div className="mt-2">
                            <p>Subtotal: Rs.{order.subtotal.toFixed(2)}</p>
                            <p>
                              Discount: -Rs.{order.totalDiscount.toFixed(2)}
                            </p>
                            <p className="font-medium">
                              Total: Rs.{order.totalPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded">
                          <h4 className="font-medium mb-2">
                            Items ({order.items.length})
                          </h4>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-12 h-12 object-contain mr-2"
                                />
                                <div>
                                  <p className="text-sm line-clamp-1">
                                    {item.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Rs.{item.discountPrice || item.price} x{" "}
                                    {item.quantity}
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
                          onChange={(e) =>
                            handleUpdateOrderStatus(order._id, e.target.value)
                          }
                          className="p-2 border rounded text-sm"
                          disabled={isLoading}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
                          disabled={isLoading}
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
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No orders found
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
