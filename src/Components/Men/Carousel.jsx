'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';

const Carousel = ({ apiUrl, sectionTitle = 'Men' }) => {
  const [products, setProducts] = useState([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProducts();
  }, [apiUrl]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const redirectToFilter = () => {
    window.location.href = '/filter';
  };

  return (
    <div>
      <title>{sectionTitle}</title>
      <div className="relative mx-4 mt-8">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-[0_0_25%] p-4 cursor-pointer group"
                onClick={redirectToFilter}
              >
                <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-md">
                  <Image
                    src={product.image}
                    alt={product.title}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-center mt-3">
                  <p className="text-base font-semibold text-gray-700 truncate">{product.title}</p>
                  <p className="text-red-600 font-bold text-sm mt-1">UP TO 50% OFF</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <button onClick={scrollPrev} className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-2">
          <svg className="w-4 h-4 text-black" viewBox="0 0 6 10">
            <path d="M5 1L1 5l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button onClick={scrollNext} className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-2">
          <svg className="w-4 h-4 text-black" viewBox="0 0 6 10">
            <path d="m1 9 4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Carousel;
