"use client";

import { useMemo, useState } from "react";
import type { Store } from "@/db/schema";

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function mapsUrl(store: Store) {
  return store.googleMapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`;
}

export function StoreLocatorPanel({ stores, limit }: { stores: Store[]; limit?: number }) {
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [search, setSearch] = useState("");
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cities = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const s of stores) {
      if (!seen.has(s.city)) {
        seen.add(s.city);
        list.push(s.city);
      }
    }
    return list.slice(0, 4);
  }, [stores]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = term
      ? stores.filter(
          (s) =>
            s.name.toLowerCase().includes(term) ||
            s.addressLine.toLowerCase().includes(term) ||
            s.city.toLowerCase().includes(term)
        )
      : stores;

    const sorted = origin
      ? [...list].sort(
          (a, b) =>
            haversineKm(origin.lat, origin.lng, a.lat, a.lng) -
            haversineKm(origin.lat, origin.lng, b.lat, b.lng)
        )
      : list;

    return limit ? sorted.slice(0, limit) : sorted;
  }, [stores, search, origin, limit]);

  function useMyLocation() {
    setError(null);
    if (!navigator.geolocation) {
      setError("Location isn't supported on this device.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setError("Couldn't get your location. Try searching instead.");
        setLocating(false);
      },
      { timeout: 8000 }
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-ac-surface-plum-translucent p-2.5 rounded-2xl sm:rounded-full border border-ac-border-plum-translucent">
        <div className="flex items-center gap-2 flex-1 px-4 py-2">
          <span className="text-ac-surface-container-high/60 text-lg">⌕</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter town, area or pincode (e.g. Kozhikode, Kochi, Thrissur)"
            className="w-full bg-transparent border-none text-ac-on-primary placeholder:text-ac-surface-container-high/40 font-humanist text-sm focus:outline-none"
          />
        </div>
        <button
          onClick={useMyLocation}
          disabled={locating}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ac-secondary text-ac-on-primary px-7 py-3 font-humanist text-sm hover:bg-ac-secondary-container transition-all shadow-md disabled:opacity-60 whitespace-nowrap"
        >
          {locating ? "Locating…" : "Use GPS"}
        </button>
      </div>
      {error && <p className="text-ac-secondary-container text-xs text-center -mt-3">{error}</p>}

      {cities.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 -mt-2 text-xs">
          <span className="text-ac-surface-container-high/60 font-medium mr-1">Popular regions:</span>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSearch(city)}
              className="px-3 py-1 rounded-full bg-ac-surface-plum-translucent border border-ac-border-plum-translucent text-ac-surface-container-high hover:text-ac-on-primary hover:bg-ac-secondary transition-colors"
            >
              {city}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-ac-surface-container-high/70 text-sm text-center">
            No stores match that search yet.
          </p>
        )}
        {filtered.map((store) => {
          const dist = origin
            ? haversineKm(origin.lat, origin.lng, store.lat, store.lng)
            : null;
          return (
            <a
              key={store.id}
              href={mapsUrl(store)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-ac-surface-plum-translucent hover:bg-ac-surface-plum-translucent/90 transition-all cursor-pointer border border-ac-border-plum-translucent"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-11 h-11 rounded-full bg-ac-tertiary-container flex items-center justify-center shrink-0 shadow-inner text-ac-secondary-container">
                  ⌂
                </div>
                <div>
                  <h4 className="font-editorial text-base text-ac-on-primary font-semibold">
                    {store.name}
                    {store.isOwnOutlet && (
                      <span className="ml-2 text-[10px] text-ac-secondary-container align-middle font-humanist">
                        OWN OUTLET
                      </span>
                    )}
                  </h4>
                  <p className="font-humanist text-xs text-ac-surface-container-high/75 mt-0.5">
                    {store.addressLine}, {store.city}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-humanist text-sm text-ac-secondary-container font-semibold">
                  {dist !== null ? `${dist.toFixed(1)} km` : "View →"}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
