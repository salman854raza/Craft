import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import usePageMeta from "../hooks/usePageMeta.js";

const LOGOS = [
  "Greenford Developments",
  "Northbank Capital",
  "Heritage Trust",
  "Selkie Homes",
  "Mill & Co.",
  "Stonegate Partners",
  "Civic Land",
  "Bellwood Estates",
];

const TESTIMONIALS = [
  {
    name: "Helena Marsh",
    role: "Development Director, Greenford Developments",
    quote:
      "Ashlar took a derelict mill nobody else wanted to touch and turned it into the best-performing asset in our portfolio. They scoped the structural risk honestly from day one — no surprises at tender.",
  },
  {
    name: "Robert Adeyemi",
    role: "Founder, Selkie Homes",
    quote:
      "What stood out was how little we had to manage. Drawings, planning, contractor coordination — it all moved through one team instead of three consultants pointing fingers at each other.",
  },
  {
    name: "Charlotte Yin",
    role: "Estates Manager, Heritage Trust",
    quote:
      "We needed an architect who understood listed building consent inside and out. Ashlar's conservation knowledge saved us two rounds of committee resubmission.",
  },
  {
    name: "Marcus Webb",
    role: "Principal, Northbank Capital",
    quote:
      "Five projects in six years and counting. The reporting is clear, the budgets hold, and the buildings consistently lease faster than projected.",
  },
];

const CASE_STUDIES = [
  {
    name: "The Founders' Mill",
    location: "Stockport, UK",
    type: "Adaptive Reuse · 42,000 sqft",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Birchgate Residence",
    location: "Peak District, UK",
    type: "Passive House · 3,400 sqft",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Selkie Coastal Offices",
    location: "Brighton, UK",
    type: "Commercial Fit-Out · 18,000 sqft",
    img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function Clients() {
  usePageMeta("/clients");
  return (
    <>
      <PageHero
        sheet="SHEET C-000 — CLIENTS"
        title="Built across sectors, trusted by the people who commission buildings."
        kicker="Developers, trusts, and homeowners who needed a studio that could carry a project from planning risk to practical completion."
      />

      {/* LOGOS */}
      <section className="py-20 border-b border-ink/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="sheet-label text-concrete text-center mb-10">
            ORGANISATIONS WE'VE DESIGNED, RESTORED, AND BUILT FOR
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-10 gap-y-10 place-items-center">
            {LOGOS.map((l, i) => (
              <Reveal key={l} delay={i * 0.05}>
                <span className="font-display text-lg text-ink/40 hover:text-blueprint transition-colors cursor-default">
                  {l}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 lg:py-28 bg-stone/20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="text-center max-w-xl mx-auto">
            <p className="sheet-label text-brass mb-4">CLIENT SPEAKS</p>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-blueprint text-balance">
              What it's like working with the studio.
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-6 mt-16">
            {TESTIMONIALS.map((t, i) => (
              <Reveal
                key={t.name}
                delay={i * 0.08}
                className="bg-paper rounded-lg p-8 border border-ink/10"
              >
                <div className="flex gap-1 text-brass mb-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={16} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="text-ink/80 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 mt-6">
                  <div className="h-10 w-10 rounded-full bg-blueprint/10 flex items-center justify-center font-display text-sm font-semibold text-blueprint">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-blueprint">{t.name}</p>
                    <p className="text-concrete text-xs">{t.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="sheet-label text-brass mb-4">SELECTED WORK</p>
              <h2 className="font-display text-4xl lg:text-5xl font-semibold text-blueprint text-balance max-w-xl">
                A few projects we're proud to put a name to.
              </h2>
            </div>
            <Link
              to="/journal"
              className="inline-flex items-center gap-2 text-blueprint font-medium border-b border-blueprint/30 pb-1 hover:border-blueprint transition-colors shrink-0"
            >
              Read the journal <ArrowRight size={15} />
            </Link>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {CASE_STUDIES.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.08} className="group crop-marks p-1.5">
                <div className="overflow-hidden rounded-sm">
                  <img
                    src={c.img}
                    alt={c.name}
                    className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-display text-lg font-semibold text-blueprint mt-4">{c.name}</h3>
                <p className="text-concrete text-sm">{c.location}</p>
                <p className="sheet-label text-brass/80 mt-1">{c.type}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="rounded-2xl bg-blueprint text-paper px-8 lg:px-16 py-14 text-center">
              <h2 className="font-display text-3xl lg:text-4xl font-semibold text-balance">
                Want to be the next name on this page?
              </h2>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 mt-8 rounded-full bg-brass text-blueprint-deep px-7 py-3.5 text-sm font-semibold hover:bg-brass-light transition-colors"
              >
                Start a project <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
