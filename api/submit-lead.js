// api/submit-lead.js
//
// Vercel Serverless Function. Handles both the Contact page form
// (inquiry_type: "project") and the Journal page newsletter signup
// (inquiry_type: "newsletter"). Writes directly to Supabase via the REST
// API using the service role key, which is only ever available in this
// server-side environment — never shipped to the browser.
//
// Required environment variables (set in Vercel Project Settings →
// Environment Variables, not in the repo):
//   SUPABASE_URL               e.g. https://xxxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  service_role key from Supabase API settings

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
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
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
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
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
