import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Loader2, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import usePageMeta from "../hooks/usePageMeta.js";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";

const CODE_LENGTH = 6;

export default function VerifyOtp() {
  usePageMeta("/verify");
  const { state } = useLocation();
  const navigate   = useNavigate();
  const { verifyOtp, resendOtp } = useAuth();

  const email = state?.email ?? null;

  const [digits, setDigits]       = useState(Array(CODE_LENGTH).fill(""));
  const [status, setStatus]       = useState("idle"); // idle|loading|success|error
  const [errorMsg, setErrorMsg]   = useState("");
  const [resendState, setResend]  = useState("idle"); // idle|sending|sent
  const inputRefs = useRef([]);

  // ── Auto-verify when user arrives via the email confirmation LINK ──────
  // Supabase appends ?token_hash=XXX&type=signup to the redirect URL.
  const handleLinkToken = useCallback(async () => {
    const params    = new URLSearchParams(window.location.search);
    const tokenHash = params.get("token_hash");
    const type      = params.get("type");
    if (!tokenHash || type !== "signup") return;

    setStatus("loading");
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "signup" });
    if (error) {
      setStatus("error");
      setErrorMsg("This confirmation link has expired or already been used. Enter the 6-digit code below or request a new one.");
    } else {
      setStatus("success");
      setTimeout(() => navigate("/my-enquiries"), 1400);
    }
  }, [navigate]);

  useEffect(() => {
    handleLinkToken();
  }, [handleLinkToken]);

  // Redirect to signup if no email AND no token_hash in URL
  useEffect(() => {
    const hasHash = new URLSearchParams(window.location.search).get("token_hash");
    if (!email && !hasHash) navigate("/signup", { replace: true });
  }, [email, navigate]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (status === "idle") inputRefs.current[0]?.focus();
  }, [status]);

  // ── Digit input handlers ───────────────────────────────────────────────
  function handleChange(i, value) {
    const v = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < CODE_LENGTH - 1) inputRefs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e) {
    const raw = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!raw) return;
    e.preventDefault();
    const next = raw.split("").concat(Array(CODE_LENGTH).fill("")).slice(0, CODE_LENGTH);
    setDigits(next);
    inputRefs.current[Math.min(raw.length, CODE_LENGTH - 1)]?.focus();
  }

  // ── Submit ─────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const code = digits.join("");

    if (code.length < CODE_LENGTH) {
      setStatus("error");
      setErrorMsg("Please enter the full 6-digit code.");
      return;
    }
    if (!email) {
      setStatus("error");
      setErrorMsg("Email missing — please start over.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const { error } = await verifyOtp({ email, token: code });
    if (error) {
      setStatus("error");
      setDigits(Array(CODE_LENGTH).fill(""));
      setErrorMsg("Incorrect or expired code. Check your email for the latest code and try again.");
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
      return;
    }

    setStatus("success");
    setTimeout(() => navigate("/my-enquiries"), 1400);
  }

  // ── Resend ─────────────────────────────────────────────────────────────
  async function handleResend() {
    if (!email || resendState !== "idle") return;
    setResend("sending");
    await resendOtp({ email });
    setResend("sent");
    setDigits(Array(CODE_LENGTH).fill(""));
    setErrorMsg("");
    setStatus("idle");
    setTimeout(() => { setResend("idle"); inputRefs.current[0]?.focus(); }, 10000);
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <section className="min-h-screen flex items-center justify-center blueprint-grid py-32 px-6">
      <Reveal className="w-full max-w-md bg-paper rounded-2xl border border-ink/10 shadow-[0_20px_60px_-20px_rgba(27,42,61,0.25)] p-8 sm:p-10 text-center">

        <ShieldCheck className="text-blueprint mx-auto" size={36} strokeWidth={1.4} />
        <p className="sheet-label text-brass mt-4">SHEET R-002 — VERIFICATION</p>
        <h1 className="font-display text-3xl font-semibold text-blueprint mt-2">
          Check your email
        </h1>
        <p className="text-concrete text-sm mt-2 leading-relaxed">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-ink">{email ?? "your email"}</span>.
          <br />Copy it from the email and paste or type it below.
        </p>

        {/* ── Success ── */}
        {status === "success" && (
          <div className="flex flex-col items-center gap-3 mt-10 text-emerald-600">
            <CheckCircle2 size={40} strokeWidth={1.5} />
            <p className="font-display text-xl font-semibold">Verified — you&apos;re in!</p>
            <p className="text-concrete text-sm">Taking you to your account…</p>
          </div>
        )}

        {/* ── Auto-verifying link ── */}
        {status === "loading" && !digits.some(Boolean) && (
          <div className="flex flex-col items-center gap-3 mt-10 text-concrete">
            <Loader2 className="animate-spin text-blueprint" size={32} />
            <p className="text-sm">Verifying your link…</p>
          </div>
        )}

        {/* ── Manual code entry ── */}
        {status !== "success" && !(status === "loading" && !digits.some(Boolean)) && (
          <form onSubmit={handleSubmit} className="mt-9" noValidate>
            {/* 6-box input */}
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`h-14 w-12 text-center font-display text-2xl font-bold rounded-lg border-2 transition-all focus:outline-none ${
                    d ? "border-blueprint bg-blueprint/5 text-blueprint" : "border-ink/15 bg-paper text-ink"
                  } focus:border-blueprint`}
                />
              ))}
            </div>

            {/* Error */}
            {status === "error" && errorMsg && (
              <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-md px-3 py-2.5 text-rose-700 text-sm mt-5 text-left">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-blueprint text-paper px-7 py-3.5 text-sm font-semibold hover:bg-blueprint-deep transition-colors disabled:opacity-60 mt-7"
            >
              {status === "loading"
                ? <><Loader2 size={16} className="animate-spin" /> Verifying…</>
                : "Verify & continue"}
            </button>

            {/* Resend */}
            {email && (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendState !== "idle"}
                className="inline-flex items-center gap-1.5 text-sm text-concrete hover:text-blueprint transition-colors mt-5 disabled:opacity-50"
              >
                <RefreshCw size={13} className={resendState === "sending" ? "animate-spin" : ""} />
                {resendState === "sent"   ? "Code resent — check your inbox"
                 : resendState === "sending" ? "Sending new code…"
                 : "Didn't get the code? Resend"}
              </button>
            )}
          </form>
        )}

        <p className="text-concrete text-sm mt-8">
          Wrong email?{" "}
          <Link to="/signup" className="text-blueprint font-medium border-b border-blueprint/30 hover:border-blueprint transition-colors">
            Start over
          </Link>
        </p>
      </Reveal>
    </section>
  );
}
