import React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import usePageMeta from "../hooks/usePageMeta.js";
import ContactForm from "../components/ContactForm.jsx";

export default function Contact() {
  usePageMeta("/contact");
  return (
    <>
      <PageHero
        sheet="SHEET K-000 — CONTACT"
        title="Tell us about your site."
        kicker="The more detail you give us up front — site, timeline, budget range — the faster we can give you a useful answer."
      />

      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-[0.85fr_1.15fr] gap-12">
          {/* STUDIO INFO */}
          <Reveal direction="right">
            <div className="bg-blueprint text-paper rounded-2xl p-9 h-full flex flex-col">
              <p className="sheet-label text-brass mb-2">KEEP IN TOUCH</p>
              <h2 className="font-display text-2xl font-semibold leading-snug">
                14 Foundry Lane, Studio 3<br />Manchester, M4 5AD
              </h2>

              <div className="drafting-rule my-7" />

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-brass-light mt-0.5 shrink-0" />
                  <div>
                    <p className="sheet-label text-paper/50 mb-1">STUDIO LINE</p>
                    <a href="tel:+441612345678" className="text-paper/85 hover:text-paper transition-colors">+44 161 234 5678</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-brass-light mt-0.5 shrink-0" />
                  <div>
                    <p className="sheet-label text-paper/50 mb-1">EMAIL</p>
                    <a href="mailto:studio@ashlar.design" className="text-paper/85 hover:text-paper transition-colors">studio@ashlar.design</a>
                    <br />
                    <a href="mailto:projects@ashlar.design" className="text-paper/85 hover:text-paper transition-colors">projects@ashlar.design</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-brass-light mt-0.5 shrink-0" />
                  <div>
                    <p className="sheet-label text-paper/50 mb-1">STUDIO HOURS</p>
                    <p className="text-paper/85">Mon–Fri, 9:00–17:30 GMT</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-10">
                <p className="text-paper/40 text-xs leading-relaxed">
                  For urgent structural or safety concerns on an active site,
                  call the studio line directly rather than using this form.
                </p>
              </div>
            </div>
          </Reveal>

          {/* FORM */}
          <Reveal direction="left" delay={0.1}>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-blueprint text-balance">
              Feel free to reach via the form below.
            </h2>
            <p className="text-concrete mt-3 mb-9">
              We reply to every enquiry personally — usually within two working days.
            </p>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* STYLISED LOCATION GRAPHIC */}
      <section className="relative h-[420px] blueprint-grid overflow-hidden border-t border-blueprint-line/20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blueprint-deep/60 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
          <Reveal className="flex flex-col items-center">
            <div className="relative">
              <MapPin size={42} className="text-brass drop-shadow-[0_0_12px_rgba(168,116,60,0.6)]" />
              <span className="absolute -inset-3 rounded-full border border-brass/40 animate-ping" />
            </div>
            <p className="sheet-label text-paper/70 mt-5">FOUNDRY LANE, MANCHESTER M4 5AD</p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Manchester+M4+5AD"
              target="_blank"
              rel="noreferrer"
              className="text-paper text-sm mt-2 border-b border-paper/30 hover:border-paper transition-colors"
            >
              Open in Maps ↗
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
