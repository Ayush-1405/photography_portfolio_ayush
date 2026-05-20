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
  const [editing, setEditing] = useState(null); // item being edited
  const [form, setForm] = useState(EMPTY_FORM);
  const [mediaFile, setMediaFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await getProjects();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

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
      src: item.src,
      sort_order: String(item.sort_order ?? 0),
    });
    setMediaFile(null);
    setPosterFile(null);
    setError("");
    setShowModal(true);
  }

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

      if (editing) {
        await updateProject(editing.id, fd);
      } else {
        await createProject(fd);
      }
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProject(id);
      setDeleteConfirm(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  const previewSrc = mediaFile ? URL.createObjectURL(mediaFile) : form.src;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-bone">Projects</h1>
          <p className="text-sm text-mist mt-1">{items.length} project{items.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-accent text-ink text-sm font-semibold px-4 py-2 rounded hover:bg-accent/90 transition-colors"
        >
          + Add Project
        </button>
      </div>

      {loading ? (
        <div className="text-mist text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-mist">
          <p className="text-4xl mb-3">◈</p>
          <p>No projects yet. Add your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-graphite border border-white/5 rounded-lg overflow-hidden group">
              <div className="aspect-[16/10] relative bg-black">
                <MediaPreview src={item.src} type={item.type} poster={item.poster} />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-bone font-medium text-sm truncate">{item.title}</p>
                    <p className="text-xs text-mist mt-0.5">{item.category} · {item.year}</p>
                  </div>
                  <span className={`shrink-0 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                    item.type === "video"
                      ? "text-blue-400 border-blue-400/20 bg-blue-400/5"
                      : "text-accent border-accent/20 bg-accent/5"
                  }`}>
                    {item.type}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-mist mt-2 line-clamp-2">{item.description}</p>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 text-xs text-mist border border-white/10 rounded px-3 py-1.5 hover:text-bone hover:border-white/20 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(item)}
                    className="flex-1 text-xs text-red-400 border border-red-400/20 rounded px-3 py-1.5 hover:bg-red-400/5 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? "Edit Project" : "Add Project"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="field-label">Title *</label>
              <input
                className="field-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="Project title"
              />
            </div>
            <div>
              <label className="field-label">Category *</label>
              <input
                className="field-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
                placeholder="Cinematography"
              />
            </div>
            <div>
              <label className="field-label">Year *</label>
              <input
                className="field-input"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                required
                placeholder="2026"
              />
            </div>
            <div className="col-span-2">
              <label className="field-label">Description</label>
              <textarea
                className="field-input resize-none"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description…"
              />
            </div>
            <div>
              <label className="field-label">Type *</label>
              <select
                className="field-input"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="field-label">Sort Order</label>
              <input
                type="number"
                className="field-input"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          {/* Media upload */}
          <div>
            <label className="field-label">
              Media File {!editing && "*"}
              <span className="text-mist/60 normal-case font-normal ml-1">(image or video)</span>
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setMediaFile(e.target.files[0] || null)}
              className="file-input"
            />
            {!mediaFile && (
              <div className="mt-2">
                <label className="field-label">Or paste URL</label>
                <input
                  className="field-input"
                  value={form.src}
                  onChange={(e) => setForm({ ...form, src: e.target.value })}
                  placeholder="https://…"
                />
              </div>
            )}
          </div>

          {/* Poster (for videos) */}
          {form.type === "video" && (
            <div>
              <label className="field-label">
                Poster / Thumbnail
                <span className="text-mist/60 normal-case font-normal ml-1">(optional, for videos)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPosterFile(e.target.files[0] || null)}
                className="file-input"
              />
            </div>
          )}

          {/* Preview */}
          {previewSrc && (
            <div className="rounded overflow-hidden aspect-[16/10] bg-black">
              <MediaPreview src={previewSrc} type={form.type} />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 text-sm text-mist border border-white/10 rounded px-4 py-2 hover:text-bone transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 text-sm bg-accent text-ink font-semibold rounded px-4 py-2 hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : editing ? "Save Changes" : "Add Project"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Project">
        <p className="text-sm text-mist mb-6">
          Are you sure you want to delete <span className="text-bone font-medium">"{deleteConfirm?.title}"</span>?
          This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="flex-1 text-sm text-mist border border-white/10 rounded px-4 py-2 hover:text-bone transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(deleteConfirm.id)}
            className="flex-1 text-sm bg-red-500 text-white font-semibold rounded px-4 py-2 hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
