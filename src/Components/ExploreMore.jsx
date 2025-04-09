'use client';
import React from "react";



export default function ExploreMore({ products }) {
  return (
    <div className="flex flex-col gap-6 my-6">
      <h3 className="text-2xl font-semibold text-gray-700 ml-6 md:ml-24">Explore More</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 md:px-24">
      {products.slice(0, 4).map((product, i) => (
  <div key={i} className="w-full rounded-lg overflow-hidden shadow-md">
    <img
      src={product.image}
      alt={`Explore ${i}`}
      className="w-full object-contain"
    />
  </div>
))}

      </div>
    </div>
  );
}
