import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { to: "/", label: "Dashboard", icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  )},
  { to: "/projects", label: "Projects", icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="13" rx="1"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  )},
  { to: "/gallery", label: "Gallery", icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="1"/>
      <circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
    </svg>
  )},
  { to: "/settings", label: "Settings", icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  )},
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  function logout() {
    localStorage.removeItem("admin_token");
    navigate("/login");
  }

  const SidebarContent = () => (
    <>
      <div className="px-8 py-10">
        <div className="group flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-void font-display text-xl font-bold transition-transform group-hover:scale-110 duration-500">
            A
          </div>
          <div>
            <p className="font-display text-bone font-medium tracking-tight text-lg">
              Ayush<span className="text-accent italic">.</span>Mistry
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent/60">Portfolio Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              [
                "flex items-center gap-4 px-4 py-3.5 rounded-sm text-xs font-mono uppercase tracking-widest transition-all duration-500",
                isActive
                  ? "bg-accent/5 text-accent border-r-2 border-accent"
                  : "text-mist hover:text-bone hover:bg-white/5 hover:pl-6",
              ].join(" ")
            }
          >
            <span className="opacity-70">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-8">
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-sm text-xs font-mono uppercase tracking-widest text-mist hover:text-red-400 hover:bg-red-400/5 transition-all duration-500"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"/>
          </svg>
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-void text-bone selection:bg-accent/30 selection:text-bone">

      {/* ── Desktop sidebar ─────────────────────────────── */}
      <aside className="hidden lg:flex w-72 shrink-0 bg-ink border-r border-white/5 flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* ── Mobile overlay + drawer ──────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] lg:hidden"
          >
            {/* backdrop */}
            <div className="absolute inset-0 bg-void/90 backdrop-blur-md" onClick={() => setSidebarOpen(false)} />
            {/* drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-0 h-full w-72 bg-ink border-r border-white/5 flex flex-col z-[101]"
            >
              <div className="absolute top-6 right-6">
                <button onClick={() => setSidebarOpen(false)} className="text-mist hover:text-bone">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-6 py-5 bg-ink border-b border-white/5 sticky top-0 z-[90]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-mist hover:text-bone p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <p className="font-display text-bone font-medium tracking-tight text-lg">
            Ayush<span className="text-accent italic">.</span>Mistry
          </p>
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-void font-display text-sm font-bold">A</div>
        </header>

        <main className="flex-1 p-6 lg:p-12 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
