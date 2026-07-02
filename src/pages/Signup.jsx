import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Loader2, AlertCircle, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import usePageMeta from "../hooks/usePageMeta.js";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

function getErrorMessage(error) {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (error.message && typeof error.message === "string") return error.message;
  try { const p = JSON.parse(JSON.stringify(error)); if (p.message) return p.message; } catch {}
  return "Something went wrong. Please try again.";
}

export default function Signup() {
  usePageMeta("/signup");
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const debounceRef = useRef(null);

  const pwLen = form.password.length;
  const pwStrength = pwLen === 0 ? "none" : pwLen < 8 ? "weak" : pwLen < 12 ? "ok" : "strong";

  function update(field, value) {
    if (status === "error") { setStatus("idle"); setErrorMsg(""); }
    setForm((f) => ({ ...f, [field]: value }));
    if (field === "username") checkUsername(value);
  }

  function checkUsername(value) {
    clearTimeout(debounceRef.current);
    if (!value) { setUsernameStatus("idle"); return; }
    if (!USERNAME_RE.test(value)) { setUsernameStatus("invalid"); return; }
    setUsernameStatus("checking");
    debounceRef.current = setTimeout(async () => {
      const { data, error } = await supabase.rpc("is_username_available", { check_username: value });
      if (error) { setUsernameStatus("idle"); return; }
      setUsernameStatus(data ? "available" : "taken");
    }, 450);
  }

  function setError(msg) { setStatus("error"); setErrorMsg(msg); }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg("");

    if (!form.fullName.trim()) return setError("Please enter your full name.");
    if (!form.username.trim()) return setError("Please choose a username.");
    if (usernameStatus === "invalid") return setError("Username must be 3–20 characters: letters, numbers, underscores only.");
    if (usernameStatus === "taken") return setError("That username is already taken — please choose another.");
    if (!form.email.trim()) return setError("Please enter your email address.");
    if (!form.password) return setError("Please create a password.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters long.");

    setStatus("loading");

    const { error } = await signUp({
      email: form.email.trim(),
      password: form.password,
      username: form.username.trim(),
      fullName: form.fullName.trim(),
    });

    if (error) return setError(getErrorMessage(error));

    navigate("/verify", { state: { email: form.email.trim() } });
  }

  return (
    <section className="min-h-screen flex items-center justify-center blueprint-grid py-32 px-6">
      <Reveal className="w-full max-w-md bg-paper rounded-2xl border border-ink/10 shadow-[0_20px_60px_-20px_rgba(27,42,61,0.25)] p-8 sm:p-10">
        <div className="flex items-center gap-2.5 mb-1">
          <UserPlus className="text-blueprint" size={22} strokeWidth={1.6} />
          <p className="sheet-label text-brass">SHEET R-001 — REGISTRATION</p>
        </div>
        <h1 className="font-display text-3xl font-semibold text-blueprint mt-2">Create an account</h1>
        <p className="text-concrete text-sm mt-2">Track your enquiries and pick up where you left off.</p>

        <form onSubmit={handleSubmit} className="space-y-5 mt-8" noValidate>
          {/* Full name */}
          <div>
            <label className="sheet-label text-concrete block mb-2">Full name*</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="e.g. Salman Raza"
              className="w-full rounded-md border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:border-blueprint transition-colors bg-paper"
            />
          </div>

          {/* Username */}
          <div>
            <label className="sheet-label text-concrete block mb-2">Username*</label>
            <div className="relative">
              <input
                type="text"
                value={form.username}
                onChange={(e) => update("username", e.target.value)}
                placeholder="e.g. salman_raza"
                autoCapitalize="none"
                autoCorrect="off"
                className="w-full rounded-md border border-ink/15 px-4 py-3 pr-10 text-sm focus:outline-none focus:border-blueprint transition-colors bg-paper"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {usernameStatus === "checking" && <Loader2 size={16} className="animate-spin text-concrete" />}
                {usernameStatus === "available" && <CheckCircle2 size={16} className="text-emerald-600" />}
                {(usernameStatus === "taken" || usernameStatus === "invalid") && <XCircle size={16} className="text-rose-500" />}
              </span>
            </div>
            {usernameStatus === "taken" && <p className="text-rose-600 text-xs mt-1.5">That username is taken.</p>}
            {usernameStatus === "invalid" && <p className="text-rose-600 text-xs mt-1.5">3–20 characters: letters, numbers, underscores only.</p>}
            {usernameStatus === "available" && <p className="text-emerald-600 text-xs mt-1.5">Username is available!</p>}
          </div>

          {/* Email */}
          <div>
            <label className="sheet-label text-concrete block mb-2">Email address*</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-md border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:border-blueprint transition-colors bg-paper"
            />
          </div>

          {/* Password */}
          <div>
            <label className="sheet-label text-concrete block mb-2">Password*</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-md border border-ink/15 px-4 py-3 pr-11 text-sm focus:outline-none focus:border-blueprint transition-colors bg-paper"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-concrete hover:text-ink transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password strength bar */}
            {pwStrength !== "none" && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      pwStrength === "weak" && i === 0 ? "bg-rose-500" :
                      pwStrength === "ok" && i <= 1 ? "bg-amber-400" :
                      pwStrength === "strong" ? "bg-emerald-500" : "bg-ink/10"
                    }`} />
                  ))}
                </div>
                <p className={`text-xs ${
                  pwStrength === "weak" ? "text-rose-500" :
                  pwStrength === "ok" ? "text-amber-500" : "text-emerald-600"
                }`}>
                  {pwStrength === "weak" ? "Too short — minimum 8 characters" :
                   pwStrength === "ok" ? "Good — consider making it longer" : "Strong password ✓"}
                </p>
              </div>
            )}
          </div>

          {/* Error box */}
          {status === "error" && errorMsg && (
            <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-md px-3 py-2.5 text-rose-700 text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-blueprint text-paper px-7 py-3.5 text-sm font-semibold hover:bg-blueprint-deep transition-colors disabled:opacity-60"
          >
            {status === "loading" ? (
              <><Loader2 size={16} className="animate-spin" /> Creating account…</>
            ) : "Create account"}
          </button>
        </form>

        <p className="text-concrete text-sm text-center mt-7">
          Already have an account?{" "}
          <Link to="/login" className="text-blueprint font-medium border-b border-blueprint/30 hover:border-blueprint transition-colors">
            Log in
          </Link>
        </p>
      </Reveal>
    </section>
  );
}
