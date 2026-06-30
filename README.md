# Ashlar Studio

A boutique architecture & interior design studio website — full-stack React + Supabase application with authentication, OTP email verification, and a real backend database.

**Status:** core build complete

## Stack
- React 18 + Vite
- Tailwind CSS
- Framer Motion (page transitions, scroll reveals)
- Three.js (3D wireframe hero building)
- React Router
- Supabase (Auth + Postgres database, accessed directly from the client — no custom backend server needed)
- Deployed as a static SPA on Vercel

## How the backend works
There's no custom API server. The browser talks to Supabase directly using the public anon key, and Postgres Row Level Security (RLS) policies enforce exactly what each request is allowed to do:
- Anyone (logged in or not) can **insert** into `messages` (Contact form) and `newsletter_subscribers` (Journal signup)
- Only a logged-in user can **read** their own rows in `messages` — enforced by `auth.uid() = user_id`
- Only a logged-in user can read/update their own row in `profiles`
- Two narrow RPC functions (`get_email_by_username`, `is_username_available`) expose only what's needed for login-by-username and live signup validation — nothing else in `auth.users` is ever exposed

## Pages
- `/` Home
- `/about` About
- `/services` Services
- `/clients` Clients
- `/pricing` Pricing
- `/journal` Journal (blog + newsletter signup)
- `/contact` Contact (project enquiry form)
- `/signup` Create an account (name, username, email, password)
- `/verify` Enter the 6-digit email OTP to activate the account
- `/login` Log in with email **or** username
- `/my-enquiries` *(protected)* — logged-in user's own message history

## Local development
```bash
npm install
npm run dev
```

No `.env` file is needed for local dev — the Supabase URL and anon key are public-by-design (safe under RLS) and are set directly in `src/lib/supabaseClient.js`.

## Database schema
See `supabase/migrations/`:
- `0001_create_leads_table.sql` — superseded, dropped in 0002
- `0002_auth_schema_profiles_messages_newsletter.sql` — current schema:
  - `profiles` (1:1 with `auth.users`, auto-created on signup via trigger)
  - `messages` (contact form / project enquiries, optionally linked to a user)
  - `newsletter_subscribers` (Journal email signups)

## ⚠️ One-time manual setup required: OTP email template
Supabase's **default** "Confirm signup" email shows a clickable link, not a visible 6-digit code — but this app's `/verify` page expects the user to type/paste a code. To make the code appear in the email:

1. Go to **Supabase Dashboard → Authentication → Email Templates → Confirm signup**
2. Replace the template body so it includes `{{ .Token }}` somewhere visible, e.g.:
   ```html
   <h2>Confirm your signup</h2>
   <p>Your verification code is:</p>
   <h1 style="letter-spacing: 4px;">{{ .Token }}</h1>
   <p>Enter this code on the Ashlar Studio website to activate your account.</p>
   ```
3. Save. New signups will now receive a visible 6-digit code instead of (or alongside) the confirmation link.

This is a one-time dashboard change — already-deployed code doesn't need to change once this is set.

## Deployment (Vercel)
1. Import `salman854raza/Craft` on vercel.com — Vite is auto-detected, `vercel.json` handles SPA routing for client-side routes like `/about`.
2. No environment variables are required — the app is a static SPA that talks to Supabase directly from the browser.
3. Deploy. Every `git push` to `main` auto-redeploys.

## Build log
- [x] All 9 pages (7 marketing pages + Login + Signup + Verify + protected My Enquiries)
- [x] Supabase Auth: email/password signup, OTP verification, login by email-or-username
- [x] Database schema: `profiles`, `messages`, `newsletter_subscribers`, RLS-secured
- [x] Contact form & newsletter signup write directly to Supabase (no custom API needed)
- [x] Auth-aware Navbar (login/signup vs. logged-in account menu)
- [x] SEO meta tags, Open Graph, JSON-LD, favicon
- [x] Bundle splitting, scroll-to-top, page transitions
- [ ] **Action needed:** set the OTP email template in Supabase dashboard (see above)
- [ ] Connect repo to Vercel for live deployment
