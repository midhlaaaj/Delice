import Link from "next/link";
import { db } from "@/db";
import { stores } from "@/db/schema";
import { asc } from "drizzle-orm";
import { deleteStore } from "@/lib/actions/stores";

export default async function AdminStoresPage() {
  const allStores = await db.select().from(stores).orderBy(asc(stores.name));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-plum">Stores</h1>
        <Link href="/admin/stores/new" className="bg-plum text-cream rounded-full px-5 py-2.5 text-sm">
          New store
        </Link>
      </div>

      <div className="bg-paper border border-line rounded-2xl divide-y divide-line">
        {allStores.map((s) => (
          <div key={s.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-plum">{s.name}</div>
              <div className="text-xs text-ink/50 mt-0.5">
                {s.addressLine}, {s.city} · {s.isApproved ? "approved" : "pending"}
                {s.isOwnOutlet ? " · own outlet" : ""}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/admin/stores/${s.id}`} className="text-sm text-plum-soft">
                Edit
              </Link>
              <form action={deleteStore}>
                <input type="hidden" name="id" value={s.id} />
                <button className="text-sm text-rose">Delete</button>
              </form>
            </div>
          </div>
        ))}
        {allStores.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-ink/50">No stores yet.</div>
        )}
      </div>
    </div>
  );
}
