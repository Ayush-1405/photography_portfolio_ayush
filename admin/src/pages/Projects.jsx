import { useEffect, useState } from "react";
import { getProjects, createProject, updateProject, deleteProject } from "../api";
import MediaPreview from "../components/MediaPreview";
import Modal from "../components/Modal";

const EMPTY_FORM = {
  title: "",
  category: "",
  year: new Date().getFullYear().toString(),
  description: "",
  type: "image",
  src: "",
  sort_order: "0",
};

export default function Projects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [mediaFile, setMediaFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);

  /* ── data ── */
  async function load() {
    setLoading(true);
    try {
      const data = await getProjects();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!mediaFile) {
      setPreviewSrc(form.src || null);
      return;
    }

    const objectUrl = URL.createObjectURL(mediaFile);
    setPreviewSrc(objectUrl);

    // Clean up memory when file changes or modal closes
    return () => URL.revokeObjectURL(objectUrl);
  }, [mediaFile, form.src]);

  useEffect(() => {
    if (!posterFile) {
      setPosterPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(posterFile);
    setPosterPreview(objectUrl);

    // Clean up memory
    return () => URL.revokeObjectURL(objectUrl);
  }, [posterFile]);

  /* ── open modal ── */
  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setMediaFile(null);
    setPosterFile(null);
    setError("");
    setShowModal(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      title: item.title,
      category: item.category,
      year: item.year,
      description: item.description || "",
      type: item.type,
      src: item.src || "",
      sort_order: String(item.sort_order ?? 0),
    });
    setMediaFile(null);
    setPosterFile(null);
    setError("");
    setShowModal(true);
  }

  /* ── submit ── */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("category", form.category);
      fd.append("year", form.year);
      fd.append("description", form.description);
      fd.append("type", form.type);
      fd.append("sort_order", form.sort_order);
      if (mediaFile) fd.append("media", mediaFile);
      else if (form.src) fd.append("src", form.src);
      if (posterFile) fd.append("poster", posterFile);

      if (editing) await updateProject(editing._id, fd);
      else await createProject(fd);

      setShowModal(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  /* ── delete ── */
  async function handleDelete(id) {
    try {
      await deleteProject(id);
      setDeleteConfirm(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  /* ════════════════════════════════════════════════════════════ */
  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-bone">Projects</h1>
          <p className="text-xs sm:text-sm text-mist mt-0.5">
            {items.length} project{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-accent text-ink text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-accent/90 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add Project</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-graphite border border-white/5 rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-[16/10] bg-white/5" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-white/5 rounded w-3/4" />
                <div className="h-2 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 sm:py-24 text-mist">
          <svg className="w-10 h-10 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="13" rx="1" /><path d="M8 21h8M12 17v4" />
          </svg>
          <p className="text-sm">No projects yet.</p>
          <button onClick={openCreate} className="mt-3 text-accent text-sm hover:underline">
            Add your first project →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-graphite border border-white/5 rounded-lg overflow-hidden">
              {/* thumbnail — relative so MediaPreview's absolute works */}
              <div className="aspect-[16/10] relative bg-black">
                <MediaPreview
                  src={previewSrc}
                  type={form.type}
                  poster={posterPreview || undefined}
                />
                <div className="absolute top-2 right-2">
                  <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border backdrop-blur-sm ${item.type === "video"
                    ? "text-blue-400 border-blue-400/30 bg-black/60"
                    : "text-accent border-accent/30 bg-black/60"
                    }`}>
                    {item.type}
                  </span>
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <p className="text-bone font-medium text-sm truncate">{item.title}</p>
                <p className="text-xs text-mist mt-0.5">{item.category} · {item.year}</p>
                {item.description && (
                  <p className="text-xs text-mist/70 mt-1.5 line-clamp-2">{item.description}</p>
                )}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(item)}
                    className="flex-1 text-xs text-mist border border-white/10 rounded-md px-3 py-1.5 hover:text-bone hover:border-white/20 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => setDeleteConfirm(item)}
                    className="flex-1 text-xs text-red-400 border border-red-400/20 rounded-md px-3 py-1.5 hover:bg-red-400/5 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          ADD / EDIT MODAL
          ════════════════════════════════════════════════════════ */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? "Edit Project" : "Add Project"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2.5 rounded-lg flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="field-label">Title <span className="text-red-400">*</span></label>
            <input className="field-input" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required placeholder="Project title" />
          </div>

          {/* Category + Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Category <span className="text-red-400">*</span></label>
              <input className="field-input" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required placeholder="Cinematography" />
            </div>
            <div>
              <label className="field-label">Year <span className="text-red-400">*</span></label>
              <input className="field-input" value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                required placeholder="2026" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="field-label">Description</label>
            <textarea className="field-input resize-none" rows={2} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description…" />
          </div>

          {/* Type + Sort */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Type <span className="text-red-400">*</span></label>
              <select className="field-input" value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="field-label">Sort Order</label>
              <input type="number" className="field-input" value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                placeholder="0" />
            </div>
          </div>

          {/* ── Media upload ── */}
          <div className="space-y-2">
            <label className="field-label">
              Media File {!editing && <span className="text-red-400">*</span>}
              <span className="text-mist/50 normal-case font-normal ml-1 text-[10px]">
                — image or video, up to 500 MB
              </span>
            </label>

            <label className="flex items-center gap-3 w-full cursor-pointer bg-ink border border-white/10 hover:border-accent/40 rounded-lg px-3 py-2.5 transition-colors group">
              <svg className="w-4 h-4 text-mist group-hover:text-accent transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
              </svg>
              <span className="text-sm text-mist group-hover:text-bone transition-colors truncate">
                {mediaFile ? mediaFile.name : "Choose file…"}
              </span>
              <input type="file" accept="image/*,video/*" className="sr-only"
                onChange={(e) => {
                  const f = e.target.files[0] || null;
                  setMediaFile(f);
                  if (f) setForm((prev) => ({ ...prev, src: "" }));
                }} />
            </label>

            {mediaFile && (
              <button type="button" onClick={() => setMediaFile(null)}
                className="text-xs text-mist/60 hover:text-red-400 transition-colors">
                ✕ Remove file
              </button>
            )}

            {!mediaFile && (
              <div>
                <label className="field-label mt-2">Or paste a URL</label>
                <input className="field-input" value={form.src}
                  onChange={(e) => setForm({ ...form, src: e.target.value })}
                  placeholder="https://res.cloudinary.com/…" />
              </div>
            )}
          </div>

          {/* ── Poster (video only) ── */}
          {form.type === "video" && (
            <div className="space-y-2">
              <label className="field-label">
                Poster / Thumbnail
                <span className="text-mist/50 normal-case font-normal ml-1 text-[10px]">optional</span>
              </label>
              <label className="flex items-center gap-3 w-full cursor-pointer bg-ink border border-white/10 hover:border-accent/40 rounded-lg px-3 py-2.5 transition-colors group">
                <svg className="w-4 h-4 text-mist group-hover:text-accent transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="1" />
                  <circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                </svg>
                <span className="text-sm text-mist group-hover:text-bone transition-colors truncate">
                  {posterFile ? posterFile.name : "Choose poster image…"}
                </span>
                <input type="file" accept="image/*" className="sr-only"
                  onChange={(e) => setPosterFile(e.target.files[0] || null)} />
              </label>
              {posterFile && (
                <button type="button" onClick={() => setPosterFile(null)}
                  className="text-xs text-mist/60 hover:text-red-400 transition-colors">
                  ✕ Remove poster
                </button>
              )}
            </div>
          )}

          {/* ── Preview ── */}
          {previewSrc && (
            <div>
              <p className="field-label mb-2">Preview</p>
              {/*
                CRITICAL: relative + aspect ratio = bounded container.
                MediaPreview uses absolute inset-0 — without this the
                image/video would expand to fill the entire page.
              */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-white/10">
                <MediaPreview
                  src={previewSrc}
                  type={form.type}
                  poster={posterPreview || undefined}
                />
              </div>
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex gap-3 pt-2 border-t border-white/5">
            <button type="button" onClick={() => setShowModal(false)}
              className="flex-1 text-sm text-mist border border-white/10 rounded-lg px-4 py-2.5 hover:text-bone hover:border-white/20 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 text-sm bg-accent text-ink font-semibold rounded-lg px-4 py-2.5 hover:bg-accent/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Uploading…
                </>
              ) : editing ? "Save Changes" : "Add Project"}
            </button>
          </div>

        </form>
      </Modal>

      {/* ── Delete confirm ── */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Project">
        <p className="text-sm text-mist mb-6">
          Delete <span className="text-bone font-medium">"{deleteConfirm?.title}"</span>?
          This action cannot be undone and will remove the file from Cloudinary.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)}
            className="flex-1 text-sm text-mist border border-white/10 rounded-lg px-4 py-2.5 hover:text-bone transition-colors">
            Cancel
          </button>
          <button onClick={() => handleDelete(deleteConfirm._id)}
            className="flex-1 text-sm bg-red-500 text-white font-semibold rounded-lg px-4 py-2.5 hover:bg-red-600 transition-colors">
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
