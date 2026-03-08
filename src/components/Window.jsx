import { useEffect, useState } from 'react';
import { useMotionValue, useDragControls } from 'framer-motion';
import { motion } from 'framer-motion';
import { Minimize2 } from 'lucide-react';
import ProjectList from './ProjectList';
import About from './About';
import Contact from './Contact';

function WindowContent({ type }) {
  switch (type) {
    case 'projects': return <ProjectList />;
    case 'about':    return <About />;
    case 'contact':  return <Contact />;
    default:         return <ProjectList />;
  }
}

export default function Window({
  id,
  type,
  title,
  zIndex,
  isMinimized,
  isMaximized,
  position,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
}) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const onChange = (event) => setIsMobile(event.matches);

    setIsMobile(media.matches);

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  const x = useMotionValue(position?.x ?? 100);
  const y = useMotionValue(position?.y ?? 80);
  const dragControls = useDragControls();

  if (isMinimized) return null;

  const maximizedStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    borderRadius: 0,
    zIndex,
  };

  const normalStyle = {
    zIndex,
    x: isMobile ? 0 : x,
    y: isMobile ? 0 : y,
    position: 'absolute',
    top: 0,
    left: 0,
  };

  const mobileStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    borderRadius: 0,
    zIndex: Math.max(zIndex, 50),
  };

  return (
    <motion.div
      drag={!isMobile && !isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={() => {
        if (!isMobile && !isMaximized) onPositionChange?.({ x: x.get(), y: y.get() });
      }}
      onMouseDown={onFocus}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      style={isMobile ? mobileStyle : (isMaximized ? maximizedStyle : normalStyle)}
      className={[
        'bg-white/30 backdrop-blur-2xl border border-white/50 shadow-2xl',
        'flex flex-col overflow-hidden select-none',
        isMobile
          ? 'fixed inset-0 z-50 w-full h-full rounded-none pt-10'
          : isMaximized
            ? 'rounded-none'
            : 'rounded-xl w-full h-full md:w-[620px] md:h-[440px]',
      ].join(' ')}
    >
      {/* Title bar — drag handle only */}
      <div
        onPointerDown={(e) => { if (!isMobile && !isMaximized) dragControls.start(e); }}
        className={[
          'h-10 shrink-0 bg-white/20 border-b border-white/30 flex items-center justify-between px-4',
          isMobile ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
        ].join(' ')}
      >
        {/* Mac-style traffic-light controls */}
        <div className="flex items-center gap-2">
          {/* Close — red */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onClose(id); }}
            title="Close"
            className="group w-3.5 h-3.5 rounded-full bg-red-400 border border-red-500/40
              hover:bg-red-500 transition-colors flex items-center justify-center"
          >
            <span className="hidden group-hover:block text-red-900 font-bold leading-none" style={{ fontSize: 8 }}>✕</span>
          </button>
          {/* Minimize — yellow */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onMinimize(id); }}
            title="Minimize"
            className="group w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-500/40
              hover:bg-yellow-500 transition-colors flex items-center justify-center"
          >
            <span className="hidden group-hover:block text-yellow-900 font-bold leading-none" style={{ fontSize: 8 }}>–</span>
          </button>
          {/* Maximize — green */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onMaximize(id); }}
            title={isMaximized ? 'Restore' : 'Maximize'}
            className="group w-3.5 h-3.5 rounded-full bg-green-400 border border-green-500/40
              hover:bg-green-500 transition-colors flex items-center justify-center"
          >
            {isMaximized
              ? <Minimize2 size={8} className="hidden group-hover:block text-green-900" />
              : <span className="hidden group-hover:block text-green-900 font-bold leading-none" style={{ fontSize: 8 }}>+</span>
            }
          </button>
        </div>

        {/* Title — centred */}
        <span className="absolute left-1/2 -translate-x-1/2 text-white font-semibold text-sm drop-shadow-md truncate max-w-[55%] pointer-events-none">
          {title}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-black/5 text-white">
        <WindowContent type={type} />
      </div>
    </motion.div>
  );
}