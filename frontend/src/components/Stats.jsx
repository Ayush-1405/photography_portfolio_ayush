import { stats } from "../data";
import { ScrollReveal } from "./ScrollReveal";

export function Stats() {
  return (
    <section className="border-y border-white/5 bg-white/[0.01] px-6 py-16 sm:px-10 lg:px-16 backdrop-blur-md">
      <div className="mx-auto max-w-6xl">
        <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 0.06}>
              <div className="group relative border-l border-white/5 pl-6">
                <dt className="font-mono text-[10px] sm:text-xs-mono uppercase tracking-[0.3em] text-mist">{s.label}</dt>
                <dd className="mt-2 font-display text-4xl sm:text-5xl lg:text-6xl font-light text-bone tracking-tight select-none">
                  {s.value}
                </dd>
                {/* Smooth scaling gold left indicator line */}
                <div className="absolute inset-y-0 left-0 w-[2px] bg-accent origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out" />
              </div>
            </ScrollReveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
