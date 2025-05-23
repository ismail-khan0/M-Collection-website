'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function ExploreMore() {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?gender=kids&showInExploreMore=true`);
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

  const redirectToFilter = (category) => {
    const params = new URLSearchParams();
    params.set('gender', 'kids');
    params.set('category', category);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6 my-6">
      <h3 className="text-2xl font-semibold text-gray-700 ml-6 md:ml-24">Explore More</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 md:px-24">
        {products.slice(0, 4).map((product, i) => (
          <div 
            key={i} 
            onClick={() => redirectToFilter(product.category)}
            className="w-full rounded-lg overflow-hidden shadow-md cursor-pointer"
          >
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
