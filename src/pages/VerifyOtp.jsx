import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import usePageMeta from "../hooks/usePageMeta.js";
import { useAuth } from "../context/AuthContext.jsx";

const CODE_LENGTH = 6;

export default function VerifyOtp() {
  usePageMeta("/verify");
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useAuth();

  const email = location.state?.email;
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [resendState, setResendState] = useState("idle"); // idle | sending | sent
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) navigate("/signup", { replace: true });
  }, [email, navigate]);

  function handleChange(i, value) {
    const v = value.replace(/[^0-9]/g, "").slice(-1);
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
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.split("");
    while (next.length < CODE_LENGTH) next.push("");
    setDigits(next);
    const lastFilled = Math.min(pasted.length, CODE_LENGTH) - 1;
    inputRefs.current[lastFilled]?.focus();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length !== CODE_LENGTH) {
      setStatus("error");
      setErrorMsg("Enter the full 6-digit code.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const { error } = await verifyOtp({ email, token: code });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message || "That code didn't work. Check your email and try again.");
      return;
    }

    setStatus("success");
    setTimeout(() => navigate("/my-enquiries"), 1200);
  }

  async function handleResend() {
    setResendState("sending");
    await resendOtp({ email });
    setResendState("sent");
    setTimeout(() => setResendState("idle"), 8000);
  }

  if (!email) return null;

  return (
    <section className="min-h-screen flex items-center justify-center blueprint-grid py-32 px-6">
      <Reveal className="w-full max-w-md bg-paper rounded-2xl border border-ink/10 shadow-[0_20px_60px_-20px_rgba(27,42,61,0.25)] p-8 sm:p-10 text-center">
        <ShieldCheck className="text-blueprint mx-auto" size={32} strokeWidth={1.5} />
        <p className="sheet-label text-brass mt-4">SHEET R-002 — VERIFICATION</p>
        <h1 className="font-display text-3xl font-semibold text-blueprint mt-2">Check your email</h1>
        <p className="text-concrete text-sm mt-2">
          We sent a 6-digit code to <span className="font-medium text-ink">{email}</span>. Copy it
          from the email and paste or type it below.
        </p>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-2 mt-9 text-emerald-600">
            <CheckCircle2 size={32} />
            <p className="font-medium">Verified — you're in.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-9">
            <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
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
                  className="h-13 w-11 sm:h-14 sm:w-12 text-center font-display text-xl font-semibold rounded-md border border-ink/15 focus:outline-none focus:border-blueprint transition-colors bg-paper"
                />
              ))}
            </div>

            {status === "error" && (
              <div className="flex items-center justify-center gap-2 text-rose-600 text-sm mt-5">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-blueprint text-paper px-7 py-3.5 text-sm font-semibold hover:bg-blueprint-deep transition-colors disabled:opacity-60 mt-7"
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Verifying…
                </>
              ) : (
                "Verify & continue"
              )}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={resendState === "sending"}
              className="text-sm text-concrete hover:text-blueprint transition-colors mt-5 disabled:opacity-60"
            >
              {resendState === "sent" ? "Code resent — check your email" : "Didn't get a code? Resend it"}
            </button>
          </form>
        )}

        <p className="text-concrete text-sm mt-7">
          Wrong email?{" "}
          <Link to="/signup" className="text-blueprint font-medium border-b border-blueprint/30 hover:border-blueprint transition-colors">
            Start over
          </Link>
        </p>
      </Reveal>
    </section>
  );
}
