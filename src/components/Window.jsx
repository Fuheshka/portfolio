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
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const onChange = (event) => setIsMobile(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const x = useMotionValue(position?.x ?? 100);
  const y = useMotionValue(position?.y ?? 80);
  const dragControls = useDragControls();

  if (isMinimized) return null;

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
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.90 }}
      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
      style={{
        zIndex: isMobile ? Math.max(zIndex, 50) : zIndex,
        x: isMobile || isMaximized ? 0 : x,
        y: isMobile || isMaximized ? 0 : y,
      }}
      className={[
        'bg-gradient-to-b from-white/35 via-white/20 to-white/10 backdrop-blur-3xl',
        'border-t border-l border-white/60 border-r border-b border-white/35',
        'shadow-[0_20px_50px_rgba(0,100,200,0.22),inset_0_1px_0_rgba(255,255,255,0.4)]',
        'flex flex-col overflow-hidden select-none',
        isMobile
          ? 'fixed inset-0 w-full h-full rounded-none pt-10'
          : isMaximized
            ? 'fixed inset-0 w-full h-full rounded-none'
            : 'rounded-2xl w-full h-full md:w-[620px] md:h-[440px] absolute top-0 left-0',
      ].join(' ')}
    >
      {/* 3D Gloss reflection overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/15 z-30" />

      {/* Title bar — drag handle */}
      <div
        onPointerDown={(e) => { if (!isMobile && !isMaximized) dragControls.start(e); }}
        className={[
          'h-10 shrink-0 bg-gradient-to-b from-cyan-400/25 to-blue-500/10 border-b border-white/30 flex items-center justify-between px-4 relative z-25',
          isMobile ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
        ].join(' ')}
      >
        {/* Skeuomorphic 3D traffic-light controls */}
        <div className="flex items-center gap-2">
          {/* Close — red */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onClose(id); }}
            title="Close"
            className="group w-3.5 h-3.5 rounded-full bg-gradient-to-b from-red-400 via-red-500 to-red-600
              border border-red-700/50 hover:brightness-110 active:brightness-90 transition-all flex items-center justify-center
              shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.15)]"
          >
            <span className="hidden group-hover:block text-red-950 font-bold leading-none drop-shadow-[0_1px_0_rgba(255,255,255,0.2)]" style={{ fontSize: 8 }}>✕</span>
          </button>
          {/* Minimize — yellow */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onMinimize(id); }}
            title="Minimize"
            className="group w-3.5 h-3.5 rounded-full bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600
              border border-yellow-700/50 hover:brightness-110 active:brightness-90 transition-all flex items-center justify-center
              shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.15)]"
          >
            <span className="hidden group-hover:block text-yellow-950 font-bold leading-none drop-shadow-[0_1px_0_rgba(255,255,255,0.2)]" style={{ fontSize: 8 }}>–</span>
          </button>
          {/* Maximize — green */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onMaximize(id); }}
            title={isMaximized ? 'Restore' : 'Maximize'}
            className="group w-3.5 h-3.5 rounded-full bg-gradient-to-b from-green-300 via-green-500 to-green-600
              border border-green-700/50 hover:brightness-110 active:brightness-90 transition-all flex items-center justify-center
              shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.15)]"
          >
            {isMaximized
              ? <Minimize2 size={8} className="hidden group-hover:block text-green-950" />
              : <span className="hidden group-hover:block text-green-950 font-bold leading-none drop-shadow-[0_1px_0_rgba(255,255,255,0.2)]" style={{ fontSize: 8 }}>+</span>
            }
          </button>
        </div>

        {/* Title — centred */}
        <span className="absolute left-1/2 -translate-x-1/2 text-white font-bold text-sm tracking-wide drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.35)] truncate max-w-[55%] pointer-events-none">
          {title}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-black/10 text-white relative z-20">
        <WindowContent type={type} />
      </div>
    </motion.div>
  );
}