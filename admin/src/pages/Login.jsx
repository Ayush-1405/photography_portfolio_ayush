import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.username, form.password);
      localStorage.setItem("admin_token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-sans text-2xl font-semibold text-bone">
            Ayush<span className="text-accent">.</span>Admin
          </h1>
          <p className="text-sm text-mist mt-1">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-graphite rounded-lg p-6 space-y-4 border border-white/5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-mist mb-1.5 uppercase tracking-wider">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full bg-ink border border-white/10 rounded px-3 py-2.5 text-sm text-bone placeholder-mist/50 focus:outline-none focus:border-accent/50 transition-colors"
              placeholder="admin"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs text-mist mb-1.5 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-ink border border-white/10 rounded px-3 py-2.5 text-sm text-bone placeholder-mist/50 focus:outline-none focus:border-accent/50 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-ink font-semibold text-sm py-2.5 rounded hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-mist/50 mt-4">
          Default: admin / admin123
        </p>
      </div>
    </div>
  );
}
