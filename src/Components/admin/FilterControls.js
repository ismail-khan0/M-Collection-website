export default function FilterControls({ filters, onFilterChange }) {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium mb-3">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1">Gender</label>
          <select
            name="gender"
            value={filters.gender}
            onChange={onFilterChange}
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
            onChange={onFilterChange}
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
            onChange={onFilterChange}
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
  );
}