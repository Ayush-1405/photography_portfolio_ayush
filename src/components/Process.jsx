import { processSteps } from "../data";
import { ScrollReveal } from "./ScrollReveal";

export function Process() {
  return (
    <section className="bg-void px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-accent">How it works</p>
          <h2 className="mt-3 font-display text-4xl text-bone sm:text-5xl">The process</h2>
        </ScrollReveal>

        <div className="mt-16 grid gap-px bg-white/5 border border-white/5 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <ScrollReveal key={step.num} delay={i * 0.07}>
              <div className="group relative bg-void p-8 lg:p-10 hover:bg-graphite transition-colors duration-500 h-full">
                <p className="font-display text-5xl text-white/5 group-hover:text-accent/20 transition-colors duration-500 select-none">
                  {step.num}
                </p>
                <h3 className="mt-4 font-display text-xl text-bone">{step.title}</h3>
                <p className="mt-4 font-sans text-sm leading-relaxed text-mist">{step.body}</p>
                <div className="absolute bottom-0 left-0 h-px w-0 bg-accent group-hover:w-full transition-all duration-700" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
