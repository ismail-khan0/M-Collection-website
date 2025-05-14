'use client';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="w-full md:w-3/4 flex items-center justify-center py-12">
        <p className="text-center text-gray-500">No products found matching your filters</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-3/4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 p-4">
        {products.map((product) => (
          <ProductCard 
            key={product._id || product.id} 
            product={product} 
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;