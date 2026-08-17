import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'

// ─────────────────────────────────────────────────────────────
//  PRIMITIVAS DE MOVIMIENTO  ·  reutilizables por cualquier sección.
//  Todas respetan `prefers-reduced-motion` y todas animan únicamente
//  `transform` / `opacity`. Ver la nota de rendimiento en fx/Ambient.tsx.
// ─────────────────────────────────────────────────────────────

/** Botón o enlace que se inclina hacia el cursor. Solo en punteros finos. */
export function Magnetic({
  children,
  strength = 0.28,
  className = '',
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 20 })
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 20 })

  const onMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (reduced || e.pointerType !== 'mouse') return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={`inline-flex ${className}`}
    >
      {children}
    </motion.span>
  )
}

/** Tarjeta con inclinación 3D al pasar el cursor. En táctil queda plana. */
export function TiltCard({
  children,
  className = '',
  max = 8,
}: {
  children: ReactNode
  className?: string
  max?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const spring = { stiffness: 200, damping: 22 }
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring)

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== 'mouse') return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }
  const reset = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Número que sube al entrar en pantalla. Una sola vez, sin loop. */
export function Counter({
  to,
  suffix = '',
  prefix = '',
  duration = 1400,
  className = '',
}: {
  to: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setValue(to)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // easeOutExpo — arranca rápido y frena, se lee como un contador real
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setValue(Math.round(to * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, to, duration, reduced])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  )
}

const GLYPHS = '▚▞█▓▒░/\\<>{}[]#*+=-_'

/** Titular que se "resuelve" desde ruido. Corre una vez y queda texto plano. */
export function DecodeText({
  text,
  className = '',
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()
  const [out, setOut] = useState(reduced ? text : '')

  useEffect(() => {
    if (reduced) {
      setOut(text)
      return
    }
    let frame = 0
    let timer = 0
    const start = () => {
      const began = performance.now()
      const total = 620 + text.length * 12
      const tick = (now: number) => {
        const t = Math.min(1, (now - began) / total)
        const solved = Math.floor(text.length * t)
        setOut(
          text
            .split('')
            .map((ch, i) => {
              if (i < solved || ch === ' ') return ch
              return GLYPHS[(i * 7 + Math.floor(now / 40)) % GLYPHS.length]
            })
            .join(''),
        )
        if (t < 1) frame = requestAnimationFrame(tick)
        else setOut(text)
      }
      frame = requestAnimationFrame(tick)
    }
    timer = window.setTimeout(start, delay)
    return () => {
      window.clearTimeout(timer)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [text, delay, reduced])

  // El texto real siempre está en el DOM para lectores de pantalla y SEO.
  return (
    <span className={className}>
      <span aria-hidden>{out}</span>
      <span className="sr-only">{text}</span>
    </span>
  )
}

/** Línea naranja que barre la sección al entrar. El separador de la marca. */
export function BeamDivider({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`relative h-px w-full overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <motion.div
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-connexo to-transparent"
        initial={{ x: '-120%' }}
        whileInView={{ x: '420%' }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}

/**
 * Anillos de señal NFC emanando de un punto de toque.
 * Tres círculos SVG en `scale`+`opacity`. Sin canvas, sin rAF propio.
 */
export function NfcRings({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion()
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <circle cx="100" cy="100" r="6" fill="#ff6600" />
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx="100"
          cy="100"
          r="20"
          fill="none"
          stroke="#ff6600"
          strokeWidth="1.5"
          style={{ originX: '100px', originY: '100px' }}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={
            reduced
              ? { scale: 1.6, opacity: 0.25 }
              : { scale: [0.4, 4.2], opacity: [0.7, 0] }
          }
          transition={
            reduced
              ? undefined
              : { duration: 3.4, repeat: Infinity, ease: 'easeOut', delay: i * 1.13 }
          }
        />
      ))}
    </svg>
  )
}

/**
 * Cinta infinita. La animación es CSS pura (`--marquee`), duplicamos el
 * contenido para que el bucle no salte, y se pausa fuera de pantalla.
 */
export function Marquee({
  items,
  duration = 32,
}: {
  items: string[]
  duration?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '120px' })

  return (
    <div
      ref={ref}
      className="relative flex overflow-hidden"
      style={{
        maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
      }}
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className="animate-marquee flex shrink-0 items-center gap-10 pr-10"
          style={{
            animationDuration: `${duration}s`,
            animationPlayState: inView ? 'running' : 'paused',
          }}
        >
          {items.map((item) => (
            <span
              key={item}
              className="flex shrink-0 items-center gap-10 whitespace-nowrap text-sm text-white/35"
            >
              {item}
              <span className="h-1 w-1 rounded-full bg-connexo/60" />
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
