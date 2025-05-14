'use client';
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const CheckoutSteps = ({ currentStep }) => {
  const steps = ["Address", "Payment", "Confirmation"]; // Updated to match your flow

  return (
    <div className="flex justify-between items-center mb-8 relative">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center z-10 bg-white px-4">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center 
            ${currentStep >= index + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
          >
            {currentStep > index + 1 ? (
              <CheckCircleIcon className="w-5 h-5" />
            ) : (
              index + 1
            )}
          </div>
          <span
            className={`mt-2 text-sm ${currentStep >= index + 1 ? "text-blue-600 font-medium" : "text-gray-500"}`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;
