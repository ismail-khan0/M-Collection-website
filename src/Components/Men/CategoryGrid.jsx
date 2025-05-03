'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const CategoryGrid = ({ start = 0, end = '', gender = 'men', sectionTitle = 'Browse Categories' }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = gender
          ? `/api/products?showInBrowseCategories=true&gender=${gender}`
          : '/api/products?showInBrowseCategories=true';

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Process to get unique categories with proper validation
        const uniqueCategories = [];
        const categorySet = new Set();

        if (Array.isArray(data?.products)) {
          data.products.forEach((product) => {
            // Ensure product has a category before processing
            if (product?.category && typeof product.category === 'string') {
              const normalizedCategory = product.category.trim();
              if (normalizedCategory && !categorySet.has(normalizedCategory)) {
                categorySet.add(normalizedCategory);
                uniqueCategories.push({
                  _id: product._id || Math.random().toString(36).substring(2, 9),
                  title: normalizedCategory,
                  image: product.image || '/default-product-image.png',
                });
              }
            }
          });

          setCategories(uniqueCategories);
        } else {
          console.warn('Unexpected API response structure:', data);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error.message);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [gender]);

 // In Carousel, CategoryGrid, and ShopByCategory components
const redirectToFilter = (productOrCategory) => {
  const params = new URLSearchParams();
  
  // Handle both cases where we might get a product object or just a category string
  const category = typeof productOrCategory === 'string' 
    ? productOrCategory 
    : productOrCategory?.category || '';
  
  // Always set the gender prop that was passed to the component
  if (gender) params.set('gender', gender.toLowerCase());
  
  // Set category if available
  if (category) params.set('category', category.trim().toLowerCase());
  
  router.push(`/products?${params.toString()}`);
};

  if (isLoading) {
    return (
      <div className="py-10 px-4 bg-white">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 text-[#3e4152] uppercase tracking-wide">
          {sectionTitle}
        </h2>
        <div className="flex flex-wrap justify-center gap-4 max-w-7xl mx-auto">
          {Array.from({ length: end - start }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm w-36 animate-pulse"
            >
              <div className="w-full h-32 bg-gray-200" />
              <div className="py-2 px-2 w-full">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 px-4 bg-white text-center text-red-500">
        <p>Error loading categories: {error}</p>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 bg-white">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 text-[#3e4152] uppercase tracking-wide">
        {sectionTitle}
      </h2>

      {categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 max-w-7xl mx-auto">
          {categories.slice(start, end).map((category, index) => (
            <div
              key={category._id}
              onClick={() => redirectToFilter(category.title)}
              className="flex flex-col items-center bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 transform hover:scale-105"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="w-full h-32 relative bg-pink-50">
                <Image
                  src={category.image}
                  alt={category.title || 'Category image'}
                  fill
                  className="object-contain p-2"
                  unoptimized
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-product-image.png';
                  }}
                />
              </div>
              <div className="py-2 px-2 w-full">
                <p className="text-center text-sm font-semibold text-[#3e4152] leading-tight">
                  {category.title || 'Unnamed Category'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p>No categories found</p>
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;