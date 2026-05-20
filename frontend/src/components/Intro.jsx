import { motion } from "framer-motion";
import { introPortrait } from "../data";
import { ScrollReveal } from "./ScrollReveal";

export function Intro() {
  return (
    <section id="about" className="relative px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:gap-8 lg:items-center">
        <ScrollReveal className="lg:col-span-5">
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-graphite">
            <motion.img
              src={introPortrait}
              alt="Portrait of the photographer"
              className="h-full w-full object-cover grayscale contrast-[1.05]"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>
        </ScrollReveal>
        <div className="lg:col-span-6 lg:col-start-7">
          <ScrollReveal delay={0.08}>
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-accent">Introduction</p>
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight text-bone sm:text-5xl text-balance">
              I chase quiet moments where frame, light, and feeling align.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.18}>
            <p className="mt-8 font-sans text-base font-light leading-relaxed text-mist">
              Based between cities and coastlines, my work sits at the intersection of editorial clarity and
              atmospheric mood. Whether on assignment or personal series, I build sequences that read like
              chapters — pacing, negative space, and tone are as important as the subject itself.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.22}>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-10 font-sans text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-mist">Experience</dt>
                <dd className="mt-2 text-bone">1+ years</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-mist">Focus</dt>
                <dd className="mt-2 text-bone">Editorial</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-mist">Available</dt>
                <dd className="mt-2 text-bone">Worldwide</dd>
              </div>
            </dl>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
