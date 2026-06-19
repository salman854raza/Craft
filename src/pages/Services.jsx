import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Layers,
  Ruler,
  Sun,
  Map,
  HardHat,
} from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import usePageMeta from "../hooks/usePageMeta.js";

const SERVICES = [
  {
    icon: Building2,
    title: "Architecture",
    sheet: "S-01",
    copy: "Ground-up design across residential and commercial typologies — from feasibility studies through to construction-ready drawings.",
    points: ["Feasibility & massing studies", "Planning applications", "Technical & construction drawings"],
  },
  {
    icon: Layers,
    title: "Interior Design",
    sheet: "S-02",
    copy: "Material palettes, lighting design, and joinery detailing that carry a project's idea through to its finishes.",
    points: ["Material & finishes specification", "Lighting design", "Bespoke joinery & fit-out"],
  },
  {
    icon: Ruler,
    title: "Adaptive Reuse",
    sheet: "S-03",
    copy: "Converting mills, warehouses, and chapels into spaces that work today, without erasing what made them worth keeping.",
    points: ["Heritage & conservation surveys", "Structural retrofit coordination", "Change-of-use applications"],
  },
  {
    icon: Sun,
    title: "Sustainability Consulting",
    sheet: "S-04",
    copy: "Passive-first design strategy, embodied carbon auditing, and material sourcing built to hold up under scrutiny.",
    points: ["Embodied carbon audits", "Passive house strategy", "Material sourcing & supply chain review"],
  },
  {
    icon: Map,
    title: "Urban Planning",
    sheet: "S-05",
    copy: "Masterplanning and site strategy for developers working across multiple plots or phased delivery.",
    points: ["Masterplan strategy", "Density & massing modelling", "Stakeholder & community consultation"],
  },
  {
    icon: HardHat,
    title: "Construction Oversight",
    sheet: "S-06",
    copy: "Site visits, contractor coordination, and snagging — making sure what gets built matches what was drawn.",
    points: ["Contractor administration", "Site inspections", "Practical completion & snagging"],
  },
];

export default function Services() {
  usePageMeta("/services");
  return (
    <>
      <PageHero
        sheet="SHEET S-000 — SERVICES"
        title="Six disciplines. One continuous process."
        kicker="Most projects use several of these at once — we coordinate them under one roof so nothing gets lost in handoff."
      />

      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <Reveal
                key={s.title}
                delay={(i % 3) * 0.08}
                className="group relative border border-ink/10 rounded-lg p-7 hover:border-brass/50 hover:shadow-[0_10px_30px_-15px_rgba(27,42,61,0.25)] transition-all duration-300"
              >
                <p className="sheet-label text-concrete/60 absolute top-6 right-7">{s.sheet}</p>
                <div className="h-12 w-12 rounded-full bg-blueprint/5 flex items-center justify-center group-hover:bg-brass/15 transition-colors">
                  <s.icon className="text-blueprint group-hover:text-brass transition-colors" size={22} strokeWidth={1.6} />
                </div>
                <h3 className="font-display text-xl font-semibold text-blueprint mt-6">{s.title}</h3>
                <p className="text-concrete text-sm mt-3 leading-relaxed">{s.copy}</p>
                <ul className="mt-5 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-ink/70">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-brass shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DEDICATED SECTION */}
      <section className="py-24 lg:py-28 bg-stone/20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal direction="right">
            <p className="sheet-label text-brass mb-4">WHY ASHLAR</p>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-blueprint leading-tight text-balance">
              One studio, end to end — no handoffs between firms.
            </h2>
            <p className="text-concrete mt-6 leading-relaxed max-w-lg">
              Architecture, interiors, and sustainability strategy are
              usually split across separate consultants. We keep them
              together, which means fewer redrawn details, fewer
              contradicting specs, and a single point of accountability
              from first sketch to final inspection.
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 mt-8 text-blueprint font-medium border-b border-blueprint/30 pb-1 hover:border-blueprint transition-colors"
            >
              See pricing &amp; packages <ArrowRight size={15} />
            </Link>
          </Reveal>
          <Reveal direction="left" delay={0.1} className="crop-marks p-2">
            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop"
              alt="Architectural model and material samples on a studio table"
              className="w-full h-[440px] object-cover rounded-sm"
              loading="lazy"
            />
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="rounded-2xl bg-blueprint text-paper px-8 lg:px-16 py-14 text-center">
              <h2 className="font-display text-3xl lg:text-4xl font-semibold text-balance">
                Not sure which service your project needs?
              </h2>
              <p className="text-paper/60 mt-3 max-w-md mx-auto">
                Tell us what you're working with — we'll scope it for you.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 mt-8 rounded-full bg-brass text-blueprint-deep px-7 py-3.5 text-sm font-semibold hover:bg-brass-light transition-colors"
              >
                Talk to the studio <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
