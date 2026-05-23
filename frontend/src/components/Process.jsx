import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { processSteps } from "../data";
import { ScrollReveal } from "./ScrollReveal";

export function Process() {
  const scrollContainerRef = useRef(null);
  const horizontalRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const horizontalSection = horizontalRef.current;
      if (!horizontalSection) return;

      const getScrollAmount = () => {
        const totalWidth = horizontalSection.scrollWidth;
        const windowWidth = window.innerWidth;
        return totalWidth - windowWidth;
      };

      // Main horizontal scroll pinning
      const pinTrigger = gsap.to(horizontalSection, {
        id: "horizontalProcess",
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          pin: true,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          fastScrollEnd: true,
        }
      });

      // Header entrance
      gsap.from(".process-header-text", {
        scale: 0.9,
        opacity: 0,
        y: 30,
        duration: 1.5,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          start: "top 70%",
        }
      });

      // Step entrance tied to container animation
      gsap.from(".process-step", {
        x: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: horizontalSection,
          start: "left 95%",
          containerAnimation: pinTrigger,
        }
      });
    }, scrollContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={scrollContainerRef} className="relative z-10 overflow-hidden border-t border-white/5">
      <div className="sticky top-0 h-screen flex flex-col justify-center">
        {/* Header Section */}
        <div className="px-[var(--content-px-mobile)] lg:px-[var(--content-px)] max-w-[var(--container-max)] mx-auto w-full mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <p className="process-header-text font-mono text-xs-mono uppercase text-accent mb-4 tracking-[0.4em]">Methodology</p>
            <h2 className="process-header-text font-display text-5xl sm:text-7xl lg:text-8xl text-bone tracking-tighter leading-none mb-8">
              The <span className="italic text-accent">Process</span>
            </h2>
            <p className="process-header-text font-sans text-base sm:text-lg text-mist leading-relaxed max-w-lg border-l border-white/10 pl-6 sm:pl-8">
              A structured yet fluid approach to visual storytelling. Every project follows a deliberate path from discovery to final delivery.
            </p>
          </div>
        </div>

        {/* Horizontal Container */}
        <div 
          ref={horizontalRef} 
          className="flex gap-10 sm:gap-16 lg:gap-24 px-[var(--content-px-mobile)] lg:px-[var(--content-px)] items-center will-change-transform"
          style={{ width: "fit-content" }}
        >
          {processSteps.map((step, i) => (
            <div
              key={step.num}
              className="process-step relative shrink-0 w-[80vw] sm:w-[45vw] lg:w-[30vw] flex flex-col justify-between p-8 sm:p-12 border border-white/5 bg-graphite/5 backdrop-blur-sm rounded-sm group hover:border-accent/20 transition-all duration-700"
            >
              <div className="mb-10 lg:mb-16">
                <span className="font-mono text-xs-mono text-accent tracking-[0.3em]">Phase 0{i + 1}</span>
                <div className="mt-4 h-[1px] w-8 bg-accent/30 group-hover:w-16 transition-all duration-700" />
              </div>

              <div>
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-bone mb-6 tracking-tight group-hover:text-accent transition-colors duration-500 uppercase">
                  {step.title}
                </h3>
                <p className="font-sans text-sm sm:text-base text-mist leading-relaxed opacity-80">
                  {step.body}
                </p>
              </div>

              {/* Decorative Step Number */}
              <div className="absolute top-8 right-8 pointer-events-none opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
                <span className="font-display text-7xl sm:text-9xl text-bone leading-none select-none">0{i + 1}</span>
              </div>
            </div>
          ))}

          {/* Closing Card */}
          <div className="h-[40vh] sm:h-[50vh] aspect-[1/1] shrink-0 flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-white/10 rounded-sm bg-void/50 backdrop-blur-sm ml-10 lg:ml-20">
            <p className="font-mono text-[8px] sm:text-[10px] uppercase text-accent/40 tracking-[0.4em] mb-4 sm:mb-6">Journey's End</p>
            <h3 className="font-display text-2xl sm:text-4xl text-bone/60 leading-tight">Your story starts <br/><span className="italic text-accent/80">with phase 01.</span></h3>
          </div>
        </div>
      </div>
    </section>
  );
}
