import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useTheme } from "../context/ThemeContext";
import { heroImage } from "../data";

export function Hero() {
  const reduce = useReducedMotion();
  const heroRef = useRef(null);
  const { theme } = useTheme();

  const isLightTheme = theme === "bone";

  useEffect(() => {
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Main title reveal
      gsap.from(".hero-title-line", {
        y: 120,
        rotate: 3,
        stagger: 0.12,
        duration: 2,
        ease: "power4.out",
        delay: 0.6,
      });

      // Subtitle fade in
      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 30,
        duration: 1.5,
        ease: "power3.out",
        delay: 1.4,
      });

      // Image reveal from bottom with a lens shutter effect
      gsap.from(".hero-image-box", {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 2.2,
        ease: "expo.inOut",
        delay: 0.3,
      });

      // Parallax for image inside container - Unified with GSAP
      gsap.to(".hero-image", {
        yPercent: 20,
        scale: 1.2,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        }
      });

      // Background glow movement on scroll
      gsap.to(".hero-glow", {
        yPercent: 30,
        xPercent: 10,
        opacity: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <header ref={heroRef} className="relative min-h-screen-d overflow-hidden flex items-center pt-24 pb-12 sm:pt-28 sm:pb-16">
      {/* Dynamic Gold Glow Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hero-glow absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-accent/[0.04] blur-[150px] animate-liquid-drift" />
        <div className="hero-glow absolute bottom-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-accent/[0.03] blur-[180px] animate-liquid-drift" style={{ animationDelay: "-5s" }} />
      </div>

      <div className="relative z-10 w-full px-[var(--content-px-mobile)] lg:px-[var(--content-px)] max-w-[var(--container-max)] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left: Asymmetric Image Column */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <div className="hero-image-box relative aspect-[3/4] w-full max-w-[300px] sm:max-w-[380px] lg:max-w-none mx-auto overflow-hidden rounded-sm bg-graphite shadow-2xl">
            <img
              src={heroImage}
              alt="Editorial Photography"
              className={`hero-image h-full w-full object-cover brightness-[0.8] hover:grayscale-0 transition-all duration-1000 ${isLightTheme ? 'grayscale-0' : 'grayscale'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-transparent" />
          </div>

          <div className="mt-5 flex items-center justify-between lg:justify-start lg:gap-10 opacity-30 font-mono text-[9px] uppercase tracking-[0.3em]">
            <div className="flex items-center gap-2">
              <span className="text-accent">FR.</span>
              <span>2026.05</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent">LOC.</span>
              <span>MUMBAI</span>
            </div>
          </div>
        </div>

        {/* Right: Typography Column */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="max-w-4xl">
            <p className="hero-subtitle font-mono text-[9px] sm:text-xs-mono uppercase text-accent mb-5 lg:mb-8 tracking-[0.4em] lg:tracking-[0.6em] opacity-80">
              Cinematographer & Director
            </p>

            <h1 className="font-display text-[clamp(3rem,11vw,9rem)] text-bone leading-[0.85] tracking-tighter mb-8 lg:mb-12">
              <div className="overflow-hidden">
                <span className="hero-title-line block">Ayush</span>
              </div>
              <div className="overflow-hidden pl-8 sm:pl-16 lg:pl-24">
                <span className="hero-title-line block italic text-accent">
                  Mistry<span className="text-bone not-italic">.</span>
                </span>
              </div>
            </h1>

            <div className="hero-subtitle flex flex-col sm:flex-row items-start sm:items-center gap-5 lg:gap-12">
              <p className="font-sans text-sm sm:text-base lg:text-lg text-mist max-w-xs sm:max-w-sm leading-relaxed border-l border-accent/20 pl-5">
                Crafting cinematic narratives through high-end editorial photography and film direction.
              </p>

              <a
                href="#work"
                className="group relative flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-bone py-2 shrink-0"
              >
                <span>View Works</span>
                <span className="h-[1px] w-8 bg-accent transition-all duration-500 group-hover:w-16" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="font-mono text-[7px] uppercase tracking-[0.4em] text-accent/40">Scroll</span>
        <div className="h-10 w-[1px] bg-gradient-to-b from-accent/40 to-transparent relative overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-accent"
          />
        </div>
      </motion.div>
    </header>
  );
}
