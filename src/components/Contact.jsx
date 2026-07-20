import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Mail, Send, MessageCircle, Check, Copy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const EMAIL = 'fuheshka@gmail.com';

const SOCIALS = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/Fuheshka',
    icon: Github,
    style: 'bg-gradient-to-b from-slate-500/25 to-slate-600/10 border-slate-350/30 hover:border-slate-300/60 hover:shadow-[0_8px_20px_rgba(255,255,255,0.06),inset_0_1px_1.5px_rgba(255,255,255,0.25)]',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    href: 'https://t.me/fuheshka',
    icon: Send,
    style: 'bg-gradient-to-b from-sky-500/25 to-sky-600/10 border-sky-350/30 hover:border-sky-300/60 hover:shadow-[0_8px_20px_rgba(34,211,238,0.18),inset_0_1px_1.5px_rgba(255,255,255,0.25)]',
  },
  {
    id: 'discord',
    label: 'Discord',
    href: 'https://discordapp.com/users/316858178073526273',
    icon: MessageCircle,
    style: 'bg-gradient-to-b from-indigo-500/25 to-indigo-600/10 border-indigo-350/30 hover:border-indigo-300/60 hover:shadow-[0_8px_20px_rgba(99,102,241,0.18),inset_0_1px_1.5px_rgba(255,255,255,0.25)]',
  },
];

function SocialButton({ item, delay }) {
  const Icon = item.icon;
  return (
    <motion.a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut', delay }}
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.96 }}
      className={[
        'group w-full h-12 rounded-xl border backdrop-blur-md relative overflow-hidden',
        'flex items-center justify-center gap-2',
        'text-white font-bold text-sm',
        'shadow-md transition-[transform,border-color,box-shadow] duration-200 ease-out',
        item.style,
      ].join(' ')}
    >
      {/* Icon gloss highlight */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
      <Icon size={18} className="text-white drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.2)]" />
      {item.label}
    </motion.a>
  );
}

export default function Contact() {
  const { lang, t } = useLanguage();
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

  const copiedLabel = lang === 'ru' ? 'Скопировано!' : 'Copied!';
  const copyHint = lang === 'ru' ? 'нажмите на email для мгновенного копирования' : 'click email to copy instantly';

  return (
    <div className="min-h-full flex items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-md rounded-2xl overflow-hidden
          border-t border-l border-white/55 border-r border-b border-white/30
          bg-gradient-to-b from-white/25 via-white/10 to-white/5 backdrop-blur-xl
          shadow-[0_20px_50px_rgba(0,100,200,0.12),inset_0_1px_1px_rgba(255,255,255,0.35)] p-6"
      >
        {/* Card gloss reflection overlay */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-2xl z-10" />

        <div className="relative z-10 text-left mb-5 select-none">
          <h2 className="text-2xl font-bold text-white drop-shadow-[0_1.5px_2.5px_rgba(0,0,0,0.3)] font-display">
            {t('contact_heading')}
          </h2>
          <p className="text-xs text-cyan-200 drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.15)] font-semibold mt-1">
            {t('contact_sub')}
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-3">
          <motion.button
            onClick={copyEmail}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.96 }}
            className="relative w-full h-14 rounded-xl border border-cyan-300/65 bg-gradient-to-b from-cyan-400/40 to-blue-500/25
              hover:from-cyan-400/50 hover:to-blue-500/35 shadow-[0_10px_25px_rgba(0,180,255,0.18),inset_0_1px_1px_rgba(255,255,255,0.45)]
              text-white font-bold text-base transition-[border-color,background-color,box-shadow] duration-200 ease-out
              flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
          >
            {/* Button gloss highlight */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            {copied ? <Check size={20} className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]" /> : <Mail size={20} className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]" />}
            {copied ? copiedLabel : EMAIL}

            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute -top-9 left-1/2 -translate-x-1/2
                    text-[11px] font-semibold text-white bg-black/60 backdrop-blur-md
                    border border-white/25 rounded-md px-2 py-1 shadow-lg"
                >
                  {copiedLabel}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {SOCIALS.map((item, idx) => (
              <SocialButton key={item.id} item={item} delay={0.08 + idx * 0.07} />
            ))}
          </div>

          <p className="text-xs text-white/60 text-left mt-1 inline-flex items-center justify-start gap-1.5 select-none drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.1)]">
            <Copy size={13} className="text-white/70" />
            {copyHint}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
