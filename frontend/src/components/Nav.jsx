import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const NAV_LINKS = [
  { href: "#about",        label: "About" },
  { href: "#work",         label: "Work" },
  { href: "#frames",       label: "Frames" },
  { href: "#gallery",      label: "Archive" },
  { href: "#testimonials", label: "Voices" },
  { href: "#services",     label: "Services" },
];

const THEMES = [
  { id: "void", label: "Dark",  dot: "bg-[#f5f5f7]" },
  { id: "bone", label: "Light", dot: "bg-accent" },
  { id: "clay", label: "Clay",  dot: "bg-gold-dark" },
];

/* ─── easing ─────────────────────────────────────────────────────────────── */
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

/* ─── variants ───────────────────────────────────────────────────────────── */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit:   { opacity: 0, transition: { duration: 0.35, ease: "easeIn", delay: 0.15 } },
};

const menuPanelVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { duration: 0.65, ease: EASE_OUT_EXPO },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.5, ease: [0.7, 0, 0.84, 0] },
  },
};

const linkVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.18 + i * 0.06, duration: 0.7, ease: EASE_OUT_EXPO },
  }),
};

const footerVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.65, duration: 0.6, ease: EASE_OUT_EXPO },
  },
};

export function Nav() {
  const [scrolled,        setScrolled]        = useState(false);
  const [mobileOpen,      setMobileOpen]       = useState(false);
  const [activeSection,   setActiveSection]    = useState("");
  const { theme, setTheme } = useTheme();

  const isDark  = theme === "void";
  const isClay  = theme === "clay";
  const isLight = theme === "bone";

  /* ── scroll detection ──────────────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── active section via IntersectionObserver ───────────────────────────── */
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  /* ── lock body scroll when mobile menu open ────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* ── close on Escape ───────────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  /* ── nav background logic ──────────────────────────────────────────────── */
  const navBg = scrolled
    ? isDark
      ? "bg-[#0a0a0a]/85 border-b border-white/[0.06] backdrop-blur-2xl"
      : isClay
      ? "bg-[#23211f]/85 border-b border-white/[0.06] backdrop-blur-2xl"
      : "bg-white/85 border-b border-black/[0.06] backdrop-blur-2xl"
    : "bg-transparent";

  /* ── logo color: always readable ───────────────────────────────────────── */
  const logoColor = mobileOpen
    ? "text-[#f5f5f7]"
    : isLight && !scrolled
    ? "text-[#0a0a0a]"
    : "text-bone";

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          DESKTOP / MAIN NAV BAR
      ═══════════════════════════════════════════════════════════════════ */}
      <motion.nav
        role="navigation"
        aria-label="Main navigation"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.1 }}
        className={`
          fixed inset-x-0 top-0 z-[100]
          transition-[background-color,border-color,padding,backdrop-filter]
          duration-500
          ${navBg}
          ${scrolled ? "py-4" : "py-8"}
        `}
      >
        <div className="w-full px-6 lg:px-20 flex items-center justify-between">

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <a
            href="#"
            aria-label="Ayush Mistry — home"
            className="group relative z-[110] flex items-center select-none"
            onClick={closeMobile}
          >
            <span
              className={`
                font-display text-[1.6rem] leading-none tracking-[-0.03em]
                transition-[letter-spacing,color] duration-700
                group-hover:tracking-[0.06em]
                ${logoColor}
              `}
            >
              Ayush
              <span className="text-accent italic not-italic">.</span>
              Mistry
            </span>
          </a>

          {/* ── Desktop links ────────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">

            {/* Links */}
            <ul className="flex items-center gap-7 xl:gap-9" role="list">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`
                        relative font-mono text-[10px] uppercase tracking-[0.35em]
                        transition-colors duration-300
                        group
                        ${isActive
                          ? "text-accent"
                          : isLight && !scrolled
                          ? "text-[#0a0a0a]/55 hover:text-[#0a0a0a]"
                          : "text-bone/50 hover:text-bone"
                        }
                      `}
                    >
                      {link.label}
                      {/* underline */}
                      <span
                        className={`
                          absolute -bottom-1 left-0 h-[1px] bg-accent
                          transition-all duration-400
                          ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                        `}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Divider */}
            <span
              className={`
                hidden xl:block h-5 w-[1px]
                ${isLight && !scrolled ? "bg-black/10" : "bg-white/10"}
              `}
              aria-hidden="true"
            />

            {/* Theme switcher */}
            <div
              role="group"
              aria-label="Theme switcher"
              className={`
                flex items-center gap-0.5 p-1 rounded-full
                border transition-colors duration-500
                ${isLight && !scrolled
                  ? "border-black/10 bg-black/[0.03]"
                  : "border-white/10 bg-white/[0.03]"
                }
              `}
            >
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  aria-label={`Switch to ${t.label} theme`}
                  aria-pressed={theme === t.id}
                  className="relative flex items-center justify-center w-6 h-6 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                >
                  <motion.span
                    animate={{
                      scale:   theme === t.id ? 1   : 0.45,
                      opacity: theme === t.id ? 1   : 0.25,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`block w-2 h-2 rounded-full ${t.dot}`}
                  />
                  {theme === t.id && (
                    <motion.span
                      layoutId="theme-ring"
                      className="absolute inset-0 rounded-full border border-accent/50"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#contact"
              className={`
                group relative overflow-hidden rounded-[3px]
                border px-7 py-[10px]
                font-mono text-[10px] uppercase tracking-[0.25em]
                transition-[border-color] duration-300
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
                ${isLight && !scrolled
                  ? "border-black/20 text-[#0a0a0a]"
                  : "border-accent/25 text-bone"
                }
                hover:border-accent
              `}
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-void">
                Connect
              </span>
              <span
                className="absolute inset-0 z-0 bg-accent translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
                aria-hidden="true"
              />
            </a>
          </div>

          {/* ── Mobile hamburger ─────────────────────────────────────────── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className={`
              lg:hidden relative z-[120]
              flex flex-col items-center justify-center
              w-11 h-11 rounded-[3px]
              border transition-colors duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
              ${mobileOpen
                ? "border-white/10 bg-white/5"
                : isLight && !scrolled
                ? "border-black/10 bg-black/[0.03]"
                : "border-white/10 bg-white/[0.03]"
              }
            `}
          >
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
            <span className="flex flex-col gap-[6px] w-5" aria-hidden="true">
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                className="block h-[1px] w-full bg-bone origin-center"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                className="block h-[1px] w-full bg-bone origin-center"
              />
            </span>
          </button>

        </div>
      </motion.nav>

      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE MENU
      ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeMobile}
              className="fixed inset-0 z-[108] bg-black/40 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              key="mobile-panel"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              variants={menuPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="
                fixed inset-y-0 right-0 z-[110]
                w-full max-w-sm
                bg-[#0a0a0a] flex flex-col
                lg:hidden overflow-hidden
              "
            >
              {/* Subtle grain */}
              <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
                aria-hidden="true"
              />

              {/* Top bar inside panel */}
              <div className="relative z-10 flex items-center justify-between px-8 pt-7 pb-0">
                <a
                  href="#"
                  onClick={closeMobile}
                  className="font-display text-[1.4rem] leading-none tracking-[-0.03em] text-[#f5f5f7]"
                >
                  Ayush<span className="text-accent italic">.</span>Mistry
                </a>
                <button
                  onClick={closeMobile}
                  aria-label="Close menu"
                  className="flex items-center justify-center w-9 h-9 rounded-[3px] border border-white/10 text-bone/50 hover:text-bone hover:border-white/20 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Label */}
              <div className="relative z-10 px-8 mt-10 mb-6">
                <p className="font-mono text-[8px] uppercase tracking-[0.6em] text-accent/70">
                  Navigation
                </p>
              </div>

              {/* Links */}
              <nav
                aria-label="Mobile navigation"
                className="relative z-10 flex-1 px-8 overflow-y-auto"
              >
                <ul className="flex flex-col" role="list">
                  {NAV_LINKS.map((link, i) => (
                    <motion.li
                      key={link.href}
                      custom={i}
                      variants={linkVariants}
                      initial="hidden"
                      animate="visible"
                      className="border-b border-white/[0.05] last:border-b-0"
                    >
                      <a
                        href={link.href}
                        onClick={closeMobile}
                        className="
                          group flex items-baseline gap-5 py-5
                          focus-visible:outline-none focus-visible:text-accent
                        "
                      >
                        <span className="font-mono text-[9px] text-accent/30 tabular-nums w-5 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="
                            font-display text-[2.6rem] leading-none tracking-[-0.02em]
                            text-[#f5f5f7]/80
                            transition-all duration-400
                            group-hover:text-[#f5f5f7] group-hover:italic group-hover:tracking-[0.01em]
                          "
                        >
                          {link.label}
                        </span>
                        <span
                          className="ml-auto font-mono text-[9px] text-accent/0 group-hover:text-accent/60 transition-colors duration-300"
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </a>
                    </motion.li>
                  ))}

                  {/* Connect as last item */}
                  <motion.li
                    custom={NAV_LINKS.length}
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                    className="pt-6"
                  >
                    <a
                      href="#contact"
                      onClick={closeMobile}
                      className="
                        group flex items-baseline gap-5 py-5
                        focus-visible:outline-none focus-visible:text-accent
                      "
                    >
                      <span className="font-mono text-[9px] text-accent/30 tabular-nums w-5 shrink-0">
                        {String(NAV_LINKS.length + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="
                          font-display text-[2.6rem] leading-none tracking-[-0.02em]
                          text-accent/80
                          transition-all duration-400
                          group-hover:text-accent group-hover:italic
                        "
                      >
                        Connect
                      </span>
                      <span
                        className="ml-auto font-mono text-[9px] text-accent/0 group-hover:text-accent/60 transition-colors duration-300"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </a>
                  </motion.li>
                </ul>
              </nav>

              {/* Footer */}
              <motion.div
                variants={footerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 px-8 pb-10 pt-6 border-t border-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  {/* Theme switcher */}
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[8px] uppercase tracking-[0.5em] text-white/20">
                      Theme
                    </span>
                    <div className="flex items-center gap-2">
                      {THEMES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id)}
                          aria-label={`${t.label} theme`}
                          aria-pressed={theme === t.id}
                          className={`
                            relative w-7 h-7 rounded-full border
                            transition-all duration-300
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
                            ${theme === t.id
                              ? "border-accent/60 scale-110"
                              : "border-white/10 scale-90 hover:scale-100 hover:border-white/20"
                            }
                          `}
                        >
                          <span
                            className={`
                              block w-full h-full rounded-full
                              ${t.id === "void" ? "bg-white/15"
                                : t.id === "bone" ? "bg-accent/35"
                                : "bg-gold-dark/35"
                              }
                            `}
                          />
                          {theme === t.id && (
                            <motion.span
                              layoutId="mobile-theme-ring"
                              className="absolute inset-[-3px] rounded-full border border-accent/40"
                              transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Social */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-mono text-[8px] uppercase tracking-[0.5em] text-white/20">
                      Follow
                    </span>
                    <div className="flex items-center gap-4">
                      {[
                        { label: "IG", href: "https://www.instagram.com/theayushmistry24" },
                        { label: "BE", href: "#" },
                        { label: "LI", href: "#" },
                      ].map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target={s.href !== "#" ? "_blank" : undefined}
                          rel={s.href !== "#" ? "noopener noreferrer" : undefined}
                          className="font-mono text-[9px] uppercase tracking-widest text-white/30 hover:text-accent transition-colors duration-200"
                        >
                          {s.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mt-6 font-mono text-[8px] uppercase tracking-[0.3em] text-white/15">
                  © {new Date().getFullYear()} Ayush Mistry
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
