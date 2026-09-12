# Delice — Slice of Happiness

Next.js (App Router) site for Delice: homepage with a draggable flavor wheel, product detail pages,
an Explore All grid, a reels-style UGC video feed, a store locator, and a password-protected admin
panel for managing products/stores/videos.

Stack: Next.js 16 + Tailwind v4 · Drizzle ORM + Neon (Postgres) · NextAuth v5 (Credentials) ·
Cloudflare R2 for media storage.

## Setup

1. **Install deps** (already done if you're reading this after scaffolding): `npm install`

2. **Copy env vars**: `cp .env.example .env.local` and fill in:
   - `DATABASE_URL` — from your [Neon](https://neon.tech) project (Postgres connection string)
   - `AUTH_SECRET` — a random secret, e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
   - `AUTH_URL` — `http://localhost:3000` locally
   - `R2_*` — from your Cloudflare R2 bucket (Account ID, an API token's Access Key ID/Secret,
     bucket name, and the bucket's public base URL — either the `r2.dev` dev URL or a custom domain
     you've connected to the bucket)
   - `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — credentials for the one admin login (your friend),
     used only by the seed script

3. **Push the schema to Neon**: `npm run db:push`

4. **Seed sample data + the admin user**: `npm run db:seed`
   (Re-run any time after changing `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` to add another admin —
   it won't duplicate existing rows.)

5. **Run the dev server**: `npm run dev`, then open http://localhost:3000

6. **Admin panel**: http://localhost:3000/admin/login — sign in with the seeded admin credentials to
   manage products, stores, and UGC videos. Uploads go straight to R2 via presigned URLs.

## Project structure

- `src/app/` — routes: `/` (homepage), `/product/[slug]`, `/explore`, `/videos`, `/admin/*`
- `src/db/` — Drizzle schema (`schema.ts`), client (`index.ts`), queries (`queries.ts`), seed script
- `src/lib/actions/` — server actions used by the admin forms (create/update/delete)
- `src/lib/r2.ts` — Cloudflare R2 presigned upload helper
- `src/auth.ts` / `src/proxy.ts` — NextAuth config and route protection for `/admin/*`
- `_mockups/` — the original static HTML mockups this build was based on (reference only)

## Known gaps / next steps

- The animated top-view → side-view hero transition (wheel tap → product detail) isn't built yet —
  it needs the real top-down/side-profile product photography (per-flavor top-down still,
  side-profile still, and a backup transition video) first. `imageTopUrl`/`imageSideUrl`/
  `transitionVideoUrl` fields already exist on `products` for it.
- All product/store/video content ships as seed data with color-swatch placeholders until real
  photos are uploaded through the admin panel.
- SEO extras (sitemap, structured data for store locations) aren't wired up yet.
