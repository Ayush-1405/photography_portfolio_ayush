import { stats } from "../data";
import { ScrollReveal } from "./ScrollReveal";

export function Stats() {
  return (
    <section className="border-y border-white/5 bg-graphite px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 0.06}>
              <div className="group relative border-l border-white/10 pl-6">
                <dt className="font-sans text-[10px] uppercase tracking-[0.3em] text-mist">{s.label}</dt>
                <dd className="mt-2 font-display text-5xl font-medium text-bone sm:text-6xl">
                  {s.value}
                </dd>
                <div className="absolute inset-y-0 left-0 w-px bg-accent origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
              </div>
            </ScrollReveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
