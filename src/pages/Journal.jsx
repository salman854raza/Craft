import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Send, CheckCircle2, Loader2 } from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";

const CATEGORIES = ["All", "Design", "Sustainability", "Process", "Case Study", "Studio News"];

const POSTS = [
  { id: 1, category: "Design", date: "26 May 2026", title: "Why we still draw by hand before we model in 3D", excerpt: "Sketching forces a kind of editing that software doesn't — here's why the first hour of every project still happens on paper.", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=900&auto=format&fit=crop" },
  { id: 2, category: "Sustainability", date: "21 May 2026", title: "Embodied carbon is the number nobody asks about", excerpt: "Operational efficiency gets all the attention. The carbon locked into materials before a building even opens is the harder problem.", img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=900&auto=format&fit=crop" },
  { id: 3, category: "Case Study", date: "14 May 2026", title: "Inside the Founders' Mill conversion", excerpt: "How a derelict 1860s textile mill became 42,000 sqft of flexible workspace without losing its original character.", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=900&auto=format&fit=crop" },
  { id: 4, category: "Process", date: "08 May 2026", title: "What actually happens during a feasibility study", excerpt: "It's not just a site visit. Here's the full checklist we run before telling a client whether their idea is buildable.", img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=900&auto=format&fit=crop" },
  { id: 5, category: "Studio News", date: "30 Apr 2026", title: "We've relocated to the Foundry Lane building", excerpt: "Fittingly, our new studio is itself one of our adaptive reuse projects — a converted Victorian foundry.", img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=900&auto=format&fit=crop" },
  { id: 6, category: "Design", date: "22 Apr 2026", title: "The case for fewer, better-chosen materials", excerpt: "A tight material palette isn't a budget constraint — used well, it's what makes a building feel resolved.", img: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?q=80&w=900&auto=format&fit=crop" },
  { id: 7, category: "Sustainability", date: "15 Apr 2026", title: "Passive house principles for UK retrofits", excerpt: "Most passive house guidance assumes new-build. Here's what changes when you're retrofitting a 1930s terrace instead.", img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=900&auto=format&fit=crop" },
  { id: 8, category: "Process", date: "02 Apr 2026", title: "Reading a planning committee report before they do", excerpt: "Most refusals are predictable if you know what the case officer is actually scoring against.", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=900&auto=format&fit=crop" },
  { id: 9, category: "Case Study", date: "25 Mar 2026", title: "Birchgate: building a passive house in the Peak District", excerpt: "Site access, wind exposure, and a conservation officer who didn't want to see a single solar panel from the road.", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=900&auto=format&fit=crop" },
  { id: 10, category: "Design", date: "18 Mar 2026", title: "Lighting design is 70% decisions you make in daylight", excerpt: "The best lighting schemes are mostly about understanding how a room behaves before dark, not after.", img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=900&auto=format&fit=crop" },
  { id: 11, category: "Studio News", date: "09 Mar 2026", title: "Crossing the 100-project mark", excerpt: "Project number one hundred was a passive house in the Peak District — a fitting bookend to twenty-eight years.", img: "https://images.unsplash.com/photo-1481026469463-66327c86e544?q=80&w=900&auto=format&fit=crop" },
  { id: 12, category: "Sustainability", date: "27 Feb 2026", title: "Sourcing reclaimed materials without the guesswork", excerpt: "A practical look at how we vet salvage yards and reclaimed timber suppliers before specifying anything.", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=900&auto=format&fit=crop" },
];

const PER_PAGE = 4;

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiry_type: "newsletter", email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2.5 text-paper">
        <CheckCircle2 size={20} className="text-brass-light shrink-0" />
        <span>You're subscribed — look out for our next dispatch.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md w-full">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="flex-1 rounded-full bg-paper/10 border border-paper/25 px-5 py-3 text-sm text-paper placeholder:text-paper/40 focus:outline-none focus:border-brass transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-brass text-blueprint-deep px-6 py-3 text-sm font-semibold hover:bg-brass-light transition-colors disabled:opacity-60"
      >
        {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
        Subscribe
      </button>
      {status === "error" && (
        <p className="text-rose-300 text-xs sm:absolute sm:mt-12">{errorMsg}</p>
      )}
    </form>
  );
}

export default function Journal() {
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (category === "All" ? POSTS : POSTS.filter((p) => p.category === category)),
    [category]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function selectCategory(c) {
    setCategory(c);
    setPage(1);
  }

  return (
    <>
      <PageHero
        sheet="SHEET J-000 — JOURNAL"
        title="Notes from the studio."
        kicker="Process write-ups, material research, and the occasional opinion on planning policy — published roughly twice a month."
      />

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* CATEGORY FILTER */}
          <Reveal className="flex flex-wrap gap-2.5 mb-14">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => selectCategory(c)}
                className={`sheet-label rounded-full px-4 py-2 border transition-colors ${
                  category === c
                    ? "bg-blueprint text-paper border-blueprint"
                    : "border-ink/15 text-ink/60 hover:border-blueprint/40 hover:text-blueprint"
                }`}
              >
                {c}
              </button>
            ))}
          </Reveal>

          {/* POST GRID */}
          <AnimatePresence mode="wait">
            <motion.div
              key={category + page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7"
            >
              {paged.map((post, i) => (
                <Reveal key={post.id} delay={i * 0.07} className="group cursor-default">
                  <div className="overflow-hidden rounded-sm">
                    <img
                      src={post.img}
                      alt={post.title}
                      className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <p className="sheet-label text-brass mt-4">{post.category} · {post.date}</p>
                  <h3 className="font-display text-lg font-semibold text-blueprint mt-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-concrete text-sm mt-2 leading-relaxed">{post.excerpt}</p>
                </Reveal>
              ))}
            </motion.div>
          </AnimatePresence>

          {paged.length === 0 && (
            <p className="text-concrete text-center py-16">No posts in this category yet.</p>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-16">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-9 w-9 rounded-full border border-ink/15 flex items-center justify-center text-ink/60 hover:border-blueprint/40 hover:text-blueprint transition-colors disabled:opacity-30"
                aria-label="Previous page"
              >
                <ArrowLeft size={16} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 w-9 rounded-full sheet-label flex items-center justify-center transition-colors ${
                    page === i + 1 ? "bg-blueprint text-paper" : "text-ink/60 hover:text-blueprint"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-9 w-9 rounded-full border border-ink/15 flex items-center justify-center text-ink/60 hover:border-blueprint/40 hover:text-blueprint transition-colors disabled:opacity-30"
                aria-label="Next page"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="rounded-2xl bg-blueprint text-paper px-8 lg:px-16 py-14 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div>
                <h2 className="font-display text-3xl lg:text-4xl font-semibold text-balance">
                  Get new posts in your inbox.
                </h2>
                <p className="text-paper/60 mt-3 max-w-md">
                  No more than twice a month. Unsubscribe whenever you like.
                </p>
              </div>
              <NewsletterForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
