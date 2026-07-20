import { Volume2, VolumeX, Image, Eye, Sparkles, Globe } from 'lucide-react';
import { playClickSound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

const WALLPAPERS = [
  { id: 'default', key: 'default', src: 'assets/frutiger_aero_wallpaper.png' },
  { id: 'aurora',  key: 'aurora',  src: 'assets/aurora_aero.png' },
  { id: 'eco',     key: 'eco',     src: 'assets/eco_glass.png' },
  { id: 'water',   key: 'water',   src: 'assets/water_sphere.png' },
];

export default function Personalization({
  currentWallpaper,
  setWallpaper,
  blurAmount,
  setBlurAmount,
  soundEnabled,
  setSoundEnabled,
}) {
  const { lang, setLang, t } = useLanguage();

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

  const handleLangSelect = (newLang) => {
    playClickSound();
    setLang(newLang);
  };

  return (
    <div className="p-5 pb-8 flex flex-col gap-6 font-sans text-white/90 max-w-full overflow-x-hidden">
      {/* System Language Selector */}
      <div className="bg-white/10 p-4 rounded-xl border border-white/20 shadow-md backdrop-blur-md relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        
        <h3 className="text-sm font-bold text-cyan-200 mb-3 flex items-center gap-1.5 font-display drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.2)]">
          <Globe size={13} className="text-cyan-300" />
          {t('pers_lang')}
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleLangSelect('en')}
            className={[
              'p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all',
              lang === 'en'
                ? 'border-cyan-300 bg-cyan-500/20 text-white shadow-[0_0_12px_rgba(34,211,238,0.35)]'
                : 'border-white/20 hover:border-white/40 bg-black/15 text-white/70 hover:text-white',
            ].join(' ')}
          >
            <span>🇬🇧 English</span>
            {lang === 'en' && <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(34,211,238,1)]" />}
          </button>

          <button
            onClick={() => handleLangSelect('ru')}
            className={[
              'p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all',
              lang === 'ru'
                ? 'border-cyan-300 bg-cyan-500/20 text-white shadow-[0_0_12px_rgba(34,211,238,0.35)]'
                : 'border-white/20 hover:border-white/40 bg-black/15 text-white/70 hover:text-white',
            ].join(' ')}
          >
            <span>🇷🇺 Русский</span>
            {lang === 'ru' && <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(34,211,238,1)]" />}
          </button>
        </div>
      </div>

      {/* Wallpaper Selection */}
      <div>
        <h3 className="text-sm font-bold text-cyan-200 mb-3 flex items-center gap-1.5 font-display drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.2)]">
          <Image size={13} className="text-cyan-300" />
          {t('pers_bg')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {WALLPAPERS.map((wp) => {
            const isSelected = currentWallpaper === wp.id;
            const wpLabel = t(`wallpapers.${wp.key}`);
            return (
              <button
                key={wp.id}
                onClick={() => handleWallpaperClick(wp.id)}
                className={[
                  'group relative flex flex-col rounded-xl overflow-hidden border text-left cursor-pointer transition-[transform,border-color,box-shadow] duration-200 ease-out active:scale-[0.97]',
                  isSelected
                    ? 'border-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] scale-[1.01]'
                    : 'border-white/20 hover:border-white/45 bg-black/10 hover:bg-white/5 hover:scale-[1.01]',
                ].join(' ')}
              >
                {/* Image Preview */}
                <div className="h-16 w-full overflow-hidden relative bg-slate-950">
                  <img
                    src={`${import.meta.env.BASE_URL}${wp.src}`}
                    alt={wpLabel}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                </div>
                {/* Label */}
                <div className="p-2 text-xs font-bold flex items-center justify-between">
                  <span>{wpLabel}</span>
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
        
        <h3 className="text-sm font-bold text-cyan-200 mb-3 flex items-center gap-1.5 font-display drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.2)]">
          <Eye size={13} className="text-cyan-300" />
          {t('pers_blur')}
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
        <p className="text-[10px] text-white/60 mt-2 italic">{t('pers_blur_desc')}</p>
      </div>

      {/* Toggle Controls */}
      <div className="w-full">
        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className={[
            'w-full p-4 rounded-xl border text-left cursor-pointer transition-[transform,border-color,box-shadow] duration-150 ease-out active:scale-[0.98] relative overflow-hidden flex items-center justify-between',
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
              <div className="text-xs font-bold">{t('pers_sound')}</div>
              <div className="text-[10px] text-white/60 mt-0.5">
                {soundEnabled ? t('pers_sound_enabled') : t('pers_sound_muted')}
              </div>
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
        <span>{t('pers_footer')}</span>
      </div>
    </div>
  );
}
