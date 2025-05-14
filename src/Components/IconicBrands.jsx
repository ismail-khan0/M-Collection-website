'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function IconicBrands() {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchIconicBrands = async () => {
      try {
        const response = await fetch(`/api/products?gender=kids&showInIconicBrands=true`);
        const data = await response.json();

        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("Unexpected product response format.");
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching iconic brands:", error);
        setProducts([]);
      }
    };

    fetchIconicBrands();
  }, []);

  const redirectToFilter = (brand) => {
    const params = new URLSearchParams();
    params.set('gender', 'kids');
    params.set('category', brand);
    router.push(`/products?${params.toString()}`);
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No iconic brands available at the moment.
      </div>
    );
  }

  const iconicBrands = products.length > 4 ? products.slice(4, 9) : products.slice(0, 5);

  return (
    <div className="flex gap-2 my-6 flex-col">
      <h3 className="text-2xl font-semibold text-gray-700 ml-16 md:ml-24 my-6">Iconic Brands</h3>

      <div className="flex flex-wrap justify-center items-center gap-4 bg-orange-300 p-4 rounded-lg">
        {iconicBrands.map((product, index) => {
          if (!product.image || !product.brand) return null;

          return (
            <div
              key={index}
              onClick={() => redirectToFilter(product.brand)}
              className="w-52 h-40 rounded-lg overflow-hidden shadow-md flex justify-center items-center bg-white cursor-pointer hover:shadow-lg transition-shadow"
            >
              <img
                src={product.image}
                alt={product.title || "Brand Image"}
                className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
