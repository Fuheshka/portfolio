import { motion } from 'framer-motion';
import { Github, Mail, ExternalLink } from 'lucide-react';

// ─── Social links data ─────────────────────────────────────────────────────
const LINKS = [
  {
    id: 'github',
    label: 'GitHub',
    sub: 'github.com/Fuheshka',
    href: 'https://github.com/Fuheshka',
    icon: Github,
    from: 'from-slate-500/40',
    to: 'to-slate-700/40',
    border: 'border-slate-400/30',
    hover: 'hover:border-slate-300/60 hover:shadow-slate-400/30',
    iconColor: 'text-white',
  },
  {
    id: 'email',
    label: 'Email',
    sub: 'fuheshka@gmail.com',
    href: 'mailto:fuheshka@gmail.com',
    icon: Mail,
    from: 'from-cyan-500/30',
    to: 'to-teal-600/30',
    border: 'border-cyan-400/30',
    hover: 'hover:border-cyan-300/60 hover:shadow-cyan-400/30',
    iconColor: 'text-cyan-300',
  },
];

// ─── Single link card ──────────────────────────────────────────────────────
function LinkCard({ link, delay }) {
  const Icon = link.icon;
  return (
    <motion.a
      href={link.href}
      target={link.id !== 'email' ? '_blank' : undefined}
      rel="noreferrer"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, delay }}
      whileHover={{ scale: 1.03 }}
      className={[
        'group relative flex items-center gap-4 rounded-2xl overflow-hidden',
        `bg-gradient-to-r ${link.from} ${link.to}`,
        'backdrop-blur-md border',
        link.border,
        'shadow-lg',
        link.hover,
        'p-5 transition-all duration-300',
      ].join(' ')}
    >
      {/* Top gloss */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-2xl" />

      {/* Icon circle */}
      <div className={`relative z-10 shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-white/10 border border-white/20 shadow-md`}>
        <Icon size={22} className={link.iconColor} />
      </div>

      {/* Text */}
      <div className="relative z-10 flex-1 min-w-0">
        <p className="font-bold text-white text-sm leading-none">{link.label}</p>
        <p className="text-[11px] text-white/45 mt-1 truncate">{link.sub}</p>
      </div>

      {/* Arrow */}
      <ExternalLink
        size={14}
        className="relative z-10 shrink-0 text-white/25 group-hover:text-white/70 transition-colors"
      />
    </motion.a>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function Contact() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full gap-6 p-4 pb-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h2 className="text-xl font-bold text-white">Get in touch</h2>
        <p className="text-xs text-white/45 mt-1">Pick your preferred channel</p>
      </motion.div>

      {/* Link cards */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        {LINKS.map((link, i) => (
          <LinkCard key={link.id} link={link} delay={0.08 + i * 0.1} />
        ))}
      </div>

      {/* Subtle footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-[10px] text-white/25 text-center"
      >
        Response within 24 hours ·{' '}
        <span className="text-white/35">Open to freelance &amp; full-time</span>
      </motion.p>

    </div>
  );
}
