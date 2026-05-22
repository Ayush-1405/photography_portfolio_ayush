import { useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { stripImages } from "../data";

export function HorizontalStrip() {
  const reduce = useReducedMotion();
  const scrollContainerRef = useRef(null);
  const horizontalRef = useRef(null);

  useEffect(() => {
    if (reduce) return;

    const ctx = gsap.context(() => {
      const horizontalSection = horizontalRef.current;
      const totalWidth = horizontalSection.scrollWidth;
      const windowWidth = window.innerWidth;
      const amountToScroll = totalWidth - windowWidth;

      gsap.to(horizontalSection, {
        x: -amountToScroll,
        ease: "none",
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          pin: true,
          start: "top top",
          end: () => `+=${amountToScroll}`,
          scrub: 1, // Reduced scrub for more immediate response
          invalidateOnRefresh: true,
          anticipatePin: 1,
        }
      });

      // Child reveals tied to the horizontal scroll
      gsap.from(".strip-card", {
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
    }, scrollContainerRef);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section ref={scrollContainerRef} className="relative bg-void min-h-screen lg:h-screen flex flex-col justify-center border-y border-white/5 overflow-hidden py-20 lg:py-0">
      <div className="px-6 sm:px-10 lg:px-20 mb-12 sm:mb-16 w-full max-w-[1800px] mx-auto">
        <p className="strip-header-text font-mono text-xs-mono sm:text-sm-mono uppercase text-accent mb-4 tracking-[0.4em]">Continuous Reel</p>
        <h2 className="strip-header-text font-display text-4xl sm:text-5xl lg:text-7xl text-bone tracking-tighter leading-none">Selected <span className="italic text-accent">Frames</span></h2>
      </div>

      <div className="relative flex items-center">
        <div 
          ref={horizontalRef} 
          className="flex gap-10 sm:gap-16 lg:gap-24 px-6 sm:px-10 lg:px-20 will-change-transform"
          style={{ width: "fit-content" }}
        >
          {stripImages.map((item, i) => (
            <motion.div
              key={item.src}
              className="relative shrink-0 group strip-card"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <div className="h-[45vh] sm:h-[60vh] aspect-[4/5] overflow-hidden rounded-sm bg-graphite border border-white/5 hover:border-accent/30 transition-all duration-700 relative group cursor-none" data-cursor="view">
                <img 
                  src={item.src} 
                  alt={item.title} 
                  className="h-full w-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
                  loading="lazy" 
                />
                
                {/* Decorative Corners */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-700" />
              </div>
              
              <div className="mt-8 flex flex-col gap-4">
                <div className="flex items-end justify-between border-b border-white/5 pb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="h-[1px] w-6 bg-accent/40" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/60">0{i + 1} — {item.location} ({item.year})</p>
                    </div>
                    <h3 className="font-display text-3xl sm:text-4xl text-bone tracking-tight group-hover:text-accent transition-colors duration-500">{item.title}</h3>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-mist/30 mb-2">Metadata Archive</p>
                    <div className="px-3 py-1 border border-white/10 rounded-full">
                      <p className="font-mono text-[10px] text-mist/60 uppercase tracking-widest">{item.metadata}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Closing Spacer Card */}
          <div className="h-[45vh] sm:h-[60vh] aspect-[4/5] shrink-0 flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-white/10 rounded-sm bg-void/50 backdrop-blur-sm">
            <p className="font-mono text-[8px] sm:text-[10px] uppercase text-accent/40 tracking-[0.4em] mb-4 sm:mb-6">End of Reel</p>
            <h3 className="font-display text-2xl sm:text-4xl text-bone/60 leading-tight">More visual stories <br/><span className="italic text-accent/80">await below.</span></h3>
          </div>
        </div>
      </div>
    </section>
  );
}
