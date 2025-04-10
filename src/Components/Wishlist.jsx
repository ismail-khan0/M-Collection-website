import { useSelector, useDispatch } from 'react-redux';
import { toggleWishlistItem } from './../app/redux/wishlistSlice'; 
import { TrashIcon } from '@heroicons/react/24/outline';

const parsePrice = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price !== 'string') return 0;
  
  // Remove all non-numeric characters except decimal point
  const numericString = price.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(numericString);
  return isNaN(parsed) ? 0 : parsed;
};

const Wishlist = () => {
  const wishlistItems = useSelector(state => state.wishlist.items);
  const dispatch = useDispatch();

  // Calculate total price
  const totalPrice = wishlistItems.reduce((sum, product) => {
    const price = parsePrice(product.discountPrice || product.price);
    return sum + price;
  }, 0);

  const handleRemove = (productId) => {
    dispatch(toggleWishlistItem({ id: productId }));
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="w-full md:w-3/4 flex items-center justify-center py-12">
        <p className="text-center text-gray-500">Your wishlist is empty</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-3/4 p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Wishlist</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlistItems.map(product => {
          const price = parsePrice(product.price);
          const discountPrice = product.discountPrice ? parsePrice(product.discountPrice) : null;

          return (
            <div
              key={product.id}
              className="group bg-white h-full flex flex-col p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex-grow flex flex-col">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 min-h-[40px]">
                  {product.name}
                </h3>
                <div className="mt-auto">
                  <div className="flex items-center justify-center gap-2">
                    {discountPrice ? (
                      <>
                        <span className="text-red-500 font-bold text-lg">
                          ${discountPrice.toFixed(2)}
                        </span>
                        <span className="text-gray-400 line-through text-sm">
                          ${price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-lg">
                        ${price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemove(product.id)}
                className="mt-3 self-center p-2 rounded-full bg-red-500 hover:bg-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Total Price Display */}
      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <span className="text-lg font-semibold">Total Price:</span>
        <span className="text-xl text-red-500 font-bold">
          ${totalPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default Wishlist;