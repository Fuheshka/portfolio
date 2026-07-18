import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Folder, User, Mail } from 'lucide-react';
import Window from './components/Window';
import Taskbar from './components/Taskbar';
import Wallpaper from './components/Wallpaper';

const APPS = [
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'about',    label: 'About Me', icon: User   },
  { id: 'contact',  label: 'Contact',  icon: Mail   },
];

const CASCADE_OFFSET = 30;
const BASE_X = 80;
const BASE_Y = 60;
let zCounter = 100;

function nextZ() { return ++zCounter; }

export default function App() {
  const [isBooting, setIsBooting]   = useState(true);
  const [windows, setWindows]       = useState([]);
  const [activeId, setActiveId]     = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setIsBooting(false), 3000);
    return () => clearTimeout(t);
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────
  const openCount = windows.length;

  function openWindow(id) {
    const existing = windows.find((w) => w.id === id);
    if (existing) {
      // Restore if minimized, always bring to front
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, isMinimized: false, zIndex: nextZ() } : w
        )
      );
      setActiveId(id);
      return;
    }
    const app = APPS.find((a) => a.id === id);
    const count = openCount;
    const newWin = {
      id,
      type:        id,
      title:       app?.label ?? id,
      icon:        app?.icon ?? null,
      isMinimized: false,
      isMaximized: false,
      zIndex:      nextZ(),
      position:    { x: BASE_X + count * CASCADE_OFFSET, y: BASE_Y + count * CASCADE_OFFSET },
    };
    setWindows((prev) => [...prev, newWin]);
    setActiveId(id);
  }

  function closeWindow(id) {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveId(null);
  }

  function minimizeWindow(id) {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    if (activeId === id) setActiveId(null);
  }

  function maximizeWindow(id) {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized, zIndex: nextZ() } : w
      )
    );
    setActiveId(id);
  }

  function focusWindow(id) {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ() } : w))
    );
    setActiveId(id);
  }

  function updatePosition(id, pos) {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position: pos } : w))
    );
  }

  // Taskbar click: if open → toggle minimize; if closed → open
  function handleTaskbarClick(id) {
    const win = windows.find((w) => w.id === id);
    if (!win) {
      openWindow(id);
    } else if (win.isMinimized) {
      openWindow(id); // restores
    } else if (activeId === id) {
      minimizeWindow(id); // clicking active app minimizes it
    } else {
      focusWindow(id); // bring to front
    }
  }

  // ── Boot screen ────────────────────────────────────────────────────────
  if (isBooting) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-tr from-cyan-950 via-slate-950 to-blue-950">
        <div className="flex flex-col items-center gap-6 select-none animate-pulse">
          {/* Glowing Orb Logo */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 via-teal-300 to-emerald-400 p-0.5 shadow-[0_0_40px_8px_rgba(34,211,238,0.4),inset_0_1px_2px_rgba(255,255,255,0.6)] relative flex items-center justify-center">
            <span className="text-3xl filter drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.25)]">🍃</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />
          </div>
          
          <div className="text-cyan-200/80 text-[13px] tracking-[0.18em] uppercase font-bold text-center font-sans">
            Fuheshka OS
          </div>

          {/* Glossy Progress Bar Container */}
          <div className="w-48 h-1.5 rounded-full bg-white/10 overflow-hidden border border-white/15 relative shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)]">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 rounded-full animate-pulse" style={{ width: '65%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">

      {/* Wallpaper */}
      <Wallpaper />

      {/* Desktop icons */}
      <div className="absolute inset-0 z-0 p-4 md:p-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3 content-start">
        {APPS.map((app) => {
          const Icon = app.icon;
          return (
            <div
              key={app.id}
              onDoubleClick={() => openWindow(app.id)}
              onClick={() => openWindow(app.id)}
              className="w-full max-w-[98px] flex flex-col items-center gap-2 rounded-2xl p-2.5 hover:bg-white/20 hover:shadow-[0_8px_20px_rgba(255,255,255,0.08),inset_0_1px_1px_rgba(255,255,255,0.2)] border border-transparent hover:border-white/25 transition-all duration-300 cursor-pointer group touch-manipulation"
            >
              <div className="w-13 h-13 md:w-12 md:h-12 rounded-2xl bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-xl border border-white/50 shadow-lg flex items-center justify-center group-hover:from-white/45 group-hover:to-white/20 group-hover:border-cyan-300/60 group-hover:shadow-[0_0_15px_rgba(103,232,249,0.35)] transition-all duration-300 relative overflow-hidden">
                {/* Icon glossy reflection overlay */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
                <Icon className="text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.25)] w-[24px] h-[24px] md:w-[22px] md:h-[22px] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-white text-[11px] md:text-[12px] font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] text-center leading-tight tracking-wide font-sans">
                {app.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Windows */}
      <AnimatePresence>
        {windows.map((win) => (
          <Window
            key={win.id}
            id={win.id}
            type={win.type}
            title={win.title}
            zIndex={win.zIndex}
            isMinimized={win.isMinimized}
            isMaximized={win.isMaximized}
            position={win.position}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onFocus={() => focusWindow(win.id)}
            onPositionChange={(pos) => updatePosition(win.id, pos)}
          />
        ))}
      </AnimatePresence>

      {/* Taskbar */}
      <Taskbar
        activeWindows={windows}
        activeId={activeId}
        onWindowClick={handleTaskbarClick}
      />

    </div>
  );
}

