import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Volume2, VolumeX, Globe } from 'lucide-react';
import { playClickSound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export default function MenuBar({
  activeTitle,
  soundEnabled,
  setSoundEnabled,
  onOpenApp,
  onRestart,
  onShutDown,
}) {
  const { lang, setLang, t } = useLanguage();
  const [now, setNow] = useState(new Date());
  const [appleMenuOpen, setAppleMenuOpen] = useState(false);
  const appleMenuRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 30); // update every 30s
    return () => clearInterval(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (appleMenuRef.current && !appleMenuRef.current.contains(event.target)) {
        setAppleMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateTime = (date) => {
    const locale = lang === 'ru' ? 'ru-RU' : 'en-US';
    const dayName = date.toLocaleDateString(locale, { weekday: 'short' });
    const day = date.getDate();
    const month = date.toLocaleDateString(locale, { month: 'short' });
    const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${dayName} ${day} ${month} ${time}`;
  };

  const handleAppleMenuClick = () => {
    playClickSound();
    setAppleMenuOpen(!appleMenuOpen);
  };

  const handleAction = (callback) => {
    playClickSound();
    setAppleMenuOpen(false);
    callback();
  };

  const toggleLanguage = () => {
    playClickSound();
    setLang(lang === 'en' ? 'ru' : 'en');
  };

  return (
    <div className="absolute top-0 left-0 right-0 h-7 bg-white/20 dark:bg-black/25 backdrop-blur-xl border-b border-white/15 text-white text-xs px-4 flex items-center justify-between z-[9999] select-none font-sans font-medium">
      {/* Left side: System Menu + Active App */}
      <div className="flex items-center gap-4 relative">
        {/* Fuheshka OS Logo Menu */}
        <div ref={appleMenuRef} className="relative">
          <button
            onClick={handleAppleMenuClick}
            className={`cursor-pointer hover:bg-white/20 px-1.5 py-0.5 rounded-lg transition-colors flex items-center justify-center gap-1 group ${appleMenuOpen ? 'bg-white/20' : ''}`}
            title="Fuheshka OS Menu"
          >
            {/* Custom Glossy Aero 'F' Logo Orb */}
            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-400 via-teal-300 to-emerald-400 border border-white/80 shadow-[0_0_8px_rgba(34,211,238,0.5)] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
              <span className="text-[10px] font-black text-slate-950 font-display leading-none select-none tracking-tighter drop-shadow-[0_0.5px_0.5px_rgba(255,255,255,0.4)]">
                F
              </span>
            </div>
          </button>
          
          {/* Dropdown Menu */}
          <AnimatePresence>
            {appleMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute left-0 mt-1.5 w-52 rounded-lg bg-slate-900/85 backdrop-blur-2xl border border-white/10 shadow-2xl py-1.5 z-[10000] flex flex-col text-white/90"
              >
                <button
                  onClick={() => handleAction(() => onOpenApp('about'))}
                  className="w-full text-left px-4 py-1.5 hover:bg-cyan-500/80 hover:text-white cursor-pointer transition-colors font-bold text-xs"
                >
                  {t('menu_about')}
                </button>
                <button
                  onClick={() => handleAction(() => onOpenApp('personalization'))}
                  className="w-full text-left px-4 py-1.5 hover:bg-cyan-500/80 hover:text-white cursor-pointer transition-colors text-xs"
                >
                  {t('menu_settings')}
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button
                  onClick={() => handleAction(onRestart)}
                  className="w-full text-left px-4 py-1.5 hover:bg-cyan-500/80 hover:text-white cursor-pointer transition-colors text-xs"
                >
                  {t('menu_restart')}
                </button>
                <button
                  onClick={() => handleAction(onShutDown)}
                  className="w-full text-left px-4 py-1.5 hover:bg-cyan-500/80 hover:text-white cursor-pointer transition-colors text-xs"
                >
                  {t('menu_shutdown')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active Application Name */}
        <span className="font-bold text-white tracking-wide font-display">
          {activeTitle || t('app_finder')}
        </span>
      </div>

      {/* Right side: Status icons + Lang Switcher + Clock */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Language Switcher Pill */}
        <button
          onClick={toggleLanguage}
          title={lang === 'en' ? 'Switch to Russian' : 'Переключить на английский'}
          className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded-full border border-white/20 bg-black/10 backdrop-blur-md transition-all flex items-center gap-1 text-[10px] font-bold tracking-wider"
        >
          <Globe size={11} className="text-cyan-300" />
          <span>{lang.toUpperCase()}</span>
        </button>

        {/* Wifi Icon */}
        <Wifi size={13} className="text-white/80" />

        {/* Sound Toggle */}
        <button
          onClick={() => {
            playClickSound();
            setSoundEnabled(!soundEnabled);
          }}
          title={soundEnabled ? t('menu_sound_mute') : t('menu_sound_unmute')}
          className="cursor-pointer hover:bg-white/20 p-1 rounded transition-colors flex items-center justify-center"
        >
          {soundEnabled ? (
            <Volume2 size={13} className="text-white/85" />
          ) : (
            <VolumeX size={13} className="text-white/55" />
          )}
        </button>

        {/* Time and Date */}
        <span className="tabular-nums text-white/90 font-semibold drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.15)] font-mono text-[11px]">
          {formatDateTime(now)}
        </span>
      </div>
    </div>
  );
}
