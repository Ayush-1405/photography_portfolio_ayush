import { useState } from "react";
import { changePassword } from "../api";

export default function Settings() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    setSaving(true);
    try {
      await changePassword(form.currentPassword, form.newPassword);
      setSuccess("Password changed successfully");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-bone">Settings</h1>
        <p className="text-sm text-mist mt-1">Manage your admin account</p>
      </div>

      <div className="bg-graphite border border-white/5 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-bone mb-4 uppercase tracking-wider">Change Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-3 py-2 rounded">
              {success}
            </div>
          )}

          <div>
            <label className="field-label">Current Password</label>
            <input
              type="password"
              className="field-input"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="field-label">New Password</label>
            <input
              type="password"
              className="field-input"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="field-label">Confirm New Password</label>
            <input
              type="password"
              className="field-input"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-accent text-ink font-semibold text-sm py-2.5 rounded hover:bg-accent/90 transition-colors disabled:opacity-50 mt-2"
          >
            {saving ? "Saving…" : "Update Password"}
          </button>
        </form>
      </div>

      <div className="bg-graphite border border-white/5 rounded-lg p-6 mt-4">
        <h2 className="text-sm font-semibold text-bone mb-2 uppercase tracking-wider">API Info</h2>
        <div className="space-y-2 text-xs text-mist font-mono">
          <p>Backend: <span className="text-bone">http://localhost:4000</span></p>
          <p>Projects API: <span className="text-bone">GET /api/projects</span></p>
          <p>Gallery API: <span className="text-bone">GET /api/gallery</span></p>
        </div>
      </div>
    </div>
  );
}
