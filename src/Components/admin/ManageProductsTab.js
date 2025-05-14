import ProductTable from "./ProductTable";
import FilterControls from "./FilterControls";

export default function ManageProductsTab({
  products,
  isLoading,
  filters,
  onFilterChange,
  onEdit,
  onDelete,
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Products</h2>

      <FilterControls filters={filters} onFilterChange={onFilterChange} />

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ProductTable
          products={products}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}