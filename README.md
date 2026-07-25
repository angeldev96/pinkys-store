# Pinky's Store

Production e-commerce storefront for **Pinky's Store**, a beauty retailer in San Pedro Sula, Honduras selling makeup, jewelry, perfumes and accessories.

Live: **https://www.pinkysstorehn.com**

The store runs without a payment gateway: customers browse the catalog, fill a cart, and check out through **WhatsApp** in one tap. The owner manages the whole inventory from a mobile-first admin dashboard that can **fill an entire product form from a single photo** using Gemini vision.

Built with Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS and Supabase (Postgres + Auth + Storage).

---

## Table of contents

- [Features](#features)
- [WhatsApp ordering](#whatsapp-ordering)
- [AI product capture (Gemini vision)](#ai-product-capture-gemini-vision)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database schema](#database-schema)
- [Creating an admin user](#creating-an-admin-user)
- [SEO](#seo)
- [Security](#security)
- [Deployment](#deployment)
- [Known limitations](#known-limitations)

---

## Features

**Storefront**

- Product catalog served from Supabase with live search, category filters (makeup, jewelry, perfumes, accessories), gender filters and badges (Nuevo, Oferta, Bestseller, Premium).
- Product detail drawer, cart drawer with quantity controls, and toast feedback on add-to-cart.
- Mobile-first layout: responsive grid, wrapping filter chips (no horizontal scroll traps), 44–48px tap targets, safe-area support for notched devices.
- Next.js Image optimization (AVIF/WebP), one-year immutable caching for static assets.

**WhatsApp ordering**

- Floating WhatsApp button for general inquiries.
- Cart checkout that builds a formatted order message and opens `wa.me` with it pre-filled. See [below](#whatsapp-ordering).

**Admin dashboard** (`/admin/dashboard`, role-gated)

- Full product CRUD, image upload to Supabase Storage, stock tracking.
- Camera-first product creation: take a photo → the AI fills name, description, category, gender and badge → you review and set the price.
- Orders tab reading the `orders` table (see [Known limitations](#known-limitations)).

**SEO**

- Five JSON-LD schemas (Organization, LocalBusiness, WebSite, Breadcrumb, ItemList), dynamic `sitemap.xml` and `robots.txt`, Open Graph / Twitter Cards, canonical URLs and `es-HN` hreflang targeting.

---

## WhatsApp ordering

There is no checkout, no card form and no payment provider. In the Honduran market this removes the biggest source of drop-off — customers already live in WhatsApp, and the seller confirms stock, price and delivery in the same thread.

**How it works**

1. The customer adds products to the cart (client-side state, [useCart.ts](src/hooks/useCart.ts)).
2. On "Order via WhatsApp", [CartDrawer.tsx](src/components/CartDrawer.tsx) builds a plain-text message: numbered line items with quantity and line total, followed by the order total in Lempiras and a closing question about availability.
3. The message is URL-encoded and opened as `https://wa.me/<NUMBER>?text=<message>` in a new tab — WhatsApp Web on desktop, the native app on mobile.
4. The seller replies in WhatsApp and confirms the order manually.

Example of the generated message:

```
🌸 *PEDIDO PINKY'S STORE*

Hola! Me gustaría ordenar los siguientes productos:

1. *Labial líquido mate tono nude*
   Cantidad: 2
   Precio: L560.00

💰 *TOTAL: L560.00*

¿Me puedes confirmar la disponibilidad? 🙏
```

The destination number comes from `NEXT_PUBLIC_WHATSAPP_NUMBER` (international format, no `+`, e.g. `50495825388`). The same number backs the floating [WhatsAppButton.tsx](src/components/WhatsAppButton.tsx), which opens a generic "tell me more about your products" message.

Because the flow is a plain link, it needs no WhatsApp Business API account, no webhook and no server infrastructure.

---

## AI product capture (Gemini vision)

Listing a product used to mean typing a name and writing a sales description on a phone. Now the owner points the camera at the product and the form fills itself.

**Flow**

1. In the product modal, "Tomar foto del producto" opens the rear camera directly (`<input type="file" accept="image/*" capture="environment">` in [ImageUpload.tsx](src/components/admin/ImageUpload.tsx)).
2. [imagePayload.ts](src/lib/imagePayload.ts) downscales the photo to a 1024px longest edge and re-encodes it as JPEG at quality 0.82 — a 4–8MB phone photo becomes a few hundred KB of base64. It falls back to the original bytes if `createImageBitmap`/canvas is unavailable.
3. The payload is POSTed to [/api/ai/analyze-product](app/api/ai/analyze-product/route.ts).
4. The route calls Gemini with a Honduran-Spanish system prompt and a strict JSON schema, then returns the validated fields.
5. [dashboard/page.tsx](app/admin/dashboard/page.tsx#L176) merges the result into the form **without ever overwriting what you already typed** — empty fields only. Category, gender and badge are applied only when creating a new product, never when editing an existing one.
6. Price and stock are always yours to enter. The AI is told never to guess them.

**Response shape**

```jsonc
{
  "detected": true,               // false when the photo isn't a sellable product
  "name": "Labial líquido mate tono nude",
  "description": "...",           // 2–4 sentences, ~350 chars max
  "category": "maquillaje",       // maquillaje | joyeria | perfumes | accesorios
  "genero": "dama",               // unisex | caballero | dama
  "badge": null,                  // Nuevo | Oferta | Bestseller | Premium | null
  "notes": ""                     // seller-facing note: doubts, missing data, why it failed
}
```

**Model choice**

The default is `gemini-3.5-flash-lite` (~$0.0008 per scan), overridable with `GEMINI_MODEL`. It was benchmarked against real catalog photos: it reads brand and shade off the packaging as accurately as models 5× its price, and it respects the "invent nothing" rule that the full flash models broke. `gemini-3.1-flash-lite` (~$0.0006) also works, with slightly weaker shade naming.

> Note: `gemini-2.5-flash` and `gemini-2.5-flash-lite` return `404 — no longer available to new users` for recently issued API keys. Use the Gemini 3.x family.

**Guardrails baked into the route**

- **Auth**: the same gate as the dashboard — authenticated user whose `user_profiles.role` is `admin`. 401/403 otherwise.
- **Input validation**: accepts a bare base64 string or a full data URL; only JPEG/PNG/WebP/GIF; base64 charset checked; decoded size capped at ~4MB.
- **Structured output**: `responseJsonSchema` + `responseMimeType: application/json`, so the model cannot drift out of the enum values. Enums are re-validated server-side anyway.
- **Prompt rules**: no invented brands, prices, ingredients, milliliters, karats, guarantees or promotions; no emojis or hashtags; write in Honduran Spanish; describe only what is visible.
- **Thinking budget**: sent with `thinkingLevel: LOW` (this task measured 0 thinking tokens). Gemini 2.x rejects `thinkingLevel`, so a 400 triggers one automatic retry without it — which keeps `GEMINI_MODEL` overrides working across model generations.
- **Error mapping**: 503 if the key is missing or invalid, 429 on rate limits, 422 on safety blocks, 502 on truncated or unparseable responses. Every message is user-facing Spanish.
- **Runtime**: `nodejs`, `maxDuration = 60`.

The feature degrades cleanly: with no `GEMINI_API_KEY` set, the app runs exactly as before and the endpoint returns 503.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, tailwindcss-animate, Radix primitives (dialog, tooltip, separator), lucide-react |
| Backend | Supabase — Postgres, Auth, Storage |
| AI | Google Gemini via `@google/genai` |
| Auth gate | Next.js middleware (`middleware.ts`) + `@supabase/ssr` |

---

## Project structure

```
app/                       # Next.js App Router
  layout.tsx               # metadata, fonts, JSON-LD schemas
  page.tsx                 # storefront
  robots.ts / sitemap.ts   # dynamic SEO files
  admin/
    login/ register/ dashboard/
  api/ai/analyze-product/  # Gemini vision endpoint
lib/
  supabase.ts              # browser client + typed products/orders/storage APIs
  supabase-server.ts       # cookie-bound server client
src/
  app/api/products/        # public read-only products endpoint
  components/              # storefront components
    admin/                 # dashboard components
    ui/                    # Radix wrappers
  data/products.ts         # Supabase → frontend product mapping
  hooks/                   # useCart, use-mobile
  lib/imagePayload.ts      # client-side photo downscaling
middleware.ts              # /admin/* role gate
```

The dual `app/` + `src/` layout is historical (the project migrated from a Vite `src` app to the Next App Router). Both are aliased under `@/` per `tsconfig.json`.

---

## Getting started

Requirements: Node.js 18+ and a Supabase project.

```sh
git clone https://github.com/angeldev96/pinkys-store.git
cd pinkys-store
npm install
cp .env.example .env
# fill in the values, then:
npm run dev
```

The app runs at http://localhost:3000, the admin at http://localhost:3000/admin/login.

Scripts:

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server (raises the max HTTP header size to 64KB for large Supabase auth cookies) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

---

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon key |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | yes | Order destination, international format without `+` (e.g. `50495825388`) |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical site URL for metadata, sitemap and robots. Defaults to `https://www.pinkysstorehn.com` |
| `GEMINI_API_KEY` | no | Enables AI product capture. Get one at https://aistudio.google.com/apikey |
| `GEMINI_MODEL` | no | Vision model override. Defaults to `gemini-3.5-flash-lite` |

`GEMINI_API_KEY` is server-side only — it never reaches the browser, and the endpoint that uses it is admin-gated.

If you point at a different Supabase project, add its storage hostname to `images.remotePatterns` in [next.config.js](next.config.js).

---

## Database schema

Three tables plus one storage bucket.

**`products`**

| Column | Type |
| --- | --- |
| `id` | uuid, pk |
| `name` | text |
| `description` | text, nullable |
| `price` | numeric |
| `category` | `maquillaje` \| `joyeria` \| `perfumes` \| `accesorios` |
| `genero` | `unisex` \| `caballero` \| `dama` |
| `image_url` | text, nullable |
| `badge` | `Nuevo` \| `Oferta` \| `Bestseller` \| `Premium`, nullable |
| `stock` | int |
| `created_at`, `updated_at` | timestamptz |

**`orders`**

| Column | Type |
| --- | --- |
| `id` | uuid, pk |
| `customer_name`, `customer_phone` | text |
| `items` | jsonb — `[{ id, name, price, quantity, image_url }]` |
| `total` | numeric |
| `status` | `pending` \| `confirmed` \| `shipped` \| `delivered` \| `cancelled` |
| `notes` | text, nullable |
| `created_at`, `updated_at` | timestamptz |

**`user_profiles`**

| Column | Type |
| --- | --- |
| `id` | uuid, pk, references `auth.users` |
| `role` | text — `admin` grants dashboard access |

**Storage**: a public bucket named `product-images`; uploads land under `products/`.

RLS should allow anonymous `select` on `products` and restrict writes to authenticated admins. Role assignment must happen in Supabase (SQL or dashboard) — the register page deliberately cannot set `role`, so nobody can self-promote to admin.

---

## Creating an admin user

1. Sign up at `/admin/register` (or create the user in the Supabase dashboard).
2. In the Supabase SQL editor, grant the role:

```sql
insert into user_profiles (id, role)
values ('<auth-user-uuid>', 'admin')
on conflict (id) do update set role = 'admin';
```

3. Log in at `/admin/login`. The middleware checks the role on every `/admin/*` request and redirects non-admins back to login.

---

## SEO

- [layout.tsx](app/layout.tsx) — full metadata: title template, Honduran keyword set, Open Graph and Twitter images, `es-HN` locale and hreflang, canonical URL.
- [StructuredData.tsx](src/components/StructuredData.tsx) — JSON-LD for `Organization`, `LocalBusiness`, `WebSite`, `BreadcrumbList` and `ItemList` (the catalog).
- [sitemap.ts](app/sitemap.ts) / [robots.ts](app/robots.ts) — generated at build time from `NEXT_PUBLIC_SITE_URL`. `/admin/` and `/api/` are disallowed.

---

## Security

- `/admin/*` is protected by middleware: session check plus `user_profiles.role === 'admin'`, on every request.
- The AI endpoint repeats the same check server-side rather than trusting the UI.
- Security headers set in [next.config.js](next.config.js): `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, `Referrer-Policy: strict-origin-when-cross-origin`, and a `Permissions-Policy` denying camera, microphone and geolocation to third parties.
- Secrets are split: only `NEXT_PUBLIC_*` variables reach the browser.
- `package.json` pins `postcss ^8.5.10` through an `overrides` entry, because Next bundles an older vulnerable version.

---

## Deployment

Deploys as a standard Next.js app (Vercel or any Node host). Set every variable from the table above in the host's environment, including `GEMINI_API_KEY` if you want AI capture in production. The AI route needs the Node runtime and up to 60s of execution time — both are declared in the route file.

---

## Known limitations

- **WhatsApp orders are not persisted.** The cart checkout only opens a `wa.me` link; nothing is written to the `orders` table, so the admin Orders tab stays empty unless rows are inserted by other means. Closing this gap means writing the order through `ordersApi.create()` before opening WhatsApp, and asking for the customer's name and phone first.
- **No pagination** in the admin product list — fine at the current catalog size, worth revisiting as it grows.
- **AI capture handles one photo at a time** and never sets price or stock, by design.
