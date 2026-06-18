import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Clients", to: "/clients" },
  { label: "Pricing", to: "/pricing" },
  { label: "Journal", to: "/journal" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-paper/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(27,42,61,0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            className="shrink-0"
            aria-hidden="true"
          >
            <rect x="1" y="9" width="13" height="20" fill="none" stroke="currentColor" className={scrolled || open ? "text-blueprint" : "text-paper"} strokeWidth="1.4" />
            <rect x="16" y="1" width="13" height="28" fill="currentColor" className="text-brass" />
          </svg>
          <span
            className={`font-display text-lg font-semibold tracking-tight transition-colors ${
              scrolled || open ? "text-blueprint" : "text-paper"
            }`}
          >
            Ashlar Studio
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `sheet-label text-[0.72rem] tracking-widest2 transition-colors ${
                  scrolled ? "text-ink/70 hover:text-blueprint" : "text-paper/80 hover:text-paper"
                } ${isActive ? (scrolled ? "!text-blueprint" : "!text-paper") : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:block">
          <Link
            to="/contact"
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all border ${
              scrolled
                ? "border-blueprint text-blueprint hover:bg-blueprint hover:text-paper"
                : "border-paper/60 text-paper hover:bg-paper hover:text-blueprint"
            }`}
          >
            Start a project
          </Link>
        </div>

        <button
          className={`lg:hidden p-2 ${scrolled || open ? "text-blueprint" : "text-paper"}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      <div
        className={`lg:hidden grid transition-all duration-300 ease-out bg-paper ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        style={{ overflow: "hidden" }}
      >
        <div className="px-6 pb-8 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `py-3 border-b border-ink/10 font-display text-lg ${
                  isActive ? "text-brass" : "text-ink"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-5 inline-flex justify-center rounded-full bg-blueprint text-paper px-5 py-3 text-sm font-medium"
          >
            Start a project
          </Link>
        </div>
      </div>
    </header>
  );
}
