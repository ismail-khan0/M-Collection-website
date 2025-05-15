'use client';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No products found matching your filters</p>
          <p className="text-sm text-gray-400">Try adjusting your filters or search for something else</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product._id || product.id} 
          product={product} 
        />
      ))}
    </div>
  );
};

export default ProductGrid;