'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function FavoriteBrands() {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?gender=kids&showInFavouriteBrands=true`);
        const data = await response.json();

        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("Unexpected product response format.");
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const redirectToFilter = (brand) => {
    const params = new URLSearchParams();
    params.set('gender', 'kids');
    params.set('brand', brand);
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
