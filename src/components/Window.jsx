import { motion } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';

export default function Window({ title, zIndex, onClose, bringToFront }) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      onMouseDown={bringToFront}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ zIndex }}
      className="absolute top-24 left-24 w-[600px] h-[400px] bg-white/30 backdrop-blur-2xl border border-white/50 rounded-xl shadow-2xl overflow-hidden flex flex-col"
    >
      <div className="h-10 bg-white/20 border-b border-white/30 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing">
        <span className="text-white font-medium text-sm drop-shadow-md">{title}</span>
        <div className="flex gap-4">
          <button className="text-white hover:text-white/70 transition-colors">
            <Minus size={16} />
          </button>
          <button className="text-white hover:text-white/70 transition-colors">
            <Square size={14} />
          </button>
          <button onClick={onClose} className="text-white hover:text-red-400 transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 text-white bg-black/5 overflow-y-auto">
        Content for {title}
      </div>
    </motion.div>
  );
}