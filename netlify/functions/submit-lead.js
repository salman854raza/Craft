// netlify/functions/submit-lead.js
//
// Handles both the Contact page form (inquiry_type: "project") and the
// Journal page newsletter signup (inquiry_type: "newsletter"). Writes
// directly to Supabase via the REST API using the service role key, which
// is only ever available in this server-side environment — never shipped
// to the browser.
//
// Required environment variables (set in Netlify site settings, not in
// the repo):
//   SUPABASE_URL               e.g. https://xxxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  service_role key from Supabase API settings

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid JSON body." });
  }

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
    return jsonResponse(200, { ok: true });
  }

  if (!["project", "newsletter"].includes(inquiry_type)) {
    return jsonResponse(400, { error: "Invalid inquiry type." });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return jsonResponse(400, { error: "A valid email address is required." });
  }

  if (inquiry_type === "project" && (!name.trim() || !message.trim())) {
    return jsonResponse(400, { error: "Name and message are required for project enquiries." });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
    return jsonResponse(500, { error: "Server is not configured correctly. Please try again later." });
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
    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Supabase insert failed:", res.status, errText);
      return jsonResponse(502, { error: "Could not save your message right now. Please try again shortly." });
    }

    return jsonResponse(200, { ok: true });
  } catch (err) {
    console.error("Unexpected error submitting lead:", err);
    return jsonResponse(500, { error: "Unexpected server error. Please try again." });
  }
};
