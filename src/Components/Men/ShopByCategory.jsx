"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ShopByCategory = ({ title = "Shop by Category", gender = "men" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = gender 
          ? `/api/products?showInShopByCategory=true&gender=${gender}`
          : '/api/products?showInShopByCategory=true';
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.success && Array.isArray(data.products)) {
          const categoriesMap = new Map();
          data.products.forEach((product) => {
            if (product?.category) {
              categoriesMap.set(product.category, product);
            }
          });
          setProducts(Array.from(categoriesMap.values()));
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [gender]);

  const redirectToFilter = (productOrCategory) => {
    const params = new URLSearchParams();

    const category = typeof productOrCategory === 'string' 
      ? productOrCategory 
      : productOrCategory?.category || '';

    if (gender) params.set('gender', gender.toLowerCase());
    if (category) params.set('category', category.trim().toLowerCase());

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div id="Shop-Category" className="py-10 bg-gray-100">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 uppercase tracking-wide">
          {title}
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-600 text-lg font-medium">No data found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <div
                key={product._id || product.id}
                onClick={() => redirectToFilter(product)}
                className="bg-white border-8 border-red-500 overflow-hidden shadow-sm cursor-pointer flex flex-col group"
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                  <Image
                    src={product.image || '/default-product-image.png'}
                    alt={product.title || 'Product image'}
                    fill
                    className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-product-image.png';
                    }}
                  />
                </div>

                <div className="bg-red-500 text-white flex flex-col justify-center items-center p-2 gap-1">
                  <p className="text-sm font-semibold">{product.category || 'Category'}</p>
                  <p className="text-lg font-extrabold">
                    {product.discountPrice || 0} % OFF
                  </p>
                  <p className="text-sm font-semibold">Shop Now</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopByCategory;
