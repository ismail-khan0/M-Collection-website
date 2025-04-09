'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const FeaturedGifts = () => {
  const [gifts, setGifts] = useState([]);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products?limit=8')
      .then(res => res.json())
      .then(data => setGifts(data));
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Popular Gifts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {gifts.map(gift => (
          <div key={gift.id} className="rounded-2xl overflow-hidden shadow-md bg-white">
            <Image
              src={gift.image}
              alt={gift.title}
              width={300}
              height={300}
              className="w-full h-60 object-contain p-4"
            />
            <div className="p-4">
              <h3 className="font-medium text-md mb-2">{gift.title.slice(0, 40)}...</h3>
              <p className="text-pink-600 font-semibold mb-2">${gift.price}</p>
              <button className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedGifts;
