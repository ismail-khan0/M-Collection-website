'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function KidsCategories() {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchKidsCategories = async () => {
      try {
        const res = await fetch(`/api/products?gender=kids&showInKidsCategories=true`);
        const data = await res.json();

        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("Unexpected product response format.");
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching Kids Categories:", err);
        setProducts([]);
      }
    };

    fetchKidsCategories();
  }, []);

  const redirectToFilter = (category) => {
    const params = new URLSearchParams();
    params.set('gender', 'kids');
    params.set('category', category);
    router.push(`/products?${params.toString()}`);
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No kids categories available at the moment.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 my-6">
      <h3 className="text-2xl font-semibold text-gray-700 ml-16 md:ml-24 my-6">Kids Categories</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mx-8 gap-6">
        {products.map((product) => (
          <div
            key={product._id || product.id}
            onClick={() => redirectToFilter(product.category)}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition h-full cursor-pointer"
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
