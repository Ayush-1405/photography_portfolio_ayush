import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Lightbox } from "./Lightbox";
import { fetchGallery } from "../api";
import { fallbackGallery } from "../data";
import { SmoothMedia } from "./SmoothMedia";

const EASE = [0.16, 1, 0.3, 1];

function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
}

const desktopSpanClass = {
  normal: "md:col-span-1 md:row-span-1",
  tall: "md:col-span-1 md:row-span-2",
  wide: "md:col-span-2 md:row-span-1",
  large: "md:col-span-2 md:row-span-2",
};

const categories = ["All", "Landscape", "Editorial", "Portrait", "Cinematography"];

export function Gallery() {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const [active, setActive] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const galleryRef = useRef(null);

  useEffect(() => {
    fetchGallery()
      .then((data) => {
        // If data is received from API, use it. Otherwise, fall back to static.
        if (data && Array.isArray(data) && data.length > 0) {
          // Sort by sort_order if available, otherwise preserve order
          const sorted = [...data].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
          setItems(sorted);
        } else {
          setItems(fallbackGallery);
        }
      })
      .catch((err) => {
        console.error("Failed to sync gallery from admin:", err);
        setItems(fallbackGallery);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    let filtered = items;
    if (activeCategory !== "All") {
      filtered = items.filter(
        (item) => item.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    return showAll ? filtered : filtered.slice(0, isMobile ? 4 : 8);
  }, [items, activeCategory, showAll, isMobile]);

  useEffect(() => {
    if (loading || reduce) return;
    const ctx = gsap.context(() => {
      // Smooth header reveal
      gsap.from(".gallery-header-text", {
        y: 40,
        opacity: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top 85%",
        }
      });

      // Optimized batch reveal for grid items
      ScrollTrigger.batch(".gallery-item", {
        onEnter: (batch) => gsap.to(batch, { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          stagger: 0.1, 
          overwrite: true,
          duration: 1.2,
          ease: "power3.out"
        }),
        start: "top 85%",
      });
    }, galleryRef);
    return () => ctx.revert();
  }, [loading, reduce, filteredItems]); // Added filteredItems to re-run on filter

  const itemKey = (item) => item._id || item.id;
  const getSpan = (item) => item.span || "tall";

  return (
    <section id="gallery" ref={galleryRef} className="relative z-20 px-[var(--content-px-mobile)] lg:px-[var(--content-px)] py-[var(--section-py)] border-t border-white/5 overflow-hidden bg-[var(--void)]">
      <div className="mx-auto max-w-[var(--container-max)]">
        
        {/* Header & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12 sm:mb-16">
          <div className="max-w-3xl">
            <p className="gallery-header-text font-mono text-xs-mono uppercase text-accent mb-3 tracking-[0.4em]">Archive</p>
            <h2 className="gallery-header-text font-display text-5xl sm:text-7xl lg:text-8xl text-bone tracking-tighter leading-none mb-6">
              Visual <span className="italic text-accent">Studies</span>
            </h2>
            <p className="gallery-header-text font-sans text-base lg:text-lg text-mist max-w-md leading-relaxed border-l border-white/5 pl-6 opacity-70">
              A comprehensive collection of frames exploring light, form, and the human condition.
            </p>
          </div>

          <div className="gallery-header-text flex flex-wrap gap-2 lg:mb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 font-mono text-[9px] uppercase tracking-widest transition-all rounded-full border ${
                  activeCategory === cat 
                    ? "bg-accent text-void border-accent" 
                    : "border-white/5 text-mist/40 hover:border-white/20 hover:text-mist"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid with Blur Reveal */}
        <div className="relative">
          <div className="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-[minmax(240px,auto)] sm:auto-rows-[minmax(260px,auto)]">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredItems.map((item) => {
                const span = getSpan(item);
                const spanClass = desktopSpanClass[span] || desktopSpanClass.normal;
                
                return (
                  <motion.div
                    key={itemKey(item)}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={`gallery-item relative group overflow-hidden rounded-sm cursor-pointer ${spanClass} border border-white/5 hover:border-accent/30 transition-all duration-700`}
                    onClick={() => setActive({ src: item.src, type: item.type, poster: item.poster })}
                  >
                    <SmoothMedia
                      src={item.src}
                      type={item.type}
                      poster={item.poster}
                      title={item.caption}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000 flex flex-col justify-end p-6 sm:p-10">
                      <p className="font-mono text-[10px] sm:text-sm-mono uppercase text-accent mb-2 sm:mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-700 tracking-[0.2em]">{item.category}</p>
                      <p className="font-display text-2xl sm:text-3xl text-bone leading-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-75 tracking-tight">{item.caption}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Blur Overlay & Show More Button */}
          {!showAll && items.length > (isMobile ? 4 : 8) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 bottom-0 h-64 sm:h-96 bg-gradient-to-t from-void via-void/95 to-transparent flex items-end justify-center pb-12 sm:pb-16 pointer-events-none"
            >
              <button
                onClick={() => setShowAll(true)}
                className="group/more flex flex-col items-center gap-4 sm:gap-6 pointer-events-auto"
              >
                <span className="font-mono text-[10px] sm:text-sm-mono uppercase tracking-[0.4em] sm:tracking-[0.6em] text-bone group-hover:text-accent transition-all duration-700">
                  Explore Full Archive
                </span>
                <div className="h-12 sm:h-20 w-[1px] bg-gradient-to-b from-accent to-transparent group-hover:h-24 sm:group-hover:h-32 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]" />
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <Lightbox
            src={active.src}
            type={active.type}
            poster={active.poster}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
