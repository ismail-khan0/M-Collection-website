"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ShopByCategory = ({ title = "Shop by Category", gender = "men" }) => {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = gender 
          ? `/api/products?showInShopByCategory=true&gender=${gender}`
          : '/api/products?showInShopByCategory=true';
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.success && Array.isArray(data.products)) {
          const categoriesMap = new Map();
          data.products.forEach((product) => {
            // Ensure product has a category before adding to map
            if (product?.category) {
              categoriesMap.set(product.category, product);
            }
          });
          setProducts(Array.from(categoriesMap.values()));
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
  }, [gender]);

 // In Carousel, CategoryGrid, and ShopByCategory components
const redirectToFilter = (productOrCategory) => {
  const params = new URLSearchParams();
  
  // Handle both cases where we might get a product object or just a category string
  const category = typeof productOrCategory === 'string' 
    ? productOrCategory 
    : productOrCategory?.category || '';
  
  // Always set the gender prop that was passed to the component
  if (gender) params.set('gender', gender.toLowerCase());
  
  // Set category if available
  if (category) params.set('category', category.trim().toLowerCase());
  
  router.push(`/products?${params.toString()}`);
};

  return (
    <div id="Shop-Category" className="py-10 bg-gray-100">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 uppercase tracking-wide">
          {title}
        </h1>

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
      </div>
    </div>
  );
};

export default ShopByCategory;