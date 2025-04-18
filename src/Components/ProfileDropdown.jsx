'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'next-auth/react';
import { logout } from '@/app/redux/authSlice';
import { useSession } from 'next-auth/react';

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const logoutHandler = async () => {
    try {
      await signOut({ callbackUrl: '/' });
      dispatch(logout());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div
      className="absolute top-[100%] left-[-100px] z-50 bg-white text-black shadow-xl p-6 w-72 border border-gray-200 rounded-md hidden group-hover:flex flex-col"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {isAuthenticated && session?.user ? (
        <>
          <h1 className="font-bold text-xl mb-1">{session.user.name}</h1>
          <p className="text-sm text-[#535665]">{session.user.email}</p>

          <div className="mt-3">
            <button
              className="w-full py-1 px-4 text-red-600 border border-red-600 rounded-sm hover:bg-red-50"
              onClick={logoutHandler}
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <Link href="/signin">
          <button className="w-full py-1 px-4 text-blue-600 border border-blue-600 rounded-sm hover:bg-blue-50">
            Sign In
          </button>
        </Link>
      )}
    </div>
  );
}