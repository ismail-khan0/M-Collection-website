'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const FeaturedGifts = () => {
  const [gifts, setGifts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const res = await fetch('/api/products?gender=gifts');
        const data = await res.json();

        if (data.success && Array.isArray(data.products)) {
          setGifts(data.products); 
        } else {
          console.error('Invalid response format');
          setGifts([]);
        }
      } catch (err) {
        console.error('Error fetching gifts:', err);
        setGifts([]);
      }
    };

    fetchGifts();
  }, []);

  const redirectToFilteredGifts = () => {
    const params = new URLSearchParams();
    params.set('gender', 'gifts');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <section className="my-10 px-6">
      <h2 className="text-2xl font-semibold mb-4">Popular Gifts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {gifts.map((gift) => (
          <div
            key={gift._id || gift.id}
            onClick={redirectToFilteredGifts}
            className="cursor-pointer rounded-2xl overflow-hidden shadow-md bg-white hover:shadow-lg transition"
          >
            <Image
              src={gift.image}
              alt={gift.title}
              width={300}
              height={300}
              className="w-full h-96 object-contain p-4"
            />
            <div className="px-6 py-2">
              <h3 className="font-bold text-lg mb-2 ml-2 ">
                {gift.title}
              </h3>
              <p className="text-pink-600 font-semibold  mb-2 ml-2">RS: {gift.price}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent card click from firing again
                  redirectToFilteredGifts();
                }}
                className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition"
              >
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
