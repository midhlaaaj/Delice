import { db } from "@/db";
import { stores } from "@/db/schema";
import { asc } from "drizzle-orm";
import { deleteStore } from "@/lib/actions/stores";
import { AdminPageHeader, AdminList, AdminListRow, StatusPill } from "@/components/admin/admin-ui";

export default async function AdminStoresPage() {
  const allStores = await db.select().from(stores).orderBy(asc(stores.name));

  return (
    <div>
      <AdminPageHeader
        title="Stores"
        description="Locations shown on the store locator."
        action={{ label: "New store", href: "/admin/stores/new" }}
      />

      <AdminList
        emptyLabel="No stores yet."
        items={allStores.map((s) => (
          <AdminListRow
            key={s.id}
            href={`/admin/stores/${s.id}`}
            title={s.name}
            meta={`${s.addressLine}, ${s.city}`}
            pills={
              <>
                <StatusPill tone={s.isApproved ? "positive" : "neutral"} label={s.isApproved ? "Approved" : "Pending"} />
                <StatusPill tone={s.isOwnOutlet ? "warning" : "neutral"} label={s.isOwnOutlet ? "Own outlet" : "Partner"} />
              </>
            }
            deleteAction={deleteStore}
            deleteId={s.id}
          />
        ))}
      />
    </div>
  );
}
