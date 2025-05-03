'use client';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlistItem } from '@/app/redux/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.items);

  const productId = product._id || product.id;
  const isWishlisted = wishlistItems.some(
    item => (item._id || item.id) === productId
  );

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlistItem({
      ...product,
      id: productId,
    }));
  };

  return (
    <div 
      className="group bg-white h-full flex flex-col justify-between p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300"
      title={product.name}
    >
      {/* Image - Full area cover */}
      <div className="relative aspect-square overflow-hidden rounded-lg mb-4 w-full">
        <img 
          src={product.image} 
          alt={product.name} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          title={product.name}
          loading="lazy"
        />
      </div>

      {/* Title & Price */}
      <div className="flex flex-col flex-grow justify-center items-center">
        <h3 
          className="text-base font-semibold text-gray-900 line-clamp-2 mb-1 min-h-[18px] text-center"
          title={product.title}
        >
          {product.title}
        </h3>

        <div className="mb-2">
          <div className="flex items-center justify-center gap-2">
            <span 
              className="text-red-500 font-bold text-lg"
              title={`Discounted price: ${product.discountPrice}`}
            >
              {product.discountPrice}
            </span>
            <span 
              className="text-gray-400 line-through text-sm"
              title={`Original price: ${product.price}`}
            >
              {product.price}
            </span>
          </div>
        </div>
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={handleWishlistToggle}
        className={`w-full py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
          isWishlisted 
            ? 'bg-red-100 text-red-600 border border-red-200' 
            : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500 border border-gray-200'
        }`}
        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isWishlisted ? '❤️ Added to Wishlist' : '♡ Add to Wishlist'}
      </button>
    </div>
  );
};

export default ProductCard;