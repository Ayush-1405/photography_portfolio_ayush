import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Lightbox } from "./Lightbox";
import { fetchGallery } from "../api";

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

const mobileAspect = {
  normal: "aspect-[4/3]",
  tall: "aspect-[3/4]",
  wide: "aspect-[16/9]",
  large: "aspect-[4/3]",
};

export function Gallery() {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const [active, setActive] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery()
      .then((data) => {
        if (data && Array.isArray(data)) {
          // Shuffle ONCE right here when data arrives so it remains perfectly static during resizes
          const randomized = [...data].sort(() => Math.random() - 0.5);
          setItems(randomized);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const itemKey = (item) => item._id || item.id;
  const getSpan = (item) => item.span || "tall";

  return (
    <section id="gallery" className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-accent">Gallery</p>
          <h2 className="mt-3 font-display text-4xl text-bone sm:text-5xl">Visual archive</h2>
          <p className="mt-4 max-w-lg font-sans text-sm text-mist">
            A curated mix of stills and motion — tap any frame to expand.
          </p>
        </motion.div>

        {/* ── Loading skeleton ── */}
        {loading ? (
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-sm bg-graphite animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-14 text-center py-20 text-mist">
            <p className="text-4xl mb-3 opacity-30">◻</p>
            <p className="text-sm">No gallery items yet.</p>
          </div>
        ) : (
          <div className="mt-14 gap-3 sm:gap-4 grid grid-cols-2 md:grid-cols-4 md:auto-rows-[200px] md:[grid-auto-flow:dense]">
            {items.map((item, i) => {
              const span = getSpan(item);
              return (
                <motion.div
                  key={itemKey(item)}
                  className={[
                    "group relative overflow-hidden rounded-sm bg-graphite cursor-pointer",
                    isMobile ? (mobileAspect[span] ?? "aspect-[3/4]") : "",
                    desktopSpanClass[span] ?? "md:col-span-1 md:row-span-2",
                  ].join(" ")}
                  initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.55,
                    delay: Math.min(i * 0.04, 0.3),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() =>
                    setActive({
                      src: item.src,
                      type: item.type,
                      poster: item.poster,
                      caption: item.caption,
                    })
                  }
                >
                  {/* ── Media ── */}
                  {item.type === "video" ? (
                    // Performance optimization: prevents background bandwidth draining
                    <video
                      src={item.src}
                      poster={item.poster || undefined}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      muted
                      playsInline
                      autoPlay
                      loop
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.caption ?? ""}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}

                  {/* ── Hover overlay ── */}
                  <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 sm:transition-opacity sm:duration-400" />

                  {/* ── Video play icon ── */}
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-white/50 bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:border-accent/80 group-hover:bg-black/60 transition-all duration-300">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* ── Caption ── */}
                  {item.caption && (
                    <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-4 sm:translate-y-2 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 sm:transition-all sm:duration-300 bg-gradient-to-t from-void/80 to-transparent">
                      <p className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-bone/90 leading-snug line-clamp-1">
                        {item.caption}
                      </p>
                    </div>
                  )}

                  {/* ── Video badge ── */}
                  {item.type === "video" && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 font-sans text-[8px] sm:text-[9px] uppercase tracking-widest text-bone bg-black/50 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 border border-white/10">
                      Video
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {active && (
          <Lightbox
            src={active.src}
            type={active.type}
            poster={active.poster}
            alt={active.caption}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}