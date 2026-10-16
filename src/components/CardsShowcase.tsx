import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { cardDesigns, CARD_H, CARD_W, type CardDesign, type CardFace } from '../data/cards'
import { wa, waMsg } from '../config/site'
import { TiltCard } from './fx/Motion'
import { WhatsappIcon } from './icons'

/**
 * Las tarjetas físicas de Connexo, flotando sobre un neón naranja: portada y
 * reverso a la vez, con un selector entre los diseños reales (Connexo, Quantum
 * Code, Fundación Arupo, Arupo CTI). Datos y rutas de imagen en `data/cards.ts`.
 *
 * Reglas que respeta (CLAUDE.md §6 y §12):
 * - **Solo `transform` y `opacity` se animan.** El desenfoque del resplandor y
 *   el `box-shadow` del tubo de neón son ESTÁTICOS; lo que se mueve es la
 *   capa ya pintada (la flotación) o su `opacity` (el parpadeo del neón).
 * - **CSS puro para lo que corre para siempre** (flotación y parpadeo, en
 *   `tailwind.config.js`), y en pausa cuando la sección sale de pantalla.
 * - `prefers-reduced-motion` no necesita código: la regla global de `index.css`
 *   colapsa las duraciones y el frame 0% de cada keyframe es el reposo.
 * - Los PNG ya traen las esquinas redondeadas (transparentes); el radio de
 *   `CORNER` solo existe para que el aro y el neón calcen con ellas.
 */

// Radio medido sobre el PNG: 40px de 1200×758 → 3.33% del ancho, 5.28% del alto.
const CORNER = 'rounded-[3.33%/5.28%]'

function Face({
  face,
  label,
  place,
  rotate,
  floatDelay,
  live,
  z,
}: {
  face: CardFace
  label: string
  /** Posición del cuadro dentro del escenario (clases de Tailwind). */
  place: string
  rotate: number
  /** Desfase negativo (s) para que las dos tarjetas no floten al unísono. */
  floatDelay: number
  live: boolean
  z: string
}) {
  return (
    // Capa 1 — posición + inclinación fija (transform estático).
    <div className={`absolute w-[74%] sm:w-[52%] ${place} ${z}`} style={{ transform: `rotate(${rotate}deg)` }}>
      {/* Capa 2 — la flotación (CSS puro, en pausa fuera de pantalla). */}
      <div
        className="animate-card-float will-change-transform"
        style={{ animationDelay: `${floatDelay}s`, animationPlayState: live ? 'running' : 'paused' }}
      >
        {/* Capa 3 — el hover (solo ratón: en táctil Framer lo ignora). */}
        <motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative"
        >
          {/* Resplandor difuso detrás de la tarjeta. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-[7%] rounded-full bg-connexo/45 blur-3xl"
          />
          {/* Tubos de neón desfasados: asoman por detrás como un letrero. */}
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-0 ${CORNER} translate-x-[3%] translate-y-[5%] rotate-[3deg] border-2 border-connexo shadow-neon animate-neon-flicker`}
          />
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-0 ${CORNER} -translate-x-[2.5%] -translate-y-[4%] -rotate-[2deg] border border-connexo/60 shadow-neon-soft`}
          />

          <img
            src={face.src}
            alt={face.alt}
            width={CARD_W}
            height={CARD_H}
            loading="lazy"
            decoding="async"
            draggable={false}
            className={`relative block h-auto w-full select-none ${CORNER} ring-1 ring-white/10`}
          />

          {/* Etiqueta: a caballo del borde inferior, donde ninguna tarjeta
              tiene arte. */}
          <span className="absolute -bottom-3 left-[6%] inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/85 px-3 py-1 text-xs font-semibold text-white/85">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-connexo" />
            {label}
          </span>
        </motion.div>
      </div>
    </div>
  )
}

export default function CardsShowcase() {
  const [activeId, setActiveId] = useState(cardDesigns[0].id)
  const design = cardDesigns.find((d) => d.id === activeId) ?? cardDesigns[0]

  const sectionRef = useRef<HTMLElement>(null)
  // `live` pausa la flotación fuera de pantalla; `seen` dispara la precarga.
  const live = useInView(sectionRef, { margin: '80px' })
  const seen = useInView(sectionRef, { once: true, margin: '240px' })

  // Precarga de los otros diseños: así el cambio de selector no "carga".
  const warmed = useRef(new Set<string>())
  const warm = (d: CardDesign) => {
    for (const f of [d.front, d.back]) {
      if (warmed.current.has(f.src)) continue
      warmed.current.add(f.src)
      const img = new Image()
      img.src = f.src
    }
  }
  useEffect(() => {
    if (!seen) return
    const t = window.setTimeout(() => cardDesigns.forEach(warm), 900)
    return () => window.clearTimeout(t)
  }, [seen])

  return (
    <section
      id="tarjetas"
      ref={sectionRef}
      aria-label="Las tarjetas Connexo"
      className="relative overflow-hidden bg-abyss-950 py-20 sm:py-28"
    >
      <div className="section-pad relative">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-balance font-heading text-3xl leading-tight text-white sm:text-4xl">
            Parece una tarjeta. Trabaja como un vendedor.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-white/60">
            Esto es lo que dejas en la mano del cliente: una cara con tu marca y
            el símbolo de toque, y otra con tu nombre, tu cargo y el QR de tu
            perfil. La acercas al celular y se abre. Y si ese teléfono no lee
            NFC, el QR del reverso es el plan B.
          </p>
        </motion.div>

        {/* Escenario: halo + neón de fondo (fijos) y el par de tarjetas. */}
        <div className="relative mx-auto mt-16 w-full max-w-4xl sm:mt-20">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[125%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-connexo/20 blur-[110px]" />
            <div className="absolute left-1/2 top-1/2 aspect-square h-[104%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-connexo/70 shadow-neon-soft animate-neon-flicker" />
            <div className="absolute -bottom-3 left-1/2 h-8 w-[66%] -translate-x-1/2 rounded-[100%] bg-connexo/40 blur-2xl" />
          </div>

          <TiltCard max={4} className="relative">
            <div className="relative aspect-[5/4.5] sm:aspect-[16/9.4]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, y: 18, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  {/* El reverso queda atrás; la portada, al frente. */}
                  <Face
                    face={design.back}
                    label="Reverso"
                    place="bottom-0 right-0"
                    rotate={4}
                    floatDelay={-3.5}
                    live={live}
                    z="z-10"
                  />
                  <Face
                    face={design.front}
                    label="Portada"
                    place="left-0 top-0"
                    rotate={-5}
                    floatDelay={0}
                    live={live}
                    z="z-20"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </TiltCard>
        </div>

        {/* Selector de diseño */}
        <div
          role="group"
          aria-label="Elige un diseño de tarjeta"
          className="relative mt-16 flex flex-wrap items-center justify-center gap-2.5"
        >
          {cardDesigns.map((d) => {
            const active = d.id === design.id
            return (
              <button
                key={d.id}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveId(d.id)}
                onPointerEnter={() => warm(d)}
                onFocus={() => warm(d)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-connexo focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                  active
                    ? 'border-connexo bg-connexo/15 text-white'
                    : 'border-white/15 text-white/60 hover:border-connexo/50 hover:text-white'
                }`}
              >
                {d.name}
              </button>
            )
          })}
        </div>

        <p
          aria-live="polite"
          className="mx-auto mt-5 min-h-[4.5rem] max-w-xl text-center text-sm leading-relaxed text-white/55 sm:min-h-[3rem]"
        >
          {design.blurb}
        </p>

        <div className="mt-6 flex flex-col items-center gap-4">
          <a
            href={wa(waMsg.cards)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta group"
          >
            <WhatsappIcon className="h-5 w-5" />
            QUIERO LA MÍA
          </a>
          <p className="max-w-md text-center text-xs text-white/35">
            Son tarjetas reales de negocios que ya usan Connexo: el QR del
            reverso lleva a su perfil.
          </p>
        </div>
      </div>
    </section>
  )
}
