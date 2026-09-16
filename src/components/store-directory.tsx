"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Store } from "@/db/schema";
import { Button } from "@/components/button";
import { EmptyState } from "@/components/empty-state";

const PAGE_SIZE = 20;

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

export function StoreDirectory({ stores }: { stores: Store[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [search, setSearch] = useState("");
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageFromUrl = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

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

    if (!origin) return list;

    return [...list].sort(
      (a, b) =>
        haversineKm(origin.lat, origin.lng, a.lat, a.lng) -
        haversineKm(origin.lat, origin.lng, b.lat, b.lng)
    );
  }, [stores, search, origin]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(pageFromUrl, totalPages);

  useEffect(() => {
    if (pageFromUrl !== currentPage) {
      goToPage(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length]);

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) params.delete("page");
    else params.set("page", String(page));
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    goToPage(1);
  }

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
        goToPage(1);
      },
      () => {
        setError("Couldn't get your location. Try searching instead.");
        setLocating(false);
      },
      { timeout: 8000 }
    );
  }

  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="bg-ac-paper rounded-[20px] p-5 border border-ac-border-hairline shadow-sm">
      <div className="flex gap-2.5 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by store, area, or city"
          className="flex-1 min-w-[180px] bg-ac-surface-container-low border border-ac-border-hairline rounded-full px-4.5 py-3 font-humanist text-ac-primary text-sm placeholder:text-ac-on-surface-variant/60 outline-none focus:border-ac-secondary transition-colors"
        />
        <Button onClick={useMyLocation} disabled={locating} variant="solid" size="sm" className="disabled:opacity-60">
          {locating ? "Locating…" : "Use my location"}
        </Button>
      </div>
      {error && <p className="font-humanist text-ac-secondary text-xs mt-2">{error}</p>}

      <p className="font-humanist text-ac-on-surface-variant text-xs mt-4">
        {filtered.length} store{filtered.length === 1 ? "" : "s"} · page {currentPage} of {totalPages}
      </p>

      <div className="mt-3 grid gap-3">
        {pageItems.length === 0 && (
          <EmptyState
            title="No stores match that search"
            description="Try a different town, area, or pincode — or clear your search to see every store."
            cta={{ label: "Clear search", onClick: () => handleSearchChange("") }}
          />
        )}
        {pageItems.map((store) => {
          const dist = origin
            ? haversineKm(origin.lat, origin.lng, store.lat, store.lng)
            : null;
          return (
            <a
              key={store.id}
              href={mapsUrl(store)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-ac-surface-container-low hover:bg-ac-surface-container rounded-2xl px-4.5 py-4 gap-3 no-underline text-inherit border border-ac-border-hairline shadow-sm transition-all hover:-translate-y-0.5"
            >
              <div>
                <div className="font-editorial text-[14.5px] font-medium text-ac-primary">
                  {store.name}
                  {store.isOwnOutlet && (
                    <span className="ml-2 font-humanist text-[10.5px] text-ac-secondary align-middle">
                      OWN OUTLET
                    </span>
                  )}
                </div>
                <div className="font-humanist text-[12.5px] text-ac-on-surface-variant mt-0.5">
                  {store.addressLine}, {store.city}
                </div>
              </div>
              <div className="font-humanist text-[13px] text-ac-secondary whitespace-nowrap">
                {dist !== null ? `${dist.toFixed(1)} km →` : "View →"}
              </div>
            </a>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="font-humanist text-sm px-3.5 py-1.5 rounded-full border border-ac-border-hairline text-ac-on-surface-variant disabled:opacity-35"
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => goToPage(n)}
              className={`font-humanist text-sm w-8 h-8 rounded-full transition-colors ${
                n === currentPage
                  ? "bg-ac-primary text-ac-on-primary"
                  : "border border-ac-border-hairline text-ac-on-surface-variant"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="font-humanist text-sm px-3.5 py-1.5 rounded-full border border-ac-border-hairline text-ac-on-surface-variant disabled:opacity-35"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
