"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  filterProducts,
  searchProducts,
  clearSearch,
} from "@/app/redux/productsSlice";
import {
  setGenderFilter,
  setCategoryFilter,
  setBrandFilter,
  setColorFilter,
  setSort,
  clearFilters,
} from "@/app/redux/filtersSlice";
import FilterSidebar from "@/Components/FilterSidebar";
import ProductGrid from "@/Components/ProductGrid";
import SortSelect from "@/Components/SortSelect";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { items, filteredItems, status, searchResults } = useSelector(
    (state) => state.products
  );
  const filters = useSelector((state) => state.filters);
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setIsSearchMode(true);
      dispatch(searchProducts(searchParam));
      setCategoryName(`Search Results for "${searchParam}"`);
    } else {
      setIsSearchMode(false);
      dispatch(clearSearch());
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (!isSearchMode && status === "succeeded") {
      const params = {};
      const gender = searchParams.getAll("gender");
      const category = searchParams.getAll("category");
      const brand = searchParams.getAll("brand");
      const color = searchParams.getAll("color");
      const sort = searchParams.get("sort") || "recommended";

      dispatch(clearFilters());

      if (gender.length > 0) {
        dispatch(setGenderFilter(gender));
        params.gender = gender;
      }
      if (category.length > 0) {
        dispatch(setCategoryFilter(category));
        params.category = category;
      }
      if (brand.length > 0) {
        dispatch(setBrandFilter(brand));
        params.brand = brand;
      }
      if (color.length > 0) {
        dispatch(setColorFilter(color));
        params.color = color;
      }
      if (sort) {
        dispatch(setSort(sort));
        params.sort = sort;
      }

      dispatch(filterProducts(params));

      // Update category name based on selected filters
      // Update category name based on selected filters
      let nameParts = [];

      if (gender.length > 0) {
        nameParts.push(
          gender.map((g) => g.charAt(0).toUpperCase() + g.slice(1)).join(" & ")
        );
      }

      if (category.length > 0) {
        nameParts.push(
          category
            .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
            .join(" & ")
        );
      }

      if (brand.length > 0) {
        nameParts.push(
          brand.map((b) => b.charAt(0).toUpperCase() + b.slice(1)).join(" & ")
        );
      }

      const name = nameParts.join(" ") || "All Products";
      setCategoryName(`${name} - ${filteredItems.length} items`);
    }
  }, [searchParams, status, dispatch, filteredItems.length, isSearchMode]);

  useEffect(() => {
    if (status === "succeeded") {
      setIsLoading(false);
    }
  }, [status]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        {isSearchMode ? (
          <div className="pt-8">
            <h1 className="text-2xl font-bold mb-6">{categoryName}</h1>

            {searchResults.length > 0 ? (
              <ProductGrid products={searchResults} />
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">
                  No products found for "{searchQuery}"
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pt-8">
              <h1 className="text-2xl font-bold mb-4 sm:mb-0">
                {categoryName}
              </h1>
              <SortSelect />
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/4">
                <FilterSidebar />
              </div>
              <div className="lg:w-3/4">
                <ProductGrid products={filteredItems} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
