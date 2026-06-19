import { useEffect } from "react";

const SITE_NAME = "Ashlar Studio";

const PAGE_META = {
  "/": {
    title: "Ashlar Studio — Architecture & Interior Design",
    description:
      "Boutique architecture and interior design practice in Manchester. Adaptive reuse, sustainable materials, and quiet structural confidence from first brief to practical completion.",
  },
  "/about": {
    title: "About — Ashlar Studio",
    description:
      "Twenty-eight years of buildings completed, restored, and loved. Learn about the studio, our process, and the team behind each project.",
  },
  "/services": {
    title: "Services — Ashlar Studio",
    description:
      "Architecture, interior design, adaptive reuse, heritage conservation, and passive house design. One studio, full delivery.",
  },
  "/clients": {
    title: "Clients — Ashlar Studio",
    description:
      "Developers, trusts, and homeowners who trusted us with their buildings. Case studies, testimonials, and a list of organisations we've worked with.",
  },
  "/pricing": {
    title: "Pricing — Ashlar Studio",
    description:
      "Transparent, fixed-fee engagement models. From a one-hour consultation to full design-and-build oversight — scoped before any fee is agreed.",
  },
  "/journal": {
    title: "Journal — Ashlar Studio",
    description:
      "Notes from the studio: process write-ups, material research, case study deep-dives, and the occasional opinion on planning policy.",
  },
  "/contact": {
    title: "Contact — Ashlar Studio",
    description:
      "Tell us about your site. A named project architect will reply within two working days.",
  },
};

const DEFAULT_META = {
  title: SITE_NAME,
  description:
    "Ashlar Studio — a boutique architecture and interior design practice in Manchester.",
};

/**
 * Sets document.title and the <meta name="description"> for the current page.
 * Call at the top of every page component.
 *
 * @param {string} path - The current pathname, e.g. "/about"
 */
export default function usePageMeta(path) {
  useEffect(() => {
    const meta = PAGE_META[path] || DEFAULT_META;

    document.title = meta.title;

    let descEl = document.querySelector('meta[name="description"]');
    if (descEl) {
      descEl.setAttribute("content", meta.description);
    }
  }, [path]);
}
