import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, BadgeDollarSign, Scale, UserCheck, Check, ChevronDown } from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import usePageMeta from "../hooks/usePageMeta.js";

const TRUST_POINTS = [
  { icon: ShieldCheck, title: "Fixed-fee certainty", copy: "Scope is agreed before work starts — no creeping hourly invoices." },
  { icon: BadgeDollarSign, title: "Staged payments", copy: "Fees release at agreed project milestones, not in one lump sum." },
  { icon: Scale, title: "No hidden costs", copy: "Planning fees, surveys, and consultant costs are itemised up front." },
  { icon: UserCheck, title: "One point of contact", copy: "A named project architect from first call through to completion." },
];

const TIERS = [
  {
    name: "Consultation",
    price: "450",
    unit: "/ session",
    description: "A single working session to pressure-test feasibility before you commit to a full design fee.",
    features: [
      "90-minute site or studio consultation",
      "Feasibility & risk summary",
      "Indicative budget range",
      "Written recommendation",
    ],
    highlight: false,
  },
  {
    name: "Design & Planning",
    price: "From 8,500",
    unit: "/ project",
    description: "Full concept-to-planning-approval service for single-site residential or small commercial projects.",
    features: [
      "Measured survey & feasibility study",
      "Concept & developed design",
      "Full planning application",
      "Up to 3 design revisions",
      "Named project architect",
    ],
    highlight: true,
  },
  {
    name: "Full-Service Delivery",
    price: "Custom",
    unit: "quoted per scope",
    description: "Design through to construction oversight for larger or more complex adaptive reuse and commercial work.",
    features: [
      "Everything in Design & Planning",
      "Technical & construction drawings",
      "Contractor tendering support",
      "Site inspections through to completion",
      "Sustainability & embodied carbon review",
    ],
    highlight: false,
  },
];

const FAQS = [
  {
    q: "How is pricing actually determined?",
    a: "We scope every project individually based on size, complexity, and how much existing structure we're working around. The Consultation tier exists specifically to get you a firm number before any design fee is agreed.",
  },
  {
    q: "Do you work on listed or heritage buildings?",
    a: "Yes — conservation and listed building consent is one of our core specialisms, particularly for mill, warehouse, and chapel conversions.",
  },
  {
    q: "What's included in the design fee versus billed separately?",
    a: "Design, planning submission, and our own drawings are included in the quoted fee. Third-party costs — structural engineering, party wall surveys, planning application fees to the council — are itemised separately and approved by you before we instruct them.",
  },
  {
    q: "Can I hire you for part of a project only?",
    a: "Yes. Some clients only need planning drawings and use their own contractor's architect for construction detailing. We're happy to scope a partial engagement.",
  },
  {
    q: "How long does a typical residential project take?",
    a: "From first consultation to planning decision is usually 3–5 months. Construction-ready drawings add another 4–8 weeks depending on complexity.",
  },
];

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-ink/10">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left gap-4"
        aria-expanded={isOpen}
      >
        <span className="font-display text-lg font-semibold text-blueprint">{faq.q}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="text-brass shrink-0" size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-concrete leading-relaxed pb-6 max-w-2xl">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Pricing() {
  usePageMeta("/pricing");
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <PageHero
        sheet="SHEET P-000 — PRICING"
        title="Transparent engagement models, scoped to your project."
        kicker="Three ways to start working with us — from a single advisory session to full design-and-build oversight."
      />

      {/* TRUST STRIP */}
      <section className="py-16 border-b border-ink/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-10">
          {TRUST_POINTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} className="text-center">
              <div className="h-14 w-14 rounded-full bg-blueprint/5 flex items-center justify-center mx-auto">
                <p.icon className="text-blueprint" size={24} strokeWidth={1.6} />
              </div>
              <h3 className="font-display text-sm font-semibold text-blueprint mt-4">{p.title}</h3>
              <p className="text-concrete text-xs mt-2 leading-relaxed">{p.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TIERS */}
      <section className="py-24 lg:py-28 bg-stone/20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="text-center max-w-xl mx-auto">
            <p className="sheet-label text-brass mb-4">ENGAGEMENT MODELS</p>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-blueprint text-balance">
              Tailored plans, no surprises at invoice time.
            </h2>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-7 mt-16 items-start">
            {TIERS.map((tier, i) => (
              <Reveal
                key={tier.name}
                delay={i * 0.1}
                className={`rounded-2xl p-8 flex flex-col h-full ${
                  tier.highlight
                    ? "bg-blueprint text-paper shadow-[0_20px_50px_-20px_rgba(27,42,61,0.5)] lg:-translate-y-3"
                    : "bg-paper border border-ink/10"
                }`}
              >
                {tier.highlight && (
                  <span className="sheet-label text-brass mb-3">MOST CHOSEN</span>
                )}
                <h3 className={`font-display text-xl font-semibold ${tier.highlight ? "text-paper" : "text-blueprint"}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm mt-3 leading-relaxed ${tier.highlight ? "text-paper/65" : "text-concrete"}`}>
                  {tier.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className={`font-display text-3xl font-semibold ${tier.highlight ? "text-paper" : "text-blueprint"}`}>
                    {tier.price !== "Custom" ? `£${tier.price}` : tier.price}
                  </span>
                  <span className={`text-xs ${tier.highlight ? "text-paper/50" : "text-concrete"}`}>{tier.unit}</span>
                </div>
                <ul className="mt-7 space-y-3 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check size={16} className={`mt-0.5 shrink-0 ${tier.highlight ? "text-brass-light" : "text-brass"}`} />
                      <span className={tier.highlight ? "text-paper/85" : "text-ink/75"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-colors ${
                    tier.highlight
                      ? "bg-brass text-blueprint-deep hover:bg-brass-light"
                      : "bg-blueprint text-paper hover:bg-blueprint-deep"
                  }`}
                >
                  Get started <ArrowRight size={15} />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Reveal className="text-center mb-14">
            <p className="sheet-label text-brass mb-4">QUESTIONS</p>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-blueprint text-balance">
              Before you reach out.
            </h2>
          </Reveal>
          <Reveal>
            {FAQS.map((faq, i) => (
              <FaqItem
                key={faq.q}
                faq={faq}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="text-center">
            <p className="text-concrete">
              Still not sure which model fits?{" "}
              <Link to="/contact" className="text-blueprint font-medium border-b border-blueprint/30 hover:border-blueprint transition-colors">
                Contact our team
              </Link>{" "}
              to get a tailored quote.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
