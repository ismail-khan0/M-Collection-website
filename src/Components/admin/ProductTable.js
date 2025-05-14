export default function ProductTable({ products, onEdit, onDelete }) {
  // Helper function to get display settings badges
  const getDisplayBadges = (product) => {
    const displaySettings = [
      { key: 'showInCarousel', label: 'Carousel' },
      { key: 'showInBrowseCategories', label: 'Browse' },
      { key: 'showInShopByCategory', label: 'Shop' },
      { key: 'showInKidsCategories', label: 'Kids' },
      { key: 'showInIconicBrands', label: 'Iconic' },
      { key: 'showInFavouriteBrands', label: 'Favourite' },
      { key: 'showInExploreMore', label: 'Explore' }
    ];

    return displaySettings
      .filter(setting => product[setting.key])
      .map(setting => (
        <span 
          key={setting.key} 
          className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1 mb-1"
        >
          {setting.label}
        </span>
      ));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Image</th>
            <th className="py-2 px-4 border">Title</th>
            <th className="py-2 px-4 border">Price</th>
            <th className="py-2 px-4 border">Category</th>
            <th className="py-2 px-4 border">Gender</th>
            <th className="py-2 px-4 border">Display Settings</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-16 object-contain"
                  />
                </td>
                <td className="py-2 px-4 border">{product.title}</td>
                <td className="py-2 px-4 border">${product.price}</td>
                <td className="py-2 px-4 border">{product.category}</td>
                <td className="py-2 px-4 border capitalize">{product.gender}</td>
                <td className="py-2 px-4 border">
                  <div className="flex flex-wrap">
                    {getDisplayBadges(product)}
                  </div>
                </td>
                <td className="py-2 px-4 border">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product._id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-4 text-center text-gray-500">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}