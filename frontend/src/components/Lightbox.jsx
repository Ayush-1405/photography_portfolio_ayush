import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Lightbox({ src, type = "image", poster, alt = "", onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-void/98 backdrop-blur-2xl p-4 sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
        >
          {/* Decorative Corner Borders for Cinematic Feel */}
          <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-accent/20 pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-accent/20 pointer-events-none" />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-7xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative group/lb overflow-hidden rounded-sm bg-graphite/5 ring-1 ring-white/10">
              {type === "video" ? (
                <video
                  src={src}
                  poster={poster}
                  controls
                  autoPlay
                  preload="auto"
                  className="w-full max-h-[80vh] object-contain"
                />
              ) : (
                <img 
                  src={src} 
                  alt={alt} 
                  crossOrigin="anonymous" 
                  className="w-full max-h-[80vh] object-contain shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]" 
                />
              )}
            </div>
            
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="h-[1px] w-10 bg-accent/40" />
                 <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">Full Resolution Capture</p>
              </div>
              
              <button
                onClick={onClose}
                className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-mist hover:text-accent transition-all group/close"
              >
                <span className="opacity-0 group-hover/close:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">Dismiss</span>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover/close:border-accent transition-colors">
                  <span className="text-sm">✕</span>
                </div>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
