/**
 * MediaPreview — renders an image or video inside its container.
 *
 * Usage:
 *   <div className="relative aspect-video">
 *     <MediaPreview src={src} type={type} />
 *   </div>
 *
 * The parent MUST have `position: relative` (or use the `relative` Tailwind class)
 * and a defined size (aspect ratio, fixed height, etc.).
 */
export default function MediaPreview({ src, type, poster }) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-mist/20">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="1"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
        <span className="text-[10px] uppercase tracking-widest">No preview</span>
      </div>
    );
  }

  if (type === "video") {
    return (
      <video
        src={src}
        poster={poster || undefined}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <img
      src={src}
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
      loading="lazy"
      onError={(e) => { e.currentTarget.style.display = "none"; }}
    />
  );
}
