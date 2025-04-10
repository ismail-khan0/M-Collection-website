'use client';
import { useEffect, useState, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, filterProducts } from '@/app/redux/productsSlice';
import { setGenderFilter, setCategoryFilter, setBrandFilter, setColorFilter, setSort } from '@/app/redux/filtersSlice';
import FilterSidebar from '@/Components/FilterSidebar';
import ProductGrid from '@/Components/ProductGrid';
import SortSelect from '@/Components/SortSelect';
import { useSearchParams } from 'next/navigation';

const CategoryPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { items, filteredItems, status } = useSelector(state => state.products);
  const filters = useSelector(state => state.filters);
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded') {
      const params = Object.fromEntries(searchParams.entries());
      dispatch(filterProducts(params));

      // Update category name
      const count = filteredItems.length;
      if (params.gender === 'men') {
        setCategoryName(`Men - ${count} items`);
      } else if (params.gender === 'women') {
        setCategoryName(`Women - ${count} items`);
      } else {
        setCategoryName(`All Products - ${count} items`);
      }
    }
  }, [searchParams, status, dispatch, filteredItems.length]);

  useEffect(() => {
    if (status === 'succeeded') {
      setIsLoading(false); // Set loading to false once products are fetched
    }
  }, [status]);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading until products are ready
  }

  return (
    <div className="bg-gray-100 p-2">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 mt-20">
          <h1 className="text-xl font-semibold mb-2 sm:mb-0">{categoryName}</h1>
          <SortSelect />
        </div>

        {status === 'filtering' && (
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
