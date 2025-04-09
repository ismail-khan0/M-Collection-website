'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSignup = (e) => {
    e.preventDefault();

    // Simple validation
    if (password === confirmPassword) {
      alert('Sign Up successful!');
      router.push('/'); // Redirect to homepage or dashboard
    } else {
      alert('Passwords do not match');
    }
  };

  return (
    <div id="signup-page" className="min-h-screen flex flex-col mt-16 mb-4">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-2 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign up
          </h1>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="fullname"
              placeholder="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
            <input
              type="email"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="confirm_password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full text-center py-3 rounded bg-green text-white hover:bg-green-dark focus:outline-none bg-red-500 my-1"
            >
              Create Account
            </button>
          </form>
          <div className="text-center text-sm text-grey-dark mt-4">
            By signing up, you agree to the
            <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
              Terms of Service
            </a>{' '}
            and
            <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
              Privacy Policy
            </a>
          </div>
        </div>
        <div className="text-grey-dark mt-6">
          Already have an account?{' '}
          <button
            id="go-to-login"
            onClick={() => router.push('/signin')}
            className="no-underline border-b border-blue text-blue"
          >
            Log in
          </button>
          .
        </div>
      </div>
    </div>
  );
}
