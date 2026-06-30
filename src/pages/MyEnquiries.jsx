import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Inbox, Loader2, ArrowRight, Clock, LogOut } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import usePageMeta from "../hooks/usePageMeta.js";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";

const STATUS_STYLES = {
  new: "bg-blueprint/10 text-blueprint",
  contacted: "bg-brass/15 text-brass",
  qualified: "bg-emerald-100 text-emerald-700",
  closed: "bg-ink/10 text-concrete",
};

export default function MyEnquiries() {
  usePageMeta("/my-enquiries");
  const { user, profile, signOut } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let active = true;

    supabase
      .from("messages")
      .select("id, name, email, project_type, message, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!active) return;
        setMessages(data || []);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  return (
    <section className="min-h-screen blueprint-grid pt-40 pb-24 px-6">
      <div className="mx-auto max-w-4xl">
        <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="sheet-label text-brass mb-3">SHEET R-004 — YOUR ACCOUNT</p>
            <h1 className="font-display text-4xl font-semibold text-paper text-balance">
              Welcome back, {profile?.full_name?.split(" ")[0] || profile?.username || "there"}.
            </h1>
            <p className="text-paper/60 mt-2">@{profile?.username}</p>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 text-paper/70 hover:text-paper text-sm border border-paper/20 rounded-full px-4 py-2 transition-colors shrink-0"
          >
            <LogOut size={14} /> Log out
          </button>
        </Reveal>

        <Reveal className="bg-paper rounded-2xl p-8 sm:p-10">
          <div className="flex items-center gap-2.5 mb-7">
            <Inbox className="text-blueprint" size={20} strokeWidth={1.6} />
            <h2 className="font-display text-xl font-semibold text-blueprint">Your enquiries</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin text-blueprint" size={24} />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-concrete">You haven't sent us a message yet.</p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 mt-5 rounded-full bg-blueprint text-paper px-6 py-3 text-sm font-semibold hover:bg-blueprint-deep transition-colors"
              >
                Start a project <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {messages.map((m) => (
                <li key={m.id} className="border border-ink/10 rounded-lg p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {m.project_type && (
                        <p className="sheet-label text-brass mb-1.5">{m.project_type}</p>
                      )}
                      <p className="text-ink/80 text-sm leading-relaxed">{m.message}</p>
                    </div>
                    <span
                      className={`sheet-label shrink-0 rounded-full px-3 py-1 ${STATUS_STYLES[m.status] || STATUS_STYLES.new}`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-concrete text-xs mt-4">
                    <Clock size={12} />
                    {new Date(m.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </section>
  );
}
