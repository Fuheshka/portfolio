import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Folder, User, Mail } from 'lucide-react';
import Window from './components/Window';
import Taskbar from './components/Taskbar';

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
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <div className="text-white text-2xl font-semibold animate-pulse">
          Starting System...
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-300">

      {/* Desktop icons */}
      <div className="absolute inset-0 z-0 p-6 flex flex-col gap-3">
        {APPS.map((app) => {
          const Icon = app.icon;
          return (
            <div
              key={app.id}
              onDoubleClick={() => openWindow(app.id)}
              onClick={() => openWindow(app.id)}
              className="w-20 flex flex-col items-center gap-1.5 rounded-lg p-2 hover:bg-white/20 transition-colors cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-xl bg-white/30 backdrop-blur-md border border-white/50 shadow-md flex items-center justify-center group-hover:bg-white/40 transition-colors">
                <Icon size={20} className="text-white drop-shadow-sm" />
              </div>
              <span className="text-white text-[11px] font-medium drop-shadow-md text-center leading-tight">
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

