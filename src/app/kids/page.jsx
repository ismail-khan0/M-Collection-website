// src/app/kids/page.jsx

import AdBanner from "@/Components/AdBanner";
import FavoriteBrands from "@/Components/FavoriteBrands";
import IconicBrands from "@/Components/IconicBrands";
import KidsCategories from "@/Components/KidsCategories";
import ExploreMore from "@/Components/ExploreMore";


export default async function KidsPage() {
  const res = await fetch("https://fakestoreapi.com/products?limit=10", { cache: 'no-store' });
  const products = await res.json();

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
