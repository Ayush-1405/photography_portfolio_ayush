import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { fetchProjects } from "../api";
import { projects as staticProjects } from "../data";
import { Lightbox } from "./Lightbox";
import { SmoothMedia } from "./SmoothMedia";

/* ─── constants ───────────────────────────────────────────────────────────── */
const DRIVE_ALL_LINK =
  "https://drive.google.com/drive/folders/19LcsP9ay1-SMdxQ4jfXTnaMJpuBjgJwj?usp=drive_link";

const projectKey = (p) => p._id || p.id;

/* ─── touch detection ─────────────────────────────────────────────────────── */
function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);
  return touch;
}

/* ─── icons ───────────────────────────────────────────────────────────────── */
function IconPlay() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
      <path d="M2 1.5l7 3.5-7 3.5V1.5z" />
    </svg>
  );
}
function IconEye() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconDrive() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4" />
      <path d="M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}
function IconArrowDiag() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
      <path d="M1 8L8 1M8 1H2.5M8 1v5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconFolder() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  );
}

/* ─── ProjectCard ─────────────────────────────────────────────────────────── */
function ProjectCard({ project, index, onView, isTouch }) {
  const hasDrive = Boolean(project.drive_link);
  const isVideo  = project.type === "video";
  const [tapped, setTapped] = useState(false);

  // On touch: first tap shows overlay, second tap opens lightbox
  const handleTap = () => {
    if (!isTouch) return;
    if (!tapped) { setTapped(true); return; }
    onView({ src: project.src, type: project.type, poster: project.poster });
  };

  const overlayVisible = isTouch ? tapped : undefined; // undefined = CSS hover handles it

  return (
    <article
      className="project-card relative shrink-0 w-[82vw] sm:w-[58vw] lg:w-[44vw] xl:w-[40vw] group"
      aria-label={`Project: ${project.title}`}
      onClick={handleTap}
    >
      {/* ── Media frame ──────────────────────────────────────────────────── */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[2px] bg-graphite/5 border border-white/[0.06] transition-[border-color] duration-700 group-hover:border-accent/30">

        <div className="project-card-image absolute inset-0">
          <SmoothMedia src={project.src} type={project.type} poster={project.poster} title={project.title} />
        </div>

        {/* type badge */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.3em] px-2 py-1 rounded-[2px] border backdrop-blur-md bg-[#0a0a0a]/60 border-white/10 text-white/50">
            {isVideo && <IconPlay />}
            {isVideo ? "Video" : "Photo"}
          </span>
        </div>

        {/* index */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span className="font-mono text-[8px] text-accent/40 tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* ── Overlay — hover on desktop, tap-toggle on touch ───────────── */}
        <div
          className={`
            absolute inset-0 z-20
            bg-gradient-to-t from-[#0a0a0a]/96 via-[#0a0a0a]/35 to-transparent
            flex flex-col justify-end p-5 sm:p-6 lg:p-8
            transition-opacity duration-500
            ${overlayVisible === true
              ? "opacity-100"
              : overlayVisible === false
              ? "opacity-0"
              : "opacity-0 group-hover:opacity-100"
            }
          `}
        >
          <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={overlayVisible ? { transform: "translateY(0)" } : undefined}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-accent">{project.category}</span>
              <span className="h-[1px] w-5 bg-accent/30" aria-hidden="true" />
              <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-white/40">{project.year}</span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl lg:text-4xl text-white tracking-[-0.02em] leading-none mb-2 sm:mb-3">
              {project.title}
            </h3>

            {project.description && (
              <p className="font-sans text-xs text-white/50 leading-relaxed line-clamp-2 max-w-sm mb-4 hidden sm:block">
                {project.description}
              </p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={(e) => { e.stopPropagation(); onView({ src: project.src, type: project.type, poster: project.poster }); }}
                aria-label={`View ${project.title}`}
                className="inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.3em] px-3 py-2 sm:px-4 rounded-[2px] bg-accent text-void border border-accent transition-all duration-300 hover:bg-transparent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                <IconEye />
                View
              </button>

              {hasDrive && (
                <a
                  href={project.drive_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.title} on Drive`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.3em] px-3 py-2 sm:px-4 rounded-[2px] bg-transparent text-white/60 border border-white/20 transition-all duration-300 hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                >
                  <IconDrive />
                  Drive
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Info bar ─────────────────────────────────────────────────────── */}
      <div className="mt-4 flex items-center justify-between gap-2 border-b border-white/[0.05] pb-4">
        <div className="flex items-baseline gap-2.5 min-w-0">
          <span className="font-mono text-[8px] text-accent/30 tabular-nums shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h4 className="font-display text-base sm:text-lg lg:text-xl text-bone tracking-[-0.01em] uppercase truncate">
            {project.title}
          </h4>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-mist/25 hidden sm:block">{project.category}</span>
          <span className="font-mono text-[7px] text-mist/15 hidden sm:block" aria-hidden="true">//</span>
          <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-mist/25">{project.year}</span>
          {hasDrive && (
            <a
              href={project.drive_link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title} on Drive`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 font-mono text-[7px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-[2px] border border-accent/15 text-accent/40 transition-all duration-300 hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/40"
            >
              <IconDrive />
              Drive
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* ─── ProjectGrid ─────────────────────────────────────────────────────────── */
export function ProjectGrid() {
  const reduce                     = useReducedMotion();
  const isTouch                    = useIsTouch();
  const [projects, setProjects]    = useState([]);
  const [loading,  setLoading]     = useState(true);
  const [active,   setActive]      = useState(null);
  const scrollContainerRef         = useRef(null);
  const horizontalRef              = useRef(null);

  useEffect(() => {
    fetchProjects()
      .then((d) => setProjects(Array.isArray(d) && d.length > 0 ? d : staticProjects))
      .catch(() => setProjects(staticProjects))
      .finally(() => setLoading(false));
  }, []);

  /* ── GSAP horizontal scroll — desktop only ─────────────────────────────── */
  useEffect(() => {
    if (loading || reduce || isTouch) return;

    const ctx = gsap.context(() => {
      const track = horizontalRef.current;
      if (!track) return;

      const getScrollAmount = () => track.scrollWidth - window.innerWidth;

      const pinTrigger = gsap.to(track, {
        id: "horizontalWork",
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

      gsap.from(".project-header-text", {
        opacity: 0, y: 20, duration: 1.1, stagger: 0.07, ease: "power4.out",
        scrollTrigger: { trigger: scrollContainerRef.current, start: "top 75%" },
      });

      gsap.from(".project-card", {
        x: 60, opacity: 0, stagger: 0.08, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: track, start: "left 95%", containerAnimation: pinTrigger },
      });
    }, scrollContainerRef);

    return () => ctx.revert();
  }, [loading, reduce, isTouch]);

  /* ── render ────────────────────────────────────────────────────────────── */
  const isMobileLayout = reduce || isTouch;

  return (
    <>
      <section
        id="work"
        ref={scrollContainerRef}
        className="relative z-10 border-t border-white/[0.05]"
        aria-label="Featured projects"
      >
        {/* ── Desktop: sticky h-screen horizontal scroll ─────────────────── */}
        {!isMobileLayout ? (
          <div className="sticky top-0 h-screen-d flex flex-col justify-center overflow-hidden">
            <DesktopHeader />
            <div
              ref={horizontalRef}
              className="flex gap-6 sm:gap-10 lg:gap-16 px-6 lg:px-20 items-end will-change-transform shrink-0"
              style={{ width: "fit-content" }}
            >
              {loading ? <Skeletons /> : (
                <>
                  {projects.map((p, idx) => (
                    <ProjectCard key={projectKey(p)} project={p} index={idx} onView={setActive} isTouch={false} />
                  ))}
                  <EndCard />
                </>
              )}
            </div>
          </div>
        ) : (
          /* ── Mobile / reduced-motion: vertical stack ─────────────────── */
          <div className="py-16 sm:py-20">
            <MobileHeader />
            <div className="mt-8 px-5 sm:px-8 flex flex-col gap-10">
              {loading ? (
                [0,1,2].map(i => (
                  <div key={i} className="w-full aspect-[16/10] bg-graphite/20 animate-pulse rounded-[2px]" />
                ))
              ) : (
                projects.map((p, idx) => (
                  <ProjectCard key={projectKey(p)} project={p} index={idx} onView={setActive} isTouch={isTouch} />
                ))
              )}
            </div>
            {/* Mobile drive CTA */}
            <div className="mt-10 px-5 sm:px-8">
              <a
                href={DRIVE_ALL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 font-mono text-[8px] uppercase tracking-[0.35em] px-5 py-3 rounded-[2px] border border-accent/30 text-accent hover:bg-accent hover:text-void transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                <IconFolder />
                All Projects on Drive
                <IconArrowDiag />
              </a>
            </div>
          </div>
        )}
      </section>

      <AnimatePresence>
        {active && (
          <Lightbox src={active.src} type={active.type} poster={active.poster} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── sub-components ──────────────────────────────────────────────────────── */

function DesktopHeader() {
  return (
    <header className="px-6 lg:px-20 w-full shrink-0 mb-8 lg:mb-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <p className="project-header-text font-mono text-[9px] uppercase tracking-[0.5em] text-accent mb-2.5">Selected Works</p>
          <h2 className="project-header-text font-display text-5xl lg:text-7xl xl:text-[5rem] text-bone tracking-[-0.03em] leading-none">
            Featured<br />
            <span className="italic pl-10 lg:pl-16 text-accent">Editorials</span>
          </h2>
        </div>
        <div className="flex flex-col items-start lg:items-end gap-4 lg:pb-1 shrink-0">
          <p className="project-header-text font-sans text-sm text-mist/55 leading-relaxed max-w-xs border-l border-white/[0.06] pl-4">
            A curated selection across fashion, architecture, and lifestyle.
          </p>
          <a
            href={DRIVE_ALL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="project-header-text group inline-flex items-center gap-2.5 font-mono text-[8px] uppercase tracking-[0.35em] px-5 py-2.5 rounded-[2px] border border-accent/25 text-accent/70 transition-all duration-300 hover:border-accent hover:text-accent hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <IconFolder />
            All Projects on Drive
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"><IconArrowDiag /></span>
          </a>
        </div>
      </div>
    </header>
  );
}

function MobileHeader() {
  return (
    <header className="px-5 sm:px-8">
      <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-accent mb-3">Selected Works</p>
      <h2 className="font-display text-4xl sm:text-5xl text-bone tracking-[-0.03em] leading-none">
        Featured<br />
        <span className="italic pl-8 text-accent">Editorials</span>
      </h2>
      <p className="mt-4 font-sans text-sm text-mist/55 leading-relaxed max-w-xs border-l border-white/[0.06] pl-4">
        A curated selection across fashion, architecture, and lifestyle.
      </p>
    </header>
  );
}

function Skeletons() {
  return (
    <>
      {[0,1,2].map(i => (
        <div key={i} className="w-[82vw] sm:w-[58vw] lg:w-[44vw] aspect-[16/10] bg-graphite/20 animate-pulse rounded-[2px] shrink-0" />
      ))}
    </>
  );
}

function EndCard() {
  return (
    <div
      className="shrink-0 self-center h-[38vh] sm:h-[46vh] aspect-[3/4] flex flex-col items-center justify-center text-center p-6 sm:p-10 rounded-[2px] ml-2 lg:ml-8 bg-[#0a0a0a] border border-[#1a1a1a] relative overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.06] via-transparent to-transparent pointer-events-none" />
      <span className="absolute top-4 left-4 w-4 h-4 border-t border-l border-accent/20" />
      <span className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-accent/20" />
      <p className="font-mono text-[8px] uppercase tracking-[0.55em] text-accent/60 mb-5 relative z-10">Portfolio Archive</p>
      <h3 className="font-display text-2xl sm:text-3xl text-[#f5f5f7] leading-snug tracking-[-0.02em] mb-8 relative z-10">
        Explore more<br /><span className="italic text-accent">visual stories.</span>
      </h3>
      <a
        href={DRIVE_ALL_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.4em] px-5 py-2.5 rounded-[2px] border border-accent/30 text-accent hover:bg-accent hover:text-void transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      >
        <IconFolder />
        View Drive
      </a>
    </div>
  );
}
