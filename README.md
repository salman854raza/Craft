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
- [x] Vercel Serverless Function for contact form + newsletter signup (`api/submit-lead.js`)
- [x] Bundle splitting (three.js / framer-motion / vendor chunks)
- [ ] Provision real Supabase project + run migration
- [ ] Connect repo to Vercel + set environment variables
- [ ] Final polish pass (responsiveness check, SEO meta tags, favicon)

## Deployment setup (once you're ready to go live)
1. Create a Supabase project, then run `supabase/migrations/0001_create_leads_table.sql` against it (SQL Editor or CLI).
2. In Vercel: import this GitHub repo as a new project. Vite is auto-detected; `vercel.json` already handles SPA routing and `/api/submit-lead.js` is picked up automatically as a Serverless Function.
3. In Vercel Project Settings → Environment Variables, add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (see `.env.example`).
4. Deploy. The contact form and newsletter signup will start writing to the `leads` table immediately.
