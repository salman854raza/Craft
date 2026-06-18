import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import AnimatedCounter from "../components/AnimatedCounter.jsx";

const TIMELINE = [
  { year: "1996", title: "Studio founded", copy: "Two architects, one drafting table, and a converted shopfront in Manchester." },
  { year: "2004", title: "First RIBA award", copy: "Recognised for the conversion of a disused canal warehouse into artist studios." },
  { year: "2014", title: "Relocated headquarters", copy: "Moved into the Foundry Lane building — itself one of our adaptive reuse projects." },
  { year: "2023", title: "100th project completed", copy: "Crossed the century mark with a passive-house residence in the Peak District." },
];

const TEAM = [
  { name: "Imogen Hale", role: "Founding Partner, Architecture", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" },
  { name: "Daniel Osei", role: "Founding Partner, Interiors", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop" },
  { name: "Priya Chandran", role: "Director of Sustainability", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop" },
  { name: "Marcus Webb", role: "Senior Project Architect", img: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=600&auto=format&fit=crop" },
];

const LOGOS = ["Greenford Developments", "Mill & Co.", "Northbank Capital", "Heritage Trust", "Selkie Homes"];

export default function About() {
  return (
    <>
      <PageHero
        sheet="SHEET A-000 — ABOUT"
        title="A studio built on restraint and good judgment."
        kicker="Twenty-eight years of architecture and interior design, still run by the two people who started it."
      />

      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal direction="right" className="crop-marks p-2">
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop"
              alt="Two architects discussing a drawing at a studio desk"
              className="w-full h-[460px] object-cover rounded-sm"
              loading="lazy"
            />
          </Reveal>
          <Reveal direction="left" delay={0.1}>
            <p className="sheet-label text-brass mb-4">OUR PHILOSOPHY</p>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-blueprint leading-tight text-balance">
              We'd rather the building speak than the portfolio.
            </h2>
            <p className="text-concrete mt-6 leading-relaxed">
              Most of our work begins with a site that already has an
              opinion — a warehouse with good bones, a terrace with the
              wrong windows, a plot with light coming from the wrong
              direction. We spend the first weeks listening to that before
              we draw anything.
            </p>
            <p className="text-concrete mt-4 leading-relaxed">
              That discipline is why clients come back: not for a signature
              style, but for a process that consistently produces buildings
              that work the way they were meant to.
            </p>
            <div className="flex items-center gap-10 mt-10">
              <div>
                <p className="font-display text-4xl font-semibold text-blueprint">
                  <AnimatedCounter to={28} />
                </p>
                <p className="sheet-label text-concrete mt-1">Years practicing</p>
              </div>
              <div className="h-12 w-px bg-ink/10" />
              <div>
                <p className="font-display text-4xl font-semibold text-blueprint">
                  <AnimatedCounter to={6} />
                </p>
                <p className="sheet-label text-concrete mt-1">Partners &amp; associates</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 lg:py-28 bg-stone/20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <p className="sheet-label text-brass mb-4">STUDIO TIMELINE</p>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-blueprint text-balance max-w-xl">
              Four moments that shaped how we work.
            </h2>
          </Reveal>

          <div className="mt-16 grid lg:grid-cols-4 gap-8">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.1}>
                <p className="font-display text-3xl font-semibold text-brass">{t.year}</p>
                <div className="drafting-rule my-4" />
                <h3 className="font-display text-lg font-semibold text-blueprint">{t.title}</h3>
                <p className="text-concrete text-sm mt-2 leading-relaxed">{t.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="text-center max-w-xl mx-auto">
            <p className="sheet-label text-brass mb-4 text-center">THE PEOPLE</p>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-blueprint text-balance">
              A small studio, deliberately.
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {TEAM.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.08} className="group">
                <div className="overflow-hidden rounded-sm">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-display text-lg font-semibold text-blueprint mt-4">{member.name}</h3>
                <p className="text-concrete text-sm">{member.role}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <section className="py-16 border-y border-ink/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="sheet-label text-concrete text-center mb-8">TRUSTED BY DEVELOPERS, TRUSTS, AND HOMEOWNERS ACROSS THE UK</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            {LOGOS.map((l) => (
              <span key={l} className="font-display text-lg text-ink/35">{l}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="rounded-2xl bg-blueprint text-paper px-8 lg:px-16 py-14 text-center">
              <h2 className="font-display text-3xl lg:text-4xl font-semibold text-balance">
                Curious how we'd approach your site?
              </h2>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 mt-8 rounded-full bg-brass text-blueprint-deep px-7 py-3.5 text-sm font-semibold hover:bg-brass-light transition-colors"
              >
                Get in touch <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
