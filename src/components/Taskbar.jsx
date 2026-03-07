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
      animate={{ opacity: win.isMinimized ? 0.4 : 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.55, y: 4 }}
      transition={{
        layout: { type: 'spring', stiffness: 320, damping: 26, mass: 0.7 },
        opacity: { duration: 0.15 },
        scale:   { duration: 0.15 },
        y:       { duration: 0.15 },
        default: { type: 'spring', stiffness: 320, damping: 24, mass: 0.7 },
      }}
      className="relative flex flex-col items-center gap-1"
    >
      <motion.button
        whileHover={{ scale: 1.2, y: -4 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 360, damping: 20, mass: 0.6 }}
        onClick={onClick}
        title={win.title}
        className={[
          'w-11 h-11 rounded-2xl flex items-center justify-center',
          'border transition-colors duration-150',
          isActive && !win.isMinimized
            ? 'bg-white/40 border-cyan-300/70 shadow-[0_0_14px_rgba(103,232,249,0.4)]'
            : 'bg-white/20 border-white/30 hover:bg-white/35',
        ].join(' ')}
      >
        <Icon size={22} className="text-white drop-shadow-sm" />
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
              shadow-[0_0_6px_2px_rgba(103,232,249,0.75)]"
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
    <div className="flex flex-col items-center leading-none select-none shrink-0">
      <span className="text-[15px] font-bold text-white tabular-nums drop-shadow-sm">{time}</span>
      <span className="text-[10px] text-white/60 mt-0.5">{date}</span>
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
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[9999]
        flex items-center gap-3 px-4
        h-14
        rounded-2xl
        bg-white/20 backdrop-blur-xl
        border border-white/30
        shadow-[0_8px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.35)]"
    >
      {/* Open window icons */}
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

      {/* Divider — only when windows are open */}
      <AnimatePresence>
        {activeWindows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.3 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.3 }}
            transition={{ duration: 0.2 }}
            className="w-px h-7 bg-white/25 shrink-0"
          />
        )}
      </AnimatePresence>

      {/* System tray */}
      <SysTray />
    </motion.div>
  );
}
