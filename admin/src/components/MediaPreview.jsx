export default function MediaPreview({ src, type, poster }) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-mist/30 text-3xl">
        ◻
      </div>
    );
  }

  if (type === "video") {
    return (
      <video
        src={src}
        poster={poster}
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
    />
  );
}
