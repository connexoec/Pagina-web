import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { members, OPEN_SLOTS, cities } from '../data/directory'
import { ecosystems } from '../data/ecosystems'
import { MemberCard, OpenSlotCard } from './DirectoryCard'
import SectionKicker from './SectionKicker'
import { Counter } from './fx/Motion'
import { ArrowIcon, SearchIcon } from './icons'
import { wa, waMsg } from '../config/site'

// ─────────────────────────────────────────────────────────────
//  RED CONNEXO · el directorio público de emprendedores.
//  Textura de red de nodos SVG (estática) + barrido de radar por transform.
//  Sin canvas y sin rAF propio → sin jank.
// ─────────────────────────────────────────────────────────────
const NODES = [
  { x: 90, y: 70 }, { x: 240, y: 40 }, { x: 380, y: 120 }, { x: 520, y: 60 },
  { x: 660, y: 130 }, { x: 160, y: 200 }, { x: 320, y: 250 }, { x: 470, y: 210 },
  { x: 620, y: 270 }, { x: 110, y: 320 }, { x: 280, y: 360 }, { x: 430, y: 330 },
  { x: 580, y: 380 }, { x: 700, y: 330 },
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
          <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} />
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

/** Barrido de radar: un cono girando. Solo `rotate` → se resuelve en GPU. */
function RadarSweep() {
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16]"
      style={{
        background:
          'conic-gradient(from 0deg, rgba(255,102,0,0.55) 0deg, rgba(255,102,0,0) 42deg, rgba(255,102,0,0) 360deg)',
        maskImage: 'radial-gradient(circle, #000 20%, transparent 68%)',
        WebkitMaskImage: 'radial-gradient(circle, #000 20%, transparent 68%)',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
    />
  )
}

/** Búsqueda sin acentos y con palabras en cualquier orden, como el catálogo. */
/** \p{M} = marcas combinantes: es la tilde ya separada por normalize('NFD'). */
const DIACRITICS = /\p{M}/gu
function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(DIACRITICS, '')
}

export default function RedConnexo() {
  const [query, setQuery] = useState('')
  const [rubro, setRubro] = useState<string>('todos')

  const results = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean)
    return members.filter((m) => {
      if (rubro !== 'todos' && m.ecosystem !== rubro) return false
      if (!terms.length) return true
      const haystack = normalize(`${m.name} ${m.what} ${m.city} ${m.ecosystem}`)
      return terms.every((t) => haystack.includes(t))
    })
  }, [query, rubro])

  const isFiltering = query.trim() !== '' || rubro !== 'todos'
  const openSlots = isFiltering ? 0 : OPEN_SLOTS
  const rubrosActivos = new Set(members.map((m) => m.ecosystem)).size

  return (
    <section
      id="red"
      className="relative overflow-hidden border-y border-white/[0.06] bg-abyss-900 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <NodeNetwork />
      </div>
      <RadarSweep />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      <div className="section-pad relative">
        {/* Encabezado */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex justify-center">
            <SectionKicker label="el mapa de los que ya se atrevieron" />
          </div>

          <h2 className="font-heading text-3xl leading-tight text-white sm:text-5xl">
            RED CONNEXO: el directorio de quienes cambiaron el papel por un toque.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base text-white/60 sm:text-lg">
            No es un listado de anuncios. Es la red de negocios reales que ya
            viven en Connexo: entras, ves qué hace cada uno y saltas directo a su
            perfil. Sin intermediarios y sin pagar por aparecer arriba.
          </p>

          {/* Pulso de la red */}
          <div className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-4">
            {[
              { n: members.length, v: members.length === 1 ? 'Negocio en la red' : 'Negocios en la red' },
              { n: rubrosActivos, v: rubrosActivos === 1 ? 'Rubro activo' : 'Rubros activos' },
              { n: cities().length, v: cities().length === 1 ? 'Ciudad' : 'Ciudades' },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-xl border border-white/[0.06] bg-black/40 px-3 py-4 backdrop-blur-sm"
              >
                <Counter to={s.n} className="font-heading text-2xl text-connexo" />
                <div className="mt-1 text-[11px] uppercase tracking-wide text-white/45">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buscador */}
        <div className="mx-auto mt-14 max-w-2xl">
          <label className="relative block">
            <span className="sr-only">Buscar en la RED CONNEXO</span>
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca un negocio, un rubro o una ciudad…"
              className="w-full rounded-full border border-white/10 bg-black/50 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/30 backdrop-blur-sm transition-colors focus:border-connexo/60 focus:outline-none focus:ring-1 focus:ring-connexo/40"
            />
          </label>

          {/* Filtros por rubro */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setRubro('todos')}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                rubro === 'todos'
                  ? 'border-connexo bg-connexo text-black'
                  : 'border-white/10 text-white/55 hover:border-white/25 hover:text-white'
              }`}
            >
              Todos
            </button>

            {ecosystems.map((eco) => {
              const count = members.filter((m) => m.ecosystem === eco.id).length
              const isActive = rubro === eco.id
              return (
                <button
                  key={eco.id}
                  onClick={() => setRubro(isActive ? 'todos' : eco.id)}
                  disabled={count === 0}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'border-connexo bg-connexo text-black'
                      : count === 0
                        ? 'cursor-not-allowed border-white/[0.06] text-white/20'
                        : 'border-white/10 text-white/55 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {eco.name}
                  {count > 0 && (
                    <span className={isActive ? 'ml-1.5 text-black/60' : 'ml-1.5 text-connexo'}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Grilla */}
        {results.length === 0 ? (
          <div className="mx-auto mt-14 max-w-md rounded-2xl border border-white/[0.08] bg-black/40 p-10 text-center">
            <p className="font-heading text-xl text-white">Todavía nadie por ahí.</p>
            <p className="mt-3 text-sm text-white/50">
              La red está abriendo y aún es chica. Prueba con otro rubro, o sé tú
              quien ocupe ese lugar.
            </p>
            <button
              onClick={() => {
                setQuery('')
                setRubro('todos')
              }}
              className="mt-5 text-sm font-semibold text-connexo hover:underline"
            >
              Ver toda la red
            </button>
          </div>
        ) : (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((m, i) => (
              <MemberCard key={m.id} member={m} index={i} />
            ))}
            {Array.from({ length: openSlots }, (_, i) => (
              <OpenSlotCard key={`slot-${i}`} index={results.length + i} />
            ))}
          </div>
        )}

        {/* Cierre */}
        <div className="mx-auto mt-16 max-w-2xl text-center">
          <p className="text-sm text-white/45">
            La red se llena en el orden en que la gente se atreve. No hay puestos
            comprados ni resultados patrocinados: quien entra, aparece.
          </p>
          <a
            href={wa(waMsg.red)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta group mt-6"
          >
            ENTRAR A LA RED
            <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}
