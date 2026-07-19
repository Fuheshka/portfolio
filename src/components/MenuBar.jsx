import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Volume2, VolumeX } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export default function MenuBar({
  activeTitle,
  soundEnabled,
  setSoundEnabled,
  onOpenApp,
  onRestart,
  onShutDown,
}) {
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
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
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

  return (
    <div className="absolute top-0 left-0 right-0 h-7 bg-white/20 dark:bg-black/25 backdrop-blur-xl border-b border-white/15 text-white text-xs px-4 flex items-center justify-between z-[9999] select-none font-sans font-medium">
      {/* Left side: Apple menu + Active App */}
      <div className="flex items-center gap-4 relative">
        {/* Apple Logo Menu */}
        <div ref={appleMenuRef} className="relative">
          <button
            onClick={handleAppleMenuClick}
            className={`cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded transition-colors text-sm flex items-center justify-center ${appleMenuOpen ? 'bg-white/20' : ''}`}
          >
            
          </button>
          
          {/* Dropdown Menu */}
          <AnimatePresence>
            {appleMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute left-0 mt-1.5 w-48 rounded-lg bg-slate-900/85 backdrop-blur-2xl border border-white/10 shadow-2xl py-1.5 z-[10000] flex flex-col text-white/90"
              >
                <button
                  onClick={() => handleAction(() => onOpenApp('about'))}
                  className="w-full text-left px-4 py-1.5 hover:bg-cyan-500/80 hover:text-white cursor-pointer transition-colors font-bold text-xs"
                >
                  About This Portfolio
                </button>
                <button
                  onClick={() => handleAction(() => onOpenApp('personalization'))}
                  className="w-full text-left px-4 py-1.5 hover:bg-cyan-500/80 hover:text-white cursor-pointer transition-colors text-xs"
                >
                  System Settings...
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button
                  onClick={() => handleAction(onRestart)}
                  className="w-full text-left px-4 py-1.5 hover:bg-cyan-500/80 hover:text-white cursor-pointer transition-colors text-xs"
                >
                  Restart...
                </button>
                <button
                  onClick={() => handleAction(onShutDown)}
                  className="w-full text-left px-4 py-1.5 hover:bg-cyan-500/80 hover:text-white cursor-pointer transition-colors text-xs"
                >
                  Shut Down...
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active Application Name */}
        <span className="font-bold text-white tracking-wide font-display">
          {activeTitle || 'Finder'}
        </span>
      </div>

      {/* Right side: Status icons + Clock */}
      <div className="flex items-center gap-4">
        {/* Wifi Icon */}
        <Wifi size={13} className="text-white/80" />

        {/* Sound Toggle */}
        <button
          onClick={() => {
            playClickSound();
            setSoundEnabled(!soundEnabled);
          }}
          title={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
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
