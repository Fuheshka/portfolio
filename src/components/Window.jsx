import { useEffect, useState, useRef } from 'react';
import { useMotionValue, useDragControls, animate } from 'framer-motion';
import { motion } from 'framer-motion';
import { Minimize2 } from 'lucide-react';
import Personalization from './Personalization';
import ProjectList from './ProjectList';
import About from './About';
import Contact from './Contact';
import { playCloseSound, playMinimizeSound, playOpenSound } from '../utils/audio';

function WindowContent({ type, customizationProps }) {
  switch (type) {
    case 'projects':        return <ProjectList />;
    case 'about':           return <About />;
    case 'contact':         return <Contact />;
    case 'personalization': return <Personalization {...customizationProps} />;
    default:                return <ProjectList />;
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
  size: sizeProp,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  onSizeChange,
  customizationProps,
}) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [size, setSize] = useState({
    width: sizeProp?.width ?? 620,
    height: sizeProp?.height ?? 440,
  });
  const latestSize = useRef(size);
  latestSize.current = size;

  useEffect(() => {
    if (sizeProp) {
      setSize({ width: sizeProp.width, height: sizeProp.height });
    }
  }, [sizeProp]);

  const handleResizeStart = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();

    const handleElement = e.currentTarget;
    handleElement.setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startXPos = x.get();
    const startYPos = y.get();

    const onPointerMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startXPos;
      let newY = startYPos;

      const minW = 380;
      const minH = 280;

      if (direction.includes('e')) {
        newWidth = Math.max(minW, startWidth + dx);
      } else if (direction.includes('w')) {
        const potentialWidth = startWidth - dx;
        if (potentialWidth >= minW) {
          newWidth = potentialWidth;
          newX = startXPos + dx;
        } else {
          newWidth = minW;
          newX = startXPos + (startWidth - minW);
        }
      }

      if (direction.includes('s')) {
        newHeight = Math.max(minH, startHeight + dy);
      } else if (direction.includes('n')) {
        const potentialHeight = startHeight - dy;
        if (potentialHeight >= minH) {
          newHeight = potentialHeight;
          newY = startYPos + dy;
        } else {
          newHeight = minH;
          newY = startYPos + (startHeight - minH);
        }
      }

      setSize({ width: newWidth, height: newHeight });
      latestSize.current = { width: newWidth, height: newHeight };
      x.set(newX);
      y.set(newY);
    };

    const onPointerUp = (upEvent) => {
      handleElement.releasePointerCapture(upEvent.pointerId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      onSizeChange?.(latestSize.current);
      onPositionChange?.({ x: x.get(), y: y.get() });
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const onChange = (event) => setIsMobile(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const x = useMotionValue(position?.x ?? 100);
  const y = useMotionValue(position?.y ?? 80);
  const dragControls = useDragControls();

  const MENU_BAR_HEIGHT = 28;
  const targetWidth = isMobile ? windowDimensions.width : isMaximized ? windowDimensions.width : size.width;
  const targetHeight = isMobile ? windowDimensions.height - MENU_BAR_HEIGHT : isMaximized ? windowDimensions.height - MENU_BAR_HEIGHT : size.height;

  useEffect(() => {
    if (isMinimized) {
      // Slide down toward the Dock (center bottom)
      animate(x, windowDimensions.width / 2 - size.width / 2, { duration: 0.38, ease: [0.25, 1, 0.5, 1] });
      animate(y, windowDimensions.height, { duration: 0.38, ease: [0.25, 1, 0.5, 1] });
    } else if (isMaximized || isMobile) {
      // Smoothly slide to top-left corner below the top MenuBar (y = 28)
      animate(x, 0, { duration: 0.35, ease: [0.25, 1, 0.5, 1] });
      animate(y, MENU_BAR_HEIGHT, { duration: 0.35, ease: [0.25, 1, 0.5, 1] });
    } else {
      // Spring back to its normal desktop position
      animate(x, position?.x ?? 100, { type: 'spring', stiffness: 300, damping: 26 });
      animate(y, position?.y ?? 80, { type: 'spring', stiffness: 300, damping: 26 });
    }
  }, [isMinimized, isMaximized, isMobile, windowDimensions]);

  useEffect(() => {
    if (!isMinimized && !isMaximized && !isMobile) {
      animate(x, position?.x ?? 100, { type: 'spring', stiffness: 300, damping: 26 });
      animate(y, position?.y ?? 80, { type: 'spring', stiffness: 300, damping: 26 });
    }
  }, [position]);

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
      animate={{
        scale: isMinimized ? 0.15 : 1,
        opacity: isMinimized ? 0 : 1,
      }}
      exit={{ opacity: 0, scale: 0.90 }}
      transition={{
        duration: 0.35,
        ease: [0.25, 1, 0.5, 1],
      }}
      style={{
        zIndex: isMobile ? Math.max(zIndex, 50) : zIndex,
        x: x,
        y: y,
        width: targetWidth,
        height: targetHeight,
        pointerEvents: isMinimized ? 'none' : 'auto',
      }}
      className={[
        'bg-gradient-to-b from-white/35 via-white/20 to-white/10 backdrop-blur-3xl',
        'border-t border-l border-white/60 border-r border-b border-white/35',
        'shadow-[0_20px_50px_rgba(0,100,200,0.22),inset_0_1px_0_rgba(255,255,255,0.4)]',
        'flex flex-col overflow-hidden select-none absolute top-0 left-0',
        isMobile || isMaximized ? 'rounded-none' : 'rounded-2xl',
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
            onClick={(e) => { e.stopPropagation(); playCloseSound(); onClose(id); }}
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
            onClick={(e) => { e.stopPropagation(); playMinimizeSound(); onMinimize(id); }}
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
            onClick={(e) => { e.stopPropagation(); playOpenSound(); onMaximize(id); }}
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
        <WindowContent type={type} customizationProps={customizationProps} />
      </div>
      {/* 8-Way Resize Handles */}
      {!isMobile && !isMaximized && (
        <>
          {/* Edges */}
          <div onPointerDown={(e) => handleResizeStart(e, 'n')} className="absolute top-0 left-2 right-2 h-1.5 -translate-y-1/2 cursor-ns-resize z-40" />
          <div onPointerDown={(e) => handleResizeStart(e, 's')} className="absolute bottom-0 left-2 right-2 h-1.5 translate-y-1/2 cursor-ns-resize z-40" />
          <div onPointerDown={(e) => handleResizeStart(e, 'w')} className="absolute left-0 top-2 bottom-2 w-1.5 -translate-x-1/2 cursor-ew-resize z-40" />
          <div onPointerDown={(e) => handleResizeStart(e, 'e')} className="absolute right-0 top-2 bottom-2 w-1.5 translate-x-1/2 cursor-ew-resize z-40" />

          {/* Corners */}
          <div onPointerDown={(e) => handleResizeStart(e, 'nw')} className="absolute top-0 left-0 w-3 h-3 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize z-50" />
          <div onPointerDown={(e) => handleResizeStart(e, 'ne')} className="absolute top-0 right-0 w-3 h-3 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize z-50" />
          <div onPointerDown={(e) => handleResizeStart(e, 'sw')} className="absolute bottom-0 left-0 w-3 h-3 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize z-50" />
          <div onPointerDown={(e) => handleResizeStart(e, 'se')} className="absolute bottom-0 right-0 w-3 h-3 translate-x-1/2 translate-y-1/2 cursor-nwse-resize z-50" />
        </>
      )}
    </motion.div>
  );
}