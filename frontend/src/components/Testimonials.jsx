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

      // Header Text Parallax
      gsap.set(".testimonial-header-text", { y: 120, opacity: 0 });
      gsap.to(".testimonial-header-text", {
        y: 0,
        opacity: 1,
        duration: 1.8,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          start: "top 80%",
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
    <section id="testimonials" ref={scrollContainerRef} className="relative z-10 bg-void min-h-screen flex flex-col justify-center border-y border-white/5 overflow-hidden py-20 lg:py-0">
      <div className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-20 w-full mb-12 sm:mb-16 lg:mb-24">
        <div className="max-w-5xl">
          <p className="testimonial-header-text font-mono text-xs-mono sm:text-sm-mono uppercase text-accent mb-4 sm:mb-6 lg:mb-8 tracking-[0.4em] sm:tracking-[0.6em] opacity-80">Voices</p>
          <h2 className="testimonial-header-text font-display text-5xl sm:text-8xl lg:text-[10rem] text-bone tracking-tighter leading-[0.95] sm:leading-[0.85]">
            Client <span className="italic text-accent">Perspectives</span>
          </h2>
        </div>
      </div>

      <div className="relative flex items-center">
        <div 
          ref={horizontalRef} 
          className="flex gap-6 sm:gap-10 lg:gap-16 px-6 sm:px-10 lg:px-20 will-change-transform"
          style={{ width: "fit-content" }}
        >
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className="testimonial-card group relative bg-ink border border-white/5 p-8 sm:p-12 lg:p-20 rounded-sm w-[85vw] sm:w-[70vw] lg:w-[45vw] aspect-square sm:aspect-video lg:aspect-auto lg:h-[550px] shrink-0 hover:border-accent/40 transition-all duration-1000 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle Grain Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
                  <span className="font-mono text-[10px] sm:text-xs-mono lg:text-sm-mono text-accent tracking-[0.4em] font-bold">0{i + 1}</span>
                  <div className="h-[1px] w-12 sm:w-16 lg:w-20 bg-accent/20 group-hover:w-20 sm:group-hover:w-24 lg:group-hover:w-32 group-hover:bg-accent/40 transition-all duration-1000" />
                </div>
                
                <h3 className="font-display text-xl sm:text-3xl lg:text-5xl text-bone leading-[1.3] sm:leading-[1.2] tracking-tight mb-8 sm:mb-12 italic opacity-90 group-hover:opacity-100 transition-opacity duration-1000 ease-out line-clamp-4 lg:line-clamp-none">
                  "{t.quote}"
                </h3>
              </div>
              
              <div className="relative z-10 pt-6 sm:pt-12 lg:pt-16 border-t border-white/5 flex items-end justify-between">
                <div>
                  <p className="font-mono text-[10px] sm:text-sm-mono lg:text-base-mono uppercase text-bone tracking-[0.3em] sm:tracking-[0.4em] mb-1 sm:mb-2 lg:mb-3">{t.author}</p>
                  <p className="font-mono text-[8px] sm:text-[9px] lg:text-xs-mono uppercase text-mist/40 tracking-[0.4em] sm:tracking-[0.5em]">{t.role}</p>
                </div>
                
                {/* Large Decorative Initial */}
                <div className="font-display text-6xl sm:text-8xl lg:text-[10rem] text-accent/5 italic leading-none group-hover:text-accent/10 transition-colors duration-1000 select-none">
                  {t.author.charAt(0)}
                </div>
              </div>

              {/* Decorative Quote Mark */}
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8 lg:top-10 lg:right-10 text-accent/5 font-display text-8xl sm:text-[12rem] lg:text-[15rem] leading-none select-none group-hover:text-accent/10 transition-all duration-1000 transform group-hover:rotate-6 group-hover:scale-110">
                ”
              </div>
              
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent/30 group-hover:w-full transition-all duration-1000 ease-in-out" />
            </div>
          ))}
          
          {/* Closing Card - Ultimate Call to Action */}
          <div className="testimonial-card w-[85vw] sm:w-[70vw] lg:w-[45vw] lg:h-[550px] shrink-0 flex flex-col items-center justify-center text-center p-8 sm:p-12 lg:p-20 bg-accent/[0.02] border border-accent/10 rounded-sm group/cta relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.05] to-transparent opacity-0 group-hover/cta:opacity-100 transition-opacity duration-1000" />
            
            <p className="font-mono text-[10px] sm:text-xs-mono lg:text-sm-mono uppercase text-accent mb-6 sm:mb-8 lg:mb-12 tracking-[0.5em] sm:tracking-[0.7em] opacity-80">Collaborate</p>
            <h3 className="font-display text-3xl sm:text-4xl lg:text-6xl text-bone mb-8 sm:mb-12 lg:mb-16 leading-[1.1] tracking-tighter">
              Shall we define <br/><span className="italic text-accent">your vision?</span>
            </h3>
            
            <a 
              href="#contact"
              className="group/btn relative inline-flex items-center gap-4 sm:gap-6 lg:gap-8 font-mono text-[10px] sm:text-xs-mono lg:text-sm-mono uppercase text-bone px-8 sm:px-12 lg:px-16 py-4 sm:py-6 lg:py-8 border border-white/10 hover:border-accent transition-all duration-1000 overflow-hidden"
            >
              <span className="relative z-10 tracking-[0.3em] sm:tracking-[0.4em]">Start Project</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-accent relative z-10 transform group-hover/btn:translate-x-3 transition-transform duration-700 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              <div className="absolute inset-0 bg-accent/5 scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-1000 origin-left" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
