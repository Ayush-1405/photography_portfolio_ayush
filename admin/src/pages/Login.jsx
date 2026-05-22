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
    <div className="min-h-screen flex items-center justify-center bg-void px-6 py-12">
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-void font-display text-2xl font-bold mb-6">
            A
          </div>
          <h1 className="font-display text-3xl text-bone tracking-tight">
            Ayush<span className="text-accent italic">.</span>Mistry
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent/60 mt-3">Portfolio Access</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-ink border border-white/5 p-8 lg:p-10 space-y-8 rounded-sm animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200"
        >
          {error && (
            <div className="bg-red-400/5 border border-red-400/10 text-red-400 text-xs font-mono uppercase tracking-widest px-5 py-4 rounded-sm flex items-center gap-3">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              {error}
            </div>
          )}

          <div>
            <label className="field-label">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="field-input"
              placeholder="Identity"
              required
              autoFocus
              autoComplete="username"
            />
          </div>

          <div>
            <label className="field-label">Passphrase</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="field-input"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full bg-accent text-void font-mono text-xs uppercase tracking-[0.2em] font-bold py-5 rounded-sm hover:bg-white transition-all disabled:opacity-50 mt-4 overflow-hidden"
          >
            <span className="relative z-10">
              {loading ? "Authenticating..." : "Authorize Access"}
            </span>
            <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </button>
        </form>

        <p className="text-center font-mono text-[9px] uppercase tracking-[0.4em] text-mist/30 mt-8">
          Secure Editorial Environment
        </p>
      </div>
    </div>
  );
}
