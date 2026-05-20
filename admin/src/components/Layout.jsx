import { Outlet, NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: "⊞" },
  { to: "/projects", label: "Projects", icon: "◈" },
  { to: "/gallery", label: "Gallery", icon: "◻" },
  { to: "/settings", label: "Settings", icon: "⚙" },
];

export default function Layout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("admin_token");
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-graphite border-r border-white/5 flex flex-col">
        <div className="px-6 py-6 border-b border-white/5">
          <p className="font-sans text-bone font-semibold tracking-wide">
            Ayush<span className="text-accent">.</span>Admin
          </p>
          <p className="text-xs text-mist mt-0.5">Portfolio Manager</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-mist hover:text-bone hover:bg-white/5",
                ].join(" ")
              }
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-mist hover:text-bone hover:bg-white/5 transition-colors"
          >
            <span>⎋</span> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-ink">
        <Outlet />
      </main>
    </div>
  );
}
