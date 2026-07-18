import { useState } from 'react';
import { Volume2, VolumeX, MousePointer, Image, Eye, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/audio';

const WALLPAPERS = [
  { id: 'default', label: 'Classic Aero', src: 'assets/frutiger_aero_wallpaper.png' },
  { id: 'aurora',  label: 'Aurora Waves', src: 'assets/aurora_aero.png' },
  { id: 'eco',     label: 'Eco Glass',    src: 'assets/eco_glass.png' },
  { id: 'water',   label: 'Water Sphere', src: 'assets/water_sphere.png' },
];

export default function Personalization({
  currentWallpaper,
  setWallpaper,
  blurAmount,
  setBlurAmount,
  soundEnabled,
  setSoundEnabled,
}) {
  const handleWallpaperClick = (id) => {
    playClickSound();
    setWallpaper(id);
  };

  const handleBlurChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setBlurAmount(val);
  };

  const toggleSound = () => {
    playClickSound();
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="p-5 pb-8 flex flex-col gap-6 font-sans text-white/90 max-w-full overflow-x-hidden">
      {/* Wallpaper Selection */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-cyan-200 mb-3 flex items-center gap-1.5 drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.2)]">
          <Image size={12} className="text-cyan-300" />
          Desktop Background
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {WALLPAPERS.map((wp) => {
            const isSelected = currentWallpaper === wp.id;
            return (
              <button
                key={wp.id}
                onClick={() => handleWallpaperClick(wp.id)}
                className={[
                  'group relative flex flex-col rounded-xl overflow-hidden border text-left cursor-pointer transition-all duration-200',
                  isSelected
                    ? 'border-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] scale-[1.02]'
                    : 'border-white/20 hover:border-white/45 bg-black/10 hover:bg-white/5 hover:scale-[1.01]',
                ].join(' ')}
              >
                {/* Image Preview */}
                <div className="h-16 w-full overflow-hidden relative bg-slate-950">
                  <img
                    src={`${import.meta.env.BASE_URL}${wp.src}`}
                    alt={wp.label}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                </div>
                {/* Label */}
                <div className="p-2 text-xs font-bold flex items-center justify-between">
                  <span>{wp.label}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(34,211,238,1)]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Blur Adjuster */}
      <div className="bg-white/10 p-4 rounded-xl border border-white/20 shadow-md backdrop-blur-md relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-cyan-200 mb-3 flex items-center gap-1.5 drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.2)]">
          <Eye size={12} className="text-cyan-300" />
          Wallpaper Blur
        </h3>

        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="16"
            step="2"
            value={blurAmount}
            onChange={handleBlurChange}
            onInput={playClickSound}
            className="flex-1 h-1.5 bg-black/35 rounded-lg appearance-none cursor-pointer accent-cyan-300 border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]"
          />
          <span className="text-xs font-bold text-cyan-200 min-w-8 text-right font-mono">{blurAmount}px</span>
        </div>
        <p className="text-[10px] text-white/60 mt-2 italic">Adjust window background readability contrast.</p>
      </div>

      {/* Toggle Controls */}
      <div className="w-full">
        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className={[
            'w-full p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 relative overflow-hidden flex items-center justify-between',
            'bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-md',
            soundEnabled
              ? 'border-cyan-300/60 shadow-[0_4px_12px_rgba(0,180,255,0.12),inset_0_1px_1px_rgba(255,255,255,0.2)]'
              : 'border-white/15 hover:border-white/30',
          ].join(' ')}
        >
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-black/20 border border-white/10">
              {soundEnabled ? (
                <Volume2 size={16} className="text-cyan-300" />
              ) : (
                <VolumeX size={16} className="text-white/55" />
              )}
            </div>
            <div>
              <div className="text-xs font-bold">Sound Effects</div>
              <div className="text-[10px] text-white/60 mt-0.5">{soundEnabled ? 'Enabled' : 'Muted'}</div>
            </div>
          </div>
          {/* Glass Toggle Pill */}
          <div className={[
            'w-10 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center',
            soundEnabled ? 'bg-cyan-400/50 border border-cyan-300/40' : 'bg-black/35 border border-white/10'
          ].join(' ')}>
            <div className={[
              'w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 shadow-md',
              soundEnabled ? 'translate-x-5 bg-gradient-to-tr from-cyan-200 to-white' : 'translate-x-0'
            ].join(' ')} />
          </div>
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/45 select-none pt-2">
        <Sparkles size={10} />
        <span>Frutiger Aero Customizer v1.0</span>
      </div>
    </div>
  );
}
