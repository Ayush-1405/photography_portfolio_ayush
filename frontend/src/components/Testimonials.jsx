import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { testimonials } from "../data";
import { useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => { setTouch(window.matchMedia("(pointer: coarse)").matches); }, []);
  return touch;
}

export function Testimonials() {
  const reduce              = useReducedMotion();
  const isTouch             = useIsTouch();
  const scrollContainerRef  = useRef(null);
  const horizontalRef       = useRef(null);

  /* ── GSAP horizontal scroll — desktop only ─────────────────────────────── */
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

      // Cleaned-up resize handler
      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, scrollContainerRef);

    return () => ctx.revert();
  }, [reduce, isTouch]);

  /* ── Mobile / reduced-motion: vertical grid ────────────────────────────── */
  if (reduce || isTouch) {
    return (
      <section
        id="testimonials"
        className="relative z-20 border-t border-white/5 bg-[var(--void)] py-[var(--section-py)]"
        aria-label="Client testimonials"
      >
        <div className="px-5 sm:px-8 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mb-10 sm:mb-14"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-accent mb-3">Testimonials</p>
            <h2 className="font-display text-4xl sm:text-6xl text-bone tracking-[-0.03em] leading-none">
              Client <span className="italic text-accent">Perspectives</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.07 }}
                className="flex flex-col justify-between p-6 sm:p-8 bg-graphite/10 border border-white/[0.06] rounded-[2px]"
              >
                <div className="relative mb-6">
                  <span className="font-display text-4xl text-accent/20 absolute -top-3 -left-1 select-none">"</span>
                  <p className="font-sans text-sm sm:text-base text-bone/85 leading-relaxed relative z-10 pt-2">
                    {t.quote}
                  </p>
                </div>
                <div className="flex items-center gap-4 border-t border-white/[0.05] pt-5">
                  <div className="h-[1px] w-6 bg-accent/30 shrink-0" />
                  <div>
                    <p className="font-display text-lg text-bone">{t.author}</p>
                    <p className="font-mono text-[8px] uppercase tracking-widest text-mist/40 mt-0.5">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── Desktop: horizontal scroll ────────────────────────────────────────── */
  return (
    <section
      id="testimonials"
      ref={scrollContainerRef}
      className="relative z-20 overflow-hidden border-t border-white/5 bg-[var(--void)]"
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
            <div
              key={i}
              className="testimonial-card relative shrink-0 w-[82vw] sm:w-[52vw] lg:w-[36vw] flex flex-col justify-between p-7 sm:p-10 lg:p-12 bg-graphite/10 backdrop-blur-sm border border-white/[0.06] rounded-[2px] group hover:border-accent/25 transition-[border-color] duration-700"
            >
              <div className="relative">
                <span className="font-display text-5xl lg:text-6xl text-accent/15 absolute -top-4 -left-2 select-none group-hover:text-accent/30 transition-colors duration-700">"</span>
                <p className="font-sans text-sm sm:text-base lg:text-lg text-bone/85 leading-relaxed relative z-10 line-clamp-5 sm:line-clamp-6">
                  {t.quote}
                </p>
              </div>
              <div className="flex items-center gap-5 mt-8 border-t border-white/[0.05] pt-6">
                <div className="h-[1px] w-7 bg-accent/30 shrink-0" />
                <div>
                  <p className="font-display text-xl lg:text-2xl text-bone group-hover:text-accent transition-colors duration-500">{t.author}</p>
                  <p className="font-mono text-[8px] uppercase tracking-widest text-mist/40 mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="w-[8vw] shrink-0" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
