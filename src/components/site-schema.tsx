import { SITE_URL, SITE_NAME } from "@/lib/site";

export function OrganizationStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/delice-wordmark.svg`,
    areaServed: {
      "@type": "State",
      name: "Kerala",
    },
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
