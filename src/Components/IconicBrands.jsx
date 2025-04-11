'use client';
import React from "react";
import { useRouter } from 'next/navigation';

export default function IconicBrands({ products }) {
  const router = useRouter();

  const redirectToFilter = (category) => {
    const params = new URLSearchParams();
    params.set('gender', 'kids');
    params.set('category', category);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 my-6 flex-col">
      <h3 className="text-2xl font-semibold text-gray-700 ml-16 md:ml-24 my-6">Iconic Brands</h3>

      <div className="flex flex-wrap justify-center items-center gap-4 bg-orange-300 p-4">
        {products.slice(4, 9).map((product, index) => (
          <div
            key={index}
            onClick={() => redirectToFilter(product.brand)}
            className="w-52 h-40 rounded-lg overflow-hidden shadow-md flex justify-center items-center bg-white cursor-pointer"
          >
            <img
              src={product.image}
              alt={product.title}
              className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}