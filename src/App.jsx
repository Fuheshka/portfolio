import { useState, useEffect } from 'react';
import Window from './components/Window';

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [windows, setWindows] = useState([]);
  const [activeZIndex, setActiveZIndex] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 3000);
    return () => clearTimeout(timer);
  },[]);

  const openWindow = (id, title) => {
    if (!windows.find(w => w.id === id)) {
      setWindows([...windows, { id, title, zIndex: activeZIndex }]);
      setActiveZIndex(activeZIndex + 1);
    } else {
      bringToFront(id);
    }
  };

  const closeWindow = (id) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const bringToFront = (id) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, zIndex: activeZIndex } : w
    ));
    setActiveZIndex(activeZIndex + 1);
  };

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
      <div className="absolute inset-0 z-0 p-6 flex flex-col gap-4">
        <div 
          onClick={() => openWindow('projects', 'Projects')}
          className="w-24 h-24 flex flex-col items-center justify-center gap-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
        >
          <div className="w-12 h-12 rounded bg-white/30 backdrop-blur-md border border-white/50 shadow-sm"></div>
          <span className="text-white text-sm drop-shadow-md">Projects</span>
        </div>
      </div>

      {windows.map(win => (
        <Window 
          key={win.id}
          title={win.title}
          zIndex={win.zIndex}
          onClose={() => closeWindow(win.id)}
          bringToFront={() => bringToFront(win.id)}
        />
      ))}

      <div className="absolute bottom-0 left-0 w-full h-14 bg-white/20 backdrop-blur-xl border-t border-white/40 z-[9999] flex items-center px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.1)]">
        <div className="w-10 h-10 rounded-full bg-white/40 border border-white/50 hover:bg-white/50 transition-colors cursor-pointer"></div>
      </div>
    </div>
  );
}