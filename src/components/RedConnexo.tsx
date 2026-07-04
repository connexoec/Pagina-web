import { motion } from 'framer-motion'
import { SparkIcon, ArrowIcon } from './icons'

// Lightweight, static node graph (no per-frame JS) → zero lag.
// Nodes are pulsed with cheap CSS/framer opacity only.
const NODES = [
  { x: 90, y: 70 },
  { x: 240, y: 40 },
  { x: 380, y: 120 },
  { x: 520, y: 60 },
  { x: 660, y: 130 },
  { x: 160, y: 200 },
  { x: 320, y: 250 },
  { x: 470, y: 210 },
  { x: 620, y: 270 },
  { x: 110, y: 320 },
  { x: 280, y: 360 },
  { x: 430, y: 330 },
  { x: 580, y: 380 },
  { x: 700, y: 330 },
]
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [2, 6], [6, 7],
  [7, 3], [4, 8], [7, 8], [5, 9], [9, 10], [10, 11], [6, 11], [11, 12],
  [8, 12], [12, 13], [4, 13], [10, 6],
]

function NodeNetwork() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 760 420"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <g stroke="#ff6600" strokeOpacity="0.16" strokeWidth="1">
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
          />
        ))}
      </g>
      {NODES.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i % 3 === 0 ? 3.5 : 2}
          fill="#ff6600"
          initial={{ opacity: 0.25 }}
          animate={{ opacity: [0.25, 0.9, 0.25] }}
          transition={{
            duration: 3 + (i % 5),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.2,
          }}
        />
      ))}
    </svg>
  )
}

export default function RedConnexo() {
  return (
    <section
      id="red"
      className="relative overflow-hidden border-y border-white/[0.06] bg-abyss-900 py-24 sm:py-32"
    >
      {/* Node network texture */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <NodeNetwork />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-connexo/10 blur-[120px]" />

      <div className="section-pad relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-connexo/40 bg-connexo/10 px-4 py-1.5 text-sm font-medium lowercase tracking-tight text-connexo">
            <SparkIcon className="h-4 w-4" />
            todavía no abre sus puertas
          </span>

          <h2 className="font-heading text-3xl leading-tight text-white sm:text-5xl">
            RED CONNEXO: adentro solo están los que ya se atrevieron.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base text-white/60 sm:text-lg">
            No es un listado más. Es el mapa vivo de quienes ya cambiaron el papel
            por un toque: negocios, marcas y personas reales, conectados entre sí.
            Tu plan aparta tu lugar antes de que abra.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#planes" className="btn-cta group">
              ASEGURAR MI ESPACIO
              <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Stat row */}
          <div className="mx-auto mt-14 grid max-w-xl grid-cols-3 gap-4">
            {[
              { k: '100%', v: 'Perfiles verificados' },
              { k: '24/7', v: 'Presencia digital' },
              { k: '1 toque', v: 'Para conectar' },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-xl border border-white/[0.06] bg-black/40 px-3 py-4 backdrop-blur-sm"
              >
                <div className="font-heading text-2xl text-connexo">{s.k}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wide text-white/45">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
