'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8 px-4 sm:px-10">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Column 1: Online Shopping & Useful Links */}
        <div>
          <h2 className="font-bold mb-2 uppercase text-[#3e4152] tracking-wider text-[1.8em] max-h-[5em]">
            ONLINE SHOPPING
          </h2>
          <ul className="space-y-1 text-gray-600">
            <li>Men</li>
            <li>Women</li>
            <li>Kids</li>
            <li>Home & Living</li>
            <li>Beauty</li>
            <li>Gift Cards</li>
            <li>Myntra Insider</li>
          </ul>
          <h2 className="font-bold mt-4 mb-2">USEFUL LINKS</h2>
          <ul className="space-y-1 text-gray-600">
            <li>Blog</li>
            <li>Careers</li>
            <li>Site Map</li>
            <li>Corporate Information</li>
            <li>Whitehat</li>
            <li>Cleartrip</li>
          </ul>
        </div>

        {/* Column 2: Customer Policies */}
        <div>
          <h2 className="font-bold mb-2">CUSTOMER POLICIES</h2>
          <ul className="space-y-1 text-gray-600">
            <li>
              <Link href="#">Contact Us</Link>
            </li>
            <li>
              <Link href="#">FAQ</Link>
            </li>
            <li>
              <Link href="#">T&amp;C</Link>
            </li>
            <li>
              <Link href="#">Terms of Use</Link>
            </li>
            <li>
              <Link href="#">Track Orders</Link>
            </li>
            <li>
              <Link href="#">Shipping</Link>
            </li>
            <li>
              <Link href="#">Cancellation</Link>
            </li>
            <li>
              <Link href="#">Returns</Link>
            </li>
            <li>
              <Link href="#">Privacy Policy</Link>
            </li>
            <li>
              <Link href="#">Grievance Redressal</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: App Experience & Social Media */}
        <div>
          <h2 className="font-bold mb-2">EXPERIENCE MYNTRA APP ON MOBILE</h2>
          <div className="flex space-x-2">
            <Image 
              src="/Image/kid.webp" 
              width={128} 
              height={40} 
              alt="Google Play"
              className="w-32"
            />
            <Image 
              src="/Image/kid.webp" 
              width={128} 
              height={40} 
              alt="App Store"
              className="w-32"
            />
          </div>
          <h2 className="font-bold mt-4 mb-2">KEEP IN TOUCH</h2>
          <div className="flex space-x-4">
            <i className="fa-brands fa-facebook w-6 text-2xl"></i>
            <i className="fa-brands fa-twitter w-6 text-2xl"></i>
            <i className="fa-brands fa-youtube w-6 text-2xl"></i>
            <i className="fa-brands fa-instagram w-6 text-2xl"></i>
          </div>
        </div>

        {/* Column 4: Guarantee & Returns */}
        <div className="text-gray-700">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-people-robbery w-8 text-3xl"></i>
            <p>
              <span className="font-bold">100% ORIGINAL</span> guarantee for all products at mailocollection.com
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <i className="fa-solid fa-retweet text-3xl"></i>
            <p>
              <span className="font-bold">Return within 14 days</span> of receiving your order
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="container mx-auto text-center md:text-left mt-8">
        <div className="mb-8 border-b pb-4 text-gray-600">
          <div className="flex items-center my-4">
            <span className="font-bold text-gray-600">Popular Searches</span>
            <div className="w-auto h-[1px] mx-2 bg-gray-300 flex-1"></div>
          </div>
          <p className="text-sm text-gray-600">
            Makeup | Dresses For Girls | T-Shirts | Sandals | Headphones | Babydolls | Blazers For Men |
            Handbags | Ladies Watches | Bags | Sport Shoes | Reebok Shoes | Puma Shoes | Boxers | Wallets |
            Tops | Earrings | Fastrack Watches | Kurtis | Nike | Smart Watches | Titan Watches | Designer Blouse |
            Gowns | Rings | Cricket Shoes | Forever 21 | Eye Makeup | Photo Frames | Punjabi Suits | Bikini |
            Myntra Fashion Show | Lipstick | Saree | Watches | Dresses | Lehenga | Nike Shoes | Goggles |
            Bras | Suit | Chinos | Shoes | Adidas Shoes | Woodland Shoes | Jewellery | Designers Sarees
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="text-sm text-gray-600 mb-4 sm:mb-0">
            In case of any concern, <Link href="#" className="text-blue-600 font-semibold">Contact Us</Link>
          </div>
          <div className="text-sm text-gray-500">&copy; 2025 www.Mailocollection.com. All rights reserved.</div>
          <div className="text-sm text-gray-500">A Flipkart company</div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row justify-between">
          <div>
            <h3 className="font-bold text-sm">Registered Office Address</h3>
            <p className="text-sm text-gray-600">
              Buildings Alyssa, <br />
              Begonia and Clover situated in Embassy Tech Village, <br />
              Outer Ring Road, <br />
              Devarabeesanahalli Village, <br />
              Varthur Hobli, <br />
              Islamabad - 560103, Pakistan
            </p>
          </div>
          <div className="flex flex-col justify-end mt-4 sm:mt-0">
            <p className="text-sm text-gray-600">CIN: U72300KA2007PTC041799</p>
            <p className="text-sm text-gray-600">
              Telephone: <a href="tel:+918061561999" className="text-blue-600 font-semibold">+92-316-8323253</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
