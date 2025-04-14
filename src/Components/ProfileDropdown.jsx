'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../app/redux/authSlice'; // Adjust the path as per your folder structure

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div
      className="absolute top-[100%] left-[-100px] z-50 bg-white text-black shadow-xl p-6 w-72 border border-gray-200 rounded-md hidden group-hover:flex flex-col"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <h1 className="font-bold text-xl mb-1">
        {isAuthenticated && user?.name ? `Hi, ${user.name}` : 'Welcome'}
      </h1>
      <p className="text-sm text-[#535665]">
        {isAuthenticated ? 'Glad to see you back!' : 'To access your account & manage orders'}
      </p>

      <div className="mt-3">
        {isAuthenticated ? (
          <button
            className="w-full py-1 px-4 text-red-600 border border-red-600 rounded-sm hover:bg-red-50"
            onClick={() => dispatch(logout())}
          >
            Logout
          </button>
        ) : (
          <Link href="/signin">
            <button className="w-full py-1 px-4 text-red-600 border border-red-600 rounded-sm hover:bg-red-50">
              Profile
            </button>
          </Link>
        )}
      </div>

      <hr className="my-3" />

      <div>
        <ul className="space-y-1 text-sm">
          <li><Link href="#">Orders</Link></li>
          <li><Link href="#">Wishlist</Link></li>
          <li><Link href="#">Gift Cards</Link></li>
          <li><Link href="#">Contact Us</Link></li>
          <li><Link href="#">Myntra Insider</Link></li>
        </ul>
      </div>

      <hr className="my-3" />

      <div>
        <ul className="space-y-1 text-sm">
          <li><Link href="#">Myntra Credit</Link></li>
          <li><Link href="#">Coupons</Link></li>
          <li><Link href="#">Saved Cards</Link></li>
          <li><Link href="#">Saved VPA</Link></li>
          <li><Link href="#">Saved Addresses</Link></li>
        </ul>
      </div>
    </div>
  );
}
