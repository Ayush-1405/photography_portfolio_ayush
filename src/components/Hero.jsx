import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { heroImage } from "../data";

export function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], reduce ? [0, 0] : [0, 120]);
  const opacity = useTransform(scrollY, [0, 400], reduce ? [1, 1] : [1, 0.35]);

  return (
    <header className="relative min-h-[100dvh] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 scale-105">
        <img
          src={heroImage}
          alt=""
          className="h-full w-full object-cover brightness-[0.45]"
          loading="eager"
          decoding="async"
          crossOrigin="anonymous"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay animate-grain"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </motion.div>
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 bg-gradient-to-b from-void/20 via-void/50 to-ink"
      />

      <div className="relative z-10 flex min-h-[100dvh] flex-col justify-end px-6 pb-16 pt-28 sm:px-10 lg:px-16 lg:pb-24">
        <motion.p
          className="mb-4 font-sans text-xs uppercase tracking-[0.35em] text-mist"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Photography & visual stories
        </motion.p>
        <motion.h1
          className="font-display text-5xl font-medium leading-[0.95] text-bone sm:text-7xl lg:text-8xl"
          initial={reduce ? false : { opacity: 0, y: 32 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          Light carved
          <br />
          <span className="text-accent/90 italic">into stillness</span>
        </motion.h1>
        <motion.p
          className="mt-8 max-w-md font-sans text-sm font-light leading-relaxed text-mist"
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
        >
          Editorial landscapes, intimate portraits, and commissioned work — crafted with restraint and
          intent.
        </motion.p>
        <motion.div
          className="mt-14 flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.4em] text-mist"
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          transition={{ delay: 1 }}
          aria-hidden
        >
          <span className="h-px w-12 bg-accent/60" />
          Scroll
        </motion.div>
      </div>
    </header>
  );
}
