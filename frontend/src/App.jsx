import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Intro } from "./components/Intro";
import { AwardsStrip } from "./components/AwardsStrip";
import { HorizontalStrip } from "./components/HorizontalStrip";
import { ProjectGrid } from "./components/ProjectGrid";
import { Services } from "./components/Services";
import { Process } from "./components/Process";
import { Testimonials } from "./components/Testimonials";
import { Contact } from "./components/Contact";
import { Loader } from "./components/Loader";
import { Gallery } from "./components/Gallery";
import { GlobalScene } from "./components/GlobalScene";

export default function App() {
  const [loaded, setLoaded] = useState(true);
  const handleDone = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    // Global GSAP Configuration
    gsap.config({
      force3D: true, // Force hardware acceleration
      nullTargetWarn: false,
    });

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2, // Faster but smoother duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0, 
      smoothTouch: false,
      touchMultiplier: 1.5,
      lerp: 0.1, // Slightly higher lerp for more responsive, less "laggy" feel
      infinite: false,
    });

    // Synchronize ScrollTrigger with Lenis
    const updateScrollTrigger = () => ScrollTrigger.update();
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable lag smoothing to keep GSAP and Lenis perfectly in sync
    gsap.ticker.lagSmoothing(0);

    // Optimize ScrollTrigger for performance
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load", 
    });

    // Refresh ScrollTrigger when images load to prevent pinning jumps
    window.addEventListener("load", () => ScrollTrigger.refresh());

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return (
    <>
      <GlobalScene />
      <div className="grain-overlay" />
      <div className="min-h-screen transition-colors duration-700 opacity-100 relative z-10">
        <Nav />
        <main>
          <Hero />
          <AwardsStrip />
          <Intro />
          <HorizontalStrip />
          <ProjectGrid />
          <Gallery />
          <Services />
          <Process />
          <Testimonials />
          <Contact />
        </main>
        <footer className="border-t border-white/5 px-[var(--content-px-mobile)] lg:px-[var(--content-px)] py-20 relative overflow-hidden">
          <div className="mx-auto flex max-w-[var(--container-max)] flex-col gap-12 sm:flex-row sm:items-center sm:justify-between relative z-10">
            <div>
              <p className="font-display text-4xl sm:text-5xl text-bone tracking-tighter mb-4">
                Ayush<span className="text-accent italic">.</span>Mistry
              </p>
              <p className="font-mono text-xs-mono uppercase text-mist/60 max-w-xs">
                Capturing the soul of moments through a cinematic lens.
              </p>
            </div>

            <div className="flex flex-col gap-8 items-start sm:items-end">
              <div className="flex gap-10 font-mono text-xs-mono uppercase text-mist">
                <a href="https://www.instagram.com/theayushmistry24" className="hover:text-accent transition-colors relative group">
                  Instagram
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full" />
                </a>
                <a href="#" className="hover:text-accent transition-colors relative group">
                  Behance
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full" />
                </a>
                <a href="#" className="hover:text-accent transition-colors relative group">
                  LinkedIn
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full" />
                </a>
              </div>
              <p className="font-mono text-[10px] uppercase text-mist/40 tracking-[0.2em]">
                © {new Date().getFullYear()} Ayush Mistry — All rights reserved
              </p>
            </div>
          </div>
          
          {/* Decorative background text */}
          <div className="absolute -bottom-10 -right-10 font-display text-[20vw] text-white/[0.02] pointer-events-none select-none italic tracking-tighter">
            Mistry
          </div>
        </footer>
      </div>
    </>
  );
}
