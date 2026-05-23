import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { testimonials } from "../data";
import { ScrollReveal } from "./ScrollReveal";

export function Testimonials() {
  const scrollContainerRef = useRef(null);
  const horizontalRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const horizontalSection = horizontalRef.current;
      if (!horizontalSection) return;

      // Function to calculate dimensions accurately
      const getScrollAmount = () => {
        const totalWidth = horizontalSection.scrollWidth;
        const windowWidth = window.innerWidth;
        return totalWidth - windowWidth;
      };

      let amountToScroll = getScrollAmount();

      // Primary Horizontal Scroll Pinning
      const pinTrigger = gsap.to(horizontalSection, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          pin: true,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          scrub: 1, // Reduced for better performance
          invalidateOnRefresh: true,
          anticipatePin: 1,
          fastScrollEnd: true,
        }
      });

      // Header Text Entrance
      gsap.from(".testimonial-header-text", {
        scale: 0.9,
        y: 30,
        opacity: 0,
        duration: 1.8,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          start: "top 70%",
          once: true,
        }
      });

      // Card Staggered Entrance - Optimized for horizontal context
      gsap.set(".testimonial-card", { scale: 0.9, opacity: 0 });
      gsap.to(".testimonial-card", {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: horizontalSection,
          start: "left 95%",
          containerAnimation: pinTrigger,
        }
      });

      // Force refresh on window resize to ensure calculations are perfect
      window.addEventListener("resize", () => {
        ScrollTrigger.refresh();
      });
    }, scrollContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="testimonials" ref={scrollContainerRef} className="relative z-10 overflow-hidden border-t border-white/5">
      <div className="sticky top-0 h-screen flex flex-col justify-center px-[var(--content-px-mobile)] lg:px-[var(--content-px)] max-w-[var(--container-max)] mx-auto">
        
        {/* Header Content */}
        <div className="mb-12 sm:mb-16">
          <p className="testimonial-header-text font-mono text-xs-mono uppercase text-accent mb-3 tracking-[0.4em]">Testimonials</p>
          <h2 className="testimonial-header-text font-display text-5xl sm:text-7xl lg:text-8xl text-bone tracking-tighter leading-[0.9]">
            Client <span className="italic text-accent">Perspectives</span>
          </h2>
        </div>

        {/* Horizontal Container */}
        <div 
          ref={horizontalRef} 
          className="flex gap-10 sm:gap-16 lg:gap-24 items-center will-change-transform"
          style={{ width: "fit-content" }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="testimonial-card relative shrink-0 w-[80vw] sm:w-[50vw] lg:w-[35vw] aspect-video sm:aspect-square lg:aspect-video flex flex-col justify-between p-8 lg:p-12 bg-graphite/20 backdrop-blur-sm border border-white/5 rounded-sm group hover:border-accent/30 transition-all duration-700"
            >
              <div className="relative">
                <span className="font-display text-5xl lg:text-6xl text-accent/20 absolute -top-4 -left-2 select-none group-hover:text-accent/40 transition-colors duration-700">“</span>
                <p className="font-sans text-base lg:text-lg text-bone/90 leading-relaxed relative z-10 line-clamp-6">
                  {t.quote}
                </p>
              </div>

              <div className="flex items-center gap-6 mt-10">
                <div className="h-[1px] w-8 bg-accent/30" />
                <div>
                  <p className="font-display text-xl lg:text-2xl text-bone mb-1 group-hover:text-accent transition-colors duration-500">{t.author}</p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-mist/40">{t.role}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Spacer to end the scroll properly */}
          <div className="w-[10vw] shrink-0" />
        </div>
      </div>
    </section>
  );
}
