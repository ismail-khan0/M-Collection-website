import { useSelector, useDispatch } from 'react-redux';
import { toggleWishlistItem } from '@/app/redux/wishlistSlice';
import { TrashIcon } from '@heroicons/react/24/outline';

const parsePrice = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price !== 'string') return 0;
  const numericString = price.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(numericString);
  return isNaN(parsed) ? 0 : parsed;
};

const WishlistItems = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const handleRemove = (productId) => {
    dispatch(toggleWishlistItem({ id: productId }));
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Free shipping special for you</h1>
        <button className="text-blue-600 font-medium">
          Select all ({wishlistItems.length})
        </button>
      </div>

      <div className="space-y-6">
        {wishlistItems.map((product) => {
          const price = parsePrice(product.price);
          const discountPrice = product.discountPrice
            ? parsePrice(product.discountPrice)
            : null;
          const discountPercentage = discountPrice
            ? Math.round(((price - discountPrice) / price) * 100)
            : 0;

          return (
            <div key={product.id} className="border-b pb-6 last:border-b-0">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">
                        {product.brand || "Somewhat Brand"}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.variant || ""}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-4">
                    {discountPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">
                          Rs.{discountPrice.toFixed(2)}
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                          {discountPercentage}%
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          Rs.{price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold">
                        Rs.{price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default WishlistItems;