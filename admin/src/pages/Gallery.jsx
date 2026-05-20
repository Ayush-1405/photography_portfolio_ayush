import { useEffect, useState } from "react";
import { getGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem } from "../api";
import MediaPreview from "../components/MediaPreview";
import Modal from "../components/Modal";

const EMPTY_FORM = {
  type: "image",
  span: "tall",
  caption: "",
  src: "",
  sort_order: "0",
};

const SPAN_OPTIONS = [
  { value: "normal", label: "Normal (1×1)" },
  { value: "tall", label: "Tall (1×2)" },
  { value: "wide", label: "Wide (2×1)" },
  { value: "large", label: "Large (2×2)" },
];

export default function Gallery() {
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
  const [filter, setFilter] = useState("all");
  const [previewSrc, setPreviewSrc] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);

  /* ── data ── */
  async function load() {
    setLoading(true);
    try {
      const data = await getGallery();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

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
      type: item.type,
      span: item.span,
      caption: item.caption || "",
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
      fd.append("type", form.type);
      fd.append("span", form.span);
      fd.append("caption", form.caption);
      fd.append("sort_order", form.sort_order);
      if (mediaFile) fd.append("media", mediaFile);
      else if (form.src) fd.append("src", form.src);
      if (posterFile) fd.append("poster", posterFile);

      if (editing) await updateGalleryItem(editing._id, fd);
      else await createGalleryItem(fd);

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
      await deleteGalleryItem(id);
      setDeleteConfirm(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  // Manage main media file preview lifetime
  useEffect(() => {
    if (!mediaFile) {
      setPreviewSrc(form.src || null);
      return;
    }

    const objectUrl = URL.createObjectURL(mediaFile);
    setPreviewSrc(objectUrl);

    // Revoke the URL resource when file changes or component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [mediaFile, form.src]);

  // Manage video poster image preview lifetime
  useEffect(() => {
    if (!posterFile) {
      setPosterPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(posterFile);
    setPosterPreview(objectUrl);

    // Revoke the URL resource
    return () => URL.revokeObjectURL(objectUrl);
  }, [posterFile]);

  // Derived filters and counters (Safe, no leaks here)
  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter);
  const counts = {
    all: items.length,
    image: items.filter((i) => i.type === "image").length,
    video: items.filter((i) => i.type === "video").length,
  };

  /* ════════════════════════════════════════════════════════════ */
  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-bone">Gallery</h1>
          <p className="text-xs sm:text-sm text-mist mt-0.5">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-accent text-ink text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-accent/90 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add Item</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {["all", "image", "video"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-md border transition-colors capitalize ${filter === f
              ? "bg-accent/10 text-accent border-accent/30"
              : "text-mist border-white/10 hover:text-bone hover:border-white/20"
              }`}
          >
            {f === "all" ? `All (${counts.all})` : `${f}s (${counts[f]})`}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-graphite border border-white/5 rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-square bg-white/5" />
              <div className="p-2.5"><div className="h-2 bg-white/5 rounded w-3/4" /></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 sm:py-24 text-mist">
          <svg className="w-10 h-10 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="1" />
            <circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
          </svg>
          <p className="text-sm">{filter === "all" ? "No gallery items yet." : `No ${filter}s yet.`}</p>
          {filter === "all" && (
            <button onClick={openCreate} className="mt-3 text-accent text-sm hover:underline">
              Add your first item →
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((item) => (
            <div key={item._id} className="bg-graphite border border-white/5 rounded-lg overflow-hidden">
              {/* thumbnail — relative so MediaPreview's absolute works */}
              <div className="aspect-square relative bg-black">
                <MediaPreview src={item.src} type={item.type} poster={item.poster} />
                <div className="absolute top-1.5 right-1.5">
                  <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border backdrop-blur-sm ${item.type === "video"
                    ? "text-blue-400 border-blue-400/30 bg-black/60"
                    : "text-accent border-accent/30 bg-black/60"
                    }`}>
                    {item.type}
                  </span>
                </div>
              </div>
              <div className="p-2 sm:p-2.5">
                {item.caption && (
                  <p className="text-[11px] sm:text-xs text-mist truncate mb-1.5">{item.caption}</p>
                )}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] text-mist/50 uppercase tracking-wider shrink-0">{item.span}</span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(item)}
                      className="text-[10px] text-mist hover:text-bone px-1.5 py-0.5 rounded hover:bg-white/5 transition-colors">
                      Edit
                    </button>
                    <button onClick={() => setDeleteConfirm(item)}
                      className="text-[10px] text-red-400/60 hover:text-red-400 px-1.5 py-0.5 rounded hover:bg-red-400/5 transition-colors">
                      ✕
                    </button>
                  </div>
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
        title={editing ? "Edit Gallery Item" : "Add Gallery Item"}
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

          {/* Type + Span */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Type *</label>
              <select className="field-input" value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="field-label">Grid Span</label>
              <select className="field-input" value={form.span}
                onChange={(e) => setForm({ ...form, span: e.target.value })}>
                {SPAN_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="field-label">Caption</label>
            <input className="field-input" value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              placeholder="Optional caption…" />
          </div>

          {/* Sort order */}
          <div>
            <label className="field-label">Sort Order</label>
            <input type="number" className="field-input" value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              placeholder="0" />
          </div>

          {/* ── Media upload ── */}
          <div className="space-y-2">
            <label className="field-label">
              Media File {!editing && <span className="text-red-400">*</span>}
              <span className="text-mist/50 normal-case font-normal ml-1 text-[10px]">
                — image or video, up to 500 MB
              </span>
            </label>

            {/* File picker */}
            <label className="flex items-center gap-3 w-full cursor-pointer bg-ink border border-white/10 hover:border-accent/40 rounded-lg px-3 py-2.5 transition-colors group">
              <svg className="w-4 h-4 text-mist group-hover:text-accent transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
              </svg>
              <span className="text-sm text-mist group-hover:text-bone transition-colors truncate">
                {mediaFile ? mediaFile.name : "Choose file…"}
              </span>
              <input
                type="file"
                accept="image/*,video/*"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files[0] || null;
                  setMediaFile(f);
                  if (f) setForm((prev) => ({ ...prev, src: "" }));
                }}
              />
            </label>

            {/* Clear file button */}
            {mediaFile && (
              <button type="button"
                onClick={() => setMediaFile(null)}
                className="text-xs text-mist/60 hover:text-red-400 transition-colors">
                ✕ Remove file
              </button>
            )}

            {/* URL fallback — only shown when no file selected */}
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
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-black border border-white/10">
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
              ) : editing ? "Save Changes" : "Add Item"}
            </button>
          </div>

        </form>
      </Modal>

      {/* ── Delete confirm ── */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Gallery Item">
        <p className="text-sm text-mist mb-6">
          Delete <span className="text-bone font-medium">"{deleteConfirm?.caption || "this item"}"</span>?
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
