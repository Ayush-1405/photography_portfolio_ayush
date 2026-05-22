import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { processSteps } from "../data";
import { ScrollReveal } from "./ScrollReveal";

export function Process() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".process-header-text", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        }
      });

      gsap.from(".process-step", {
        y: 60,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="bg-void px-6 py-20 lg:py-32 border-t border-white/5 overflow-hidden">
      <div className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-20">
        <div className="max-w-2xl mb-16 sm:mb-20">
          <p className="process-header-text font-mono text-xs-mono sm:text-sm-mono uppercase text-accent mb-4 sm:mb-6 tracking-[0.4em]">Methodology</p>
          <h2 className="process-header-text font-display text-5xl sm:text-7xl lg:text-8xl text-bone tracking-tighter leading-none mb-8">
            The <span className="italic text-accent">Process</span>
          </h2>
          <p className="process-header-text font-sans text-base sm:text-lg text-mist leading-relaxed max-w-lg border-l border-white/10 pl-6 sm:pl-8">
            A structured yet fluid approach to visual storytelling. Every project follows a deliberate path from discovery to final delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 lg:gap-16">
          {processSteps.map((step, i) => (
            <div key={step.num} className="process-step group relative pt-10 sm:pt-12 border-t border-white/5 hover:border-accent transition-colors duration-700">
              <span className="font-mono text-[10px] sm:text-xs-mono text-accent absolute top-4 left-0 tracking-[0.2em]">0{i + 1}</span>
              <h3 className="font-display text-2xl lg:text-3xl text-bone mb-4 sm:mb-6 tracking-tight group-hover:pl-4 transition-all duration-700">
                {step.title}
              </h3>
              <p className="font-sans text-sm sm:text-base text-mist leading-relaxed max-w-[300px]">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
