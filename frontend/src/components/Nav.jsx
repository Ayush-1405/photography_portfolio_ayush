import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const links = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#gallery", label: "Gallery" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

const socials = [
  { href: "#", label: "IG" },
  { href: "https://www.instagram.com/theayushmistry24/", label: "BE" },
];

export function Nav() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <motion.nav
        className={`fixed left-0 right-0 top-0 z-50 px-6 py-5 transition-colors sm:px-10 lg:px-16 ${
          scrolled ? "bg-ink/90 backdrop-blur-md border-b border-white/5" : "bg-transparent"
        }`}
        initial={false}
        animate={{ paddingTop: scrolled ? 14 : 20, paddingBottom: scrolled ? 14 : 20 }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="#" className="font-display text-xl tracking-tight text-bone flex items-center gap-3">
            Ayush<span className="text-accent">.</span>Mistry
            <span className="hidden sm:inline-flex items-center gap-1.5 font-sans text-[9px] uppercase tracking-[0.25em] text-emerald-400 border border-emerald-400/30 bg-emerald-400/5 px-2 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available
            </span>
          </a>
          <ul className="hidden items-center gap-10 font-sans text-xs uppercase tracking-[0.2em] text-mist md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-bone relative group">
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent group-hover:w-full transition-all duration-300" />
                </a>
              </li>
            ))}
            <li className="flex items-center gap-4 border-l border-white/10 pl-8">
              {socials.map((s) => (
                <a key={s.label} href={s.href} className="text-mist hover:text-accent transition-colors">
                  {s.label}
                </a>
              ))}
            </li>
          </ul>
          <button
            type="button"
            className="font-sans text-xs uppercase tracking-[0.2em] text-bone md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-ink/97 backdrop-blur-lg md:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="flex flex-col items-center gap-8 font-display text-3xl text-bone">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={reduce ? undefined : { opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <a href={l.href} onClick={() => setOpen(false)} className="hover:text-accent transition-colors">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
