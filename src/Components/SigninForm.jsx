'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../app/redux/authSlice';

export default function SigninForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      // Replace with actual API call
      if (email === 'test@example.com' && password === 'password') {
        const user = { email, name: 'Test User' };
        dispatch(loginSuccess(user));
        router.push('/');
      } else {
        dispatch(loginFailure('Invalid credentials'));
        alert('Invalid credentials');
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
      alert('Login failed');
    }
  };

  return (
    <section id="login-page" className=" my-20 flex items-center justify-center">
      <div className="w-full bg-white rounded-lg shadow-lg max-w-md p-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-900">Sign in to your account</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <input
                  id="remember"
                  aria-describedby="remember"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600"
                />
                <label htmlFor="remember" className="ml-3 text-sm text-gray-500">Remember me</label>
              </div>
              <a href="#" className="text-sm text-primary-600 hover:underline">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="w-full py-3 text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm"
            >
              Sign in
            </button>
            <p className="text-sm font-light text-gray-500">
              Don’t have an account yet?{' '}
              <button
                type="button"
                id="go-to-signup"
                onClick={() => router.push('/signup')}
                className="font-medium text-primary-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
