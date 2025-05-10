'use client';
import { useSelector } from 'react-redux';

const parsePrice = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price !== 'string') return 0;
  const numericString = price.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(numericString);
  return isNaN(parsed) ? 0 : parsed;
};

const WishlistSummary = ({ onCheckout }) => {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  
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

  return (
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

      <button 
        onClick={onCheckout}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium"
      >
        Proceed to Checkout ({wishlistItems.length})
      </button>
    </div>
  );
};

export default WishlistSummary;