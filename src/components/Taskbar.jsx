import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Single dock icon ──────────────────────────────────────────────────────
function DockIcon({ app, win, isActive, onClick }) {
  const Icon = app.icon;
  const isRunning = !!win;
  const [isBouncing, setIsBouncing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!isRunning) {
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 1000);
    }
    onClick();
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col items-center gap-0.5"
    >
      {/* Custom Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="absolute -top-7 px-2.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold tracking-wide pointer-events-none whitespace-nowrap shadow-md z-[10000] font-sans"
          >
            {app.label}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.2, y: -7 }}
        whileTap={{ scale: 0.94 }}
        animate={isBouncing ? { y: [0, -18, 0, -9, 0] } : { y: 0 }}
        transition={isBouncing ? { duration: 0.75, ease: "easeInOut" } : { type: 'spring', stiffness: 400, damping: 15 }}
        onClick={handleClick}
        className={[
          'w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl flex items-center justify-center relative overflow-hidden',
          'border transition-all duration-200 shadow-md',
          isActive && isRunning && !win.isMinimized
            ? 'bg-gradient-to-b from-cyan-400/40 to-blue-500/25 border-cyan-300/80 shadow-[0_0_15px_rgba(34,211,238,0.55),inset_0_1px_1px_rgba(255,255,255,0.45)]'
            : 'bg-gradient-to-b from-white/30 to-white/10 border-white/45 hover:from-white/40 hover:to-white/20 hover:border-white/60 hover:shadow-cyan-200/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]',
          isRunning && win.isMinimized ? 'opacity-60 hover:opacity-90' : 'opacity-100',
        ].join(' ')}
      >
        {/* Button glossy highlight */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
        <Icon className="text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.25)] w-[18px] h-[18px] md:w-[22px] md:h-[22px]" />
      </motion.button>

      {/* Glowing dot indicator (running apps) */}
      <div className="h-1.5 flex items-center justify-center">
        {isRunning && (
          <span className="w-1 h-1 rounded-full bg-white/90 shadow-[0_0_6px_1.5px_rgba(255,255,255,0.8)]" />
        )}
      </div>
    </div>
  );
}

// ─── Taskbar (Dock) ─────────────────────────────────────────────────────────
export default function Taskbar({ apps = [], activeWindows = [], activeId = null, onWindowClick }) {
  return (
    <motion.div
      layout
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        layout: { type: 'spring', stiffness: 280, damping: 28 },
        default: { type: 'spring', stiffness: 280, damping: 28, delay: 0.1 },
      }}
      className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[9999]
        flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5
        rounded-2xl
        bg-white/20 dark:bg-black/25 backdrop-blur-2xl
        border-t border-l border-white/40 border-r border-b border-white/20
        shadow-[0_15px_35px_rgba(0,50,150,0.18),inset_0_1px_1px_rgba(255,255,255,0.45)]"
    >
      {/* Glossy reflection bar overlay */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-2xl" />

      {/* Pinned shortcuts */}
      <div className="flex items-center gap-2 md:gap-3">
        {apps.map((app) => {
          const win = activeWindows.find((w) => w.id === app.id);
          return (
            <DockIcon
              key={app.id}
              app={app}
              win={win}
              isActive={win && win.id === activeId}
              onClick={() => onWindowClick(app.id)}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
