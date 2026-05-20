import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "../data";
import { ScrollReveal } from "./ScrollReveal";

export function Testimonials() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32 bg-graphite border-y border-white/5">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-accent">Testimonials</p>
          <h2 className="mt-3 font-display text-4xl text-bone sm:text-5xl">What clients say</h2>
        </ScrollReveal>

        <div className="mt-16 grid lg:grid-cols-12 lg:gap-16 lg:items-center">
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="font-display text-8xl text-accent/20 select-none leading-none block">"</span>
                <p className="font-display text-2xl leading-snug text-bone sm:text-3xl text-balance -mt-4">
                  {t.quote}
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-px w-8 bg-accent/60" />
                  <div>
                    <p className="font-sans text-sm text-bone">{t.author}</p>
                    <p className="font-sans text-xs text-mist">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-12 lg:mt-0 lg:col-span-4 lg:col-start-9 flex flex-col gap-4">
            {testimonials.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setActive(i)}
                className={`text-left border-l-2 pl-5 py-3 transition-all duration-300 ${
                  i === active
                    ? "border-accent"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <p className={`font-sans text-sm transition-colors ${i === active ? "text-bone" : "text-mist"}`}>
                  {item.author}
                </p>
                <p className="font-sans text-xs text-mist/60">{item.role}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
