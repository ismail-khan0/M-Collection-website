'use client';

import FilterSidebar from '@/Components/FilterSidebar';
import ProductGrid from '@/Components/ProductGrid';
import SortSelect from '@/Components/SortSelect';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const CategoryPage = () => {
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        
        const transformedProducts = data.map(product => ({
          id: product.id,
          name: product.title,
          image: product.image,
          price: `$${(product.price * 1.2).toFixed(2)}`, // Original price + 20%
          discountPrice: `$${product.price.toFixed(2)}`,
          gender: Math.random() > 0.5 ? 'men' : 'women',
          category: ['Tshirts', 'Shirts', 'Jeans', 'Casual Shoes', 'Trousers', 'Sweatshirts', 'Jackets', 'Shorts'][Math.floor(Math.random() * 8)],
          brand: ['Friskers', 'WOOSTRO', 'FBAR', 'DISPENSER', 'Pepe jeans', 'Masch Sports'][Math.floor(Math.random() * 6)],
          color: ['Black', 'White', 'Blue', 'Navy Blue', 'Red', 'Grey', 'Maroon', 'Brown'][Math.floor(Math.random() * 8)]
        }));
        
        setAllProducts(transformedProducts);
        filterProducts(transformedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      filterProducts(allProducts);
    }
  }, [searchParams]);

  const filterProducts = (products) => {
    setFiltering(true);
    
    // Use setTimeout to avoid UI freezing during heavy filtering
    setTimeout(() => {
      let result = [...products];
      const params = Object.fromEntries(searchParams.entries());
      
      if (params.gender) {
        result = result.filter(product => product.gender.toLowerCase() === params.gender.toLowerCase());
      }
      
      if (params.category) {
        result = result.filter(product => product.category.toLowerCase() === params.category.toLowerCase());
      }
      
      if (params.brand) {
        result = result.filter(product => product.brand.toLowerCase() === params.brand.toLowerCase());
      }
      
      if (params.color) {
        result = result.filter(product => product.color.toLowerCase() === params.color.toLowerCase());
      }
      
      if (params.sort === 'low-high') {
        result.sort((a, b) => {
          const priceA = parseFloat(a.discountPrice.replace("$", ""));
          const priceB = parseFloat(b.discountPrice.replace("$", ""));
          return priceA - priceB;
        });
      } else if (params.sort === 'high-low') {
        result.sort((a, b) => {
          const priceA = parseFloat(a.discountPrice.replace("$", ""));
          const priceB = parseFloat(b.discountPrice.replace("$", ""));
          return priceB - priceA;
        });
      }
      
      updateCategoryName(params.gender, result.length);
      
      setFilteredProducts(result);
      setFiltering(false);
    }, 100);
  };

  const updateCategoryName = (gender, count) => {
    if (gender === 'men') {
      setCategoryName(`Men - ${count} items`);
    } else if (gender === 'women') {
      setCategoryName(`Women - ${count} items`);
    } else {
      setCategoryName(`All Products - ${count} items`);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 p-2">
        <div className="container mx-auto text-center py-20">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-2">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 mt-20">
          <h1 className="text-xl font-semibold mb-2 sm:mb-0">{categoryName}</h1>
          <SortSelect />
        </div>

        {filtering && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <p>Applying filters...</p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-0">
          <FilterSidebar />
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
