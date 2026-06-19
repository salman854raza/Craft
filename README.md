# Ashlar Studio

A boutique architecture & interior design studio website — built as a full-stack React application.

**Status:** in progress (build log below will grow as commits land)

## Stack
- React 18 + Vite
- Tailwind CSS
- Framer Motion (page transitions, scroll reveals)
- Three.js (3D wireframe hero building)
- React Router
- Supabase (contact form + newsletter lead storage)
- Vercel Serverless Functions (`/api/submit-lead`) for backend form handling

## Pages
- `/` Home
- `/about` About
- `/services` Services
- `/clients` Clients
- `/pricing` Pricing
- `/journal` Journal (blog)
- `/contact` Contact

## Local development
```bash
npm install
npm run dev
```

## Build log
- [x] Project scaffold (Vite + Tailwind + Router)
- [x] Home, About, Services pages
- [x] Clients, Pricing, Journal, Contact pages
- [x] Supabase schema (`supabase/migrations/0001_create_leads_table.sql`)
- [x] Supabase project provisioned (Mumbai, free tier) — leads table live
- [x] Vercel Serverless Function (`api/submit-lead.js`) for contact form + newsletter
- [x] Bundle splitting (three.js / framer-motion / vendor chunks)
- [x] `vercel.json` SPA rewrites
- [ ] Connect repo to Vercel + set environment variables
- [ ] SEO meta tags, Open Graph, favicon
- [ ] Responsiveness polish pass
- [ ] Page transition animations

## Deployment setup
1. ✅ **Supabase project provisioned** — "Ashlar Studio", Mumbai region (ap-south-1)
   - Project URL: `https://utllswqajudzehlfwryv.supabase.co`
   - `leads` table migration already applied
   - Get your `service_role` key from: Supabase Dashboard → Project Settings → API
2. **Vercel** — import `salman854raza/Craft` from GitHub (Vite is auto-detected, `vercel.json` handles SPA routing, `api/submit-lead.js` is auto-detected as a Serverless Function — no extra config needed)
3. In Vercel Project Settings → Environment Variables, add:
   - `SUPABASE_URL` = `https://utllswqajudzehlfwryv.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = _(your service_role secret from Supabase dashboard)_
4. Deploy — every `git push` to `main` will auto-redeploy.
