import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blueprint text-paper">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <svg width="26" height="26" viewBox="0 0 30 30" aria-hidden="true">
                <rect x="1" y="9" width="13" height="20" fill="none" stroke="currentColor" className="text-paper" strokeWidth="1.4" />
                <rect x="16" y="1" width="13" height="28" fill="currentColor" className="text-brass" />
              </svg>
              <span className="font-display text-lg font-semibold">Ashlar Studio</span>
            </div>
            <p className="text-paper/60 text-sm max-w-xs leading-relaxed">
              A boutique architecture and interior design practice working
              across adaptive reuse, residential, and commercial projects —
              from first sketch to final inspection.
            </p>
            <p className="sheet-label text-paper/40 mt-6">EST. 1996 · SHEET A-000</p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-paper/90">Studio</h4>
            <ul className="space-y-2.5 text-sm text-paper/60">
              <li><Link to="/about" className="hover:text-paper transition-colors">About</Link></li>
              <li><Link to="/services" className="hover:text-paper transition-colors">Services</Link></li>
              <li><Link to="/clients" className="hover:text-paper transition-colors">Clients</Link></li>
              <li><Link to="/journal" className="hover:text-paper transition-colors">Journal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-paper/90">Services</h4>
            <ul className="space-y-2.5 text-sm text-paper/60">
              <li><Link to="/services" className="hover:text-paper transition-colors">Architecture</Link></li>
              <li><Link to="/services" className="hover:text-paper transition-colors">Interior Design</Link></li>
              <li><Link to="/services" className="hover:text-paper transition-colors">Adaptive Reuse</Link></li>
              <li><Link to="/pricing" className="hover:text-paper transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-paper/90">Get in touch</h4>
            <ul className="space-y-2.5 text-sm text-paper/60">
              <li>14 Foundry Lane, Studio 3<br />Manchester, M4 5AD</li>
              <li><a href="tel:+441612345678" className="hover:text-paper transition-colors">+44 161 234 5678</a></li>
              <li><a href="mailto:studio@ashlar.design" className="hover:text-paper transition-colors">studio@ashlar.design</a></li>
            </ul>
            <div className="flex gap-4 mt-5">
              <a href="#" aria-label="Instagram" className="text-paper/60 hover:text-paper transition-colors"><Instagram size={18} /></a>
              <a href="#" aria-label="LinkedIn" className="text-paper/60 hover:text-paper transition-colors"><Linkedin size={18} /></a>
              <a href="#" aria-label="Twitter" className="text-paper/60 hover:text-paper transition-colors"><Twitter size={18} /></a>
            </div>
          </div>
        </div>

        <div className="drafting-rule mt-12 mb-6" />

        <div className="flex flex-col sm:flex-row justify-between gap-3 text-xs text-paper/40">
          <p>© {new Date().getFullYear()} Ashlar Studio. All rights reserved.</p>
          <p className="sheet-label">DRAWN — REVISED — BUILT</p>
        </div>
      </div>
    </footer>
  );
}
