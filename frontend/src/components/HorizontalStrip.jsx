import { motion, useReducedMotion } from "framer-motion";
import { stripImages } from "../data";
import { ScrollReveal } from "./ScrollReveal";

export function HorizontalStrip() {
  const reduce = useReducedMotion();

  return (
    <section className="border-y border-white/5 bg-void py-20">
      <ScrollReveal className="px-6 sm:px-10 lg:px-16">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-accent">Selected frames</p>
        <h2 className="mt-3 font-display text-3xl text-bone sm:text-4xl">A continuous reel</h2>
        <p className="mt-3 max-w-xl font-sans text-sm text-mist">
          Swipe or scroll horizontally — each frame is part of a longer visual rhythm.
        </p>
      </ScrollReveal>

      <div className="relative mt-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent sm:w-24" />

        <div
          className="flex gap-4 overflow-x-auto px-6 pb-6 pt-2 [scrollbar-width:none] sm:gap-6 sm:px-10 lg:px-16 [&::-webkit-scrollbar]:hidden snap-x snap-mandatory scroll-smooth"
        >
          {stripImages.map((src, i) => (
            <motion.figure
              key={src}
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="relative shrink-0 snap-center first:pl-0"
            >
              <div className="h-[42vw] max-h-[320px] w-[68vw] max-w-[480px] overflow-hidden rounded-sm sm:h-[38vw] sm:max-h-[380px] sm:w-[52vw] sm:max-w-[560px]">
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <figcaption className="mt-3 font-sans text-[10px] uppercase tracking-widest text-mist">
                Frame {String(i + 1).padStart(2, "0")}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
