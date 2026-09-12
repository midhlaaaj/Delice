import type { Store } from "@/db/schema";

export function StoreStructuredData({ stores }: { stores: Store[] }) {
  const data = stores.map((store) => ({
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: store.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.addressLine,
      addressLocality: store.city,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: store.lat,
      longitude: store.lng,
    },
    url: store.googleMapsUrl ?? undefined,
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
