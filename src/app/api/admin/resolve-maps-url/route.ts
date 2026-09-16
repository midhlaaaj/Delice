import { NextResponse } from "next/server";
import { auth } from "@/auth";

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

  const { url } = await request.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  try {
    // Short links (maps.app.goo.gl/…) carry no coordinates until followed —
    // fetch resolves the redirect chain so we can read the final, full URL.
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; DeliceBot/1.0)" },
    });
    const finalUrl = res.url || url;
    const coords = extractLatLng(finalUrl) ?? extractLatLng(await res.text().catch(() => ""));

    if (!coords) {
      return NextResponse.json({ error: "Couldn't find coordinates in that link." }, { status: 422 });
    }

    return NextResponse.json({ ...coords, resolvedUrl: finalUrl });
  } catch {
    return NextResponse.json({ error: "Couldn't reach that link." }, { status: 502 });
  }
}
