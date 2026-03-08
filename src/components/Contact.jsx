import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Mail, Send, MessageCircle, Check, Copy } from 'lucide-react';

const EMAIL = 'fuheshka@gmail.com';

const SOCIALS = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/Fuheshka',
    icon: Github,
    style: 'bg-slate-500/25 border-slate-300/40 hover:bg-slate-400/35 hover:shadow-slate-300/30',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    href: 'https://t.me/fuheshka',
    icon: Send,
    style: 'bg-sky-500/25 border-sky-300/40 hover:bg-sky-400/35 hover:shadow-sky-300/30',
  },
  {
    id: 'discord',
    label: 'Discord',
    href: 'https://discordapp.com/users/316858178073526273',
    icon: MessageCircle,
    style: 'bg-indigo-500/25 border-indigo-300/40 hover:bg-indigo-400/35 hover:shadow-indigo-300/30',
  },
];

function SocialButton({ item, delay }) {
  const Icon = item.icon;
  return (
    <motion.a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22, delay }}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={[
        'group w-full h-12 rounded-xl border backdrop-blur-md',
        'flex items-center justify-center gap-2',
        'text-white font-semibold text-sm',
        'shadow-lg transition-all duration-250',
        item.style,
      ].join(' ')}
    >
      <Icon size={18} className="text-white" />
      {item.label}
    </motion.a>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="relative w-full max-w-md rounded-2xl overflow-hidden
          border border-white/40 bg-white/15 backdrop-blur-md shadow-xl p-6"
      >
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

        <div className="relative z-10 text-center mb-5">
          <h2 className="text-2xl font-bold text-white drop-shadow-sm">Let&apos;s Connect</h2>
          <p className="text-sm text-white/85 mt-1">Open for freelance and collaboration</p>
        </div>

        <div className="relative z-10 flex flex-col gap-3">
          <motion.button
            onClick={copyEmail}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full h-14 rounded-xl border border-cyan-300/40 bg-cyan-500/30
              hover:bg-cyan-400/40 shadow-lg hover:shadow-cyan-300/35
              text-white font-bold text-base transition-all duration-250
              flex items-center justify-center gap-2"
          >
            {copied ? <Check size={20} /> : <Mail size={20} />}
            {copied ? 'Copied!' : EMAIL}

            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute -top-9 left-1/2 -translate-x-1/2
                    text-[11px] font-semibold text-white bg-black/45
                    border border-white/25 rounded-md px-2 py-1"
                >
                  copied!
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {SOCIALS.map((item, idx) => (
              <SocialButton key={item.id} item={item} delay={0.08 + idx * 0.07} />
            ))}
          </div>

          <p className="text-xs text-white/80 text-center mt-1 inline-flex items-center justify-center gap-1.5">
            <Copy size={13} className="text-white/90" />
            click email to copy instantly
          </p>
        </div>
      </motion.div>
    </div>
  );
}
