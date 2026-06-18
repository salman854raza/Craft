import React from "react";
import { motion } from "framer-motion";

export default function PageHero({ sheet, title, kicker }) {
  return (
    <section className="relative blueprint-grid overflow-hidden pt-40 pb-20 lg:pt-48 lg:pb-28">
      <div className="absolute inset-0 bg-gradient-to-b from-blueprint-deep/40 via-transparent to-paper pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sheet-label text-blueprint-glow mb-4"
        >
          {sheet}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-paper text-balance text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight max-w-3xl"
        >
          {title}
        </motion.h1>
        {kicker && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-paper/60 mt-5 max-w-xl text-base lg:text-lg"
          >
            {kicker}
          </motion.p>
        )}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-gradient-to-r from-brass via-blueprint-line to-transparent mt-10 max-w-md origin-left"
        />
      </div>
    </section>
  );
}
