import { getAllProducts, getSiteSettings } from "@/db/queries";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { ProductsGrid } from "@/components/admin/products-grid";
import { DefaultHighlightsForm } from "@/components/admin/default-highlights-form";

export default async function AdminProductsPage() {
  const [products, settings] = await Promise.all([getAllProducts(), getSiteSettings()]);

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Everything on the wheel and in the catalogue."
        action={{ label: "New product", href: "/admin/products/new" }}
      />

      <AdminCard className="p-5 mb-7">
        <DefaultHighlightsForm defaultHighlights={settings.defaultHighlights} />
      </AdminCard>

      <ProductsGrid products={products} />
    </div>
  );
}
