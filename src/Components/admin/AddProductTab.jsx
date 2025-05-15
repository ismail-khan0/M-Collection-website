import ProductForm from "./ProductForm";

export default function AddProductTab({ onSubmit }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      <ProductForm onSubmit={onSubmit} />
    </div>
  );
}