import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { services } from "../data";
import { ScrollReveal } from "./ScrollReveal";

function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1024 : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const handler = (e) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
}

export function Services() {
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
        id: "horizontalServices",
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
      gsap.from(".service-header-text", {
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

      // Card entrance tied to container animation
      gsap.from(".service-card", {
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
    <section id="services" ref={scrollContainerRef} className="relative z-10 overflow-hidden border-t border-white/5">
      <div className="sticky top-0 h-screen flex flex-col justify-center">
        {/* Header Section */}
        <div className="px-[var(--content-px-mobile)] lg:px-[var(--content-px)] max-w-[var(--container-max)] mx-auto w-full mb-12 sm:mb-16">
          <div className="max-w-3xl">
            <p className="service-header-text font-mono text-xs-mono uppercase text-accent mb-4 tracking-[0.4em]">Core Expertise</p>
            <h2 className="service-header-text font-display text-5xl sm:text-7xl lg:text-8xl text-bone tracking-tighter leading-none mb-8">
              Visual <span className="italic text-accent">Solutions</span>
            </h2>
            <p className="service-header-text font-sans text-base sm:text-lg text-mist leading-relaxed max-w-lg border-l border-white/10 pl-6 sm:pl-8">
              Bridging the gap between conceptual vision and cinematic reality. Providing end-to-end visual services for brands that value minimalism and narrative depth.
            </p>
          </div>
        </div>

        {/* Horizontal Container */}
        <div 
          ref={horizontalRef} 
          className="flex gap-10 sm:gap-16 lg:gap-24 px-[var(--content-px-mobile)] lg:px-[var(--content-px)] items-center will-change-transform"
          style={{ width: "fit-content" }}
        >
          {services.map((svc, i) => (
            <div
              key={svc.id}
              className="service-card relative shrink-0 w-[85vw] sm:w-[60vw] lg:w-[40vw] h-[50vh] sm:h-[60vh] flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-graphite/10 backdrop-blur-sm border border-white/5 rounded-sm group hover:border-accent/20 transition-all duration-700"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs-mono text-accent">0{i + 1}</span>
                <div className="h-[1px] w-12 bg-accent/30 group-hover:w-20 transition-all duration-700" />
              </div>

              <div>
                <h3 className="font-display text-4xl sm:text-5xl lg:text-6xl text-bone mb-6 tracking-tighter group-hover:text-accent transition-colors duration-500">
                  {svc.title}
                </h3>
                <p className="font-sans text-sm sm:text-base lg:text-lg text-mist mb-8 sm:mb-10 max-w-md leading-relaxed opacity-80">
                  {svc.tagline}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 sm:gap-y-4 mb-8">
                  {svc.items.slice(0, 4).map((item) => (
                    <div key={item} className="flex items-center gap-3 font-mono text-[9px] sm:text-xs-mono uppercase text-bone/60">
                      <span className="h-[4px] w-[4px] rounded-full bg-accent/40" />
                      {item}
                    </div>
                  ))}
                </div>

                <div className="inline-flex items-center gap-4 font-mono text-[10px] sm:text-xs-mono uppercase text-accent tracking-[0.3em] group/link">
                  <span>Inquire</span>
                  <div className="h-[1px] w-8 bg-accent/40 group-hover/link:w-12 transition-all" />
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700" />
            </div>
          ))}

          {/* Closing Card */}
          <div className="h-[50vh] sm:h-[60vh] aspect-[4/5] shrink-0 flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-white/10 rounded-sm bg-void/50 backdrop-blur-sm ml-10 lg:ml-20">
            <p className="font-mono text-[8px] sm:text-[10px] uppercase text-accent/40 tracking-[0.4em] mb-4 sm:mb-6">Ready to Create?</p>
            <h3 className="font-display text-2xl sm:text-4xl text-bone/60 leading-tight">Let's build your <br/><span className="italic text-accent/80">visual legacy.</span></h3>
          </div>
        </div>
      </div>
    </section>
  );
}
