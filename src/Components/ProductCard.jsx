'use client';

import { useState } from 'react';

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Here you would typically call an API to update the wishlist in your database
  };

  return (
    <div className="group bg-white h-full flex flex-col p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-lg mb-3">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      {/* Product Info */}
      <div className="flex-grow flex flex-col">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-center justify-center gap-2">
            <span className="text-red-500 font-bold text-lg">
              {product.discountPrice}
            </span>
            <span className="text-gray-400 line-through text-sm">
              {product.price}
            </span>
          </div>
        </div>

        {/* Wishlist Button - Always visible but more prominent on hover */}
        <button 
          onClick={toggleWishlist}
          className={`mt-3 w-full py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            isWishlisted 
              ? 'bg-red-100 text-red-600 border border-red-200' 
              : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500 border border-gray-200'
          }`}
        >
          {isWishlisted ? '❤️ Added to Wishlist' : '♡ Add to Wishlist'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;