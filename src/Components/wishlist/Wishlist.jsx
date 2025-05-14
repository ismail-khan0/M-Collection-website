'use client';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleWishlistItem } from '@/app/redux/wishlistSlice';
import WishlistEmpty from './WishlistEmpty';
import WishlistItems from './WishlistItems';
import WishlistSummary from './WishlistSummary';
import CheckoutProcess from '../Checkout/CheckoutProcess';
import { useSession } from 'next-auth/react';
const Wishlist = () => {
  const [checkoutStep, setCheckoutStep] = useState(0);
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // Sync Redux wishlist with database on load if session exists
  useEffect(() => {
    if (session) {
      const syncWishlist = async () => {
        try {
          const response = await fetch('/api/wishlist', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json();
            data.wishlist.forEach(item => {
              if (!wishlistItems.some(wishlistItem => wishlistItem.id === item._id)) {
                dispatch(toggleWishlistItem({
                  id: item._id,
                  name: item.title,
                  price: item.price,
                  discountPrice: item.discountPrice,
                  image: item.image,
                  brand: item.brand
                }));
              }
            });
          }
        } catch (error) {
          console.error('Error syncing wishlist:', error);
        }
      };
      syncWishlist();
    }
  }, [session, dispatch, wishlistItems]);

  // Toggle wishlist item (add/remove) and update DB
  const handleToggleWishlist = async (product) => {
    dispatch(toggleWishlistItem(product));

    if (session) {
      try {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ productId: product.id }),
        });
      } catch (error) {
        console.error('Error updating wishlist:', error);
      }
    }
  };

  if (checkoutStep > 0) {
    return <CheckoutProcess step={checkoutStep} setStep={setCheckoutStep} />;
  }

  if (wishlistItems.length === 0) {
    return <WishlistEmpty />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <WishlistItems onToggleWishlist={handleToggleWishlist} />
      <WishlistSummary onCheckout={() => setCheckoutStep(1)} />
    </div>
    
  );
  // Add this to your order details page


function OrderDetailsPage({ order }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleStartChat = async () => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          orderId: order._id,
          message: `I have a question about order #${order.orderNumber}`
        }),
      });

      const data = await response.json();
      if (data.success) {
        router.push("/account/support");
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  return (
    <div>
      {/* Your existing order details */}
      <button
        onClick={handleStartChat}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Contact Support About This Order
      </button>
    </div>
  );
}
};

export default Wishlist;
