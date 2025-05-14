const WishlistEmpty = () => {
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
  };
  
  export default WishlistEmpty;