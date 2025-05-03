"use client";
import { useEffect, useState } from "react";
import AdBanner from "@/Components/AdBanner";
import FavoriteBrands from "@/Components/FavoriteBrands";
import IconicBrands from "@/Components/IconicBrands";
import KidsCategories from "@/Components/KidsCategories";
import ExploreMore from "@/Components/ExploreMore";

export default function KidsClientPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?gender=kids`);
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
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 mt-16 bg-white">
      <AdBanner />
      <FavoriteBrands products={products} />
      <IconicBrands products={products} />
      <KidsCategories products={products} />
      <ExploreMore products={products} />
    </div>
  );
}
