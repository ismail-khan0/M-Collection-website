"use client";
import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, filterProducts } from "@/app/redux/productsSlice";
import {
  setGenderFilter,
  setCategoryFilter,
  setBrandFilter,
  setColorFilter,
  setSort,
  clearFilters
} from "@/app/redux/filtersSlice";
import FilterSidebar from "@/Components/FilterSidebar";
import ProductGrid from "@/Components/ProductGrid";
import SortSelect from "@/Components/SortSelect";
import { useSearchParams } from "next/navigation";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { items, filteredItems, status } = useSelector(
    (state) => state.products
  );
  const filters = useSelector((state) => state.filters);
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      const params = {};
      // Get all filter values from URL
      const gender = searchParams.getAll('gender');
      const category = searchParams.getAll('category');
      const brand = searchParams.getAll('brand');
      const color = searchParams.getAll('color');
      const sort = searchParams.get('sort') || 'recommended';

      // Clear all filters first
      dispatch(clearFilters());

      // Update Redux filter state
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

      // Apply filters to products
      dispatch(filterProducts(params));

      // Update category name
      let name = 'All Products';
      if (gender.length === 1) {
        name = `${gender[0].charAt(0).toUpperCase() + gender[0].slice(1)}`;
      } else if (gender.length > 1) {
        name = 'Multiple Genders';
      } else if (category.length > 0) {
        name = `${category[0].charAt(0).toUpperCase() + category[0].slice(1)}`;
      }
      setCategoryName(`${name} - ${filteredItems.length} items`);
    }
  }, [searchParams, status, dispatch, filteredItems.length]);

  useEffect(() => {
    if (status === "succeeded") {
      setIsLoading(false);
    }
  }, [status]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 p-2 ">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 mt-4">
          <h1 className="text-xl font-semibold mb-2 sm:mb-0">{categoryName}</h1>
          <SortSelect />
        </div>

        {status === "filtering" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <p>Applying filters...</p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-0">
          <FilterSidebar />
          <ProductGrid products={filteredItems} />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;