import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, Sun, Ruler, Building2 } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import AnimatedCounter from "../components/AnimatedCounter.jsx";
import BlueprintBuilding from "../components/BlueprintBuilding.jsx";

const SERVICES = [
  {
    icon: Building2,
    title: "Architecture",
    copy: "Ground-up design for residential and commercial sites, from massing studies through construction drawings.",
  },
  {
    icon: Layers,
    title: "Interior Design",
    copy: "Material palettes, lighting plans, and joinery details that finish a building the way it was drawn.",
  },
  {
    icon: Ruler,
    title: "Adaptive Reuse",
    copy: "Reading what a structure already knows — converting mills, warehouses, and chapels into spaces people want.",
  },
  {
    icon: Sun,
    title: "Sustainability Consulting",
    copy: "Passive-first strategies, embodied carbon audits, and material sourcing that holds up to scrutiny.",
  },
];

const PROCESS = [
  { sheet: "A-101", title: "Concept", copy: "Site analysis, client brief, and the first sketches that set the language for everything after." },
  { sheet: "A-102", title: "Documentation", copy: "Detailed drawings, structural coordination, and the specification of every material and fixture." },
  { sheet: "A-103", title: "Permitting", copy: "We carry the submission through planning and building control, so nothing stalls on paperwork." },
  { sheet: "A-104", title: "Construction Oversight", copy: "Site visits and contractor coordination to make sure what's built matches what's drawn." },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative blueprint-grid overflow-hidden min-h-screen flex items-center pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-10 items-center w-full py-16">
          <div>
            <p className="sheet-label text-blueprint-glow mb-5">EST. 1996 — MANCHESTER, UK</p>
            <h1 className="font-display text-paper text-balance text-5xl sm:text-6xl lg:text-[4.2rem] leading-[1.05] font-semibold tracking-tight">
              Every building
              <br />
              starts as a line.
            </h1>
            <p className="text-paper/65 text-lg mt-6 max-w-md leading-relaxed">
              Ashlar Studio is a boutique architecture and interior design
              practice. We take a project from first sketch to final
              inspection, without losing the idea in between.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-9">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-brass text-blueprint-deep px-6 py-3.5 text-sm font-semibold hover:bg-brass-light transition-colors"
              >
                Start a project <ArrowRight size={16} />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-paper/30 text-paper px-6 py-3.5 text-sm font-medium hover:bg-paper/10 transition-colors"
              >
                Our services
              </Link>
            </div>
          </div>

          <div className="relative h-[420px] lg:h-[520px]">
            <BlueprintBuilding className="absolute inset-0 cursor-grab" />
            <p className="sheet-label absolute bottom-2 right-2 text-paper/30">FIG. 01 — MASSING STUDY</p>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 border-t border-paper/10 bg-blueprint-deep/60">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { n: 28, suffix: "", label: "Years practicing" },
              { n: 140, suffix: "+", label: "Projects completed" },
              { n: 96, suffix: "%", label: "Repeat clients" },
              { n: 12, suffix: "", label: "International awards" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl sm:text-3xl font-semibold text-paper">
                  <AnimatedCounter to={s.n} suffix={s.suffix} />
                </p>
                <p className="text-paper/50 text-xs mt-1 sheet-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal direction="right">
            <p className="sheet-label text-brass mb-4">ABOUT THE STUDIO</p>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-blueprint leading-tight text-balance">
              We design buildings that age the way they were intended to.
            </h2>
            <p className="text-concrete mt-6 leading-relaxed max-w-lg">
              Founded by two architects who met restoring a Victorian
              foundry, Ashlar Studio has spent nearly three decades on the
              belief that good design is mostly good judgment — about
              materials, about light, and about what a site is already
              telling you.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 mt-8 text-blueprint font-medium border-b border-blueprint/30 pb-1 hover:border-blueprint transition-colors"
            >
              Read our story <ArrowRight size={15} />
            </Link>
          </Reveal>
          <Reveal direction="left" delay={0.1}>
            <div className="relative crop-marks p-2">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
                alt="Architects reviewing drawings at a studio table"
                className="w-full h-[420px] object-cover rounded-sm"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICES TEASER */}
      <section className="py-24 lg:py-32 bg-blueprint-deep text-paper">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <p className="sheet-label text-brass mb-4">WHAT WE DO</p>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-balance max-w-xl">
              Four disciplines, one continuous process.
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-paper/10 mt-14 rounded-lg overflow-hidden">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08} className="bg-blueprint-deep p-8 hover:bg-blueprint transition-colors duration-300 group">
                <s.icon className="text-blueprint-line group-hover:text-brass transition-colors" size={28} strokeWidth={1.5} />
                <h3 className="font-display text-lg font-semibold mt-6">{s.title}</h3>
                <p className="text-paper/55 text-sm mt-3 leading-relaxed">{s.copy}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 mt-12 text-paper font-medium border-b border-paper/30 pb-1 hover:border-paper transition-colors"
            >
              View all services <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <p className="sheet-label text-brass mb-4">HOW A PROJECT MOVES</p>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-blueprint text-balance max-w-xl">
              From sketch to structure, four sheets at a time.
            </h2>
          </Reveal>

          <div className="grid lg:grid-cols-4 gap-8 mt-16">
            {PROCESS.map((p, i) => (
              <Reveal key={p.sheet} delay={i * 0.1}>
                <p className="font-mono text-brass text-sm">{p.sheet}</p>
                <div className="drafting-rule my-4" />
                <h3 className="font-display text-xl font-semibold text-blueprint">{p.title}</h3>
                <p className="text-concrete text-sm mt-3 leading-relaxed">{p.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="rounded-2xl bg-brass/10 border border-brass/30 px-8 lg:px-16 py-14 text-center">
              <h2 className="font-display text-3xl lg:text-4xl font-semibold text-blueprint text-balance">
                Have a site in mind? Let's draft something for it.
              </h2>
              <p className="text-concrete mt-4 max-w-md mx-auto">
                Tell us about the site, the brief, and the timeline — we'll
                reply within two working days with next steps.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 mt-8 rounded-full bg-blueprint text-paper px-7 py-3.5 text-sm font-semibold hover:bg-blueprint-deep transition-colors"
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
