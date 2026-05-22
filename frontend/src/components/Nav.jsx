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

// const socials = [
//   { href: "#", label: "IG" },
//   { href: "https://www.instagram.com/theayushmistry24/", label: "BE" },
// ];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] nav-blur ${
          scrolled || mobileMenuOpen ? "py-3 bg-void/60 backdrop-blur-2xl border-b border-white/5 shadow-2xl" : "py-6 bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1800px] items-center justify-between px-6 sm:px-10 lg:px-20">
          {/* Left: Logo */}
          <div className="flex-1 lg:flex-none">
            <a href="#" className="group flex items-center gap-2 relative z-[110]">
              <span className="font-display text-xl sm:text-2xl tracking-tighter text-bone">
                Ayush<span className="text-accent italic transition-all duration-500 group-hover:pl-1">.</span>Mistry
              </span>
            </a>
          </div>

          {/* Center: Desktop Links (Sleeker) */}
          <div className="hidden lg:flex flex-1 justify-center items-center">
            <ul className="flex items-center gap-6">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="relative font-mono text-[10px] uppercase tracking-[0.3em] text-mist transition-colors hover:text-accent group"
                  >
                    {l.label}
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[1px] w-0 bg-accent transition-all duration-500 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Right: Theme Selector & Action */}
          <div className="hidden lg:flex flex-1 justify-end items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[8px] uppercase tracking-widest text-mist/20">Skin</span>
              <div className="flex items-center gap-1 p-1 border border-white/5 rounded-full bg-void/10">
                {[
                  { id: 'void', color: 'bg-white', label: 'Void' },
                  { id: 'bone', color: 'bg-accent', label: 'Bone' },
                  { id: 'clay', color: 'bg-gold-dark', label: 'Clay' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className="relative flex items-center justify-center w-7 h-7 group"
                    title={`Theme: ${t.label}`}
                  >
                    <motion.div 
                      animate={{ 
                        scale: theme === t.id ? 1 : 0.4,
                        opacity: theme === t.id ? 1 : 0.2
                      }}
                      className={`w-2 h-2 rounded-full ${t.color} transition-colors`}
                    />
                    {theme === t.id && (
                      <motion.div 
                        layoutId="activeThemeDesktop"
                        className="absolute inset-0 border border-accent/40 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <a
              href="#contact"
              className="group relative overflow-hidden rounded-full border border-accent/30 px-8 py-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-bone transition-all hover:border-accent"
            >
              <span className="relative z-10 transition-colors group-hover:text-void">Connect</span>
              <div className="absolute inset-0 z-0 bg-accent transition-transform duration-500 translate-y-full group-hover:translate-y-0" />
            </a>
          </div>

          {/* Mobile Actions (Always Proper) */}
          <div className="flex lg:hidden items-center gap-4 relative z-[110]">
            {!mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-1 px-1.5 py-1 border border-white/10 rounded-full bg-void/50 backdrop-blur-md"
              >
                {[
                  { id: 'void', color: 'bg-white' },
                  { id: 'bone', color: 'bg-accent' },
                  { id: 'clay', color: 'bg-gold-dark' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className="relative flex items-center justify-center w-8 h-8"
                  >
                    <motion.div 
                      animate={{ 
                        scale: theme === t.id ? 1 : 0.5,
                        opacity: theme === t.id ? 1 : 0.3
                      }}
                      className={`w-2 h-2 rounded-full ${t.color}`}
                    />
                    {theme === t.id && (
                      <motion.div 
                        layoutId="activeThemeMobile"
                        className="absolute inset-0 border border-accent/40 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex flex-col items-end gap-1.5 p-2 group min-w-[44px] relative z-[120]"
            >
              <motion.span 
                animate={mobileMenuOpen ? { rotate: 45, y: 7, width: 28 } : { rotate: 0, y: 0, width: 20 }}
                className="h-[1px] bg-bone transition-colors" 
              />
              <motion.span 
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="h-[1px] w-7 bg-bone transition-colors" 
              />
              <motion.span 
                animate={mobileMenuOpen ? { rotate: -45, y: -7, width: 28 } : { rotate: 0, y: 0, width: 24 }}
                className="h-[1px] bg-bone transition-colors" 
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[105] bg-void/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 lg:hidden"
            >
              <ul className="flex flex-col items-center gap-6 mb-12">
                {links.map((l, i) => (
                  <motion.li 
                    key={l.href}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <a
                      href={l.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-display text-3xl sm:text-4xl text-bone hover:text-accent transition-colors italic tracking-tighter"
                    >
                      {l.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              
              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="group relative px-12 py-4 font-mono text-[10px] uppercase tracking-[0.4em] text-accent border border-accent/20 rounded-sm overflow-hidden"
              >
                <span className="relative z-10">Connect</span>
                <div className="absolute inset-0 bg-accent/5 scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
              </motion.a>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-8 mt-16 p-5 border border-white/5 rounded-full bg-void/30"
              >
                  {[
                    { id: 'void', color: 'bg-white', label: 'Void' },
                    { id: 'bone', color: 'bg-accent', label: 'Bone' },
                    { id: 'clay', color: 'bg-gold-dark', label: 'Clay' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className="relative flex items-center justify-center w-10 h-10">
                        <motion.div 
                          animate={{ 
                            scale: theme === t.id ? 1 : 0.6,
                            opacity: theme === t.id ? 1 : 0.4
                          }}
                          className={`w-3 h-3 rounded-full ${t.color}`}
                        />
                        {theme === t.id && (
                          <motion.div 
                            layoutId="activeThemeOverlay"
                            className="absolute inset-0 border border-accent/40 rounded-full"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </div>
                      <span className={`font-mono text-[8px] uppercase tracking-[0.2em] transition-colors ${theme === t.id ? 'text-accent' : 'text-mist/30'}`}>
                        {t.label}
                      </span>
                    </button>
                  ))}
                </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
