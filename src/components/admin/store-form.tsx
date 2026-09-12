import { upsertStore } from "@/lib/actions/stores";
import type { Store } from "@/db/schema";

export function StoreForm({ store }: { store?: Store }) {
  return (
    <form action={upsertStore} className="grid gap-4 max-w-xl">
      {store && <input type="hidden" name="id" value={store.id} />}

      <div>
        <label className="block text-sm text-ink/70 mb-1.5">Store name</label>
        <input
          name="name"
          defaultValue={store?.name}
          required
          className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-ink/70 mb-1.5">Address line</label>
        <input
          name="addressLine"
          defaultValue={store?.addressLine}
          required
          className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-ink/70 mb-1.5">City</label>
        <input
          name="city"
          defaultValue={store?.city}
          required
          className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink/70 mb-1.5">Latitude</label>
          <input
            name="lat"
            type="number"
            step="any"
            defaultValue={store?.lat}
            required
            className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-ink/70 mb-1.5">Longitude</label>
          <input
            name="lng"
            type="number"
            step="any"
            defaultValue={store?.lng}
            required
            className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-ink/70 mb-1.5">Google Maps URL (optional)</label>
        <input
          name="googleMapsUrl"
          defaultValue={store?.googleMapsUrl ?? ""}
          placeholder="Leave blank to auto-generate from lat/lng"
          className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isOwnOutlet" defaultChecked={store?.isOwnOutlet} />
        This is our own outlet (not a partner shop)
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isApproved" defaultChecked={store?.isApproved ?? true} />
        Approved (visible on the site)
      </label>

      <button type="submit" className="bg-plum text-cream rounded-full px-6 py-2.5 text-sm w-fit">
        Save store
      </button>
    </form>
  );
}
