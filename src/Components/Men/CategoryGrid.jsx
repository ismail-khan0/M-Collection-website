'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const CategoryGrid = ({ gender = 'men', sectionTitle = 'Browse Categories' }) => {
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
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        
        if (data.success && Array.isArray(data.products)) {
          // Get all products with showInBrowseCategories = true
          const browseCategories = data.products.filter(
            product => product.showInBrowseCategories === true
          );
          
          setCategories(browseCategories);
        } else {
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

  const redirectToFilter = (categoryTitle) => {
    const params = new URLSearchParams();
    if (gender) params.set('gender', gender.toLowerCase());
    if (categoryTitle) params.set('category', categoryTitle.trim().toLowerCase());
    router.push(`/products?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="py-10 px-4 bg-white">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 text-[#3e4152] uppercase tracking-wide">
          {sectionTitle}
        </h2>
        <div className="flex flex-wrap justify-center gap-4 max-w-7xl mx-auto">
          {Array.from({ length: 14 }).map((_, index) => (
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
          {categories.slice(0, 14).map((category, index) => (
            <div
              key={category._id || index}
              onClick={() => redirectToFilter(category.category)}
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
        <div className="text-center text-gray-500 text-lg font-medium py-10">
          No categories found.
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;