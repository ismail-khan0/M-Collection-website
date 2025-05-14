// app/admin/components/ProductForm.jsx
"use client";
import { useState } from 'react';

const categories = [
  'T-Shirts', 'Shirts', 'Jeans', 'Trousers', 
  'Shorts', 'Jackets', 'Sweatshirts', 'Shoes',
  'Accessories', 'Watches', 'Bags', 'Sunglasses'
];

const brands = [
  'Nike', 'Adidas', 'Puma', 'Levi\'s',
  'H&M', 'Zara', 'Gucci', 'Dior',
  'Louis Vuitton', 'Tommy Hilfiger', 'Calvin Klein'
];

const colors = [
  'Red', 'Blue', 'Green', 'Black',
  'White', 'Gray', 'Yellow', 'Pink',
  'Purple', 'Orange', 'Brown', 'Navy'
];

export default function ProductForm({ 
  initialData = {
    title: '',
    image: null,
    price: '',
    discountPrice: '',
    gender: 'men',
    category: '',
    brand: '',
    color: '',
    showInCarousel: false,
    showInBrowseCategories: false,
    showInShopByCategory: false,
    showInKidsCategories: false,
    showInIconicBrands: false,
    showInFavouriteBrands: false,
    showInExploreMore: false,
  },
  onSubmit,
  isEditing = false
}) {
  const [formData, setFormData] = useState(initialData);
  const [previewImage, setPreviewImage] = useState(initialData.image || null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create a new FormData object
    const formDataToSend = new FormData();
    
    // Append all regular fields
    formDataToSend.append('title', formData.title);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('discountPrice', formData.discountPrice);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('brand', formData.brand);
    formDataToSend.append('color', formData.color);
    
    // Append all display settings as strings
    formDataToSend.append('showInCarousel', String(formData.showInCarousel));
    formDataToSend.append('showInBrowseCategories', String(formData.showInBrowseCategories));
    formDataToSend.append('showInShopByCategory', String(formData.showInShopByCategory));
    formDataToSend.append('showInKidsCategories', String(formData.showInKidsCategories));
    formDataToSend.append('showInIconicBrands', String(formData.showInIconicBrands));
    formDataToSend.append('showInFavouriteBrands', String(formData.showInFavouriteBrands));
    formDataToSend.append('showInExploreMore', String(formData.showInExploreMore));
    
    // Append the image if it exists
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
    
    await onSubmit(formDataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      {/* Title */}
      <div>
        <label className="block mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block mb-1">Product Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
          required={!isEditing}
        />
        {previewImage && (
          <div className="mt-2">
            <img
              src={typeof previewImage === 'string' ? previewImage : URL.createObjectURL(previewImage)}
              alt="Preview"
              className="h-40 object-contain border rounded"
            />
          </div>
        )}
      </div>

      {/* Price & Discount */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Price ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Discount Price ($)</label>
          <input
            type="number"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="block mb-1">Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
          <option value="gifts">Gifts</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block mb-1">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div>
        <label className="block mb-1">Brand</label>
        <select
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a brand</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Color */}
      <div>
        <label className="block mb-1">Color</label>
        <select
          name="color"
          value={formData.color}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a color</option>
          {colors.map((color) => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
        {formData.color && (
          <div
            className="w-6 h-6 mt-2 rounded-full border"
            style={{ backgroundColor: formData.color.toLowerCase() }}
          />
        )}
      </div>

      {/* Display Settings */}
      <div className="space-y-2 border p-4 rounded">
        <h3 className="font-semibold">Display Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="showInCarousel"
              checked={formData.showInCarousel}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Show in Carousel</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="showInBrowseCategories"
              checked={formData.showInBrowseCategories}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Show in Browse Categories</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="showInShopByCategory"
              checked={formData.showInShopByCategory}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Show in Shop by Category</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="showInFavouriteBrands"
              checked={formData.showInFavouriteBrands}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Show in FAVOURITE BRANDS</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="showInIconicBrands"
              checked={formData.showInIconicBrands}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Show in Iconic Brands</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="showInKidsCategories"
              checked={formData.showInKidsCategories}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Show in Kids Categories</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="showInExploreMore"
              checked={formData.showInExploreMore}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Show in Explore More</label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {isEditing ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
}