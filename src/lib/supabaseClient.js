import { createClient } from "@supabase/supabase-js";

// These are PUBLIC by design — the anon key is meant to ship in the
// browser bundle. It can only do what Row Level Security explicitly
// allows (see supabase/migrations/0002_*.sql): insert into messages /
// newsletter_subscribers, read/update a user's own profile, and call the
// two narrow lookup RPCs. It can never read other users' data.
const SUPABASE_URL = "https://utllswqajudzehlfwryv.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0bGxzd3FhanVkemVobGZ3cnl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NzUzNDUsImV4cCI6MjA5NzM1MTM0NX0.MbvODC-uM-45vHuJ3XehtLloPn8hCseWzVWupwf6hGU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
