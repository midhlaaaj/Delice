import { upsertStore } from "@/lib/actions/stores";
import { LocationField } from "./location-field";
import { Button } from "@/components/button";
import { adminInput, adminLabel } from "./admin-ui";
import type { Store } from "@/db/schema";

export function StoreForm({ store }: { store?: Store }) {
  return (
    <form action={upsertStore} className="grid gap-5 max-w-xl">
      {store && <input type="hidden" name="id" value={store.id} />}

      <div>
        <label className={adminLabel}>Store name</label>
        <input name="name" defaultValue={store?.name} required className={adminInput} />
      </div>

      <div>
        <label className={adminLabel}>Address line</label>
        <input name="addressLine" defaultValue={store?.addressLine} required className={adminInput} />
      </div>

      <div>
        <label className={adminLabel}>City</label>
        <input name="city" defaultValue={store?.city} required className={adminInput} />
      </div>

      <LocationField defaultLat={store?.lat} defaultLng={store?.lng} defaultMapsUrl={store?.googleMapsUrl} />

      <div className="flex flex-col gap-2.5">
        <label className="flex items-center gap-2 font-humanist text-sm text-ac-on-surface">
          <input type="checkbox" name="isOwnOutlet" defaultChecked={store?.isOwnOutlet} />
          This is our own outlet (not a partner shop)
        </label>
        <label className="flex items-center gap-2 font-humanist text-sm text-ac-on-surface">
          <input type="checkbox" name="isApproved" defaultChecked={store?.isApproved ?? true} />
          Approved (visible on the site)
        </label>
      </div>

      <Button type="submit" className="w-fit">
        Save store
      </Button>
    </form>
  );
}
