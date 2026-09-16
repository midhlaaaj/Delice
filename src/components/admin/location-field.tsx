"use client";

import { useState } from "react";
import { adminInput, adminLabel } from "./admin-ui";

export function LocationField({
  defaultLat,
  defaultLng,
  defaultMapsUrl,
}: {
  defaultLat?: number;
  defaultLng?: number;
  defaultMapsUrl?: string | null;
}) {
  const [mapsUrl, setMapsUrl] = useState(defaultMapsUrl ?? "");
  const [lat, setLat] = useState(defaultLat ?? "");
  const [lng, setLng] = useState(defaultLng ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function detect() {
    if (!mapsUrl.trim()) return;
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/admin/resolve-maps-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: mapsUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't detect location");
      setLat(data.lat);
      setLng(data.lng);
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't detect location");
      setStatus("error");
    }
  }

  return (
    <div className="grid gap-4">
      <div>
        <label className={adminLabel}>Google Maps link</label>
        <p className="font-humanist text-[12px] text-ac-on-surface-variant mb-1.5">
          Paste a Google Maps share link — coordinates are detected automatically.
        </p>
        <div className="flex gap-2.5">
          <input
            value={mapsUrl}
            onChange={(e) => setMapsUrl(e.target.value)}
            placeholder="https://maps.app.goo.gl/…"
            className={`${adminInput} flex-1`}
          />
          <button
            type="button"
            onClick={detect}
            disabled={status === "loading" || !mapsUrl.trim()}
            className="font-humanist text-sm font-medium text-ac-on-primary bg-ac-maroon hover:bg-ac-maroon-deep disabled:opacity-50 rounded-xl px-4 whitespace-nowrap transition-colors"
          >
            {status === "loading" ? "Detecting…" : "Detect location"}
          </button>
        </div>
        {error && <p className="font-humanist text-xs text-ac-rose mt-1.5">{error}</p>}
        {lat !== "" && lng !== "" && status !== "error" && (
          <p className="font-humanist text-xs text-ac-on-surface-variant mt-1.5">
            Detected: {lat}, {lng}
          </p>
        )}
      </div>

      <input type="hidden" name="googleMapsUrl" value={mapsUrl} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={adminLabel}>Latitude</label>
          <input
            name="lat"
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value === "" ? "" : Number(e.target.value))}
            required
            className={adminInput}
          />
        </div>
        <div>
          <label className={adminLabel}>Longitude</label>
          <input
            name="lng"
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value === "" ? "" : Number(e.target.value))}
            required
            className={adminInput}
          />
        </div>
      </div>
      <p className="font-humanist text-[12px] text-ac-on-surface-variant -mt-2.5">
        Auto-filled from the link above — you can still fine-tune them by hand.
      </p>
    </div>
  );
}
