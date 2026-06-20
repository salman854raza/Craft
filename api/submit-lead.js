// api/submit-lead.js
//
// Vercel Serverless Function. Handles both the Contact page form
// (inquiry_type: "project") and the Journal page newsletter signup
// (inquiry_type: "newsletter"). Writes to Supabase via the REST API
// using the anon key held server-side — safe because RLS only permits
// INSERT (no SELECT), so this key can write but never read leads data.
//
// Required environment variables (set in Vercel Project Settings →
// Environment Variables):
//   SUPABASE_URL       e.g. https://utllswqajudzehlfwryv.supabase.co
//   SUPABASE_ANON_KEY  anon/public key from Supabase API settings

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  let payload = req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      return res.status(400).json({ error: "Invalid JSON body." });
    }
  }
  payload = payload || {};

  const {
    inquiry_type = "project",
    name = "",
    email = "",
    phone = "",
    project_type = "",
    message = "",
    company = "", // honeypot field from ContactForm — humans never fill this
  } = payload;

  // Silent bot trap: pretend success so bots don't learn to adapt, but
  // never write the row.
  if (company) {
    return res.status(200).json({ ok: true });
  }

  if (!["project", "newsletter"].includes(inquiry_type)) {
    return res.status(400).json({ error: "Invalid inquiry type." });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "A valid email address is required." });
  }

  if (inquiry_type === "project" && (!name.trim() || !message.trim())) {
    return res.status(400).json({ error: "Name and message are required for project enquiries." });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars.");
    return res.status(500).json({ error: "Server is not configured correctly. Please try again later." });
  }

  const row = {
    inquiry_type,
    name: name.trim() || null,
    email: email.trim().toLowerCase(),
    phone: phone.trim() || null,
    project_type: project_type.trim() || null,
    message: message.trim() || null,
    source: "website",
  };

  try {
    const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    });

    if (!supaRes.ok) {
      const errText = await supaRes.text();
      console.error("Supabase insert failed:", supaRes.status, errText);
      return res.status(502).json({ error: "Could not save your message right now. Please try again shortly." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Unexpected error submitting lead:", err);
    return res.status(500).json({ error: "Unexpected server error. Please try again." });
  }
}
