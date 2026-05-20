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
          className="fixed inset-0 z-[150] flex items-center justify-center bg-void/95 backdrop-blur-md p-4 sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {type === "video" ? (
              <video
                src={src}
                poster={poster}
                controls
                autoPlay
                preload="auto"
                className="w-full max-h-[80vh] rounded-sm object-contain"
              />
            ) : (
              <img src={src} alt={alt} crossOrigin="anonymous" className="w-full max-h-[85vh] object-contain rounded-sm" />
            )}
            <button
              onClick={onClose}
              className="absolute -top-10 right-0 font-sans text-xs uppercase tracking-[0.3em] text-mist hover:text-bone transition-colors"
            >
              Close ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
