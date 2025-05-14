"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import AddProductTab from "@/components/admin/AddProductTab";
import EditProductTab from "@/components/admin/EditProductTab";
import ManageProductsTab from "@/components/admin/ManageProductsTab";
import OrdersTab from "@/components/admin/OrdersTab";

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
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete order");
      }

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
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      editingProduct={editingProduct}
    >
      {activeTab === "add" && (
        <AddProductTab onSubmit={handleAddProduct} />
      )}

      {activeTab === "edit" && editingProduct && (
        <EditProductTab
          product={editingProduct}
          onSubmit={handleUpdateProduct}
        />
      )}

      {activeTab === "manage" && (
        <ManageProductsTab
          products={products}
          isLoading={isLoading}
          filters={filters}
          onFilterChange={handleFilterChange}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      {activeTab === "orders" && (
        <OrdersTab
          orders={orders}
          isLoading={isLoading}
          orderStatusFilter={orderStatusFilter}
          onStatusFilterChange={(e) => setOrderStatusFilter(e.target.value)}
          onUpdateStatus={handleUpdateOrderStatus}
          onDeleteOrder={handleDeleteOrder}
        />
      )}
      
    </AdminLayout>
  );
}