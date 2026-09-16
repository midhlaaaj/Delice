import { getAllProducts } from "@/db/queries";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ProductsGrid } from "@/components/admin/products-grid";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Everything on the wheel and in the catalogue."
        action={{ label: "New product", href: "/admin/products/new" }}
      />
      <ProductsGrid products={products} />
    </div>
  );
}
