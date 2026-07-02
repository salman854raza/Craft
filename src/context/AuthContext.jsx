import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId) {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("id, username, full_name, created_at")
      .eq("id", userId)
      .maybeSingle();
    setProfile(data || null);
  }

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!active) return;
      setSession(s);
      setUser(s?.user ?? null);
      loadProfile(s?.user?.id).finally(() => setLoading(false));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      loadProfile(s?.user?.id);
    });

    return () => {
      active = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  /**
   * Step 1 of signup: creates the auth user and triggers Supabase's
   * confirmation email (which contains the OTP code, once the email
   * template is configured to show {{ .Token }}). Returns { error }.
   */
  async function signUp({ email, password, username, fullName }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, full_name: fullName },
      },
    });

    // Supabase returns status 200 with identities=[] for already-registered
    // emails instead of an error — detect this and surface it clearly.
    if (!error && data?.user && data.user.identities?.length === 0) {
      return { error: { message: "An account with this email already exists. Please log in instead." } };
    }

    return { error };
  }

  /** Step 2 of signup: confirms the 6-digit code the user got by email. */
  async function verifyOtp({ email, token }) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });
    return { data, error };
  }

  /** Resends the signup confirmation email (new OTP code). */
  async function resendOtp({ email }) {
    const { error } = await supabase.auth.resend({ type: "signup", email });
    return { error };
  }

  /**
   * Logs in with either an email address or a username. Usernames are
   * resolved to an email server-side via the get_email_by_username RPC
   * before calling signInWithPassword.
   */
  async function signIn({ identifier, password }) {
    let email = identifier.trim();

    if (!email.includes("@")) {
      const { data: resolvedEmail, error: rpcError } = await supabase.rpc(
        "get_email_by_username",
        { lookup_username: email }
      );
      if (rpcError || !resolvedEmail) {
        return { error: { message: "No account found with that username." } };
      }
      email = resolvedEmail;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }

  async function signOut() {
    await supabase.auth.signOut();
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
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
