'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const CategoryGrid = ({ apiUrl, start, end, gender = 'men', sectionTitle = 'Browse Categories' }) => {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCategories();
  }, [apiUrl]);

  const redirectToFilter = (categoryId) => {
    const params = new URLSearchParams();
    params.set('gender', gender); // dynamic
    router.push(`/products?${params.toString()}`);
  };
  

  return (
    <div id="Home_imgs" className="py-10 px-4 bg-white">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 text-[#3e4152] uppercase tracking-wide">
        {sectionTitle}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
        {categories.slice(start, end).map((category) => (
          <div
            key={category.id}
            onClick={() => redirectToFilter(category.id)}
            className="bg-white rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 p-4 flex flex-col items-center"
          >
            <div className="w-32 h-32 relative mb-4">
              <Image
                src={category.image}
                alt={category.title}
                width={128}
                height={128}
                className="object-contain rounded"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-700 line-clamp-2 px-2">
              {category.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
