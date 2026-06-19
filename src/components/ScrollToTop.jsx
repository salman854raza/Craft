import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls the window to the top on every route change.
 * Mount once inside <Router> (already done in main.jsx via App.jsx).
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use instant scroll for page transitions — Framer Motion handles the
    // visual fade so we don't want a competing smooth scroll delay.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
