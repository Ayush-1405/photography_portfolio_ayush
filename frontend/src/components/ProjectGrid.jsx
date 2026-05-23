import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { fetchProjects } from "../api";
import { projects as staticProjects } from "../data";
import { Lightbox } from "./Lightbox";
import { SmoothMedia } from "./SmoothMedia";

export function ProjectGrid() {
  const reduce = useReducedMotion();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState(null);
  const scrollContainerRef = useRef(null);
  const horizontalRef = useRef(null);

  useEffect(() => {
    fetchProjects()
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(staticProjects);
        }
      })
      .catch((err) => {
        console.error("Failed to sync projects from admin:", err);
        setProjects(staticProjects);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || reduce) return;

    const ctx = gsap.context(() => {
      const horizontalSection = horizontalRef.current;
      if (!horizontalSection) return;

      const getScrollAmount = () => {
        const totalWidth = horizontalSection.scrollWidth;
        const windowWidth = window.innerWidth;
        return totalWidth - windowWidth;
      };

      // Main horizontal scroll pinning
      const pinTrigger = gsap.to(horizontalSection, {
        id: "horizontalWork",
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          pin: true,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          fastScrollEnd: true,
        }
      });

      // Header entrance
      gsap.from(".project-header-text", {
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

      // Card entrance tied to container animation
      gsap.from(".project-card", {
        x: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: horizontalSection,
          start: "left 95%",
          containerAnimation: pinTrigger,
        }
      });

      // Parallax for project images
      gsap.utils.toArray(".project-card-image .parallax-target").forEach((img) => {
        gsap.to(img, {
          xPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: img.closest(".project-card"),
            containerAnimation: pinTrigger,
            start: "left right",
            end: "right left",
            scrub: true
          }
        });
      });
    }, scrollContainerRef);

    return () => ctx.revert();
  }, [loading, reduce]);

  const projectKey = (p) => p._id || p.id;

  return (
    <section id="work" ref={scrollContainerRef} className="relative z-10 overflow-hidden border-t border-white/5">
      <div className="sticky top-0 h-screen flex flex-col justify-center">
        {/* Header Section */}
        <div className="px-[var(--content-px-mobile)] lg:px-[var(--content-px)] max-w-[var(--container-max)] mx-auto w-full mb-12 sm:mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <p className="project-header-text font-mono text-xs-mono uppercase text-accent mb-3 tracking-[0.4em]">Selected Works</p>
              <h2 className="project-header-text font-display text-5xl sm:text-7xl lg:text-8xl text-bone tracking-tighter leading-none">
                Featured<br />
                <span className="italic pl-8 sm:pl-24 text-accent">Editorials</span>
              </h2>
            </div>
            <div className="lg:pb-4">
              <p className="project-header-text font-sans text-base lg:text-lg text-mist max-w-sm leading-relaxed border-l border-white/5 pl-6 opacity-70">
                A curated selection of work across fashion, architecture, and lifestyle. Each project is a deep exploration of light and form.
              </p>
            </div>
          </div>
        </div>

        {/* Horizontal Container */}
        <div 
          ref={horizontalRef} 
          className="flex gap-10 sm:gap-16 lg:gap-24 px-[var(--content-px-mobile)] lg:px-[var(--content-px)] items-center will-change-transform"
          style={{ width: "fit-content" }}
        >
          {loading ? (
            [0, 1, 2].map((i) => (
              <div key={i} className="w-[80vw] sm:w-[50vw] lg:w-[40vw] aspect-[4/5] bg-graphite/20 animate-pulse rounded-sm shrink-0" />
            ))
          ) : (
            projects.map((p, idx) => (
              <div
                key={projectKey(p)}
                className="project-card relative shrink-0 w-[80vw] sm:w-[55vw] lg:w-[45vw] group cursor-pointer"
                onClick={() => setActiveProject({ src: p.src, type: p.type, poster: p.poster })}
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-video lg:aspect-[16/9] overflow-hidden rounded-sm bg-graphite border border-white/5 group-hover:border-accent/30 transition-all duration-700">
                  <div className="project-card-image w-full h-full">
                    <SmoothMedia
                      src={p.src}
                      type={p.type}
                      poster={p.poster}
                      title={p.title}
                    />
                  </div>
                  
                  {/* Premium Editorial Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-void/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000 flex flex-col justify-end p-8 lg:p-16">
                    <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="font-mono text-[10px] lg:text-xs-mono uppercase text-accent tracking-[0.3em]">
                          {p.category}
                        </span>
                        <span className="h-[1px] w-12 bg-accent/30" />
                        <span className="font-mono text-[10px] lg:text-xs-mono text-mist uppercase tracking-[0.3em]">{p.year}</span>
                      </div>
                      
                      <h3 className="font-display text-4xl lg:text-7xl text-bone mb-6 tracking-tighter">
                        {p.title}
                      </h3>
                      
                      <p className="font-sans text-sm lg:text-base text-mist max-w-lg mb-10 leading-relaxed line-clamp-2 opacity-80">
                        {p.description}
                      </p>

                      <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.4em] text-accent">
                         <span>View Project</span>
                         <span className="h-[1px] w-8 bg-accent" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Visible Info Below (Editorial Style) */}
                <div className="mt-8 flex items-baseline justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] text-accent/40">0{idx + 1}</span>
                    <h4 className="font-display text-2xl lg:text-3xl text-bone tracking-tight uppercase">{p.title}</h4>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-mist/30">{p.category} // {p.year}</span>
                </div>
              </div>
            ))
          )}
          
          {/* Closing Card matching HorizontalStrip style */}
          <div className="h-[45vh] sm:h-[60vh] aspect-[4/5] shrink-0 flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-white/10 rounded-sm bg-void/50 backdrop-blur-sm ml-10 lg:ml-20">
            <p className="font-mono text-[8px] sm:text-[10px] uppercase text-accent/40 tracking-[0.4em] mb-4 sm:mb-6">Portfolio Archive</p>
            <h3 className="font-display text-2xl sm:text-4xl text-bone/60 leading-tight">Explore more <br/><span className="italic text-accent/80">visual stories.</span></h3>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeProject && (
          <Lightbox
            src={activeProject.src}
            type={activeProject.type}
            poster={activeProject.poster}
            onClose={() => setActiveProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}