import ProductForm from "./ProductForm";

export default function EditProductTab({ product, onSubmit }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
      <ProductForm
        initialData={{
          ...product,
          image: product.image,
        }}
        onSubmit={onSubmit}
        isEditing={true}
      />
    </div>
  );
}