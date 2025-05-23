"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/navigation";

const Carousel = ({ sectionTitle = "Men", gender = "men" }) => {
  const [products, setProducts] = useState([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = gender
          ? `/api/products?showInCarousel=true&gender=${gender}`
          : "/api/products?showInCarousel=true";

        const response = await fetch(url);
        const data = await response.json();

        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("Unexpected product response format.");
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [gender]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const redirectToFilter = (productOrCategory) => {
    const params = new URLSearchParams();
    const category =
      typeof productOrCategory === "string"
        ? productOrCategory
        : productOrCategory?.category || "";

    if (gender) params.set("gender", gender.toLowerCase());
    if (category) params.set("category", category.trim().toLowerCase());

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="my-12">
      <div className="relative mx-auto max-w-7xl px-4">
        {products.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-lg font-medium">
            No data found.
          </div>
        ) : (
          <>
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="flex-[0_0_80%] sm:flex-[0_0_40%] md:flex-[0_0_30%] lg:flex-[0_0_25%] px-2 cursor-pointer group"
                    onClick={() => redirectToFilter(product)}
                  >
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-md">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-fill"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            >
              <svg className="w-5 h-5 text-black" viewBox="0 0 6 10">
                <path
                  d="M5 1L1 5l4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            >
              <svg className="w-5 h-5 text-black" viewBox="0 0 6 10">
                <path
                  d="m1 9 4-4-4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Carousel;
