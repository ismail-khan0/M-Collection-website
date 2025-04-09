'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

const FilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state to store the current selected filters
  const [selectedFilters, setSelectedFilters] = useState({
    gender: [],
    category: [],
    brand: [],
    color: []
  });

  // Helper function to update query params dynamically
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value); // Add or update the query parameter
      return params.toString();
    },
    [searchParams]
  );

  // Clear all filters and reset to default
  const clearFilters = () => {
    router.push('/products'); // Reset to the default product page without any filters
  };

  // Check if a filter is applied based on URL query params
  const isChecked = (filterName, filterValue) => {
    return selectedFilters[filterName].includes(filterValue);
  };

  // Handle filter change and update the URL query parameters
  const handleFilterChange = (filterName, filterValue) => {
    // Toggle filter on/off
    const newFilters = { ...selectedFilters };
    const index = newFilters[filterName].indexOf(filterValue);

    if (index >= 0) {
      // If filter is already selected, remove it
      newFilters[filterName].splice(index, 1);
    } else {
      // Otherwise, add it
      newFilters[filterName].push(filterValue);
    }

    setSelectedFilters(newFilters);

    // Update URL query params
    const queryString = Object.keys(newFilters)
      .map((key) => {
        return newFilters[key].map((value) => `${key}=${value}`).join('&');
      })
      .join('&');

    router.push(`/products?${queryString}`);
  };

  return (
    <aside className="w-full md:w-1/4 lg:w-1/4 bg-white p-4 rounded max-h-[100vh] overflow-y-auto sticky top-4 border ring-none border-gray-300 focus:outline-none">
      <h2 className="font-semibold text-lg mb-2">Filters</h2>
      <hr />
      <button className="text-blue-600 text-sm mt-2" onClick={clearFilters}>
        CLEAR ALL
      </button>

      {/* Gender Filter */}
      <div className="mt-4">
        <h3 className="font-semibold">Gender</h3>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="men-checkbox"
            checked={isChecked('gender', 'men')}
            onChange={() => handleFilterChange('gender', 'men')}
            className="form-checkbox"
          />
          <label htmlFor="men-checkbox" className="ml-1">Men</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="women-checkbox"
            checked={isChecked('gender', 'women')}
            onChange={() => handleFilterChange('gender', 'women')}
            className="form-checkbox"
          />
          <label htmlFor="women-checkbox" className="ml-1">Women</label>
        </div>
      </div>

      <hr className="mt-4" />

      {/* Categories */}
      <div className="mt-4">
        <h3 className="font-semibold">Categories</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          {['Tshirts', 'Shirts', 'Jeans', 'Casual Shoes', 'Trousers', 'Sweatshirts', 'Jackets', 'Shorts'].map(
            (category) => (
              <li key={category} className="flex items-center gap-2">
                <input
                  id={category.toLowerCase()}
                  type="checkbox"
                  checked={isChecked('category', category)}
                  onChange={() => handleFilterChange('category', category)}
                  className="form-checkbox"
                />
                <label htmlFor={category.toLowerCase()}>{category}</label>
              </li>
            )
          )}
        </ul>
      </div>

      <hr className="mt-4" />

      {/* Brands */}
      <div className="mt-4">
        <h3 className="font-semibold">Brands</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          {['Friskers', 'WOOSTRO', 'FBAR', 'DISPENSER', 'Pepe jeans', 'Masch Sports'].map((brand) => (
            <li key={brand} className="flex items-center gap-2">
              <input
                id={brand.toLowerCase().replace(' ', '-')}
                type="checkbox"
                checked={isChecked('brand', brand)}
                onChange={() => handleFilterChange('brand', brand)}
                className="form-checkbox"
              />
              <label htmlFor={brand.toLowerCase().replace(' ', '-')}>{brand}</label>
            </li>
          ))}
        </ul>
      </div>

      <hr className="mt-4" />

      {/* Color Filter */}
      <div className="mt-4">
        <h3 className="font-semibold">Color</h3>
        <div className="text-sm text-gray-600 space-y-2">
          {[
            { id: 'black', name: 'Black', emoji: '⚫' },
            { id: 'white', name: 'White', emoji: '⚪' },
            { id: 'blue', name: 'Blue', emoji: '🔵' },
            { id: 'navy', name: 'Navy Blue', emoji: '🔵' },
            { id: 'red', name: 'Red', emoji: '🔴' },
            { id: 'grey', name: 'Grey', emoji: '⚫' },
            { id: 'maroon', name: 'Maroon', emoji: '🟥' },
            { id: 'brown', name: 'Brown', emoji: '🟫' }
          ].map((color) => (
            <div key={color.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={color.id}
                checked={isChecked('color', color.name)}
                onChange={() => handleFilterChange('color', color.name)}
                className="form-checkbox"
              />
              <label htmlFor={color.id} className="ml-1">{color.emoji} {color.name}</label>
            </div>
          ))}
          <p className="text-pink-500 mt-2">Other color filters can be added...</p>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
