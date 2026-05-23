import { useRef } from "react";
import { motion } from "framer-motion";
import { processSteps } from "../data";

/* ─── easing ──────────────────────────────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1];

/* ─── variants ────────────────────────────────────────────────────────────── */
const headerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const lineVariant = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

const stepVariant = {
  hidden:  { opacity: 0, y: 36 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: i * 0.08 },
  }),
};

/* ─── Process ─────────────────────────────────────────────────────────────── */
export function Process() {
  return (
    <section
      id="process"
      className="relative z-20 border-t border-white/[0.05] bg-[var(--void)]"
      aria-label="Our process and methodology"
    >
      {/* ── top breathing room ─────────────────────────────────────────────── */}
      <div className="pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28 px-5 sm:px-8 lg:px-20">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14 lg:mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-6"
        >
          <div>
            <motion.p
              variants={lineVariant}
              className="font-mono text-[9px] uppercase tracking-[0.5em] text-accent mb-3"
            >
              Methodology
            </motion.p>
            <motion.h2
              variants={lineVariant}
              className="font-display text-5xl sm:text-6xl lg:text-[5rem] text-bone tracking-[-0.03em] leading-none"
            >
              The <span className="italic text-accent">Process</span>
            </motion.h2>
          </div>

          <motion.p
            variants={lineVariant}
            className="font-sans text-sm lg:text-base text-mist/55 leading-relaxed max-w-sm border-l border-white/[0.06] pl-5 lg:pb-1"
          >
            A structured yet fluid approach to visual storytelling. Every
            project follows a deliberate path from discovery to final delivery.
          </motion.p>
        </motion.div>

        {/* ── Steps grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.05]">
          {processSteps.map((step, i) => (
            <motion.div
              key={step.num}
              custom={i}
              variants={stepVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="relative group bg-[var(--void)] p-7 sm:p-8 lg:p-10 flex flex-col gap-6 overflow-hidden"
            >
              {/* phase label */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] uppercase tracking-[0.5em] text-accent/60">
                  Phase {step.num}
                </span>
                {/* animated accent line */}
                <span
                  className="h-[1px] w-6 bg-accent/20 group-hover:w-12 transition-all duration-700"
                  aria-hidden="true"
                />
              </div>

              {/* step title */}
              <h3 className="font-display text-3xl sm:text-4xl text-bone tracking-[-0.02em] leading-none uppercase group-hover:text-accent transition-colors duration-500">
                {step.title}
              </h3>

              {/* divider */}
              <div className="h-[1px] w-8 bg-accent/25" aria-hidden="true" />

              {/* body */}
              <p className="font-sans text-sm text-mist/55 leading-relaxed flex-1">
                {step.body}
              </p>

              {/* ghost number — absolutely positioned, purely decorative */}
              <span
                className="
                  absolute -bottom-3 -right-1
                  font-display text-[6rem] sm:text-[7rem] leading-none
                  text-bone/[0.03] select-none pointer-events-none
                  group-hover:text-accent/[0.04] transition-colors duration-700
                "
                aria-hidden="true"
              >
                {step.num}
              </span>

              {/* corner accent */}
              <span
                className="absolute top-4 right-4 w-3 h-3 border-t border-r border-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </div>

        {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.25 }}
          className="mt-12 lg:mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-t border-white/[0.05] pt-8"
        >
          <p className="font-display text-xl sm:text-2xl text-bone/45 tracking-[-0.01em]">
            Your story starts with{" "}
            <span className="italic text-accent/65">phase 01.</span>
          </p>

          <a
            href="#contact"
            className="
              group relative overflow-hidden rounded-[2px]
              border border-accent/25 hover:border-accent
              px-7 py-3
              font-mono text-[9px] uppercase tracking-[0.3em] text-bone
              transition-[border-color] duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
              shrink-0
            "
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-void">
              Begin Discovery
            </span>
            <span
              className="absolute inset-0 bg-accent translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
              aria-hidden="true"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
