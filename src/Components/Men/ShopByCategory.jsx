"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ShopByCategory = ({
  apiUrl,
  title = "Shop by Category",
  gender = "men",
}) => {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  const redirectToFilter = (categoryId) => {
    const params = new URLSearchParams();
    params.set("gender", gender); // dynamic
    router.push(`/products?${params.toString()}`);
  };

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, [apiUrl]);

  return (
    <div id="Shop-Category" className="py-10 bg-gray-100">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 uppercase tracking-wide">
          {title}
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {products.slice(0, 12).map((product) => (
            <div
              key={product.id}
              onClick={() => redirectToFilter(product.title)}
              className="bg-white border-4 border-red-500 overflow-hidden shadow hover:scale-105 transition-all cursor-pointer"
            >
              <div className="w-full aspect-[3/4] relative bg-white p-8">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="p-2"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>

              <div className="w-full h-32 bg-red-600 text-white flex flex-col justify-between p-3 text-center">
                <div>
                  <p className="text-sm font-medium">{product.title}</p>
                </div>

                <div>
                  <p className="text-xl font-extrabold">{product.price}</p>
                  <p className="text-sm font-semibold">Shop Now</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopByCategory;
