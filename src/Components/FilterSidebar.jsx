"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const FilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedFilters, setSelectedFilters] = useState({
    gender: [],
    category: [],
    brand: [],
    color: [],
  });

  useEffect(() => {
    const params = {
      gender: searchParams.getAll("gender"),
      category: searchParams.getAll("category"),
      brand: searchParams.getAll("brand"),
      color: searchParams.getAll("color"),
    };
    setSelectedFilters(params);
  }, [searchParams]);

  const clearFilters = () => {
    router.push("/products");
  };

  const isChecked = (filterName, filterValue) => {
    return selectedFilters[filterName]
      .map(item => item.toLowerCase())
      .includes(filterValue.toLowerCase());
  };

  const handleFilterChange = (filterName, filterValue) => {
    const newFilters = { ...selectedFilters };
    const currentValues = newFilters[filterName];

    if (currentValues.includes(filterValue)) {
      newFilters[filterName] = currentValues.filter((v) => v !== filterValue);
    } else {
      newFilters[filterName] = [...currentValues, filterValue];
    }

    setSelectedFilters(newFilters);

    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, values]) => {
      values.forEach((value) => {
        params.append(key, value);
      });
    });

    router.push(`/products?${params.toString()}`);
  };

  return (
    <aside className="bg-white p-4 rounded-lg shadow-sm sticky top-24 h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Filters</h2>
        <button 
          onClick={clearFilters}
          className="text-blue-600 text-sm hover:text-blue-800"
        >
          CLEAR ALL
        </button>
      </div>

      <div className="space-y-6">
        {/* Gender Filter */}
        <div>
          <h3 className="font-semibold mb-2">Gender</h3>
          <div className="space-y-2">
            {["men", "women", "kids", "gifts"].map((gender) => (
              <div key={gender} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${gender}-checkbox`}
                  checked={isChecked("gender", gender)}
                  onChange={() => handleFilterChange("gender", gender)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`${gender}-checkbox`} className="ml-2 capitalize">
                  {gender}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-2">Categories</h3>
          <div className="space-y-2">
            {[
              "T-Shirts", "Shirts", "Jeans", "Trousers", "Shorts",
              "Jackets", "Sweatshirts", "Shoes", "Accessories",
              "Watches", "Bags", "Sunglasses"
            ].map((category) => (
              <div key={category} className="flex items-center">
                <input
                  id={category.toLowerCase()}
                  type="checkbox"
                  checked={isChecked("category", category)}
                  onChange={() => handleFilterChange("category", category)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={category.toLowerCase()} className="ml-2">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div>
          <h3 className="font-semibold mb-2">Brands</h3>
          <div className="space-y-2">
            {[
              "Nike", "Adidas", "Puma", "Levi's", "H&M",
              "Zara", "Gucci", "Dior", "Louis Vuitton",
              "Tommy Hilfiger", "Calvin Klein"
            ].map((brand) => (
              <div key={brand} className="flex items-center">
                <input
                  id={brand.toLowerCase().replace(" ", "-")}
                  type="checkbox"
                  checked={isChecked("brand", brand)}
                  onChange={() => handleFilterChange("brand", brand)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={brand.toLowerCase().replace(" ", "-")} className="ml-2">
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Color Filter */}
        <div>
          <h3 className="font-semibold mb-2">Color</h3>
          <div className="space-y-2">
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
              <div key={color.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={color.id}
                  checked={isChecked("color", color.name)}
                  onChange={() => handleFilterChange("color", color.name)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={color.id} className="ml-2">
                  {color.emoji} {color.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;