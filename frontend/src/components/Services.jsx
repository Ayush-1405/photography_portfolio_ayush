import { motion } from "framer-motion";
import { services } from "../data";
import { ScrollReveal } from "./ScrollReveal";

export function Services() {
  return (
    <section id="services" className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-accent">Services</p>
          <h2 className="mt-3 font-display text-4xl text-bone sm:text-5xl">What I offer</h2>
          <p className="mt-4 max-w-lg font-sans text-sm text-mist">
            Each engagement is shaped around your project — nothing off-the-shelf.
          </p>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {services.map((svc, i) => (
            <ScrollReveal key={svc.id} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col h-full border border-white/10 bg-graphite p-8 rounded-sm hover:border-accent/40 transition-colors duration-500"
              >
                <div className="absolute top-0 left-0 h-px w-0 bg-accent group-hover:w-full transition-all duration-700" />
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-accent">{svc.id.toUpperCase()}</p>
                <h3 className="mt-3 font-display text-2xl text-bone">{svc.title}</h3>
                <p className="mt-2 font-sans text-sm italic text-mist">{svc.tagline}</p>
                <ul className="mt-8 space-y-3 flex-1">
                  {svc.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 font-sans text-sm text-mist">
                      <span className="mt-1.5 h-px w-4 shrink-0 bg-accent/60" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 border-t border-white/10 pt-6 flex items-center justify-center">
                  <a
                    href="#contact"
                    className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent border border-accent/40 px-8 py-2.5 hover:bg-accent/10 transition-colors"
                  >
                    Inquire
                  </a>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
