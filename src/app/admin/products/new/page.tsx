import { ProductForm } from "@/components/admin/product-form";
import { getSiteSettings } from "@/db/queries";

export default async function NewProductPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-editorial text-2xl text-ac-primary mb-6">New product</h1>
      <ProductForm defaultHighlights={settings.defaultHighlights} />
    </div>
  );
}
