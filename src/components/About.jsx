import { motion } from 'framer-motion';

// ─── Toolbox data ──────────────────────────────────────────────────────────
const TOOLBOX = [
  {
    category: 'Engines',
    color: 'bg-blue-100 text-blue-800 border-blue-300/60',
    items: ['Unity', 'Godot', 'Game Jam Prototyping'],
  },
  {
    category: 'Code',
    color: 'bg-violet-100 text-violet-800 border-violet-300/60',
    items: ['C#', 'GDScript', 'Gameplay Systems', 'Bugfix & Polish'],
  },
  {
    category: '3D Art',
    color: 'bg-orange-100 text-orange-800 border-orange-300/60',
    items: ['Blender', 'Low-poly Characters', 'Stylized Props', 'Lighting & Baking'],
  },
  {
    category: 'Workflow',
    color: 'bg-pink-100 text-pink-800 border-pink-300/60',
    items: ['Git / GitHub', 'Rapid Iteration', 'Deadline Pushes'],
  },
];

// ─── Divider ───────────────────────────────────────────────────────────────
function Divider() {
  return <div className="w-full h-px bg-black/8 my-4" />;
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="p-5 pb-8 flex flex-col gap-0"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-1">
        {/* Avatar */}
        <div className="relative shrink-0 w-16 h-16 rounded-full
          bg-gradient-to-br from-cyan-200 to-blue-400
          border-2 border-white/70 shadow-lg
          flex items-center justify-center text-2xl select-none"
        >
          🎨
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
        </div>

        {/* Name + role */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 leading-tight">Fuheshka</h2>
          <p className="text-[13px] font-semibold text-cyan-600 mt-0.5">
            Indie Game Developer &amp; IT Student
          </p>
          <p className="text-[11px] text-slate-700 mt-0.5">Unity · Godot · Blender · Game Jams</p>
        </div>
      </div>

      <Divider />

      {/* ── Bio ─────────────────────────────────────────────────────────── */}
      <div className="mb-1">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-700 mb-2">
          About
        </h3>
        <div className="space-y-4 text-slate-700 leading-relaxed">
          <p>
            Hi, I&apos;m <span className="font-bold text-slate-900">Daniil</span> (aka Fuheshka). 👋
          </p>

          <p>
            I&apos;m an indie developer and aspiring <span className="font-bold text-cyan-600">Technical Artist</span> who loves breaking game engines just to see how they work. I sit right at the intersection of code and art—building complex mechanics in <span className="font-medium text-slate-900">Unity &amp; Godot</span> and crafting atmospheric 3D worlds in <span className="font-medium text-slate-900">Blender</span>.
          </p>

          <p>
            My natural habitat is the chaos of a <span className="font-bold text-pink-500">Game Jam</span>. I thrive on the adrenaline of 72-hour coding marathons, rapid prototyping, and the thrill of submitting a build just minutes before the deadline. Whether it&apos;s writing C# scripts or baking lighting for a low-poly scene, I&apos;m all about making things <em>feel</em> alive.
          </p>

          <div className="bg-white/40 p-3 rounded-lg border border-white/50 text-sm">
            <span className="font-bold">⚡ When I&apos;m not coding:</span>
            <br />
            You&apos;ll find me exploring the city for the best street food 🌯, cooking up something tasty, or just vibing with new tech.
          </div>

          <p className="text-sm font-semibold text-slate-800">
            🚀 Current Status: Level 3 Student &amp; Full-time Experimenter.
          </p>
        </div>
      </div>

      <Divider />

      {/* ── Toolbox ─────────────────────────────────────────────────────── */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-700 mb-3">
          Toolbox
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
              <span className="shrink-0 mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 w-14 pt-0.5">
                {group.category}
              </span>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className={`text-[11px] font-semibold border rounded-lg px-2 py-0.5 ${group.color}`}
                  >
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
