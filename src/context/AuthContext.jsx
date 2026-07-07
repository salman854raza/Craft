import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession]   = useState(null);
  const [user, setUser]         = useState(null);
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) { setProfile(null); return; }
    const { data } = await supabase
      .from("profiles")
      .select("id, username, full_name, created_at")
      .eq("id", userId)
      .maybeSingle();
    setProfile(data ?? null);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);
      loadProfile(s?.user?.id).finally(() => setLoading(false));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      loadProfile(s?.user?.id);
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, [loadProfile]);

  // ─── signUp ────────────────────────────────────────────────────────────
  async function signUp({ email, password, username, fullName }) {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { username: username.trim(), full_name: fullName.trim() },
      },
    });

    // Supabase silently returns 200 + identities=[] for duplicate emails
    // (security feature to prevent email enumeration). Surface it clearly.
    if (!error && data?.user?.identities?.length === 0) {
      return { error: { message: "An account with this email already exists. Please log in instead." } };
    }

    return { error };
  }

  // ─── verifyOtp ─────────────────────────────────────────────────────────
  async function verifyOtp({ email, token }) {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: token.trim(),
      type: "signup",
    });
    return { data, error };
  }

  // ─── resendOtp ─────────────────────────────────────────────────────────
  async function resendOtp({ email }) {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim().toLowerCase(),
    });
    return { error };
  }

  // ─── signIn (email OR username) ────────────────────────────────────────
  async function signIn({ identifier, password }) {
    let email = identifier.trim();

    // If no @ it's a username — resolve to email via RPC
    if (!email.includes("@")) {
      const { data: resolved, error: rpcErr } = await supabase.rpc(
        "get_email_by_username",
        { lookup_username: email }
      );
      if (rpcErr || !resolved) {
        return { error: { message: "No account found with that username." } };
      }
      email = resolved;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });
    return { error };
  }

  // ─── signOut ───────────────────────────────────────────────────────────
  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
  }

  const value = {
    session,
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    signUp,
    verifyOtp,
    resendOtp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
