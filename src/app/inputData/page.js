// app/admin/page.jsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '../../Components/admin/ProductForm';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('add');
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    category: '',
    displaySetting: ''
  });
  const router = useRouter();

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchProducts();
    }
  }, [activeTab, filters]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let url = '/api/products?';
      if (filters.gender) url += `gender=${filters.gender}&`;
      if (filters.category) url += `category=${filters.category}&`;
      
      // Add display setting filters
      if (filters.displaySetting === 'carousel') {
        url += 'showInCarousel=true&';
      } else if (filters.displaySetting === 'browse') {
        url += 'showInBrowseCategories=true&';
      } else if (filters.displaySetting === 'shop') {
        url += 'showInShopByCategory=true&';
      }

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (formData) => {
    try {
      const formDataToSend = new FormData();
      
      // Append all fields
      Object.keys(formData).forEach(key => {
        if (key !== 'image' || formData.image) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add product');
      }

      alert('Product added successfully!');
      setActiveTab('manage');
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error: ${error.message}\nCheck console for details`);
    }
  };

  const handleUpdateProduct = async (formData) => {
    try {
      const formDataToSend = new FormData();
      
      // Append all fields
      Object.keys(formData).forEach(key => {
        if (key !== 'image' || formData.image) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`/api/products?id=${editingProduct._id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update product');
      }

      alert('Product updated successfully!');
      setEditingProduct(null);
      setActiveTab('manage');
      fetchProducts();
    } catch (error) {
      console.error('Update error:', error);
      alert(`Error: ${error.message}\nCheck console for details`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete product');
      }

      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Error: ${error.message}\nCheck console for details`);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setActiveTab('edit');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'add' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => {
            setEditingProduct(null);
            setActiveTab('add');
          }}
        >
          Add Product
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'manage' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage Products
        </button>
        {editingProduct && (
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'edit' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('edit')}
          >
            Edit Product
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'add' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <ProductForm onSubmit={handleAddProduct} />
          </div>
        )}

        {activeTab === 'edit' && editingProduct && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <ProductForm 
              initialData={{
                ...editingProduct,
                image: editingProduct.image // This will be the existing image path
              }}
              onSubmit={handleUpdateProduct}
              isEditing={true}
            />
          </div>
        )}

        {activeTab === 'manage' && (
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
                    <option value="unisex">Unisex</option>
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
                          <td className="py-2 px-4 border">{product.category}</td>
                          <td className="py-2 px-4 border capitalize">{product.gender}</td>
                          <td className="py-2 px-4 border">
                            <div className="flex flex-col space-y-1 text-sm">
                              {product.showInCarousel && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Carousel</span>
                              )}
                              {product.showInBrowseCategories && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Browse</span>
                              )}
                              {product.showInShopByCategory && (
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Shop</span>
                              )}
                              {!product.showInCarousel && !product.showInBrowseCategories && !product.showInShopByCategory && (
                                <span className="text-gray-500">None</span>
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
                        <td colSpan="7" className="py-4 text-center text-gray-500">
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
      </div>
    </div>
  );
}