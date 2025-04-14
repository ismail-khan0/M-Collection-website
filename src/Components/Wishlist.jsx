import { useSelector, useDispatch } from "react-redux";
import { toggleWishlistItem } from "./../app/redux/wishlistSlice";
import { TrashIcon } from "@heroicons/react/24/outline";

const parsePrice = (price) => {
  if (typeof price === "number") return price;
  if (typeof price !== "string") return 0;

  // Remove all non-numeric characters except decimal point
  const numericString = price.replace(/[^0-9.]/g, "");
  const parsed = parseFloat(numericString);
  return isNaN(parsed) ? 0 : parsed;
};

const Wishlist = () => {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();

  // Calculate totals
  const subtotal = wishlistItems.reduce((sum, product) => {
    const price = parsePrice(product.price);
    return sum + price;
  }, 0);

  const totalDiscount = wishlistItems.reduce((sum, product) => {
    if (product.discountPrice) {
      const price = parsePrice(product.price);
      const discountPrice = parsePrice(product.discountPrice);
      return sum + (price - discountPrice);
    }
    return sum;
  }, 0);

  const totalPrice = subtotal - totalDiscount;

  const handleRemove = (productId) => {
    dispatch(toggleWishlistItem({ id: productId }));
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12 px-4">
        <div className="w-48 h-48 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          You haven't added any items to your wishlist yet. Start shopping to
          add your favorite products!
        </p>
        <button
          onClick={() => (window.location.href = "/products")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Free shipping special for you</h1>
        <button className="text-blue-600 font-medium">
          Select all ({wishlistItems.length})
        </button>
      </div>

      {/* Wishlist Items */}
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
                {/* Product Image */}
                <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Product Info */}
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

                  {/* Price Section */}
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

      {/* Order Summary */}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Item(s) total:</span>
            <span>Rs.{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Item(s) discount:</span>
            <span className="text-red-500">-Rs.{totalDiscount.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t pt-4 mb-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>Rs.{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="font-medium text-blue-800">Free shipping</p>
          <p className="text-xs text-gray-500 mt-1">1 almost sold out</p>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium">
          Checkout ({wishlistItems.length})
        </button>

        {/* Footer Notes */}
        <div className="mt-6 space-y-3 text-xs text-gray-500">
          <p>
            ① Item availability and pricing are not guaranteed until payment is
            final.
          </p>
          <p>
            ② You will not be charged until you review this order on the next
            page
          </p>
          <p>➊ Safe Payment Options</p>
          <p className="text-gray-400">
            Temu is committed to protecting your payment information. We follow
            PCI DSS standards, use strong automation, and perform regular
            reviews of its system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
