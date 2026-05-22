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
  const gridRef = useRef(null);

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
      // Set initial state to visible before animation to avoid disappearing cards
      gsap.set(".project-card", { opacity: 1, y: 0 });

      gsap.from(".project-header-text", {
        y: 60,
        opacity: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 90%",
          toggleActions: "play none none none"
        }
      });

      gsap.from(".project-card", {
        y: 80,
        opacity: 0,
        duration: 1.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      });

      // Parallax for all project cards
      gsap.utils.toArray(".project-card-image .parallax-target").forEach((img) => {
        gsap.to(img, {
          yPercent: -10, // Pull up to create parallax against container
          ease: "none",
          scrollTrigger: {
            trigger: img.closest(".project-card-image"),
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });
    }, gridRef);

    return () => ctx.revert();
  }, [loading, reduce]);

  const projectKey = (p) => p._id || p.id;

  return (
    <section id="work" ref={gridRef} className="relative z-10 bg-void py-section-gap overflow-hidden border-b border-white/5">
      <div className="px-6 sm:px-10 lg:px-20 max-w-[1800px] mx-auto w-full">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 sm:mb-24 items-end">
          <div className="lg:col-span-8">
            <p className="project-header-text font-mono text-xs-mono sm:text-sm-mono uppercase text-accent mb-4 sm:mb-6 tracking-[0.4em] sm:tracking-[0.5em]">Selected Works</p>
            <h2 className="project-header-text font-display text-5xl sm:text-8xl lg:text-[10rem] text-bone tracking-tighter leading-none">
              Featured<br />
              <span className="italic pl-8 sm:pl-32 text-accent">Projects</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:pb-6">
            <p className="project-header-text font-sans text-base sm:text-lg text-mist max-w-sm leading-relaxed border-l border-white/10 pl-6 sm:pl-8">
              A curated selection of work across fashion, architecture, and lifestyle. Each project is a deep exploration of light, narrative, and cinematic form.
            </p>
          </div>
        </div>

        {/* Asymmetric Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-12">
          {loading ? (
            [0, 1, 2, 3].map((i) => (
              <div key={i} className="lg:col-span-6 aspect-[4/5] bg-graphite/20 animate-pulse rounded-sm" />
            ))
          ) : (
            projects.map((p, idx) => {
              // Asymmetric layout logic for desktop, single/double column for mobile
              const span = idx % 3 === 0 ? "lg:col-span-7" : idx % 3 === 1 ? "lg:col-span-5" : "lg:col-span-12";
              const aspect = idx % 3 === 0 ? "aspect-[4/5]" : idx % 3 === 1 ? "aspect-[3/4]" : "aspect-[4/3] lg:aspect-[16/7]";
              
              return (
                <div
                  key={projectKey(p)}
                  className={`project-card group relative overflow-hidden rounded-sm cursor-pointer border border-white/5 hover:border-accent/40 transition-all duration-700 ${span}`}
                  onClick={() => setActiveProject({ src: p.src, type: p.type, poster: p.poster })}
                >
                  <div className={`relative w-full overflow-hidden bg-void ${aspect}`}>
                    <div className="project-card-image w-full h-full">
                      <SmoothMedia
                        src={p.src}
                        type={p.type}
                        poster={p.poster}
                        title={p.title}
                      />
                    </div>
                    
                    {/* Overlay with info - Premium Editorial Style */}
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000 flex flex-col justify-end p-6 sm:p-14">
                      <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]">
                        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <span className="font-mono text-[10px] sm:text-sm-mono uppercase text-accent tracking-[0.2em] sm:tracking-[0.3em]">
                            {p.category}
                          </span>
                          <span className="h-[1px] w-8 sm:w-12 bg-accent/30" />
                          <span className="font-mono text-[10px] sm:text-sm-mono text-mist uppercase tracking-[0.2em] sm:tracking-[0.3em]">{p.year}</span>
                        </div>
                        
                        <h3 className="font-display text-3xl sm:text-7xl text-bone mb-4 sm:mb-6 tracking-tight">
                          {p.title}
                        </h3>
                        
                        <p className="font-sans text-sm sm:text-base text-mist max-w-lg mb-6 sm:mb-10 leading-relaxed line-clamp-2 opacity-80">
                          {p.description}
                        </p>
                        
                        <div className="inline-flex items-center gap-4 sm:gap-6 text-bone font-mono text-[10px] sm:text-sm-mono uppercase tracking-[0.2em] group/btn">
                          <span className="relative overflow-hidden py-1">
                            Explore Story
                            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-700 origin-left" />
                          </span>
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-accent transform group-hover/btn:translate-x-2 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Project Drive Link */}
        <div className="mt-16 sm:mt-32 pt-16 sm:pt-32 border-t border-white/5 flex flex-col items-center text-center relative overflow-hidden group/drive-section">
          <p className="font-mono text-[10px] sm:text-sm-mono uppercase text-accent mb-6 tracking-[0.4em] sm:tracking-[0.5em] opacity-60">The Archive</p>
          <h3 className="font-display text-3xl sm:text-7xl text-bone mb-10 sm:mb-12 tracking-tight leading-[1.1] max-w-4xl px-4 sm:px-0">
            Explore the full <br/><span className="italic text-accent">Cinematic Drive</span> <br/>for more visual stories.
          </h3>
          <a
            href="https://drive.google.com/drive/folders/19LcsP9ay1-SMdxQ4jfXTnaMJpuBjgJwj?usp=drive_link" 
            target="_blank"
            rel="noopener noreferrer"
            className="group/drive relative inline-flex items-center gap-4 sm:gap-6 font-mono text-[10px] sm:text-sm-mono uppercase text-bone px-8 sm:px-12 py-4 sm:py-6 border border-white/10 hover:border-accent transition-all duration-700 overflow-hidden"
          >
            <span className="relative z-10">Access Archive</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-accent relative z-10 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div className="absolute inset-0 bg-accent/5 scale-x-0 group-hover/drive:scale-x-100 transition-transform duration-700 origin-left" />
          </a>
          <p className="mt-8 sm:mt-12 font-sans text-[10px] sm:text-xs text-mist/40 max-w-xs sm:max-w-md uppercase tracking-[0.2em] sm:tracking-[0.3em] leading-relaxed">
            RAW FILES // HIGH-RES EXPORTS // BEHIND THE SCENES
          </p>
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