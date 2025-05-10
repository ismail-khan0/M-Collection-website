import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from 'next/navigation';

const PaymentMethod = ({ onComplete, onBack, address, isSubmitting, orderTotals, user }) => {
  const [paymentMethod, setPaymentMethod] = useState("easypisa");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/login?redirect=/wishlist/checkout');
      return;
    }
    if (termsAccepted) {
      onComplete({ method: paymentMethod });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-6">Payment Method</h2>
      
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-medium mb-2">Shipping Address</h3>
        <p>{address.fullName}</p>
        <p>{address.street}</p>
        <p>{address.city}, {address.state} {address.zipCode}</p>
        <p>{address.country}</p>
        <p className="mt-2">Phone: {address.phone}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="font-medium mb-3">Select Payment Method</h3>
          <div className="space-y-3">
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500">
              <input
                type="radio"
                name="paymentMethod"
                value="easypisa"
                checked={paymentMethod === "easypisa"}
                onChange={() => setPaymentMethod("easypisa")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3 flex items-center">
                <img src="/easypaisa-logo.png" alt="Easypisa" className="h-6" />
                <span className="ml-2 text-sm text-gray-700">Easypisa</span>
              </div>
            </label>
            
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500">
              <input
                type="radio"
                name="paymentMethod"
                value="khalti"
                checked={paymentMethod === "khalti"}
                onChange={() => setPaymentMethod("khalti")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3 flex items-center">
                <img src="/khalti-logo.svg" alt="Khalti" className="h-6" />
                <span className="ml-2 text-sm text-gray-700">Khalti</span>
              </div>
            </label>
            
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700">Cash on Delivery</span>
            </label>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 mt-1"
            />
            <span className="ml-2 text-sm text-gray-700">
              I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and 
              <a href="#" className="text-blue-600 hover:underline"> Privacy Policy</a>
            </span>
          </label>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!termsAccepted || isSubmitting}
            className={`px-4 py-2 rounded-md text-white ${termsAccepted ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
          >
            {isSubmitting ? 'Processing...' : 'Complete Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentMethod;