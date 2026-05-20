import { useEffect } from "react";

/**
 * Modal — bottom sheet on mobile, centered dialog on sm+.
 *
 * Layout:
 *   ┌─────────────────┐
 *   │  sticky header  │  ← always visible
 *   ├─────────────────┤
 *   │  scrollable     │  ← form fields scroll here
 *   │  body           │
 *   └─────────────────┘
 *
 * The children are responsible for rendering their own action buttons
 * inside the form (they scroll with the content, which is fine for
 * short forms). For very long forms the user just scrolls down.
 */
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

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/75 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      {/*
        Card:
        - Mobile  → slides up from bottom, rounded top corners, max 88% viewport height
        - Desktop → centered, max 560px wide, max 85% viewport height
        Uses flex-col so header is fixed and body scrolls independently.
      */}
      <div className="
        flex flex-col
        bg-graphite border border-white/10 shadow-2xl
        w-full rounded-t-2xl
        sm:rounded-xl sm:max-w-[560px]
        max-h-[88dvh] sm:max-h-[85vh]
      ">
        {/* ── Sticky header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
          <h2 className="text-sm font-semibold text-bone uppercase tracking-wider leading-none">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-mist hover:text-bone transition-colors p-1.5 -mr-1 rounded-md hover:bg-white/5"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
