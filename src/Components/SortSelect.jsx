'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const SortSelect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('sort', e.target.value);
    router.push(`?${newSearchParams.toString()}`);
  };

  return (
    <select 
      onChange={handleSortChange}
      value={searchParams.get('sort') || 'recommended'}
      className="p-2 border border-gray-300 hover:ring-none hover:border-black focus:outline-none"
    >
      <option value="recommended">Sort By: Recommended</option>
      <option value="low-high">Price: Low to High</option>
      <option value="high-low">Price: High to Low</option>
    </select>
  );
};

export default SortSelect;