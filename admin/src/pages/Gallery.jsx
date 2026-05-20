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

  async function load() {
    setLoading(true);
    try {
      const data = await getGallery();
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
      type: item.type,
      span: item.span,
      caption: item.caption || "",
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
      fd.append("type", form.type);
      fd.append("span", form.span);
      fd.append("caption", form.caption);
      fd.append("sort_order", form.sort_order);
      if (mediaFile) fd.append("media", mediaFile);
      else if (form.src) fd.append("src", form.src);
      if (posterFile) fd.append("poster", posterFile);

      if (editing) {
        await updateGalleryItem(editing.id, fd);
      } else {
        await createGalleryItem(fd);
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
      await deleteGalleryItem(id);
      setDeleteConfirm(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  const previewSrc = mediaFile ? URL.createObjectURL(mediaFile) : form.src;

  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-bone">Gallery</h1>
          <p className="text-sm text-mist mt-1">{items.length} item{items.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-accent text-ink text-sm font-semibold px-4 py-2 rounded hover:bg-accent/90 transition-colors"
        >
          + Add Item
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {["all", "image", "video"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded border transition-colors capitalize ${
              filter === f
                ? "bg-accent/10 text-accent border-accent/30"
                : "text-mist border-white/10 hover:text-bone hover:border-white/20"
            }`}
          >
            {f === "all" ? `All (${items.length})` : `${f}s (${items.filter((i) => i.type === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-mist text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-mist">
          <p className="text-4xl mb-3">◻</p>
          <p>No items yet. Add your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((item) => (
            <div key={item.id} className="bg-graphite border border-white/5 rounded-lg overflow-hidden group">
              <div className="aspect-square relative bg-black">
                <MediaPreview src={item.src} type={item.type} poster={item.poster} />
                <div className="absolute top-1.5 right-1.5 flex gap-1">
                  <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border backdrop-blur-sm ${
                    item.type === "video"
                      ? "text-blue-400 border-blue-400/30 bg-black/60"
                      : "text-accent border-accent/30 bg-black/60"
                  }`}>
                    {item.type}
                  </span>
                </div>
              </div>
              <div className="p-2.5">
                {item.caption && (
                  <p className="text-xs text-mist truncate mb-1.5">{item.caption}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-mist/60 uppercase tracking-wider">{item.span}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(item)}
                      className="text-[10px] text-mist hover:text-bone px-1.5 py-0.5 rounded hover:bg-white/5 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(item)}
                      className="text-[10px] text-red-400/70 hover:text-red-400 px-1.5 py-0.5 rounded hover:bg-red-400/5 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? "Edit Gallery Item" : "Add Gallery Item"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
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
              <label className="field-label">Grid Span</label>
              <select
                className="field-input"
                value={form.span}
                onChange={(e) => setForm({ ...form, span: e.target.value })}
              >
                {SPAN_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="field-label">Caption</label>
              <input
                className="field-input"
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                placeholder="Optional caption…"
              />
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

          {/* Poster for videos */}
          {form.type === "video" && (
            <div>
              <label className="field-label">
                Poster / Thumbnail
                <span className="text-mist/60 normal-case font-normal ml-1">(optional)</span>
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
            <div className="rounded overflow-hidden aspect-square bg-black">
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
              {saving ? "Saving…" : editing ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Gallery Item">
        <p className="text-sm text-mist mb-6">
          Delete <span className="text-bone font-medium">"{deleteConfirm?.caption || deleteConfirm?.id}"</span>?
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
