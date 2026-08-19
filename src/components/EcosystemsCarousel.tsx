import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ecosystems } from '../data/ecosystems'
import { ChevronLeft, ChevronRight, LockIcon, WhatsappIcon } from './icons'
import { wa, waMsg } from '../config/site'

const COUNT = ecosystems.length

/**
 * Proporción real de las capturas de perfil (≈ 500 × 977 px).
 * El marco del carrusel usa EXACTAMENTE esta proporción, así que la pantalla
 * entra completa: no hay recorte ni franjas negras a los lados, y ninguna
 * etiqueta se monta encima de la imagen.
 */
const SHOT_RATIO = 0.512
/** Altura de la banda con el nombre, DEBAJO del teléfono (nunca sobre él). */
const LABEL_H = 38

/** Shortest circular distance from `active` to `index` (range: -N/2..N/2). */
function circularOffset(index: number, active: number, n: number) {
  let offset = index - active
  if (offset > n / 2) offset -= n
  if (offset < -n / 2) offset += n
  return offset
}

/** Cara del espacio todavía sin captura. */
function ReservedFace() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-abyss-700 via-abyss-800 to-black">
      <div className="pointer-events-none absolute inset-0 bg-grid-nodes [background-size:22px_22px] opacity-30" />
      <div className="pointer-events-none absolute -bottom-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-connexo/20 blur-3xl" />
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-connexo/40 bg-connexo/10 text-connexo">
        <LockIcon className="h-6 w-6" />
      </div>
      <span className="relative mt-4 rounded-full border border-connexo/40 bg-connexo/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-widest text-connexo">
        Captura en camino
      </span>
    </div>
  )
}

export default function EcosystemsCarousel() {
  const [active, setActive] = useState(0)
  const [card, setCard] = useState(240)
  const containerRef = useRef<HTMLDivElement>(null)

  // El ancho manda: el alto se deriva de la proporción real de la captura.
  useEffect(() => {
    const measure = () => {
      const w = containerRef.current?.offsetWidth ?? 1024
      setCard(Math.round(Math.min(250, Math.max(168, w * 0.3))))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const phoneH = Math.round(card / SHOT_RATIO)
  const cardH = phoneH + LABEL_H
  const gap = Math.round(card * 0.66)

  const go = useCallback(
    (dir: number) => setActive((a) => (a + dir + COUNT) % COUNT),
    [],
  )

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(-1)
    if (e.key === 'ArrowRight') go(1)
  }

  const activeEco = ecosystems[active]

  return (
    /* overflow-hidden: las tarjetas laterales del cover flow se salen a
       propósito del ancho del viewport. Se recortan AQUÍ, en la sección, para
       que el documento no crezca a lo ancho (ver nota en index.css).
       Ojo: esta sección no contiene ningún `position: sticky` — si algún día
       se añade uno, `overflow-hidden` lo rompería. */
    <section
      id="ecosistemas"
      className="relative overflow-hidden bg-abyss-950 py-20 sm:py-28"
    >
      <div className="section-pad">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl text-white sm:text-4xl">
            Nueve maneras de ser tú. Ninguna de papel.
          </h2>
          <p className="mt-4 text-white/55">
            Tu perfil no se decora: se moldea a lo que haces. Una barbería y un
            restaurante no ven ni las mismas pantallas ni las mismas herramientas.
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
        aria-label="Los nueve rubros de Connexo"
        className="relative mx-auto mt-14 flex w-full max-w-6xl items-center justify-center outline-none"
        style={{ perspective: 1400, height: cardH + 60 }}
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
          // Ventana de 5 tarjetas: el resto ni se monta.
          if (abs > 2) return null

          const isCenter = offset === 0
          return (
            <motion.button
              key={eco.id}
              onClick={() => !isCenter && setActive(i)}
              aria-label={eco.name}
              aria-current={isCenter}
              className="absolute left-1/2 top-1/2 will-change-transform"
              style={{
                width: card,
                height: cardH,
                cursor: isCenter ? 'default' : 'pointer',
                pointerEvents: abs > 1 ? 'none' : 'auto',
              }}
              initial={false}
              animate={{
                x: `calc(-50% + ${offset * gap}px)`,
                y: '-50%',
                scale: isCenter ? 1 : abs === 1 ? 0.84 : 0.68,
                rotateY: offset * -24,
                opacity: abs === 0 ? 1 : abs === 1 ? 0.6 : 0.2,
                zIndex: 100 - abs,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 32 }}
            >
              {/* Cuerpo del teléfono: bisel + pantalla completa */}
              <div
                className="relative w-full overflow-hidden rounded-[1.9rem] border p-[3px] transition-colors duration-300"
                style={{
                  height: phoneH,
                  borderColor: isCenter
                    ? 'rgba(255,102,0,0.55)'
                    : 'rgba(255,255,255,0.08)',
                  background:
                    'linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 45%, rgba(0,0,0,0.6))',
                  boxShadow: isCenter
                    ? '0 0 0 1px rgba(255,102,0,0.45), 0 45px 90px -35px rgba(255,102,0,0.55)'
                    : '0 30px 60px -35px rgba(0,0,0,0.95)',
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[1.65rem] bg-black">
                  {eco.reserved || !eco.image ? (
                    <ReservedFace />
                  ) : (
                    <img
                      src={eco.image}
                      alt={`Perfil ${eco.name} en Connexo`}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      /* La proporción del marco == la de la captura → completa. */
                      className="h-full w-full object-contain"
                    />
                  )}

                  {/* Brillo diagonal de vidrio, solo en la tarjeta central */}
                  {isCenter && (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent" />
                  )}
                </div>

                {/* Velo de profundidad en las tarjetas laterales */}
                {!isCenter && (
                  <div className="pointer-events-none absolute inset-0 rounded-[1.9rem] bg-black/45" />
                )}
              </div>

              {/* Nombre DEBAJO del teléfono — nunca encima de la captura */}
              <div
                className="flex items-center justify-center"
                style={{ height: LABEL_H }}
              >
                <span
                  className={`font-heading text-sm transition-colors ${
                    isCenter ? 'text-connexo' : 'text-white/45'
                  }`}
                >
                  {eco.name}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Controls */}
      <div className="section-pad mt-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => go(-1)}
            aria-label="Anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-connexo hover:text-connexo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

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

        {/* Ficha del rubro activo */}
        <div className="mx-auto mt-8 min-h-[190px] max-w-lg text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEco.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="font-heading text-2xl text-white">{activeEco.name}</h3>
              <p className="mt-2 text-sm text-white/55">{activeEco.tagline}</p>

              <p className="mx-auto mt-4 max-w-md rounded-xl border border-connexo/20 bg-connexo/[0.06] px-4 py-3 text-sm leading-relaxed text-white/75">
                {activeEco.edge}
              </p>

              <a
                href={wa(waMsg.ecosystem(activeEco.name))}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-connexo hover:underline"
              >
                <WhatsappIcon className="h-4 w-4" />
                Quiero el perfil {activeEco.name}
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
