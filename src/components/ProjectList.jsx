import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, GitBranch, Calendar, ExternalLink, Github } from 'lucide-react';

// ─── Language colour palette ───────────────────────────────────────────────
const LANG_COLORS = {
  JavaScript: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
  TypeScript: 'bg-blue-400/20 text-blue-300 border-blue-400/30',
  Python:     'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
  Rust:       'bg-orange-400/20 text-orange-300 border-orange-400/30',
  Go:         'bg-cyan-400/20 text-cyan-300 border-cyan-400/30',
  CSS:        'bg-pink-400/20 text-pink-300 border-pink-400/30',
  HTML:       'bg-red-400/20 text-red-300 border-red-400/30',
  Shell:      'bg-lime-400/20 text-lime-300 border-lime-400/30',
  default:    'bg-white/10 text-white/70 border-white/20',
};

function langClass(lang) {
  return LANG_COLORS[lang] ?? LANG_COLORS.default;
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Skeleton card ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-white/5 backdrop-blur-md shadow-xl p-6 animate-pulse min-h-[200px]">
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-2xl" />
      {/* "Featured" badge placeholder */}
      <div className="h-4 w-20 rounded-full bg-cyan-400/15 mb-4" />
      <div className="h-6 w-2/3 rounded-full bg-white/15 mb-3" />
      <div className="h-3 w-full rounded-full bg-white/10 mb-2" />
      <div className="h-3 w-4/5 rounded-full bg-white/10 mb-6" />
      <div className="flex gap-3 mt-auto">
        <div className="h-5 w-16 rounded-full bg-white/10" />
        <div className="h-5 w-12 rounded-full bg-white/10" />
        <div className="h-5 w-24 rounded-full bg-white/10 ml-auto" />
      </div>
      <div className="flex gap-2 mt-4">
        <div className="h-8 w-28 rounded-xl bg-white/10" />
        <div className="h-8 w-28 rounded-xl bg-white/10" />
      </div>
    </div>
  );
}

// ─── Framer-motion variants ────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 240, damping: 20 },
  },
};

// ─── Empty / no-featured state ─────────────────────────────────────────────
function NoFeaturedState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="col-span-full flex items-center justify-center p-4"
    >
      <div className="relative rounded-2xl overflow-hidden border border-white/25 bg-white/8 backdrop-blur-md shadow-xl p-8 max-w-sm w-full text-center">
        {/* Glossy top highlight */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-2xl" />
        {/* Bottom glow */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center">
            <Github size={24} className="text-cyan-300" />
          </div>
          <div>
            <p className="text-white/90 font-bold text-base mb-1">No projects featured yet</p>
            <p className="text-white/45 text-xs leading-relaxed">
              Add the{' '}
              <code className="bg-cyan-400/15 border border-cyan-400/25 text-cyan-300 rounded px-1.5 py-0.5 font-mono">
                portfolio
              </code>{' '}
              topic to any GitHub repository to make it appear here.
            </p>
          </div>
          <a
            href="https://github.com/Fuheshka?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-1 text-xs font-semibold text-cyan-300 border border-cyan-400/30 bg-cyan-400/10 hover:bg-cyan-400/20 rounded-xl px-4 py-2 transition-colors"
          >
            <ExternalLink size={12} />
            Open GitHub Repositories
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function ProjectList() {
  const [repos, setRepos]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRepos() {
      try {
        const res = await fetch(
          'https://api.github.com/users/Fuheshka/repos?sort=updated&per_page=100',
          // Ensure topics array is included in the response
          { headers: { Accept: 'application/vnd.github+json' } }
        );
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          const featured = data.filter(
            (r) => r.fork === false && Array.isArray(r.topics) && r.topics.includes('portfolio')
          );
          setRepos(featured);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchRepos();
    return () => { cancelled = true; };
  }, []);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 pb-20">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-400/30 flex items-center justify-center text-red-300 text-2xl">
          ✕
        </div>
        <p className="text-white/80 font-semibold">Failed to load repositories</p>
        <p className="text-white/40 text-xs">{error}</p>
      </div>
    );
  }

  // ── No featured repos ────────────────────────────────────────────────────
  if (repos.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 pb-20">
        <NoFeaturedState />
      </div>
    );
  }

  // ── Featured repos grid ──────────────────────────────────────────────────
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {repos.map((repo) => (
        <motion.div
          key={repo.id}
          variants={cardVariants}
          whileHover={{ scale: 1.025 }}
          className={[
            'group relative flex flex-col gap-4 rounded-2xl overflow-hidden',
            'border border-white/30 bg-white/10 backdrop-blur-md',
            'shadow-xl hover:shadow-cyan-400/40',
            'p-6 transition-all duration-300',
            'hover:border-cyan-300/60 hover:brightness-110',
          ].join(' ')}
        >
          {/* Glossy reflection — Frutiger Aero top highlight */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.22] via-white/5 to-transparent pointer-events-none rounded-t-2xl z-10" />

          {/* Cyan bottom glow */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-cyan-500/15 to-transparent pointer-events-none z-10" />

          {/* "Featured" badge */}
          <div className="relative z-20">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-300 bg-cyan-400/15 border border-cyan-400/30 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Featured
            </span>
          </div>

          {/* Header */}
          <div className="relative z-20 flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-white leading-snug group-hover:text-cyan-200 transition-colors break-all">
              {repo.name}
            </h3>
          </div>

          {/* Description */}
          <p className="relative z-20 text-xs text-white/55 line-clamp-3 leading-relaxed flex-1">
            {repo.description ?? 'No description provided.'}
          </p>

          {/* Meta row */}
          <div className="relative z-20 flex flex-wrap items-center gap-2">
            {repo.language && (
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider border rounded-full px-2 py-0.5 ${langClass(repo.language)}`}
              >
                <GitBranch size={9} />
                {repo.language}
              </span>
            )}

            <span className="inline-flex items-center gap-1 text-[11px] text-yellow-300/80">
              <Star size={11} fill="currentColor" />
              {repo.stargazers_count}
            </span>

            <span className="inline-flex items-center gap-1 text-[10px] text-white/35 ml-auto">
              <Calendar size={10} />
              {formatDate(repo.pushed_at)}
            </span>
          </div>

          {/* Action buttons */}
          <div className="relative z-20 flex flex-wrap gap-2 pt-1 border-t border-white/10">
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold
                  bg-cyan-400/20 hover:bg-cyan-400/35 border border-cyan-400/40
                  text-cyan-200 hover:text-white rounded-xl px-3 py-1.5
                  transition-all duration-200 hover:shadow-md hover:shadow-cyan-500/20"
              >
                <ExternalLink size={11} />
                Live Demo
              </a>
            )}
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold
                bg-white/10 hover:bg-white/20 border border-white/20
                text-white/70 hover:text-white rounded-xl px-3 py-1.5
                transition-all duration-200"
            >
              <Github size={11} />
              Source Code
            </a>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}