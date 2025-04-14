'use client';
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { useRouter } from 'next/navigation';

const SocialAuthButtons = ({ isSignup = false }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-3 my-4 p-4">
      {/* Text */}
      <p className="text-gray-700 text-center">
        {isSignup ? (
          <>
            Already have an account?{' '}
            <button
              onClick={() => router.push('/signin')}
              className="font-medium text-primary-600 hover:underline"
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <button
              onClick={() => router.push('/signup')}
              className="font-medium text-primary-600 hover:underline"
            >
              Sign up
            </button>
          </>
        )}
      </p>

      <span className="text-gray-500">or</span>

      {/* Sign Up With Email Button */}
      <button
        onClick={() => router.push(isSignup ? '/signup' : '/signin')}
        className="w-full bg-blue-600 text-white font-medium px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
      >
        {isSignup ? 'Sign Up With Email' : 'Sign In With Email'}
      </button>

      {/* Social Login Buttons */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={() => (window.location.href = "https://www.apple.com/")}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
          aria-label="Sign in with Apple"
        >
          <FaApple className="text-black text-xl" />
        </button>
        <button
          onClick={() => (window.location.href = "https://www.facebook.com/")}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
          aria-label="Sign in with Facebook"
        >
          <FaFacebook className="text-blue-600 text-xl" />
        </button>
        <button
          onClick={() => (window.location.href = "https://accounts.google.com/")}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
          aria-label="Sign in with Google"
        >
          <FaGoogle className="text-red-500 text-xl" />
        </button>
      </div>
    </div>
  );
};

export default SocialAuthButtons;