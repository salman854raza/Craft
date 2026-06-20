import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Loader2, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import usePageMeta from "../hooks/usePageMeta.js";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

export default function Signup() {
  usePageMeta("/signup");
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "" });
  const [usernameStatus, setUsernameStatus] = useState("idle"); // idle | checking | available | taken | invalid
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [errorMsg, setErrorMsg] = useState("");
  const debounceRef = useRef(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (field === "username") checkUsername(value);
  }

  function checkUsername(value) {
    clearTimeout(debounceRef.current);
    if (!value) {
      setUsernameStatus("idle");
      return;
    }
    if (!USERNAME_RE.test(value)) {
      setUsernameStatus("invalid");
      return;
    }
    setUsernameStatus("checking");
    debounceRef.current = setTimeout(async () => {
      const { data, error } = await supabase.rpc("is_username_available", {
        check_username: value,
      });
      if (error) {
        setUsernameStatus("idle");
        return;
      }
      setUsernameStatus(data ? "available" : "taken");
    }, 450);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.fullName.trim() || !form.username.trim() || !form.email.trim() || !form.password) {
      setStatus("error");
      setErrorMsg("All fields are required.");
      return;
    }
    if (usernameStatus === "taken") {
      setStatus("error");
      setErrorMsg("That username is already taken.");
      return;
    }
    if (usernameStatus === "invalid") {
      setStatus("error");
      setErrorMsg("Username must be 3–20 characters: letters, numbers, underscores only.");
      return;
    }
    if (form.password.length < 8) {
      setStatus("error");
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const { error } = await signUp({
      email: form.email.trim(),
      password: form.password,
      username: form.username.trim(),
      fullName: form.fullName.trim(),
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message || "Could not create your account. Please try again.");
      return;
    }

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
        <p className="text-concrete text-sm mt-2">
          Track your enquiries and pick up where you left off.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 mt-8" noValidate>
          <div>
            <label className="sheet-label text-concrete block mb-2">Full name*</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className="w-full rounded-md border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:border-blueprint transition-colors bg-paper"
            />
          </div>

          <div>
            <label className="sheet-label text-concrete block mb-2">Username*</label>
            <div className="relative">
              <input
                type="text"
                value={form.username}
                onChange={(e) => update("username", e.target.value)}
                className="w-full rounded-md border border-ink/15 px-4 py-3 pr-10 text-sm focus:outline-none focus:border-blueprint transition-colors bg-paper"
                autoCapitalize="none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {usernameStatus === "checking" && <Loader2 size={16} className="animate-spin text-concrete" />}
                {usernameStatus === "available" && <CheckCircle2 size={16} className="text-emerald-600" />}
                {(usernameStatus === "taken" || usernameStatus === "invalid") && (
                  <XCircle size={16} className="text-rose-500" />
                )}
              </span>
            </div>
            {usernameStatus === "taken" && (
              <p className="text-rose-600 text-xs mt-1.5">That username is taken.</p>
            )}
            {usernameStatus === "invalid" && (
              <p className="text-rose-600 text-xs mt-1.5">3–20 characters: letters, numbers, underscores.</p>
            )}
          </div>

          <div>
            <label className="sheet-label text-concrete block mb-2">Email address*</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full rounded-md border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:border-blueprint transition-colors bg-paper"
            />
          </div>

          <div>
            <label className="sheet-label text-concrete block mb-2">Password*</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="w-full rounded-md border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:border-blueprint transition-colors bg-paper"
            />
            <p className="text-concrete/70 text-xs mt-1.5">At least 8 characters.</p>
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
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-blueprint text-paper px-7 py-3.5 text-sm font-semibold hover:bg-blueprint-deep transition-colors disabled:opacity-60"
          >
            {status === "loading" ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Creating account…
              </>
            ) : (
              "Create account"
            )}
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
