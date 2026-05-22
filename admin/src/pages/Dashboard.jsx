import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getProjects, getGallery, syncStaticData } from "../api";
import { staticProjects, staticGallery } from "../staticData";

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, gallery: 0 });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  const loadStats = () => {
    setLoading(true);
    Promise.all([getProjects(), getGallery()])
      .then(([projects, gallery]) => {
        setStats({ projects: projects.length, gallery: gallery.length });
      })
      .catch(err => console.error("Dashboard stats error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleSync = async () => {
    if (!confirm("This will synchronize all missing static projects and gallery items to the database. Continue?")) return;
    
    setSyncing(true);
    setSyncStatus(null);
    try {
      const res = await syncStaticData({
        projects: staticProjects,
        gallery: staticGallery
      });
      setSyncStatus(`Sync successful: Added ${res.addedProjects} projects and ${res.addedGallery} gallery items.`);
      loadStats();
    } catch (err) {
      setSyncStatus(`Sync failed: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const cards = [
    {
      label: "Featured Projects",
      value: stats.projects,
      to: "/projects",
      color: "text-accent",
      bg: "bg-accent/5 border-accent/10",
      desc: "Manage main portfolio projects",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      ),
    },
    {
      label: "Visual Archive",
      value: stats.gallery,
      to: "/gallery",
      color: "text-accent",
      bg: "bg-accent/5 border-accent/10",
      desc: "Manage extended gallery items",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-6xl animate-in fade-in duration-700">
      <header className="mb-12">
        <h1 className="font-display text-4xl lg:text-5xl text-bone mb-2">Welcome back, Ayush</h1>
        <p className="font-mono text-xs-mono uppercase tracking-[0.3em] text-accent/60">System Overview & Management</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[0, 1].map((i) => (
            <div key={i} className="bg-ink border border-white/5 rounded-sm p-10 animate-pulse h-48" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={card.to}
                className="group relative block bg-ink border border-white/5 p-8 lg:p-10 rounded-sm hover:border-accent/40 transition-all duration-700 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700">
                  {card.icon}
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <span className={`p-3 rounded-full ${card.bg} ${card.color}`}>
                      {card.icon}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Content Type 0{i+1}</span>
                  </div>
                  
                  <p className="text-5xl font-display text-bone mb-2">{card.value}</p>
                  <h3 className="font-mono text-xs-mono uppercase text-accent mb-4">{card.label}</h3>
                  <p className="text-sm text-mist/60 leading-relaxed max-w-[240px]">{card.desc}</p>
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-mist group-hover:text-accent transition-colors">
                  <span>Manage Database</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-ink border border-white/5 p-8 lg:p-10 rounded-sm">
          <h2 className="font-mono text-xs-mono uppercase text-accent mb-8 tracking-[0.4em]">System Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/projects"
              className="flex items-center justify-between p-5 bg-void border border-white/5 rounded-sm hover:border-accent/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest">New Project</span>
              </div>
              <span className="text-mist opacity-0 group-hover:opacity-100 transition-opacity">+</span>
            </Link>
            <Link
              to="/gallery"
              className="flex items-center justify-between p-5 bg-void border border-white/5 rounded-sm hover:border-accent/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest">Archive Item</span>
              </div>
              <span className="text-mist opacity-0 group-hover:opacity-100 transition-opacity">+</span>
            </Link>
            <a
              href={import.meta.env.VITE_SITE_URL || "http://localhost:5173"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 bg-void border border-white/5 rounded-sm hover:border-accent/30 transition-all group"
            >
              <span className="font-mono text-xs uppercase tracking-widest">Live Portfolio</span>
              <svg className="w-4 h-4 text-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <Link
              to="/settings"
              className="flex items-center justify-between p-5 bg-void border border-white/5 rounded-sm hover:border-accent/30 transition-all group"
            >
              <span className="font-mono text-xs uppercase tracking-widest">System Settings</span>
              <svg className="w-4 h-4 text-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>

        <div className="bg-accent/5 border border-accent/10 p-8 lg:p-10 rounded-sm flex flex-col justify-between">
          <div>
            <h2 className="font-mono text-xs-mono uppercase text-accent mb-6 tracking-[0.4em]">Status</h2>
            
            {syncStatus && (
              <div className={`mb-6 p-4 rounded-sm border text-[10px] font-mono uppercase tracking-wider ${syncStatus.includes("failed") ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
                {syncStatus}
              </div>
            )}

            <p className="text-sm text-mist leading-relaxed mb-6">
              Your system is currently synchronized with Cloudinary and MongoDB.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-bone">Database Connected</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-bone">Media API Ready</span>
              </div>
            </div>

            <button
              onClick={handleSync}
              disabled={syncing}
              className="w-full py-4 border border-accent/30 text-accent font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-accent hover:text-void transition-all duration-500 disabled:opacity-50"
            >
              {syncing ? "Synchronizing..." : "Sync All Projects"}
            </button>
          </div>
          <div className="mt-12 pt-6 border-t border-accent/10">
            <p className="font-display text-xl text-accent italic">"Light is the only language I speak fluently."</p>
          </div>
        </div>
      </div>
    </div>
  );
}
