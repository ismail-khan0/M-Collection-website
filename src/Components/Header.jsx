"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { searchProducts } from "./../app/redux/productsSlice";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/Image/Logo.jpeg";
import ProfileDropdown from "./ProfileDropdown";
import { CiHeart, CiUser } from "react-icons/ci";
import { PiBagSimpleLight } from "react-icons/pi";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);
    dispatch(searchProducts(value)); // Dispatch the search action
  };
  return (
    <nav
      id="header"
      className="fixed top-0 left-0 w-full z-50 bg-white border-gray-200 shadow-sm shadow-gray-200/50 dark:bg-gray-900"
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image className="ml-8 w-16 h-16" src={logo} alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"></span>
        </Link>

        <div className="flex md:order-2">
          <ul className="flex gap-4 items-center justify-center mr-2 md:hidden">
            <li className="relative group">
              <Link
                href="/wishlist"
                className="flex flex-col items-center h-auto py-0 gap-0 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group"
              >
                <CiHeart className="text-2xl group-hover:text-red-500" />
                <span className="text-sm group-hover:text-red-500">
                  Wishlist
                </span>
              </Link>
            </li>
            <li className="relative group">
              <Link
                href="/signin"
                className="flex flex-col items-center h-auto py-0 gap-0 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group"
              >
                <CiUser className="text-2xl group-hover:text-red-500" />
                <span className="text-sm group-hover:text-red-500">
                  Profile
                </span>
              </Link>
            </li>
          </ul>

          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search icon</span>
            </div>
            <input
              type="text"
              id="search-navbar"
              value={query}
              onChange={handleSearch}
              className="block w-[350px] p-[10px] ps-10 text-sm text-gray-900 bg-gray-100 border rounded-sm focus:ring-none focus:border-black focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for products, brands and more"
            />
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-search"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        <div
          className={`items-center justify-between ${
            isMenuOpen ? "block" : "hidden"
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-search"
        >
          <div className="relative mt-0 md:hidden">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
            />
          </div>
          <ul className="flex flex-col p-12 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-4 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li className="relative group">
              <Link
                href="/men"
                id="men"
                className="block relative px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:py-7 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 group"
              >
                Men
                <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-orange-600 group-hover:w-full"></span>
              </Link>
            </li>

            <li className="relative group">
              <Link
                href="/women"
                id="women"
                className="block relative px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:py-7 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Women
                <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-pink-600 group-hover:w-full"></span>
              </Link>
            </li>

            <li className="relative group">
              <Link
                href="/kids"
                id="kids"
                className="block relative px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:py-7 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Kids
                <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-orange-400 group-hover:w-full"></span>
              </Link>
            </li>

            <li className="relative group">
              <Link
                href="/gifts"
                id="men"
                className="block relative px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:py-7 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Gifts
                <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-yellow-400 group-hover:w-full"></span>
              </Link>
            </li>

            <li className="relative group">
              <Link
                href="#"
                id="Kids"
                className="block relative px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:py-7 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Studio
                <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-red-500 group-hover:w-full"></span>
              </Link>
            </li>
          </ul>
        </div>

        <div
          className="items-center justify-center hidden w-full md:flex md:w-auto md:order-3 pr-4"
          id="navbar-search"
        >
          <ul className="flex flex-row items-center p-0 md:py-0 mt-0 font-medium border border-gray-100 rounded-lg bg-gray-50 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li className="relative group mx-4">
              <div className="flex flex-col items-center h-auto py-0 gap-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:py-4 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                <CiUser className="text-3xl group-hover:text-red-500" />
                <span className="text-sm group-hover:text-red-500">
                  Profile
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-red-500 group-hover:w-full"></span>
              </div>
              <ProfileDropdown />
            </li>
            <li className="mx-4">
              <Link
                href="/wishlist"
                className="flex flex-col items-center h-auto py-0 gap-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent group"
              >
                <CiHeart className="text-3xl group-hover:text-red-500" />
                <span className="text-sm group-hover:text-red-500">
                  Wishlist
                </span>
              </Link>
            </li>
            <li className="mx-4">
              <Link
                href="/products"
                className="flex flex-col items-center h-auto py-0 gap-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent group"
              >
                <PiBagSimpleLight className="text-3xl group-hover:text-red-500" />
                <span className="text-sm group-hover:text-red-500">Bags</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
