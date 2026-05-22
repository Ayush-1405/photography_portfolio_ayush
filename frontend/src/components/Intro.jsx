import { useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { introPortrait, stats } from "../data";
import { ScrollReveal } from "./ScrollReveal";

export function Intro() {
  const reduce = useReducedMotion();
  const containerRef = useRef(null);

  useEffect(() => {
    if (reduce) return;
    const ctx = gsap.context(() => {
      // Set initial state to avoid flicker
      gsap.set(".intro-reveal", {
        y: 60,
        opacity: 0,
      });

      gsap.to(".intro-reveal", {
        y: 0,
        opacity: 1,
        duration: 1.8,
        stagger: 0.1,
        ease: "power4.out", // More sophisticated cinematic easing
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        }
      });

      // Subtle parallax for portrait
      gsap.to(".intro-portrait", {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="about" ref={containerRef} className="relative z-10 overflow-hidden bg-void px-6 py-20 lg:py-32">
      <div className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left: Text Content */}
          <div className="lg:col-span-7">
            <div className="mb-12">
              <p className="intro-reveal font-mono text-sm-mono uppercase text-accent mb-6 tracking-[0.4em]">Manifesto</p>
              <h2 className="intro-reveal font-display text-4xl sm:text-7xl lg:text-8xl text-bone tracking-tighter leading-[0.95] sm:leading-[0.9]">
                The quiet power of <span className="italic">visual</span> restraint and <span className="text-mist">intentionality.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              <div className="space-y-6">
                <p className="intro-reveal font-sans text-base sm:text-lg leading-relaxed text-mist">
                  Visual storytelling is not just about capturing what is seen, but about conveying the atmosphere and emotion that exists in the stillness of a moment. My practice is rooted in the belief that the most profound stories are often found in the spaces between actions.
                </p>
                <p className="intro-reveal font-sans text-sm sm:text-base leading-relaxed text-mist opacity-60">
                  Working globally, I specialize in creating cinematic narratives that resonate through deep intentionality and a unique mastery of natural light. Every frame is a conscious decision to highlight the essence of my subjects.
                </p>
              </div>
              
              <div className="space-y-12 sm:space-y-10">
                <div className="grid grid-cols-2 gap-8">
                  {stats.map((s) => (
                    <div key={s.label} className="intro-reveal group">
                      <p className="font-display text-4xl lg:text-5xl text-bone mb-2 group-hover:text-accent transition-colors">
                        {s.value}
                      </p>
                      <p className="font-mono text-[10px] sm:text-xs-mono uppercase tracking-widest text-mist">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="intro-reveal pt-4 sm:pt-0">
                  <a
                    href="#contact"
                    className="group/btn inline-flex items-center gap-4 font-mono text-xs-mono uppercase text-bone"
                  >
                    Explore My Story
                    <span className="h-[1px] w-12 bg-accent transition-all group-hover/btn:w-20" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Portrait Image */}
          <div className="lg:col-span-5 relative intro-reveal mt-12 lg:mt-0">
            <div className="aspect-[4/5] w-full max-w-[350px] sm:max-w-[450px] mx-auto lg:max-w-none overflow-hidden rounded-sm bg-graphite shadow-2xl relative intro-portrait">
              <motion.div
                initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="h-full w-full"
              >
                <motion.img
                  src={introPortrait}
                  alt="Ayush Mistry"
                  initial={{ scale: 1.3, filter: "grayscale(100%)" }}
                  whileInView={{ scale: 1.1, filter: "grayscale(0%)" }}
                  transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full w-full object-cover"
                />
              </motion.div>
              <div className="absolute top-8 right-[-5%] sm:right-[-10%] lg:right-[-20%]">
                <p className="font-mono text-[8px] sm:text-[10px] lg:text-xs-mono uppercase tracking-[0.8em] text-bone/20 rotate-90 origin-right whitespace-nowrap">
                  Visual Artist
                </p>
              </div>
            </div>
            <div className="absolute -left-4 sm:-left-6 lg:-left-8 -bottom-4 sm:-bottom-6 lg:-bottom-8 w-24 sm:w-32 lg:w-40 h-24 sm:h-32 lg:h-40 border border-accent/10 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
