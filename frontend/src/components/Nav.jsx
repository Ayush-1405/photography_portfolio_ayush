import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const links = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#frames", label: "Frames" },
  { href: "#gallery", label: "Archive" },
  { href: "#testimonials", label: "Voices" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Connect" },
];



export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const isLightTheme = theme === "bone";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-[100] flex justify-center pt-6 lg:pt-10 pointer-events-none"
      >
        <div 
          className={`flex items-center gap-16 px-10 py-3 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto border ${
            scrolled 
              ? `shadow-2xl ${isLightTheme ? 'bg-white/70 backdrop-blur-2xl border-void/5' : 'bg-void/40 backdrop-blur-2xl border-white/5'}` 
              : `bg-transparent border-transparent`
          }`}
        >
          {/* Logo */}
          <a href="#" className="group flex items-center relative z-[110]">
            <span className={`font-display text-xl tracking-tighter transition-all duration-700 group-hover:tracking-widest ${isLightTheme && !mobileMenuOpen ? 'text-bone' : 'text-bone'}`}>
              Ayush<span className="text-accent italic">.</span>Mistry
            </span>
          </a>

          {/* Desktop Links (Editorial Pill) */}
          <div className="hidden lg:flex items-center gap-12">
            <ul className="flex items-center gap-12 border-l border-r border-white/5 px-12">
              {links.slice(0, 6).map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`relative font-mono text-[9px] uppercase tracking-[0.4em] transition-all duration-500 hover:text-accent group ${isLightTheme ? 'text-bone/60' : 'text-mist'}`}
                  >
                    {l.label}
                    <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-accent transition-all duration-500 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-10">
              <div className="flex items-center gap-1 p-0.5 border border-white/5 rounded-full bg-void/5">
                {[
                  { id: 'void', color: 'bg-white' },
                  { id: 'bone', color: 'bg-accent' },
                  { id: 'clay', color: 'bg-gold-dark' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className="relative flex items-center justify-center w-6 h-6 rounded-full transition-all duration-500"
                  >
                    <motion.div 
                      animate={{ 
                        scale: theme === t.id ? 1 : 0.4,
                        opacity: theme === t.id ? 1 : 0.2
                      }}
                      className={`w-2 h-2 rounded-full ${t.color}`}
                    />
                    {theme === t.id && (
                      <motion.div 
                        layoutId="activeThemePill"
                        className="absolute inset-0 border border-accent/40 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <a
                href="#contact"
                className={`group relative overflow-hidden rounded-full border border-accent/20 px-6 py-2 font-mono text-[9px] uppercase tracking-[0.2em] transition-all hover:border-accent ${isLightTheme ? 'text-bone' : 'text-bone'}`}
              >
                <span className="relative z-10 transition-colors group-hover:text-void">Connect</span>
                <div className="absolute inset-0 z-0 bg-accent transition-transform duration-500 translate-y-full group-hover:translate-y-0" />
              </a>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden flex items-center gap-4">
             <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex flex-col items-center justify-center w-10 h-10 rounded-full border border-white/5 bg-void/10 backdrop-blur-md relative z-[120]"
            >
              <div className="relative w-5 h-5 flex flex-col items-center justify-center gap-1">
                <motion.span 
                  animate={mobileMenuOpen ? { rotate: 45, y: 2.5 } : { rotate: 0, y: 0 }}
                  className={`h-[1px] w-5 transition-colors ${isLightTheme && !mobileMenuOpen ? 'bg-bone' : 'bg-bone'}`} 
                />
                <motion.span 
                  animate={mobileMenuOpen ? { rotate: -45, y: -2.5 } : { rotate: 0, y: 0 }}
                  className={`h-[1px] w-5 transition-colors ${isLightTheme && !mobileMenuOpen ? 'bg-bone' : 'bg-bone'}`} 
                />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay (New Editorial Design) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[105] bg-void flex flex-col lg:hidden"
          >
            {/* Background Texture/Grain */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />
            
            <div className="relative z-10 flex flex-col h-full pt-32 px-10">
              <div className="flex-1">
                <p className="font-mono text-[8px] uppercase tracking-[0.6em] text-accent mb-12">Navigation / Menu</p>
                <ul className="flex flex-col gap-4">
                  {links.map((l, i) => (
                    <motion.li 
                      key={l.href}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <a
                        href={l.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="group flex items-baseline gap-6"
                      >
                        <span className="font-mono text-[10px] text-accent/30 italic">0{i + 1}</span>
                        <span className="font-display text-5xl sm:text-6xl text-bone tracking-tighter hover:italic hover:text-accent transition-all duration-500 uppercase">
                          {l.label}
                        </span>
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Bottom Actions */}
              <div className="pb-20">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-between border-t border-white/5 pt-10"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-mist/30">Skin</span>
                    <div className="flex items-center gap-2">
                      {['void', 'bone', 'clay'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className={`w-6 h-6 rounded-full border transition-all duration-500 ${
                            theme === t ? 'border-accent scale-110' : 'border-white/5 scale-90'
                          }`}
                        >
                          <div className={`w-full h-full rounded-full ${
                            t === 'void' ? 'bg-white/10' : t === 'bone' ? 'bg-accent/40' : 'bg-gold-dark/40'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <a
                    href="#contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent italic"
                  >
                    Start Project —
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
