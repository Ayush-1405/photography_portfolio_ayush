import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center sm:p-6 lg:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={onClose}
            className="absolute inset-0 bg-void/95 backdrop-blur-xl"
          />

          {/* Card */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col bg-ink border border-white/10 shadow-2xl w-full rounded-t-sm sm:rounded-sm sm:max-w-xl max-h-[92dvh] sm:max-h-[85vh] overflow-hidden"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 shrink-0 bg-ink">
              <h2 className="font-mono text-xs-mono uppercase tracking-[0.3em] text-accent leading-none">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-mist hover:text-bone transition-all duration-500 p-2 group"
                aria-label="Close"
              >
                <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-8 py-10 scrollbar-hide">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
