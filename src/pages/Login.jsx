import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn, Loader2, AlertCircle } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import usePageMeta from "../hooks/usePageMeta.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  usePageMeta("/login");
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setStatus("error");
      setErrorMsg("Enter your email/username and password.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const { error } = await signIn({ identifier: identifier.trim(), password });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message || "Could not log you in. Check your details and try again.");
      return;
    }

    const redirectTo = location.state?.from || "/my-enquiries";
    navigate(redirectTo);
  }

  return (
    <section className="min-h-screen flex items-center justify-center blueprint-grid py-32 px-6">
      <Reveal className="w-full max-w-md bg-paper rounded-2xl border border-ink/10 shadow-[0_20px_60px_-20px_rgba(27,42,61,0.25)] p-8 sm:p-10">
        <div className="flex items-center gap-2.5 mb-1">
          <LogIn className="text-blueprint" size={22} strokeWidth={1.6} />
          <p className="sheet-label text-brass">SHEET R-003 — LOG IN</p>
        </div>
        <h1 className="font-display text-3xl font-semibold text-blueprint mt-2">Welcome back</h1>
        <p className="text-concrete text-sm mt-2">Log in to view your enquiries.</p>

        <form onSubmit={handleSubmit} className="space-y-5 mt-8" noValidate>
          <div>
            <label className="sheet-label text-concrete block mb-2">Email or username*</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoCapitalize="none"
              className="w-full rounded-md border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:border-blueprint transition-colors bg-paper"
            />
          </div>

          <div>
            <label className="sheet-label text-concrete block mb-2">Password*</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:border-blueprint transition-colors bg-paper"
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
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-blueprint text-paper px-7 py-3.5 text-sm font-semibold hover:bg-blueprint-deep transition-colors disabled:opacity-60"
          >
            {status === "loading" ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Logging in…
              </>
            ) : (
              "Log in"
            )}
          </button>
        </form>

        <p className="text-concrete text-sm text-center mt-7">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blueprint font-medium border-b border-blueprint/30 hover:border-blueprint transition-colors">
            Create one
          </Link>
        </p>
      </Reveal>
    </section>
  );
}
