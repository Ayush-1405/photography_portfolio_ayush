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

/* ─── StripCard — shared between mobile and desktop ──────────────────────── */
function StripCard({ item, index, isLightTheme, isMobile }) {
  return (
    <motion.div
      className="relative shrink-0 group strip-card"
      style={{ width: isMobile ? "72vw" : undefined }}
      whileHover={isMobile ? undefined : { y: -8 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* image */}
      <div
        className={`
          overflow-hidden rounded-[2px] bg-graphite/5 border border-white/[0.06]
          hover:border-accent/30 transition-[border-color] duration-700 relative
          ${isMobile
            ? "h-[52vw] sm:h-[40vw] max-h-[280px]"
            : "h-[44vh] sm:h-[56vh] aspect-[4/5]"
          }
        `}
      >
        <img
          src={item.src}
          alt={item.title}
          className={`
            h-full w-full object-cover transition-all duration-1000
            ${isMobile
              ? isLightTheme ? "opacity-90" : "grayscale opacity-70"
              : `opacity-70 group-hover:opacity-100 group-hover:scale-110
                 ${isLightTheme ? "grayscale-0" : "grayscale group-hover:grayscale-0"}`
            }
          `}
          loading="lazy"
        />
        {/* corner accents — desktop only */}
        {!isMobile && (
          <>
            <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </>
        )}
      </div>

      {/* info */}
      <div className="mt-4 flex flex-col gap-2">
        <div className={`flex items-end justify-between border-b border-white/[0.05] pb-4 ${isMobile ? "gap-3" : ""}`}>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-[1px] w-4 bg-accent/40 shrink-0" />
              <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-accent/60 truncate">
                {String(index + 1).padStart(2, "0")} — {item.location}
                {!isMobile && ` (${item.year})`}
              </p>
            </div>
            <h3 className={`font-display text-bone tracking-tight group-hover:text-accent transition-colors duration-500 ${isMobile ? "text-xl" : "text-2xl sm:text-3xl"}`}>
              {item.title}
            </h3>
          </div>
          {!isMobile && (
            <div className="text-right hidden lg:block ml-6 shrink-0">
              <p className="font-mono text-[8px] uppercase tracking-widest text-mist/30 mb-1.5">Metadata</p>
              <div className="px-2.5 py-1 border border-white/10 rounded-full">
                <p className="font-mono text-[9px] text-mist/50 uppercase tracking-widest">{item.metadata}</p>
              </div>
            </div>
          )}
        </div>
        <p className="font-mono text-[8px] text-mist/35 uppercase tracking-widest">
          {item.metadata}
          {isMobile && ` · ${item.year}`}
        </p>
      </div>
    </motion.div>
  );
}

export function HorizontalStrip() {
  const reduce          = useReducedMotion();
  const isTouch         = useIsTouch();
  const scrollRef       = useRef(null);
  const horizontalRef   = useRef(null);
  const { theme }       = useTheme();
  const isLightTheme    = theme === "bone";

  /* ── GSAP pin — desktop only ────────────────────────────────────────────── */
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
          trigger: scrollRef.current,
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
        scrollTrigger: { trigger: scrollRef.current, start: "top 72%" },
      });

      gsap.from(".strip-card", {
        x: 80, opacity: 0, stagger: 0.08, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: track, start: "left 95%", containerAnimation: pinTrigger },
      });
    }, scrollRef);

    return () => ctx.revert();
  }, [reduce, isTouch]);

  /* ── MOBILE — native swipe, same cards ─────────────────────────────────── */
  if (isTouch || reduce) {
    return (
      <section
        id="frames"
        className="relative z-10 border-t border-white/[0.05] py-14 sm:py-20"
        aria-label="Selected frames"
      >
        <div className="px-5 sm:px-8 mb-7">
          <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-accent mb-2.5">Continuous Reel</p>
          <h2 className="font-display text-4xl sm:text-5xl text-bone tracking-[-0.03em] leading-none">
            Selected <span className="italic text-accent">Frames</span>
          </h2>
        </div>

        {/* native swipe */}
        <div className="h-scroll-fallback flex gap-5 sm:gap-6 px-5 sm:px-8 pb-2 items-end">
          {stripImages.map((item, i) => (
            <StripCard key={item.src} item={item} index={i} isLightTheme={isLightTheme} isMobile={true} />
          ))}
          {/* end spacer */}
          <div className="shrink-0 w-4" aria-hidden="true" />
        </div>

        <div className="flex items-center gap-2 px-5 sm:px-8 mt-4">
          <span className="font-mono text-[7px] uppercase tracking-[0.4em] text-mist/25">Swipe to explore</span>
          <span className="h-[1px] w-8 bg-mist/15" aria-hidden="true" />
        </div>
      </section>
    );
  }

  /* ── DESKTOP — GSAP pinned ──────────────────────────────────────────────── */
  return (
    <section
      id="frames"
      ref={scrollRef}
      className="relative z-10 overflow-hidden border-t border-white/[0.05]"
      aria-label="Selected frames"
    >
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
            <StripCard key={item.src} item={item} index={i} isLightTheme={isLightTheme} isMobile={false} />
          ))}

          {/* end card */}
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
