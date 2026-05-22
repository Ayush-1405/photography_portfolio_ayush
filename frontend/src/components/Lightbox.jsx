import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Lightbox({ src, type = "image", poster, alt = "", onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-void/98 backdrop-blur-xl p-4 sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative group/lb overflow-hidden rounded-sm bg-graphite/20">
              {type === "video" ? (
                <video
                  src={src}
                  poster={poster}
                  controls
                  autoPlay
                  preload="auto"
                  className="w-full max-h-[85vh] object-contain"
                />
              ) : (
                <img 
                  src={src} 
                  alt={alt} 
                  crossOrigin="anonymous" 
                  className="w-full max-h-[85vh] object-contain shadow-2xl" 
                />
              )}
            </div>
            
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 flex items-center gap-3 font-mono text-xs-mono uppercase text-mist hover:text-accent transition-colors group/close"
            >
              <span className="opacity-0 group-hover/close:opacity-100 transition-opacity">Close</span>
              <span className="text-xl">✕</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
