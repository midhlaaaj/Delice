import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { ProductForm } from "@/components/admin/product-form";
import { getSiteSettings } from "@/db/queries";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [[product], settings] = await Promise.all([
    db.select().from(products).where(eq(products.id, id)).limit(1),
    getSiteSettings(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-editorial text-2xl text-ac-primary mb-6">Edit {product.name}</h1>
      <ProductForm product={product} defaultHighlights={settings.defaultHighlights} />
    </div>
  );
}
