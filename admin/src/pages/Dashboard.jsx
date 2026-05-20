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
    { label: "Projects", value: stats.projects, to: "/projects", icon: "◈", color: "text-accent" },
    { label: "Gallery Items", value: stats.gallery, to: "/gallery", icon: "◻", color: "text-blue-400" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-bone">Dashboard</h1>
        <p className="text-sm text-mist mt-1">Overview of your portfolio content</p>
      </div>

      {loading ? (
        <div className="text-mist text-sm">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {cards.map((card) => (
            <Link
              key={card.label}
              to={card.to}
              className="bg-graphite border border-white/5 rounded-lg p-6 hover:border-accent/20 transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-2xl ${card.color}`}>{card.icon}</span>
                <span className="text-xs text-mist uppercase tracking-wider group-hover:text-accent transition-colors">
                  Manage →
                </span>
              </div>
              <p className="text-3xl font-semibold text-bone">{card.value}</p>
              <p className="text-sm text-mist mt-1">{card.label}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="bg-graphite border border-white/5 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-bone mb-4 uppercase tracking-wider">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/projects"
            className="bg-accent/10 text-accent border border-accent/20 text-sm px-4 py-2 rounded hover:bg-accent/20 transition-colors"
          >
            + Add Project
          </Link>
          <Link
            to="/gallery"
            className="bg-white/5 text-bone border border-white/10 text-sm px-4 py-2 rounded hover:bg-white/10 transition-colors"
          >
            + Add Gallery Item
          </Link>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 text-mist border border-white/10 text-sm px-4 py-2 rounded hover:bg-white/10 hover:text-bone transition-colors"
          >
            View Site ↗
          </a>
        </div>
      </div>
    </div>
  );
}
