import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

const PROJECT_TYPES = [
  "Residential new-build",
  "Residential extension / renovation",
  "Adaptive reuse / conversion",
  "Commercial fit-out",
  "Heritage / listed building",
  "Not sure yet",
];

const initialState = {
  name: "",
  email: "",
  phone: "",
  project_type: "",
  message: "",
  company: "", // honeypot — real users never see or fill this
};

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      setErrorMsg("Name, email, and a short message are required.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/.netlify/functions/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiry_type: "project", ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-brass/30 bg-brass/5 px-6 py-10 text-center"
      >
        <CheckCircle2 className="text-brass mx-auto" size={36} strokeWidth={1.6} />
        <h3 className="font-display text-xl font-semibold text-blueprint mt-4">
          Thanks — that's with us.
        </h3>
        <p className="text-concrete mt-2 max-w-sm mx-auto">
          A project architect will get back to you within two working days.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-blueprint font-medium border-b border-blueprint/30 hover:border-blueprint transition-colors"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot field — hidden from real users, bots tend to fill every field */}
      <input
        type="text"
        name="company"
        value={form.company}
        onChange={(e) => update("company", e.target.value)}
        autoComplete="off"
        tabIndex={-1}
        className="absolute -left-[9999px] opacity-0 h-0 w-0"
        aria-hidden="true"
      />

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="sheet-label text-concrete block mb-2">Your name*</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-md border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:border-blueprint transition-colors bg-paper"
          />
        </div>
        <div>
          <label className="sheet-label text-concrete block mb-2">Email address*</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-md border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:border-blueprint transition-colors bg-paper"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="sheet-label text-concrete block mb-2">Phone (optional)</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full rounded-md border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:border-blueprint transition-colors bg-paper"
          />
        </div>
        <div>
          <label className="sheet-label text-concrete block mb-2">Project type</label>
          <select
            value={form.project_type}
            onChange={(e) => update("project_type", e.target.value)}
            className="w-full rounded-md border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:border-blueprint transition-colors bg-paper"
          >
            <option value="">Select one…</option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="sheet-label text-concrete block mb-2">Your message*</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Tell us about your site, your timeline, and what you're hoping to achieve."
          className="w-full rounded-md border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:border-blueprint transition-colors bg-paper resize-none"
        />
      </div>

      {status === "error" && (
        <div className="flex items-start gap-2 text-rose-600 text-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-blueprint text-paper px-7 py-3.5 text-sm font-semibold hover:bg-blueprint-deep transition-colors disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send message <ArrowRight size={15} />
          </>
        )}
      </button>
    </form>
  );
}
