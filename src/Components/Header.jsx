"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts, fetchProducts } from "./../app/redux/productsSlice";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/Image/m-logo.png";
import ProfileDropdown from "./ProfileDropdown";
import { CiHeart, CiUser } from "react-icons/ci";
import { PiBagSimpleLight } from "react-icons/pi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { items: products } = useSelector((state) => state.products);
  const searchRef = useRef(null);

  useEffect(() => {
    // Fetch products when component mounts if not already loaded
    if (products.length === 0) {
      dispatch(fetchProducts());
    }

    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch, products.length]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);
    if (value.length > 0) {
      setShowSuggestions(true);
      dispatch(searchProducts(value));
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
      setQuery("");
    }
  };



  const filteredProducts = query.length > 0
    ? products.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <nav
      id="header"
      className="fixed top-0 left-0 w-full z-50 bg-white border-gray-200 shadow-sm shadow-gray-200/50 dark:bg-gray-900"
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4">
        <div className="flex items-center md:order-1">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            className="inline-flex items-center p-2 mr-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <Image className="w-16 h-16" src={logo} alt="Logo" />
          </Link>
        </div>

        {/* Mobile Search - shown only when menu is open */}
        {isMenuOpen && (
          <div className="w-full md:hidden mt-2">
            <form onSubmit={handleSearchSubmit} ref={searchRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                  id="mobile-search"
                  value={query}
                  onChange={handleSearch}
                  onFocus={() => query.length > 0 && setShowSuggestions(true)}
                  className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search for products, brands and more"
                />
             
              </div>
            </form>
          </div>
        )}

        {/* Desktop Navigation Links */}
        <div
          className={`items-center justify-between ${
            isMenuOpen ? "block" : "hidden"
          } w-full md:flex md:w-auto md:order-2`}
          id="navbar-search"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-4 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li className="relative group">
              <Link
                href="/men"
                className="block relative px-3 py-2 md:py-7 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 group"
              >
                Men
                <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-orange-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>

            <li className="relative group">
              <Link
                href="/women"
                className="block relative px-3 py-2 md:py-7 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Women
                <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>

            <li className="relative group">
              <Link
                href="/kids"
                className="block relative px-3 py-2 md:py-7 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Kids
                <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-orange-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>

            <li className="relative group">
              <Link
                href="/gifts"
                className="block relative px-3 py-2 md:py-7 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Gifts
                <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>

            {user?.isAdmin && (
              <li className="relative group">
                <Link
                  href="/inputData"
                  className="block relative px-3 py-2 md:py-7 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Admin Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-red-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex md:order-3 md:w-auto md:flex-1 md:max-w-md lg:max-w-lg mx-4" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                id="desktop-search"
                value={query}
                onChange={handleSearch}
                onFocus={() => query.length > 0 && setShowSuggestions(true)}
                className="block w-full p-2 pl-10 text-sm text-gray-900 bg-gray-100 border rounded-sm focus:ring-none focus:border-black focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for products, brands and more"
              />
            
            </div>
          </form>
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center md:order-4">
          <ul className="flex flex-row items-center p-0 font-medium border border-gray-100 rounded-lg bg-gray-50 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li className="relative group mx-2 lg:mx-4">
              <div className="flex flex-col items-center h-auto py-0 gap-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:py-4 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                <CiUser className="text-2xl lg:text-3xl group-hover:text-red-500" />
                <span className="text-xs lg:text-sm group-hover:text-red-500">
                  Profile
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-red-500 group-hover:w-full transition-all duration-300"></span>
              </div>
              <ProfileDropdown />
            </li>
            <li className="mx-2 lg:mx-4">
              <Link
                href="/wishlist"
                className="flex flex-col items-center h-auto py-0 gap-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent group"
              >
                <CiHeart className="text-2xl lg:text-3xl group-hover:text-red-500" />
                <span className="text-xs lg:text-sm group-hover:text-red-500">
                  Wishlist
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-red-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li className="mx-2 lg:mx-4">
              <Link
                href="/products"
                className="flex flex-col items-center h-auto py-0 gap-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent group"
              >
                <PiBagSimpleLight className="text-2xl lg:text-3xl group-hover:text-red-500" />
                <span className="text-xs lg:text-sm group-hover:text-red-500">Bags</span>
                <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-red-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile Icons - shown when menu is closed */}
        {!isMenuOpen && (
          <div className="flex md:hidden items-center md:order-4">
            <ul className="flex gap-4 items-center justify-center">
              <li className="relative group">
                <Link
                  href="/wishlist"
                  className="flex flex-col items-center h-auto py-0 gap-0 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group"
                >
                  <CiHeart className="text-2xl group-hover:text-red-500" />
                  <span className="text-xs group-hover:text-red-500">
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
                  <span className="text-xs group-hover:text-red-500">
                    Profile
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}