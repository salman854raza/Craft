import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <p className="sheet-label text-brass mb-3">SHEET NOT FOUND</p>
      <h1 className="font-display text-5xl font-semibold text-blueprint mb-4">404</h1>
      <p className="text-concrete max-w-sm mb-8">
        This drawing hasn't been filed yet. Let's get you back to a page that exists.
      </p>
      <Link
        to="/"
        className="inline-flex items-center rounded-full bg-blueprint text-paper px-6 py-3 text-sm font-medium hover:bg-blueprint-deep transition-colors"
      >
        Back to home
      </Link>
    </section>
  );
}
