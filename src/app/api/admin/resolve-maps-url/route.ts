import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkRateLimit, getIpFromHeaders } from "@/lib/rate-limit";

// Only Google Maps' own domains are allowed as a fetch target — this
// endpoint takes an admin-supplied URL and fetches it server-side, so
// without an allowlist it would let an admin (or anyone who compromises an
// admin session) make the server issue arbitrary outbound requests,
// including to internal/private network addresses (SSRF).
const ALLOWED_HOSTS = new Set([
  "maps.google.com",
  "www.google.com",
  "google.com",
  "goo.gl",
  "maps.app.goo.gl",
]);

function isAllowedMapsUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:") return false;
    return ALLOWED_HOSTS.has(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function extractLatLng(url: string): { lat: number; lng: number } | null {
  // Precise place-pin coords, when present, beat the map-view center.
  const pin = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (pin) return { lat: Number(pin[1]), lng: Number(pin[2]) };

  const view = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (view) return { lat: Number(view[1]), lng: Number(view[2]) };

  const query = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (query) return { lat: Number(query[1]), lng: Number(query[2]) };

  return null;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ip = getIpFromHeaders(request.headers);
  const { allowed, retryAfterSeconds } = checkRateLimit(`maps:${ip}`, 40, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const { url } = await request.json();
  if (!url || typeof url !== "string" || !isAllowedMapsUrl(url)) {
    return NextResponse.json({ error: "Only Google Maps links are supported." }, { status: 400 });
  }

  try {
    // Short links (maps.app.goo.gl/…) redirect through Google's own domains
    // before landing on the full maps.google.com URL. Each hop is validated
    // against the same allowlist instead of blindly following redirects, so
    // a shortened link can't be used to make the server fetch an arbitrary
    // (e.g. internal-network) address.
    let currentUrl = url;
    let finalUrl = url;
    let body = "";
    for (let hop = 0; hop < 5; hop++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      let res: Response;
      try {
        res = await fetch(currentUrl, {
          redirect: "manual",
          signal: controller.signal,
          headers: { "User-Agent": "Mozilla/5.0 (compatible; DeliceBot/1.0)" },
        });
      } finally {
        clearTimeout(timeout);
      }

      const location = res.headers.get("location");
      if (res.status >= 300 && res.status < 400 && location) {
        const nextUrl = new URL(location, currentUrl).toString();
        if (!isAllowedMapsUrl(nextUrl)) {
          return NextResponse.json({ error: "Link redirected outside Google Maps." }, { status: 422 });
        }
        currentUrl = nextUrl;
        finalUrl = nextUrl;
        continue;
      }

      finalUrl = res.url || currentUrl;
      body = await res.text().catch(() => "");
      break;
    }

    const coords = extractLatLng(finalUrl) ?? extractLatLng(body);

    if (!coords) {
      return NextResponse.json({ error: "Couldn't find coordinates in that link." }, { status: 422 });
    }

    return NextResponse.json(coords);
  } catch {
    return NextResponse.json({ error: "Couldn't reach that link." }, { status: 502 });
  }
}
