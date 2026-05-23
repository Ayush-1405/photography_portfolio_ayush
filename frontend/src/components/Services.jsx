import { useRef } from "react";
import { motion } from "framer-motion";
import { services } from "../data";

/* ─── easing ──────────────────────────────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1];

/* ─── variants ────────────────────────────────────────────────────────────── */
const headerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const lineVariant = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 48 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE, delay: i * 0.1 },
  }),
};

/* ─── ServiceCard ─────────────────────────────────────────────────────────── */
function ServiceCard({ svc, index }) {
  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="
        group relative flex flex-col
        border border-white/[0.07] rounded-[2px]
        bg-white/[0.02] backdrop-blur-sm
        p-8 lg:p-10
        hover:border-accent/25 hover:bg-white/[0.035]
        transition-[border-color,background-color] duration-700
        overflow-hidden
      "
      aria-label={`Service: ${svc.title}`}
    >
      {/* top row */}
      <div className="flex items-start justify-between mb-8">
        <span className="font-mono text-[9px] uppercase tracking-[0.45em] text-accent/70">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className="h-[1px] w-8 bg-accent/20 group-hover:w-16 transition-all duration-700 mt-[7px]"
          aria-hidden="true"
        />
      </div>

      {/* title */}
      <h3 className="font-display text-4xl lg:text-5xl text-bone tracking-[-0.02em] leading-none mb-4 group-hover:text-accent transition-colors duration-500">
        {svc.title}
      </h3>

      {/* tagline */}
      <p className="font-sans text-sm text-mist/60 leading-relaxed mb-8 max-w-xs">
        {svc.tagline}
      </p>

      {/* divider */}
      <div className="h-[1px] w-full bg-white/[0.05] mb-8" aria-hidden="true" />

      {/* items list */}
      <ul className="flex flex-col gap-3 flex-1" role="list">
        {svc.items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 font-mono text-[9px] uppercase tracking-[0.25em] text-bone/50 group-hover:text-bone/65 transition-colors duration-500"
          >
            <span
              className="mt-[5px] h-[3px] w-[3px] rounded-full bg-accent/50 shrink-0"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-10 pt-8 border-t border-white/[0.05]">
        <a
          href="#contact"
          className="
            inline-flex items-center gap-3
            font-mono text-[9px] uppercase tracking-[0.35em]
            text-accent/60 hover:text-accent
            transition-colors duration-300
            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/50
            group/cta
          "
          aria-label={`Inquire about ${svc.title}`}
        >
          <span>Inquire</span>
          <span
            className="h-[1px] w-6 bg-accent/40 group-hover/cta:w-10 transition-all duration-500"
            aria-hidden="true"
          />
        </a>
      </div>

      {/* corner accents */}
      <span className="absolute top-5 left-5 w-3 h-3 border-t border-l border-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true" />
      <span className="absolute bottom-5 right-5 w-3 h-3 border-b border-r border-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true" />

      {/* large ghost number */}
      <span
        className="absolute -bottom-4 -right-2 font-display text-[8rem] leading-none text-bone/[0.025] select-none pointer-events-none group-hover:text-bone/[0.04] transition-colors duration-700"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </motion.article>
  );
}

/* ─── Services ────────────────────────────────────────────────────────────── */
export function Services() {
  return (
    <section
      id="services"
      className="relative z-20 border-t border-white/[0.05] py-[var(--section-py)] bg-[var(--void)]"
      aria-label="Visual solutions and services"
    >
      <div className="px-6 lg:px-20 w-full">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 lg:mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-8"
        >
          <div>
            <motion.p variants={lineVariant} className="font-mono text-[9px] uppercase tracking-[0.5em] text-accent mb-4">
              Core Expertise
            </motion.p>
            <motion.h2 variants={lineVariant} className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] text-bone tracking-[-0.03em] leading-none">
              Visual{" "}
              <span className="italic text-accent">Solutions</span>
            </motion.h2>
          </div>

          <motion.p
            variants={lineVariant}
            className="font-sans text-sm lg:text-base text-mist/55 leading-relaxed max-w-sm border-l border-white/[0.06] pl-5 lg:pb-2"
          >
            Bridging the gap between conceptual vision and cinematic reality.
            End-to-end visual services for brands that value minimalism and
            narrative depth.
          </motion.p>
        </motion.div>

        {/* ── Cards grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {services.map((svc, i) => (
            <ServiceCard key={svc.id} svc={svc} index={i} />
          ))}
        </div>

        {/* ── Bottom CTA strip ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="mt-16 lg:mt-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-white/[0.05] pt-10"
        >
          <p className="font-display text-2xl sm:text-3xl text-bone/50 tracking-[-0.01em]">
            Ready to build your{" "}
            <span className="italic text-accent/70">visual legacy?</span>
          </p>
          <a
            href="#contact"
            className="
              group relative overflow-hidden rounded-[2px]
              border border-accent/25 hover:border-accent
              px-8 py-3.5
              font-mono text-[9px] uppercase tracking-[0.3em] text-bone
              transition-[border-color] duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
            "
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-void">
              Start a Project
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
