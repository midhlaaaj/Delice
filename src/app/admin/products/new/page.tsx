import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-plum mb-6">New product</h1>
      <ProductForm />
    </div>
  );
}
