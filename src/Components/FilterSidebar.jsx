"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

const FilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state to store the current selected filters
  const [selectedFilters, setSelectedFilters] = useState({
    gender: [],
    category: [],
    brand: [],
    color: [],
  });

  // Initialize filters from URL params
  useEffect(() => {
    const params = {
      gender: searchParams.getAll("gender"),
      category: searchParams.getAll("category"),
      brand: searchParams.getAll("brand"),
      color: searchParams.getAll("color"),
    };
    setSelectedFilters(params);
  }, [searchParams]);

  // Clear all filters and reset to default
  const clearFilters = () => {
    router.push("/products");
  };

  // Check if a filter is applied
  const isChecked = (filterName, filterValue) => {
    return selectedFilters[filterName].includes(filterValue);
  };

  // Handle filter change and update the URL
  const handleFilterChange = (filterName, filterValue) => {
    const newFilters = { ...selectedFilters };
    const currentValues = newFilters[filterName];

    // Toggle the filter value
    if (currentValues.includes(filterValue)) {
      newFilters[filterName] = currentValues.filter((v) => v !== filterValue);
    } else {
      newFilters[filterName] = [...currentValues, filterValue];
    }

    setSelectedFilters(newFilters);

    // Create new URLSearchParams
    const params = new URLSearchParams();

    // Add all active filters to the URL
    Object.entries(newFilters).forEach(([key, values]) => {
      values.forEach((value) => {
        params.append(key, value);
      });
    });

    router.push(`/products?${params.toString()}`);
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
        {["men", "women", "kids", "gifts"].map((gender) => (
          <div key={gender} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`${gender}-checkbox`}
              checked={isChecked("gender", gender)}
              onChange={() => handleFilterChange("gender", gender)}
              className="form-checkbox"
            />
            <label htmlFor={`${gender}-checkbox`} className="ml-1 capitalize">
              {gender}
            </label>
          </div>
        ))}
      </div>

      <hr className="mt-4" />

      {/* Categories */}
      <div className="mt-4">
        <h3 className="font-semibold">Categories</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          {[
            "Tshirts",
            "Shirts",
            "Jeans",
            "Casual Shoes",
            "Trousers",
            "Sweatshirts",
            "Jackets",
            "Shorts",
          ].map((category) => (
            <li key={category} className="flex items-center gap-2">
              <input
                id={category.toLowerCase()}
                type="checkbox"
                checked={isChecked("category", category)}
                onChange={() => handleFilterChange("category", category)}
                className="form-checkbox"
              />
              <label htmlFor={category.toLowerCase()}>{category}</label>
            </li>
          ))}
        </ul>
      </div>

      <hr className="mt-4" />

      {/* Brands */}
      <div className="mt-4">
        <h3 className="font-semibold">Brands</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          {[
            "Friskers",
            "WOOSTRO",
            "FBAR",
            "DISPENSER",
            "Pepe jeans",
            "Masch Sports",
          ].map((brand) => (
            <li key={brand} className="flex items-center gap-2">
              <input
                id={brand.toLowerCase().replace(" ", "-")}
                type="checkbox"
                checked={isChecked("brand", brand)}
                onChange={() => handleFilterChange("brand", brand)}
                className="form-checkbox"
              />
              <label htmlFor={brand.toLowerCase().replace(" ", "-")}>
                {brand}
              </label>
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
            { id: "black", name: "Black", emoji: "⚫" },
            { id: "white", name: "White", emoji: "⚪" },
            { id: "blue", name: "Blue", emoji: "🔵" },
            { id: "navy", name: "Navy Blue", emoji: "🔵" },
            { id: "red", name: "Red", emoji: "🔴" },
            { id: "grey", name: "Grey", emoji: "⚫" },
            { id: "maroon", name: "Maroon", emoji: "🟥" },
            { id: "brown", name: "Brown", emoji: "🟫" },
          ].map((color) => (
            <div key={color.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={color.id}
                checked={isChecked("color", color.name)}
                onChange={() => handleFilterChange("color", color.name)}
                className="form-checkbox"
              />
              <label htmlFor={color.id} className="ml-1">
                {color.emoji} {color.name}
              </label>
            </div>
          ))}
          <p className="text-pink-500 mt-2">
            Other color filters can be added...
          </p>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
