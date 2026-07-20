import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { projects } from '../data/projects';
import { useLanguage } from '../context/LanguageContext';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export default function ProjectList() {
  const { lang, t } = useLanguage();

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 pb-20 font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {projects.map((project, index) => {
        const descriptionText = typeof project.description === 'object'
          ? (project.description[lang] || project.description.en)
          : project.description;

        return (
          <motion.div
            key={project.id}
            variants={cardVariants}
            whileHover={{ scale: 1.01, y: -2 }}
            className={[
              'group relative flex flex-col gap-4 rounded-2xl overflow-hidden',
              'border-t border-l border-white/55 border-r border-b border-white/30',
              'bg-gradient-to-b from-white/25 via-white/10 to-white/5 backdrop-blur-xl',
              'shadow-[0_12px_24px_rgba(0,120,255,0.1),inset_0_1px_1px_rgba(255,255,255,0.3)]',
              'p-6 transition-[border-color,box-shadow,filter] duration-250 ease-out',
              'hover:border-cyan-300/60 hover:shadow-[0_15px_30px_rgba(34,211,238,0.22),inset_0_1px_1px_rgba(255,255,255,0.45)] hover:brightness-110',
              index === 0 ? 'md:col-span-2' : '',
            ].join(' ')}
          >
            {/* Glossy reflection — Frutiger Aero top highlight */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.22] via-white/5 to-transparent pointer-events-none rounded-t-2xl z-10" />

            {/* Cyan bottom glow */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-cyan-500/15 to-transparent pointer-events-none z-10" />

            {/* "Featured" badge */}
            <div className="relative z-20">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-200 bg-gradient-to-r from-cyan-500/25 to-emerald-500/25 border border-cyan-300/40 rounded-full px-2.5 py-1 shadow-[0_0_8px_rgba(34,211,238,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse shadow-[0_0_4px_1.5px_rgba(34,211,238,0.8)]" />
                Project
              </span>
            </div>

            {/* Header */}
            <div className="relative z-20 flex items-start justify-between gap-2">
              <h3 className="text-lg font-bold text-white leading-snug group-hover:text-cyan-200 transition-colors break-all drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] font-display">
                {project.title}
              </h3>
            </div>

            {/* Description */}
            <p className="relative z-20 text-xs text-white/85 line-clamp-3 leading-relaxed flex-1 drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.15)]">
              {descriptionText ?? 'No description provided.'}
            </p>

            {/* Meta row — Tech Stack Badges */}
            <div className="relative z-20 flex flex-wrap items-center gap-1.5">
              {project.tech && project.tech.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider border rounded-md px-2 py-0.5 bg-gradient-to-r from-cyan-400/20 to-teal-400/20 text-cyan-200 border-cyan-300/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="relative z-20 flex flex-wrap gap-2 pt-1 border-t border-white/10">
              {project.demo && (
                <motion.a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  whileHover={{ scale: 1.02, y: -0.5 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold relative overflow-hidden
                    bg-gradient-to-b from-cyan-400/30 to-blue-500/20 hover:from-cyan-400/45 hover:to-blue-500/35 border border-cyan-300/40
                    text-cyan-200 hover:text-white rounded-xl px-3 py-1.5 shadow-md
                    transition-[border-color,background-color,box-shadow] duration-150 ease-out hover:shadow-cyan-500/20"
                >
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                  <ExternalLink size={11} />
                  {t('projects_demo')}
                </motion.a>
              )}
              {project.link && (
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  whileHover={{ scale: 1.02, y: -0.5 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold relative overflow-hidden
                    bg-white/10 hover:bg-white/20 border border-white/20
                    text-white/80 hover:text-white rounded-xl px-3 py-1.5 shadow-md
                    transition-[border-color,background-color] duration-150 ease-out"
                >
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                  <Github size={11} />
                  {t('projects_code')}
                </motion.a>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}