'use client';
import React from "react";

export default function KidsCategories({ products }) {
  return (
    <div className="flex flex-col gap-4 my-6">
      <h3 className="text-2xl font-semibold text-gray-700 ml-16 md:ml-24 my-6">Kids Categories</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mx-8 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition h-full"
          >
            <img
              src={product.image}
              alt={product.title}
              className="h-40 object-contain mb-2"
            />
            <div className="flex flex-col flex-grow w-full">
              <h4 className="text-sm font-medium line-clamp-2 h-12 flex items-center justify-center">
                {product.title}
              </h4>
              <p className="text-yellow-600 font-semibold mt-auto">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}