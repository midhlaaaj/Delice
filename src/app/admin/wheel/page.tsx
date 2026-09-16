import { getAllProducts } from "@/db/queries";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { WheelManager } from "@/components/admin/wheel-manager";

export default async function AdminWheelPage() {
  const products = await getAllProducts();

  return (
    <div>
      <AdminPageHeader
        title="Homepage wheel"
        description="Pick which flavors spin on the homepage, and drag to reorder them."
      />
      <WheelManager products={products} />
    </div>
  );
}
