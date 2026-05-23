import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { testimonials } from "../data";

const EASE = [0.16, 1, 0.3, 1];

function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => { setTouch(window.matchMedia("(pointer: coarse)").matches); }, []);
  return touch;
}

/* ─── TestimonialCard — shared ────────────────────────────────────────────── */
function TestimonialCard({ t, index, isMobile }) {
  return (
    <div
      className={`
        testimonial-card relative shrink-0 flex flex-col justify-between
        bg-graphite/10 backdrop-blur-sm border border-white/[0.06] rounded-[2px]
        group hover:border-accent/25 transition-[border-color] duration-700
        ${isMobile
          ? "w-[78vw] sm:w-[55vw] p-6 sm:p-8"
          : "w-[82vw] sm:w-[52vw] lg:w-[36vw] p-7 sm:p-10 lg:p-12"
        }
      `}
    >
      <div className="relative mb-6">
        <span className="font-display text-5xl text-accent/15 absolute -top-4 -left-2 select-none group-hover:text-accent/30 transition-colors duration-700">"</span>
        <p className={`font-sans text-bone/85 leading-relaxed relative z-10 ${isMobile ? "text-sm line-clamp-5" : "text-sm sm:text-base lg:text-lg line-clamp-5 sm:line-clamp-6"}`}>
          {t.quote}
        </p>
      </div>
      <div className="flex items-center gap-4 border-t border-white/[0.05] pt-5">
        <div className="h-[1px] w-6 bg-accent/30 shrink-0" />
        <div>
          <p className={`font-display text-bone group-hover:text-accent transition-colors duration-500 ${isMobile ? "text-lg" : "text-xl lg:text-2xl"}`}>
            {t.author}
          </p>
          <p className="font-mono text-[8px] uppercase tracking-widest text-mist/40 mt-0.5">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const reduce             = useReducedMotion();
  const isTouch            = useIsTouch();
  const scrollContainerRef = useRef(null);
  const horizontalRef      = useRef(null);

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

      gsap.from(".testimonial-header-text", {
        scale: 0.95, y: 24, opacity: 0, duration: 1.4, stagger: 0.08, ease: "power4.out",
        scrollTrigger: { trigger: scrollContainerRef.current, start: "top 72%", once: true },
      });

      gsap.set(".testimonial-card", { scale: 0.92, opacity: 0 });
      gsap.to(".testimonial-card", {
        scale: 1, opacity: 1, duration: 1.1, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: track, start: "left 95%", containerAnimation: pinTrigger },
      });

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, scrollContainerRef);

    return () => ctx.revert();
  }, [reduce, isTouch]);

  /* ── MOBILE — native swipe, same cards ─────────────────────────────────── */
  if (isTouch || reduce) {
    return (
      <section
        id="testimonials"
        className="relative z-20 border-t border-white/[0.05] bg-[var(--void)] py-14 sm:py-20"
        aria-label="Client testimonials"
      >
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease: EASE }}
          className="px-5 sm:px-8 mb-7"
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-accent mb-2.5">Testimonials</p>
          <h2 className="font-display text-4xl sm:text-5xl text-bone tracking-[-0.03em] leading-none">
            Client <span className="italic text-accent">Perspectives</span>
          </h2>
        </motion.div>

        {/* native swipe — same cards as desktop */}
        <div
          className="h-scroll-fallback flex gap-4 sm:gap-5 px-5 sm:px-8 pb-2 items-stretch"
          role="list"
          aria-label="Testimonial cards"
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} index={i} isMobile={true} />
          ))}
          <div className="shrink-0 w-4" aria-hidden="true" />
        </div>

        <div className="flex items-center gap-2 px-5 sm:px-8 mt-4">
          <span className="font-mono text-[7px] uppercase tracking-[0.4em] text-mist/25">Swipe to read</span>
          <span className="h-[1px] w-8 bg-mist/15" aria-hidden="true" />
        </div>
      </section>
    );
  }

  /* ── DESKTOP — GSAP pinned ──────────────────────────────────────────────── */
  return (
    <section
      id="testimonials"
      ref={scrollContainerRef}
      className="relative z-20 overflow-hidden border-t border-white/[0.05] bg-[var(--void)]"
      aria-label="Client testimonials"
    >
      <div className="sticky top-0 h-screen-d flex flex-col justify-center px-[var(--content-px-mobile)] lg:px-[var(--content-px)]">
        <div className="mb-10 sm:mb-14">
          <p className="testimonial-header-text font-mono text-[9px] uppercase tracking-[0.5em] text-accent mb-3">Testimonials</p>
          <h2 className="testimonial-header-text font-display text-5xl sm:text-7xl lg:text-8xl text-bone tracking-[-0.03em] leading-[0.9]">
            Client <span className="italic text-accent">Perspectives</span>
          </h2>
        </div>

        <div
          ref={horizontalRef}
          className="flex gap-8 sm:gap-12 lg:gap-20 items-stretch will-change-transform"
          style={{ width: "fit-content" }}
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} index={i} isMobile={false} />
          ))}
          <div className="w-[8vw] shrink-0" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
