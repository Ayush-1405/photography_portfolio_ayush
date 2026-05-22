import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { services } from "../data";
import { ScrollReveal } from "./ScrollReveal";

function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1024 : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const handler = (e) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
}

export function Services() {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".service-header-text", {
        y: 60,
        opacity: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="px-6 py-20 lg:py-32 bg-void overflow-hidden border-y border-white/5">
      <div className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-20">
        <div className="max-w-3xl mb-16 sm:mb-20">
          <p className="service-header-text font-mono text-xs-mono sm:text-sm-mono uppercase text-accent mb-4 sm:mb-6 tracking-[0.4em]">Core Expertise</p>
          <h2 className="service-header-text font-display text-5xl sm:text-7xl lg:text-8xl text-bone tracking-tighter leading-none mb-8">
            Visual <span className="italic text-accent">Solutions</span>
          </h2>
          <p className="service-header-text font-sans text-base sm:text-lg text-mist leading-relaxed max-w-lg border-l border-white/10 pl-6 sm:pl-8">
            Bridging the gap between conceptual vision and cinematic reality. Providing end-to-end visual services for brands that value minimalism and narrative depth.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 h-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
          {services.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={false}
              animate={{ 
                flex: isMobile ? "none" : (expanded === i ? 3 : 0.8),
                height: isMobile ? (expanded === i ? "auto" : "100px") : "100%"
              }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setExpanded(i)}
              className={`relative overflow-hidden cursor-pointer group border border-white/5 bg-graphite/10 rounded-sm transition-all duration-700 ${
                expanded === i ? "bg-graphite/30 border-accent/20" : "hover:bg-graphite/20 hover:border-white/10"
              }`}
            >
              <div className="p-6 sm:p-8 lg:p-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4 sm:mb-6 lg:mb-10">
                  <span className="font-mono text-xs-mono text-accent">0{i + 1}</span>
                  <div className={`h-[1px] bg-accent/30 transition-all duration-700 ${expanded === i ? "w-12" : "w-0"}`} />
                </div>

                <div className="flex-1 flex flex-col justify-end">
                  <h3 className={`font-display transition-all duration-700 leading-none ${
                    expanded === i ? "text-3xl sm:text-5xl lg:text-7xl text-bone mb-4 sm:mb-6" : "text-xl sm:text-2xl lg:text-4xl text-mist mb-0"
                  }`}>
                    {svc.title}
                  </h3>
                  
                  <AnimatePresence mode="wait">
                    {expanded === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <p className="font-sans text-sm sm:text-base lg:text-lg text-mist mb-6 sm:mb-10 max-w-md leading-relaxed">
                          {svc.tagline}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-3 sm:gap-y-5 mb-8 sm:mb-12">
                          {svc.items.map((item) => (
                            <div key={item} className="flex items-center gap-3 font-mono text-[9px] sm:text-xs-mono uppercase text-bone/60">
                              <span className="h-[3px] sm:h-[5px] w-[3px] sm:w-[5px] rounded-full bg-accent" />
                              {item}
                            </div>
                          ))}
                        </div>
                        
                        <div className="inline-flex items-center gap-4 font-mono text-[10px] sm:text-xs-mono uppercase text-accent tracking-[0.3em] pb-2">
                          Learn More
                          <div className="h-[1px] w-8 bg-accent/40" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
