import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ecosystems } from '../data/ecosystems'
import { ChevronLeft, ChevronRight, LockIcon, ArrowIcon } from './icons'

const COUNT = ecosystems.length

/** Shortest circular distance from `active` to `index` (range: -N/2..N/2). */
function circularOffset(index: number, active: number, n: number) {
  let offset = index - active
  if (offset > n / 2) offset -= n
  if (offset < -n / 2) offset += n
  return offset
}

/** A single reserved / no-asset placeholder face. */
function ReservedFace() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-abyss-700 via-abyss-800 to-black">
      <div className="pointer-events-none absolute inset-0 bg-grid-nodes [background-size:22px_22px] opacity-30" />
      <div className="pointer-events-none absolute -bottom-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-connexo/20 blur-3xl" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-connexo/40 bg-connexo/10 text-connexo">
        <LockIcon className="h-7 w-7" />
      </div>
      <span className="relative mt-5 rounded-full border border-connexo/40 bg-connexo/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-connexo">
        Espacio reservado
      </span>
    </div>
  )
}

export default function EcosystemsCarousel() {
  const [active, setActive] = useState(0)
  const [dims, setDims] = useState({ card: 300, gap: 190 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Responsive sizing of the coverflow deck.
  useEffect(() => {
    const measure = () => {
      const w = containerRef.current?.offsetWidth ?? 1024
      const card = Math.min(340, Math.max(230, w * 0.62))
      setDims({ card, gap: card * 0.62 })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const go = useCallback(
    (dir: number) => setActive((a) => (a + dir + COUNT) % COUNT),
    [],
  )

  // Keyboard navigation when the deck is focused.
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(-1)
    if (e.key === 'ArrowRight') go(1)
  }

  const activeEco = ecosystems[active]

  return (
    <section id="ecosistemas" className="relative bg-abyss-950 py-20 sm:py-28">
      <div className="section-pad">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-connexo">
            Ecosistemas
          </p>
          <h2 className="font-heading text-3xl text-white sm:text-4xl">
            Un perfil que se adapta a tu negocio.
          </h2>
          <p className="mt-4 text-white/55">
            8 ecosistemas diseñados para convertir. Desliza para explorar.
          </p>
        </div>
      </div>

      {/* Coverflow deck */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={onKey}
        role="group"
        aria-roledescription="carrusel"
        aria-label="Ecosistemas Connexo"
        className="relative mx-auto mt-14 flex h-[440px] w-full max-w-6xl items-center justify-center outline-none sm:h-[500px]"
        style={{ perspective: 1400 }}
      >
        {/* Drag catcher spanning the deck */}
        <motion.div
          className="absolute inset-0 z-[200] cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60 || info.velocity.x < -400) go(1)
            else if (info.offset.x > 60 || info.velocity.x > 400) go(-1)
          }}
        />

        {ecosystems.map((eco, i) => {
          const offset = circularOffset(i, active, COUNT)
          const abs = Math.abs(offset)
          // Only render a 5-card window for performance.
          if (abs > 2) return null

          const isCenter = offset === 0
          return (
            <motion.button
              key={eco.id}
              onClick={() => !isCenter && setActive(i)}
              aria-label={eco.name}
              aria-current={isCenter}
              className="absolute left-1/2 top-1/2 overflow-hidden rounded-3xl border will-change-transform"
              style={{
                width: dims.card,
                height: dims.card * 1.32,
                borderColor: isCenter
                  ? 'rgba(255,102,0,0.55)'
                  : 'rgba(255,255,255,0.06)',
                cursor: isCenter ? 'default' : 'pointer',
                pointerEvents: abs > 1 ? 'none' : 'auto',
              }}
              initial={false}
              animate={{
                x: `calc(-50% + ${offset * dims.gap}px)`,
                y: '-50%',
                scale: isCenter ? 1 : abs === 1 ? 0.82 : 0.66,
                rotateY: offset * -22,
                opacity: abs === 0 ? 1 : abs === 1 ? 0.55 : 0.18,
                zIndex: 100 - abs,
                boxShadow: isCenter
                  ? '0 0 0 1px rgba(255,102,0,0.5), 0 40px 90px -30px rgba(255,102,0,0.5)'
                  : '0 30px 60px -30px rgba(0,0,0,0.9)',
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 32 }}
            >
              {eco.reserved || !eco.image ? (
                <ReservedFace />
              ) : (
                <img
                  src={eco.image}
                  alt={`Perfil ${eco.name}`}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              )}

              {/* Bottom gradient + label */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5 pt-16 text-left">
                <h3 className="font-heading text-xl text-white">{eco.name}</h3>
                {isCenter && (
                  <p className="mt-1 text-xs text-white/60">{eco.tagline}</p>
                )}
              </div>

              {/* Dim veil on side cards */}
              {!isCenter && (
                <div className="pointer-events-none absolute inset-0 bg-black/40" />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Controls */}
      <div className="section-pad mt-8">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => go(-1)}
            aria-label="Anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-connexo hover:text-connexo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {ecosystems.map((eco, i) => (
              <button
                key={eco.id}
                onClick={() => setActive(i)}
                aria-label={`Ir a ${eco.name}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active
                    ? 'w-6 bg-connexo'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => go(1)}
            aria-label="Siguiente"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-connexo hover:text-connexo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Active caption + CTA */}
        <div className="mx-auto mt-8 max-w-md text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEco.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-sm text-white/60">{activeEco.tagline}</p>
              <a
                href="#planes"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-connexo hover:underline"
              >
                Crear mi perfil {activeEco.name}
                <ArrowIcon className="h-4 w-4" />
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
