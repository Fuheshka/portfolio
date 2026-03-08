/**
 * Wallpaper
 *
 * Props:
 *   src      — URL of the image or video (optional)
 *   type     — 'image' | 'video' (auto-detected from extension if omitted)
 *   overlay  — Tailwind class string for the overlay tint (default: 'bg-black/25')
 */
export default function Wallpaper({
  src,
  type,
  overlay = 'bg-black/25',
}) {
  const hasMedia = Boolean(src);
  // Auto-detect type from file extension if not provided
  const resolved = type ?? (src && /\.(mp4|webm|ogg)(\?|$)/i.test(src) ? 'video' : 'image');

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {!hasMedia ? (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-300" />
      ) : resolved === 'video' ? (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img
          src={src}
          alt="wallpaper"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      )}

      {/* Readability overlay */}
      <div className={`absolute inset-0 ${overlay}`} />
    </div>
  );
}
