import Link from "next/link";
import { getAllProducts } from "@/db/queries";
import { deleteProduct } from "@/lib/actions/products";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-plum">Products</h1>
        <Link href="/admin/products/new" className="bg-plum text-cream rounded-full px-5 py-2.5 text-sm">
          New product
        </Link>
      </div>

      <div className="bg-paper border border-line rounded-2xl divide-y divide-line">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-plum">{p.name}</div>
              <div className="text-xs text-ink/50 mt-0.5">
                {p.category} · {p.priceLabel} · {p.isPublished ? "published" : "hidden"}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/admin/products/${p.id}`} className="text-sm text-plum-soft">
                Edit
              </Link>
              <form action={deleteProduct}>
                <input type="hidden" name="id" value={p.id} />
                <button className="text-sm text-rose">Delete</button>
              </form>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-ink/50">No products yet.</div>
        )}
      </div>
    </div>
  );
}
