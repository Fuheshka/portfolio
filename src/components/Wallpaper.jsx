export default function Wallpaper() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden select-none">
      <img
        src={`${import.meta.env.BASE_URL}assets/frutiger_aero_wallpaper.png`}
        alt="wallpaper"
        className="absolute inset-0 w-full h-full object-cover blur-[8px] scale-105"
        draggable={false}
      />
      {/* Readability overlay */}
      <div className="absolute inset-0 bg-black/[0.08]" />
    </div>
  );
}
