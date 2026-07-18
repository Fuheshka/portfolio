import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, User, Mail } from 'lucide-react';

// ─── type → icon map ───────────────────────────────────────────────────────
const TYPE_ICON = {
  projects: Folder,
  about:    User,
  contact:  Mail,
};

// ─── Single dock icon ──────────────────────────────────────────────────────
function DockIcon({ win, isActive, onClick }) {
  const Icon = TYPE_ICON[win.type] ?? Folder;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.6, y: 6 }}
      animate={{ opacity: win.isMinimized ? 0.45 : 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.55, y: 4 }}
      transition={{
        layout: { type: 'spring', stiffness: 380, damping: 30, mass: 0.6 },
        opacity: { duration: 0.12 },
        scale:   { duration: 0.12 },
        y:       { duration: 0.12 },
        default: { type: 'spring', stiffness: 380, damping: 28, mass: 0.6 },
      }}
      className="relative flex flex-col items-center gap-1"
    >
      <motion.button
        whileHover={{ scale: 1.15, y: -4 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 450, damping: 25, mass: 0.5 }}
        onClick={onClick}
        title={win.title}
        className={[
          'w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl flex items-center justify-center relative overflow-hidden',
          'border transition-colors duration-150 shadow-md',
          isActive && !win.isMinimized
            ? 'bg-gradient-to-b from-cyan-400/40 to-blue-500/25 border-cyan-300/80 shadow-[0_0_15px_rgba(34,211,238,0.55),inset_0_1px_1px_rgba(255,255,255,0.45)]'
            : 'bg-gradient-to-b from-white/30 to-white/10 border-white/45 hover:from-white/40 hover:to-white/20 hover:border-white/60 hover:shadow-cyan-200/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]',
        ].join(' ')}
      >
        {/* Button glossy gloss highlight */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
        <Icon className="text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.25)] w-[18px] h-[18px] md:w-[22px] md:h-[22px]" />
      </motion.button>

      {/* Glowing dot indicator */}
      <AnimatePresence>
        {!win.isMinimized && (
          <motion.span
            key="dot"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            className="w-1.5 h-1.5 rounded-full bg-cyan-300
              shadow-[0_0_8px_3px_rgba(103,232,249,0.9)]"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── System tray: clock + date ─────────────────────────────────────────────
function SysTray() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 60);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  const date = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  return (
    <div className="flex flex-col items-center leading-none select-none shrink-0 border-l border-white/20 pl-3 md:pl-4">
      <span className="text-[13px] md:text-[15px] font-bold text-white tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">{time}</span>
      <span className="text-[9px] md:text-[10px] text-white/90 font-medium drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.2)] mt-0.5">{date}</span>
    </div>
  );
}

// ─── Taskbar ────────────────────────────────────────────────────────────────
export default function Taskbar({ activeWindows = [], activeId = null, onWindowClick }) {
  return (
    <motion.div
      layout
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        layout: { type: 'spring', stiffness: 280, damping: 28 },
        default: { type: 'spring', stiffness: 280, damping: 28, delay: 0.1 },
      }}
      className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[9999]
        flex items-center gap-2 md:gap-3 px-4 md:px-5
        h-12 md:h-14
        rounded-2xl
        bg-gradient-to-b from-white/35 via-white/20 to-white/10 backdrop-blur-2xl
        border-t border-l border-white/60 border-r border-b border-white/30
        shadow-[0_15px_35px_rgba(0,50,150,0.18),inset_0_1px_1px_rgba(255,255,255,0.45)]"
    >
      {/* Glossy reflection bar overlay */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-2xl" />

      {/* Open window icons */}
      <div className="flex-1 min-w-0 overflow-x-auto md:overflow-visible scrollbar-none">
        <div className="flex items-center gap-2 md:gap-3 w-max">
          <AnimatePresence mode="sync">
            {activeWindows.map((win) => (
              <DockIcon
                key={win.id}
                win={win}
                isActive={win.id === activeId}
                onClick={() => onWindowClick(win.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Divider — only when windows are open */}
      <AnimatePresence>
        {activeWindows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.3 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.3 }}
            transition={{ duration: 0.2 }}
            className="w-px h-6 md:h-7 bg-white/30 shrink-0 mx-1"
          />
        )}
      </AnimatePresence>

      {/* System tray */}
      <SysTray />
    </motion.div>
  );
}
