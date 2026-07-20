import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const TOOLBOX = [
  {
    category: 'Engines',
    color: 'bg-blue-400/15 text-blue-200 border-blue-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
    items: ['Unity', 'Godot', 'Game Jam Prototyping'],
  },
  {
    category: 'Code',
    color: 'bg-violet-400/15 text-violet-200 border-violet-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
    items: ['C#', 'GDScript', 'Gameplay Systems', 'Bugfix & Polish'],
  },
  {
    category: '3D Art',
    color: 'bg-orange-400/15 text-orange-200 border-orange-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
    items: ['Blender', 'Low-poly Characters', 'Stylized Props', 'Lighting & Baking'],
  },
  {
    category: 'Workflow',
    color: 'bg-pink-400/15 text-pink-200 border-pink-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
    items: ['Git / GitHub', 'Rapid Iteration', 'Deadline Pushes'],
  },
];

function Divider() {
  return <div className="w-full h-px bg-white/15 my-4" />;
}

export default function About() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="p-5 pb-8 flex flex-col gap-0 font-sans text-white/90"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-1">
        {/* Avatar */}
        <div className="relative shrink-0 w-16 h-16 rounded-full
          bg-gradient-to-br from-cyan-300 via-teal-200 to-emerald-400
          border-2 border-white/70 shadow-[0_4px_15px_rgba(34,211,238,0.4)]
          flex items-center justify-center text-2xl select-none"
        >
          🎨
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
        </div>

        {/* Name + role */}
        <div>
          <h2 className="text-xl font-bold text-white leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            {t('about_name')}
          </h2>
          <p className="text-[13px] font-bold text-cyan-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] mt-0.5">
            {t('about_role')}
          </p>
          <p className="text-[11px] text-white/75 mt-0.5">{t('about_tags')}</p>
        </div>
      </div>

      <Divider />

      {/* ── Bio ─────────────────────────────────────────────────────────── */}
      <div className="mb-1">
        <h3 className="text-sm font-bold text-cyan-200 mb-2 font-display drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.2)]">
          {t('about_heading')}
        </h3>
        <div className="space-y-4 text-white/80 leading-relaxed text-sm">
          <p>{t('about_p1')}</p>
          <p>{t('about_p2')}</p>
          <p>{t('about_p3')}</p>

          <div className="bg-white/10 p-3.5 rounded-xl border border-white/20 text-xs md:text-sm shadow-md backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            <span className="font-bold text-cyan-200">{t('about_not_coding')}</span>
            <br />
            <p className="mt-1 text-white/85">{t('about_hobbies')}</p>
          </div>

          <p className="text-sm font-semibold text-white/95">
            {t('about_status')}
          </p>
        </div>
      </div>

      <Divider />

      {/* ── Toolbox ─────────────────────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-bold text-cyan-200 mb-3 font-display drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.2)]">
          {t('about_toolbox')}
        </h3>
        <div className="flex flex-col gap-3">
          {TOOLBOX.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + gi * 0.06, duration: 0.35 }}
              className="flex items-start gap-2"
            >
              {/* Category label */}
              <span className="shrink-0 mt-0.5 text-[10px] font-bold uppercase tracking-widest text-white/60 w-14 pt-0.5">
                {group.category}
              </span>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className={`text-[11px] font-bold border rounded-lg px-2.5 py-0.5 shadow-md relative overflow-hidden ${group.color}`}
                  >
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
