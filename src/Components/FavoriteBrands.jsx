'use client';
import React from "react";

export default function FavoriteBrands({ products }) {


  return (
    <div className="mt-8 flex flex-col">
      <h3 className="text-2xl font-semibold text-gray-700 ml-16 md:ml-24 my-6">FAVOURITE BRANDS</h3>
      <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
        { products.slice(0, 8).map((product, index) => (
          <img
            key={index}
            src={product.image}
            alt={product.title}
            className="h-32 w-32 border-2 border-yellow-300 rounded-full p-2 object-contain"
          />
        ))}
      </div>
    </div>
  );
}
