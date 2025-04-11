'use client';
import React from "react";
import { useRouter } from 'next/navigation';

export default function FavoriteBrands({ products }) {
  const router = useRouter();

  const redirectToFilter = (brand) => {
    const params = new URLSearchParams();
    params.set('gender', 'kids');
    params.set('brand', brand); // Add the brand filter
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="mt-8 flex flex-col">
      <h3 className="text-2xl font-semibold text-gray-700 ml-16 md:ml-24 my-6">FAVOURITE BRANDS</h3>
      <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
        {products.slice(0, 8).map((product, index) => (
          <div
            key={index}
            onClick={() => redirectToFilter(product.brand)}
            className="cursor-pointer transition-transform hover:scale-105"
          >
            <img
              src={product.image}
              alt={product.title}
              className="h-32 w-32 border-2 border-yellow-300 rounded-full p-2 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}