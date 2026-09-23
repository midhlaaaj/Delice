// Canonical site origin, used for metadataBase, sitemap/robots URLs, and
// structured data. AUTH_URL is already required for NextAuth callbacks and
// is set to the production domain, so it doubles as the site URL without
// needing a separate env var.
export const SITE_URL = (process.env.AUTH_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export const SITE_NAME = "Delice";

const WHATSAPP_MESSAGE = "Hi! I want to enquire about the wholesale pricing.";
export const WHATSAPP_PARTNER_URL = `https://wa.me/919061315776?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
