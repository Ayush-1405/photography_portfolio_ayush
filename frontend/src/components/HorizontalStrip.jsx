import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useTheme } from "../context/ThemeContext";
import { stripImages } from "../data";

function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => { setTouch(window.matchMedia("(pointer: coarse)").matches); }, []);
  return touch;
}

export function HorizontalStrip() {
  const reduce = useReducedMotion();
  const isTouch = useIsTouch();
  const scrollContainerRef = useRef(null);
  const horizontalRef = useRef(null);
  const { theme } = useTheme();
  const isLightTheme = theme === "bone";

  useEffect(() => {
    if (reduce || isTouch) return;

    const ctx = gsap.context(() => {
      const track = horizontalRef.current;
      if (!track) return;

      const getScrollAmount = () => track.scrollWidth - window.innerWidth;

      const pinTrigger = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          pin: true,
          pinSpacing: true,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          fastScrollEnd: true,
        },
      });

      gsap.from(".strip-header-text", {
        scale: 0.92, opacity: 0, y: 24, duration: 1.4, stagger: 0.08, ease: "power4.out",
        scrollTrigger: { trigger: scrollContainerRef.current, start: "top 72%" },
      });

      gsap.from(".strip-card", {
        x: 80, opacity: 0, stagger: 0.08, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: track, start: "left 95%", containerAnimation: pinTrigger },
      });
    }, scrollContainerRef);

    return () => ctx.revert();
  }, [reduce, isTouch]);

  /* ── Mobile / reduced-motion: horizontal swipe ─────────────────────────── */
  if (reduce || isTouch) {
    return (
      <section id="frames" className="relative z-10 border-t border-white/5 py-[var(--section-py)]" aria-label="Selected frames">
        <div className="px-5 sm:px-8 mb-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-accent mb-3">Continuous Reel</p>
          <h2 className="font-display text-4xl sm:text-5xl text-bone tracking-[-0.03em] leading-none">
            Selected <span className="italic text-accent">Frames</span>
          </h2>
        </div>
        {/* Native horizontal scroll on mobile */}
        <div className="h-scroll-fallback flex gap-5 px-5 sm:px-8 pb-4">
          {stripImages.map((item, i) => (
            <div key={item.src} className="relative shrink-0 w-[72vw] sm:w-[50vw]">
              <div className="h-[52vw] sm:h-[36vw] max-h-[320px] overflow-hidden rounded-[2px] bg-graphite/5 border border-white/[0.06]">
                <img
                  src={item.src}
                  alt={item.title}
                  className={`h-full w-full object-cover ${isLightTheme ? '' : 'grayscale opacity-70'}`}
                  loading="lazy"
                />
              </div>
              <div className="mt-3">
                <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-accent/60 mb-1">
                  {String(i + 1).padStart(2, "0")} — {item.location}
                </p>
                <h3 className="font-display text-xl text-bone tracking-tight">{item.title}</h3>
                <p className="font-mono text-[8px] text-mist/40 uppercase tracking-widest mt-1">{item.metadata}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ── Desktop: GSAP horizontal scroll ───────────────────────────────────── */
  return (
    <section id="frames" ref={scrollContainerRef} className="relative z-10 overflow-hidden border-t border-white/5" aria-label="Selected frames">
      <div className="sticky top-0 h-screen-d flex flex-col justify-center">
        <div className="px-[var(--content-px-mobile)] lg:px-[var(--content-px)] mb-10 sm:mb-14 w-full">
          <p className="strip-header-text font-mono text-[9px] uppercase tracking-[0.5em] text-accent mb-3">Continuous Reel</p>
          <h2 className="strip-header-text font-display text-4xl sm:text-5xl lg:text-7xl text-bone tracking-[-0.03em] leading-none">
            Selected <span className="italic text-accent">Frames</span>
          </h2>
        </div>

        <div
          ref={horizontalRef}
          className="flex gap-8 sm:gap-12 lg:gap-20 px-[var(--content-px-mobile)] lg:px-[var(--content-px)] will-change-transform"
          style={{ width: "fit-content" }}
        >
          {stripImages.map((item, i) => (
            <motion.div
              key={item.src}
              className="relative shrink-0 group strip-card"
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <div className="h-[44vh] sm:h-[56vh] aspect-[4/5] overflow-hidden rounded-[2px] bg-graphite/5 border border-white/[0.06] hover:border-accent/30 transition-[border-color] duration-700 relative">
                <img
                  src={item.src}
                  alt={item.title}
                  className={`h-full w-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ${isLightTheme ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-end justify-between border-b border-white/[0.05] pb-5">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="h-[1px] w-5 bg-accent/40" />
                      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent/60">
                        {String(i + 1).padStart(2, "0")} — {item.location} ({item.year})
                      </p>
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl text-bone tracking-tight group-hover:text-accent transition-colors duration-500">
                      {item.title}
                    </h3>
                  </div>
                  <div className="text-right hidden lg:block ml-6 shrink-0">
                    <p className="font-mono text-[8px] uppercase tracking-widest text-mist/30 mb-1.5">Metadata</p>
                    <div className="px-2.5 py-1 border border-white/10 rounded-full">
                      <p className="font-mono text-[9px] text-mist/50 uppercase tracking-widest">{item.metadata}</p>
                    </div>
                  </div>
                </div>
                <div className="lg:hidden">
                  <p className="font-mono text-[8px] text-mist/35 uppercase tracking-widest">{item.metadata}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* End card */}
          <div className="h-[44vh] sm:h-[56vh] aspect-[4/5] shrink-0 flex flex-col items-center justify-center text-center p-8 sm:p-10 border border-dashed border-white/[0.08] rounded-[2px] bg-void/30 backdrop-blur-sm">
            <p className="font-mono text-[8px] uppercase tracking-[0.5em] text-accent/35 mb-4">End of Reel</p>
            <h3 className="font-display text-2xl sm:text-3xl text-bone/50 leading-tight">
              More visual stories<br /><span className="italic text-accent/60">await below.</span>
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
