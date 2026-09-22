import { useEffect, useRef } from 'react'
import { useAccessibility } from '../context/AccessibilityContext'

/**
 * Guía de lectura (Focus Ruler) — una franja clara sigue el puntero y atenúa el
 * resto de la pantalla, para no perder la línea. Control del panel (§13).
 *
 * Multi-dispositivo a propósito: escucha `pointermove`, que unifica ratón, dedo
 * y lápiz. En PC sigue el cursor; en teléfono sigue el dedo mientras se arrastra
 * o se hace scroll. Con `pointer-events: none` NUNCA bloquea toques ni scroll.
 *
 * Rendimiento (§6): solo se mueve con `transform` (translate3d, GPU), y las
 * actualizaciones van agrupadas en un `requestAnimationFrame`. La sombra que
 * oscurece el resto es estática (no se anima). No monta nada si está apagada.
 */
const BAND = 72 // alto de la franja clara, en px
const DIM = 0.5 // opacidad del oscurecido (sutil)

export default function ReadingRuler() {
  const { settings } = useAccessibility()
  const enabled = settings.readingRuler
  const bandRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  // Arranca centrada verticalmente; se recuerda entre movimientos.
  const yRef = useRef<number>(typeof window !== 'undefined' ? window.innerHeight / 2 : 0)

  useEffect(() => {
    if (!enabled) return

    const paint = () => {
      rafRef.current = null
      const el = bandRef.current
      if (el) el.style.transform = `translate3d(0, ${yRef.current - BAND / 2}px, 0)`
    }
    const onMove = (e: PointerEvent) => {
      yRef.current = e.clientY
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(paint)
    }

    paint() // posición inicial (centro)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[45]" aria-hidden="true">
      <div
        ref={bandRef}
        className="absolute left-0 top-0 w-full will-change-transform"
        style={{
          height: BAND,
          // La sombra de gran extensión oscurece TODO menos la franja.
          boxShadow: `0 0 0 100vmax rgba(0,0,0,${DIM})`,
          // Líneas guía naranja de marca — marcan la "regla".
          borderTop: '2px solid rgba(255,102,0,0.55)',
          borderBottom: '2px solid rgba(255,102,0,0.55)',
        }}
      />
    </div>
  )
}
