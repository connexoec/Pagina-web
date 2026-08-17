import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

// ─────────────────────────────────────────────────────────────
//  EFECTOS DE AMBIENTE  ·  la atmósfera de la página.
//
//  REGLA DE ORO DE RENDIMIENTO: aquí solo se anima `transform` y `opacity`.
//  Son las dos únicas propiedades que resuelve el compositor en GPU. Nunca se
//  anima `filter`, `blur`, `box-shadow` ni `width`: eso obliga al navegador a
//  repintar cada frame y es exactamente lo que produce el lag.
// ─────────────────────────────────────────────────────────────

/** Ruido SVG generado UNA vez y horneado como data-URI. Coste por frame: 0. */
const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/**
 * Grano de película sobre toda la página. Le quita el plano digital al negro
 * puro y hace que el naranja se sienta impreso, no renderizado.
 */
export function FilmGrain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.035] mix-blend-overlay"
      style={{ backgroundImage: GRAIN_URL }}
    />
  )
}

/**
 * Auroras naranjas: manchas de luz que derivan lentamente.
 * El `blur` es ESTÁTICO (se calcula una sola vez); lo que se mueve es el
 * `transform` del elemento ya desenfocado. De ahí que no cueste nada.
 */
export function Aurora({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion()

  const blobs = [
    { size: 520, x: '12%', y: '8%', delay: 0, drift: 60 },
    { size: 420, x: '78%', y: '52%', delay: 3, drift: -50 },
    { size: 340, x: '42%', y: '82%', delay: 6, drift: 40 },
  ]

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-connexo/[0.13] blur-[120px]"
          style={{ width: b.size, height: b.size, left: b.x, top: b.y }}
          animate={
            reduced
              ? undefined
              : { x: [0, b.drift, 0], y: [0, -b.drift * 0.6, 0] }
          }
          transition={{
            duration: 18 + i * 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: b.delay,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Rejilla en perspectiva que se desplaza con el scroll. El plano está rotado en
 * X y solo se mueve su `translate3d` — el degradado repetido nunca se recalcula.
 */
export function PerspectiveGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '38%'])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-72 overflow-hidden"
      style={{ perspective: 340, maskImage: 'linear-gradient(to top, #000 10%, transparent 85%)', WebkitMaskImage: 'linear-gradient(to top, #000 10%, transparent 85%)' }}
    >
      <motion.div
        className="absolute inset-x-[-50%] bottom-[-40%] h-[200%] origin-bottom"
        style={{
          y: reduced ? 0 : y,
          transform: 'rotateX(72deg)',
          backgroundImage:
            'linear-gradient(rgba(255,102,0,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,102,0,0.22) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  )
}

/**
 * Foco que sigue al cursor. Escribe dos variables CSS con rAF (un solo frame
 * pendiente como máximo) y solo en punteros finos: en teléfono ni se monta.
 */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const el = ref.current
    if (!el) return

    let frame = 0
    let mx = 0
    let my = 0

    const paint = () => {
      frame = 0
      el.style.setProperty('--mx', `${mx}px`)
      el.style.setProperty('--my', `${my}px`)
    }
    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      if (!frame) frame = requestAnimationFrame(paint)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[55] hidden md:block"
      style={{
        background:
          'radial-gradient(340px circle at var(--mx, -999px) var(--my, -999px), rgba(255,102,0,0.055), transparent 70%)',
      }}
    />
  )
}
