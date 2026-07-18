const WALLPAPER_MAP = {
  default: 'assets/frutiger_aero_wallpaper.png',
  aurora:  'assets/aurora_aero.png',
  eco:     'assets/eco_glass.png',
  water:   'assets/water_sphere.png',
};

export default function Wallpaper({ currentWallpaper = 'default', blurAmount = 8 }) {
  const imgSrc = WALLPAPER_MAP[currentWallpaper] ?? WALLPAPER_MAP.default;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden select-none">
      <img
        src={`${import.meta.env.BASE_URL}${imgSrc}`}
        alt="wallpaper"
        className="absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-500 ease-out"
        style={{
          filter: `blur(${blurAmount}px)`,
        }}
        draggable={false}
      />
      {/* Readability overlay */}
      <div className="absolute inset-0 bg-black/[0.08]" />
    </div>
  );
}
