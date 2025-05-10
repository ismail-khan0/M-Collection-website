'use client';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import CheckoutSteps from './CheckoutSteps';
import AddressForm from './AddressForm';
import PaymentMethod from './PaymentMethod';
import OrderConfirmation from './OrderConfirmation';

const parsePrice = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price !== 'string') return 0;
  const numericString = price.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(numericString);
  return isNaN(parsed) ? 0 : parsed;
};

const CheckoutProcess = ({ step: initialStep, setStep }) => {
  const [step, setInternalStep] = useState(initialStep);
  const [address, setAddress] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const { data: session } = useSession();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const handleStepChange = (newStep) => {
    setInternalStep(newStep);
    setStep(newStep);
  };

  const handleAddressSubmit = (addressData) => {
    setAddress(addressData);
    handleStepChange(2);
  };

  const handlePaymentComplete = async (paymentData) => {
    const subtotal = wishlistItems.reduce((sum, product) => {
      return sum + parsePrice(product.price);
    }, 0);

    const totalDiscount = wishlistItems.reduce((sum, product) => {
      if (product.discountPrice) {
        return sum + (parsePrice(product.price) - parsePrice(product.discountPrice));
      }
      return sum;
    }, 0);

    const totalPrice = subtotal - totalDiscount;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: wishlistItems.map(item => ({
            id: item.id,
            name: item.name,
            image: item.image,
            price: item.price,
            discountPrice: item.discountPrice,
            quantity: 1,
            category: item.category || 'Uncategorized' 
          })),
          shippingAddress: address,
          paymentMethod: paymentData.method,
          subtotal,
          totalDiscount,
          totalPrice
        })
      });

      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      setOrderDetails({
        orderNumber: data.order.orderNumber,
        total: totalPrice,
        address,
        paymentMethod: paymentData.method,
        items: wishlistItems.map(item => ({
          ...item,
          category: item.category || 'Uncategorized' 
        }))
      });

      handleStepChange(3);
    } catch (error) {
      console.error('Error creating order:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <CheckoutSteps currentStep={step} />

      {step === 1 && (
        <AddressForm
          onNext={handleAddressSubmit}
          onBack={() => handleStepChange(0)}
        />
      )}

      {step === 2 && (
        <PaymentMethod
          onComplete={handlePaymentComplete}
          onBack={() => handleStepChange(1)}
          address={address}
          user={session?.user}
        />
      )}

      {step === 3 && (
        <OrderConfirmation
          orderDetails={orderDetails}
          onContinue={() => handleStepChange(0)}
        />
      )}
    </div>
  );
};

export default CheckoutProcess;
