import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Folder, User, Mail, Sliders, Power } from 'lucide-react';
import Window from './components/Window';
import Taskbar from './components/Taskbar';
import MenuBar from './components/MenuBar';
import Wallpaper from './components/Wallpaper';
import { playBootSound, playOpenSound, playMinimizeSound, playClickSound, setSoundEnabled } from './utils/audio';

const APPS = [
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'about',    label: 'About Me', icon: User   },
  { id: 'contact',  label: 'Contact',  icon: Mail   },
  { id: 'personalization', label: 'Personalization', icon: Sliders },
];

const CASCADE_OFFSET = 30;
const BASE_X = 80;
const BASE_Y = 60;
let zCounter = 100;

function nextZ() { return ++zCounter; }

export default function App() {
  const [isBooting, setIsBooting]   = useState(true);
  const [isShutDown, setIsShutDown] = useState(false);
  const [windows, setWindows]       = useState([]);
  const [activeId, setActiveId]     = useState(null);

  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('aero_wallpaper') || 'default');
  const [blurAmount, setBlurAmount] = useState(() => {
    const saved = localStorage.getItem('aero_blur');
    return saved !== null ? parseInt(saved, 10) : 8;
  });
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    const saved = localStorage.getItem('aero_sound');
    return saved !== null ? saved === 'true' : true;
  });

  const [bootProgress, setBootProgress] = useState(0);

  useEffect(() => {
    localStorage.setItem('aero_wallpaper', wallpaper);
  }, [wallpaper]);

  useEffect(() => {
    localStorage.setItem('aero_blur', blurAmount.toString());
  }, [blurAmount]);

  useEffect(() => {
    localStorage.setItem('aero_sound', soundEnabled.toString());
    setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    if (bootProgress < 100) {
      const t = setTimeout(() => {
        setBootProgress((prev) => Math.min(prev + 5, 100));
      }, 80);
      return () => clearTimeout(t);
    }
  }, [bootProgress]);

  function handleLogin() {
    playBootSound();
    setIsBooting(false);
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  const openCount = windows.length;

  function openWindow(id) {
    playOpenSound();
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
      size:        { width: 620, height: 440 },
    };
    setWindows((prev) => [...prev, newWin]);
    setActiveId(id);
  }

  function closeWindow(id) {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveId(null);
  }

  function minimizeWindow(id) {
    playMinimizeSound();
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
    playClickSound();
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

  function updateSize(id, size) {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, size } : w))
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

  // ── Boot / Welcome screen ───────────────────────────────────────────────
  if (isBooting) {
    return (
      <div className="relative h-screen w-screen flex items-center justify-center overflow-hidden">
        {/* Blurred dynamic wallpaper matching user preference */}
        <Wallpaper currentWallpaper={wallpaper} blurAmount={24} />

        <div className="z-10 flex flex-col items-center gap-6 select-none">
          {/* Glassmorphic User Logon Card */}
          <div className="bg-white/15 border border-white/35 rounded-3xl backdrop-blur-2xl p-8 shadow-2xl flex flex-col items-center gap-5 relative overflow-hidden w-76 text-center">
            {/* Glossy top overlay reflection */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10 z-20" />
            
            {/* Glowing Orb Logo / Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-300 via-teal-200 to-emerald-400 p-0.5 border border-white/60 shadow-[0_4px_15px_rgba(34,211,238,0.35)] flex items-center justify-center text-3xl relative overflow-hidden">
              <span className="filter drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.25)]">🎨</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />
            </div>

            <div>
              <h2 className="text-white font-extrabold text-lg tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Fuheshka</h2>
              <p className="text-[11px] text-cyan-200/90 font-bold uppercase tracking-wider mt-0.5">Technical Artist</p>
            </div>

            {bootProgress < 100 ? (
              /* Loading phase progress bar */
              <div className="flex flex-col items-center gap-2.5 w-full mt-2">
                <div className="w-48 h-1.5 rounded-full bg-white/10 overflow-hidden border border-white/15 relative shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)]">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 rounded-full transition-all duration-75"
                    style={{ width: `${bootProgress}%` }}
                  />
                </div>
                <div className="text-[9px] text-cyan-200/50 uppercase tracking-[0.2em] font-bold font-mono">
                  Loading {bootProgress}%
                </div>
              </div>
            ) : (
              /* Logon Phase Button (Unlocks audio context on click) */
              <button
                onClick={handleLogin}
                className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-b from-cyan-400/40 to-blue-500/25 hover:from-cyan-400/50 hover:to-blue-500/35 border border-cyan-300/80 text-white font-extrabold text-xs tracking-widest uppercase shadow-[0_4px_15px_rgba(34,211,238,0.2),inset_0_1px_1px_rgba(255,255,255,0.45)] cursor-pointer hover:scale-102 active:scale-98 transition-all duration-200 relative overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                Log In
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // System Shutdown state
  if (isShutDown) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-slate-950 flex flex-col items-center justify-center z-[100000] font-sans">
        <motion.button
          onClick={() => {
            setIsShutDown(false);
            playBootSound();
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-20 h-20 rounded-full bg-gradient-to-b from-red-500/20 to-red-700/40 border-2 border-red-500/80 hover:border-red-400 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300"
          title="Power On"
        >
          <Power size={32} className="text-red-400" />
        </motion.button>
        <span className="text-white/60 text-xs font-bold uppercase tracking-widest mt-4 font-display">
          System Offline · Click to Power On
        </span>
      </div>
    );
  }

  const activeWindow = windows.find((w) => w.id === activeId);
  const activeTitle = activeWindow ? activeWindow.title : 'Finder';

  return (
    <div className="relative h-screen w-screen overflow-hidden">

      {/* Top Menu Bar */}
      <MenuBar
        activeTitle={activeTitle}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabledState}
        onOpenApp={openWindow}
        onRestart={() => {
          setWindows([]);
          setActiveId(null);
          setBootProgress(0);
          setIsBooting(true);
        }}
        onShutDown={() => setIsShutDown(true)}
      />

      {/* Wallpaper */}
      <Wallpaper currentWallpaper={wallpaper} blurAmount={blurAmount} />

      {/* Desktop icons (shifted down to not overlap with top Menu Bar) */}
      <div className="absolute inset-0 z-0 p-4 pt-10 md:p-6 md:pt-12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3 content-start">
        {APPS.map((app) => {
          const Icon = app.icon;
          return (
            <motion.div
              key={app.id}
              onDoubleClick={() => openWindow(app.id)}
              onClick={() => openWindow(app.id)}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              className="w-full max-w-[98px] flex flex-col items-center gap-2 rounded-2xl p-2.5 hover:bg-white/20 hover:shadow-[0_8px_20px_rgba(255,255,255,0.08),inset_0_1px_1px_rgba(255,255,255,0.2)] border border-transparent hover:border-white/25 cursor-pointer group touch-manipulation"
            >
              <div className="w-13 h-13 md:w-12 md:h-12 rounded-2xl bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-xl border border-white/50 shadow-lg flex items-center justify-center group-hover:from-white/45 group-hover:to-white/20 group-hover:border-cyan-300/60 group-hover:shadow-[0_0_15px_rgba(103,232,249,0.35)] transition-all duration-300 relative overflow-hidden">
                {/* Icon glossy reflection overlay */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
                <Icon className="text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.25)] w-[24px] h-[24px] md:w-[22px] md:h-[22px] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-white text-[11px] md:text-[12px] font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] text-center leading-tight tracking-wide font-display">
                {app.label}
              </span>
            </motion.div>
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
            size={win.size}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onFocus={() => focusWindow(win.id)}
            onPositionChange={(pos) => updatePosition(win.id, pos)}
            onSizeChange={(size) => updateSize(win.id, size)}
            customizationProps={{
              currentWallpaper: wallpaper,
              setWallpaper,
              blurAmount,
              setBlurAmount,
              soundEnabled,
              setSoundEnabled: setSoundEnabledState,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Taskbar */}
      <Taskbar
        apps={APPS}
        activeWindows={windows}
        activeId={activeId}
        onWindowClick={handleTaskbarClick}
      />

    </div>
  );
}

