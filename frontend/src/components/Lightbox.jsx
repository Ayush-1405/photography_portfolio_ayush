import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Lightbox({ src, type = "image", poster, alt = "", onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          /* z-[300] — above grain-overlay (z-200) and nav (z-100) */
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#0a0a0a]/97 backdrop-blur-2xl p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Corner accents — hidden on very small screens */}
          <div className="absolute top-6 left-6 w-12 h-12 border-t border-l border-accent/20 pointer-events-none hidden sm:block" aria-hidden="true" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-accent/20 pointer-events-none hidden sm:block" aria-hidden="true" />

          {/* Close button — always visible top-right */}
          <button
            onClick={onClose}
            aria-label="Close lightbox"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center justify-center w-10 h-10 rounded-[2px] border border-white/10 text-white/50 hover:text-accent hover:border-accent/40 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>

          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Media */}
            <div className="relative overflow-hidden rounded-[2px] bg-graphite/5 ring-1 ring-white/[0.08]">
              {type === "video" ? (
                <video
                  src={src}
                  poster={poster}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  className="w-full max-h-[70dvh] max-h-[70vh] object-contain"
                />
              ) : (
                <img
                  src={src}
                  alt={alt}
                  crossOrigin="anonymous"
                  className="w-full max-h-[70dvh] max-h-[70vh] object-contain"
                />
              )}
            </div>

            {/* Bottom bar */}
            <div className="mt-4 sm:mt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-8 bg-accent/40 hidden sm:block" aria-hidden="true" />
                <p className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.4em] text-accent/60">
                  Full Resolution
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex items-center gap-2.5 font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-accent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/50"
              >
                <span>Close</span>
                <span className="font-mono text-[8px] text-white/20">ESC</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
