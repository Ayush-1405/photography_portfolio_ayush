import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects, getGallery } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, gallery: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProjects(), getGallery()])
      .then(([projects, gallery]) => {
        setStats({ projects: projects.length, gallery: gallery.length });
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Projects",
      value: stats.projects,
      to: "/projects",
      color: "text-accent",
      bg: "bg-accent/5 border-accent/10",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="13" rx="1"/>
          <path d="M8 21h8M12 17v4"/>
        </svg>
      ),
    },
    {
      label: "Gallery Items",
      value: stats.gallery,
      to: "/gallery",
      color: "text-blue-400",
      bg: "bg-blue-400/5 border-blue-400/10",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="1"/>
          <circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-bone">Dashboard</h1>
        <p className="text-sm text-mist mt-1">Overview of your portfolio content</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
          {[0, 1].map((i) => (
            <div key={i} className="bg-graphite border border-white/5 rounded-lg p-5 animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
          {cards.map((card) => (
            <Link
              key={card.label}
              to={card.to}
              className={`bg-graphite border rounded-lg p-4 sm:p-6 hover:border-white/10 transition-colors group ${card.bg}`}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className={card.color}>{card.icon}</span>
                <span className="text-[10px] sm:text-xs text-mist uppercase tracking-wider group-hover:text-accent transition-colors hidden sm:block">
                  Manage →
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-semibold text-bone">{card.value}</p>
              <p className="text-xs sm:text-sm text-mist mt-1">{card.label}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="bg-graphite border border-white/5 rounded-lg p-4 sm:p-6">
        <h2 className="text-xs sm:text-sm font-semibold text-bone mb-3 sm:mb-4 uppercase tracking-wider">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link
            to="/projects"
            className="bg-accent/10 text-accent border border-accent/20 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded hover:bg-accent/20 transition-colors"
          >
            + Add Project
          </Link>
          <Link
            to="/gallery"
            className="bg-white/5 text-bone border border-white/10 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded hover:bg-white/10 transition-colors"
          >
            + Add Gallery Item
          </Link>
          <a
            href={import.meta.env.VITE_SITE_URL || "http://localhost:5173"}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 text-mist border border-white/10 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded hover:bg-white/10 hover:text-bone transition-colors"
          >
            View Site ↗
          </a>
        </div>
      </div>
    </div>
  );
}
