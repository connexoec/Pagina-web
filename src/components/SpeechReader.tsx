import { useCallback, useEffect, useRef, useState } from 'react'
import { useAccessibility } from '../context/AccessibilityContext'
import { PauseIcon, PlayIcon, SpeakerIcon, StopIcon } from './icons'

/**
 * Lector de voz (Text-to-Speech) — Web Speech API nativa (`speechSynthesis`),
 * sin librerías. Control del panel (§13).
 *
 * UX (a criterio + feedback del cliente 2026-09-21):
 * - **Escritorio (mouse):** selecciona texto y se lee (en `pointerup`, un gesto).
 * - **Móvil (táctil):** **desliza el dedo sobre el texto** y el bloque bajo el
 *   dedo se **resalta** (para que una persona con baja visión sepa qué se va a
 *   leer) y se lee. La 1.ª lectura sale dentro del `pointerdown` (gesto real,
 *   requisito de iOS/Safari para desbloquear la voz); las siguientes van con un
 *   pequeño retardo al posarse en un bloque nuevo.
 * - Voz de la MEJOR calidad disponible en `es` (Google/natural/neural/premium/
 *   online; se prefiere Latinoamérica) y ritmo más pausado (rate 0.95) para que
 *   suene fluido, no robótico. Texto troceado por frases para no cortarse.
 * - Barra flotante Pausar/Reanudar/Detener. Ignora la propia UI de accesibilidad.
 * - Si el navegador no soporta TTS, la barra lo avisa.
 */

const RATE = 0.95
const PITCH = 1
const CHUNK = 220 // chars por utterance (frases agrupadas)
const DWELL = 160 // ms que el dedo se posa en un bloque antes de leerlo

function chunk(text: string): string[] {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (!clean) return []
  const parts = clean.match(/[^.!?…\n]+[.!?…]*\s*/g) ?? [clean]
  const out: string[] = []
  let buf = ''
  for (const p of parts) {
    if ((buf + p).length > CHUNK && buf) {
      out.push(buf.trim())
      buf = p
    } else {
      buf += p
    }
  }
  if (buf.trim()) out.push(buf.trim())
  return out
}

// Puntúa las voces para quedarnos con la más natural en español.
function scoreVoice(v: SpeechSynthesisVoice): number {
  const n = v.name.toLowerCase()
  const l = v.lang.toLowerCase()
  if (!/^es/.test(l)) return -1
  let s = 10
  if (/es[-_]?(419|mx|us|co|ar|cl|pe)/.test(l)) s += 3 // Latinoamérica (Ecuador)
  if (/google/.test(n)) s += 6
  if (/natural|neural|premium|enhanced|online/.test(n)) s += 6
  if (/(mónica|monica|paulina|jorge|juan|marisol|helena|laura|elvira|diego)/.test(n)) s += 2
  if (v.localService === false) s += 2 // las de red suelen sonar mejor
  return s
}

export default function SpeechReader() {
  const { settings } = useAccessibility()
  const enabled = settings.speech
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const coarse =
    typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches

  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const lastSpokenRef = useRef('')
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])
  const highlightRef = useRef<HTMLElement | null>(null)
  const dwellRef = useRef<number | null>(null)

  // Carga (asíncrona) de voces del sistema.
  useEffect(() => {
    if (!supported) return
    const load = () => {
      voicesRef.current = window.speechSynthesis.getVoices()
    }
    load()
    window.speechSynthesis.addEventListener?.('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', load)
  }, [supported])

  const bestVoice = useCallback((): SpeechSynthesisVoice | null => {
    const voices = voicesRef.current.length
      ? voicesRef.current
      : window.speechSynthesis?.getVoices?.() ?? []
    let best: SpeechSynthesisVoice | null = null
    let bestScore = 0
    for (const v of voices) {
      const s = scoreVoice(v)
      if (s > bestScore) {
        bestScore = s
        best = v
      }
    }
    return best
  }, [])

  const clearHighlight = useCallback(() => {
    if (highlightRef.current) {
      highlightRef.current.classList.remove('a11y-tts-reading')
      highlightRef.current = null
    }
  }, [])

  const setHighlight = useCallback((el: HTMLElement | null) => {
    if (highlightRef.current === el) return
    if (highlightRef.current) highlightRef.current.classList.remove('a11y-tts-reading')
    highlightRef.current = el
    if (el) el.classList.add('a11y-tts-reading')
  }, [])

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel()
    setSpeaking(false)
    setPaused(false)
    clearHighlight()
  }, [supported, clearHighlight])

  const speak = useCallback(
    (text: string) => {
      if (!supported) return
      const chunks = chunk(text)
      if (!chunks.length) return
      window.speechSynthesis.cancel()
      lastSpokenRef.current = text
      const voice = bestVoice()
      setSpeaking(true)
      setPaused(false)
      chunks.forEach((c, i) => {
        const u = new SpeechSynthesisUtterance(c)
        u.lang = voice?.lang ?? 'es-ES'
        if (voice) u.voice = voice
        u.rate = RATE
        u.pitch = PITCH
        if (i === chunks.length - 1) {
          u.onend = () => {
            setSpeaking(false)
            setPaused(false)
            clearHighlight()
          }
        }
        u.onerror = () => {
          setSpeaking(false)
          setPaused(false)
        }
        window.speechSynthesis.speak(u)
      })
    },
    [supported, bestVoice, clearHighlight],
  )

  // Devuelve el bloque de texto legible bajo un punto de la pantalla.
  const blockAt = useCallback((x: number, y: number): HTMLElement | null => {
    const hit = document.elementFromPoint(x, y) as HTMLElement | null
    if (!hit || hit.closest('[data-a11y-ui]')) return null
    const block = hit.closest<HTMLElement>(
      'p,h1,h2,h3,h4,h5,h6,li,a,button,summary,blockquote,figcaption,dd,dt,td,th,label,span',
    )
    const el = block ?? (hit.innerText ? hit : null)
    if (!el) return null
    const text = el.innerText?.trim() ?? ''
    return text.length >= 2 ? el : null
  }, [])

  // ── Escritorio: leer la selección (mouse/lápiz, NO táctil) ──────────────────
  useEffect(() => {
    if (!enabled || !supported) return
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return // en táctil manda "explorar con el dedo"
      window.setTimeout(() => {
        const sel = window.getSelection()
        if (!sel || sel.isCollapsed) return
        const text = sel.toString().trim()
        if (text.length < 2) return
        const anchor = sel.anchorNode
        const anchorEl = anchor instanceof Element ? anchor : anchor?.parentElement
        if (anchorEl?.closest('[data-a11y-ui]')) return
        if (text === lastSpokenRef.current && speaking) return
        speak(text)
      }, 10)
    }
    document.addEventListener('pointerup', onPointerUp)
    return () => document.removeEventListener('pointerup', onPointerUp)
  }, [enabled, supported, speak, speaking])

  // ── Móvil: explorar con el dedo (resalta + lee el bloque bajo el dedo) ───────
  useEffect(() => {
    if (!enabled || !supported) return

    const readBlock = (el: HTMLElement) => {
      const text = el.innerText.trim()
      if (text.length < 2 || (text === lastSpokenRef.current && speaking)) return
      speak(text)
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return
      const el = blockAt(e.clientX, e.clientY)
      if (!el) return
      setHighlight(el)
      readBlock(el) // dentro del gesto → desbloquea la voz en iOS
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return
      const el = blockAt(e.clientX, e.clientY)
      if (!el) return
      setHighlight(el) // feedback visual inmediato
      if (dwellRef.current != null) window.clearTimeout(dwellRef.current)
      dwellRef.current = window.setTimeout(() => readBlock(el), DWELL)
    }
    const onEnd = () => {
      if (dwellRef.current != null) window.clearTimeout(dwellRef.current)
    }

    document.addEventListener('pointerdown', onDown, { passive: true })
    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerup', onEnd, { passive: true })
    document.addEventListener('pointercancel', onEnd, { passive: true })
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onEnd)
      document.removeEventListener('pointercancel', onEnd)
      if (dwellRef.current != null) window.clearTimeout(dwellRef.current)
    }
  }, [enabled, supported, speak, speaking, blockAt, setHighlight])

  // Al apagar el modo (o desmontar), corta la lectura y limpia el resalte.
  useEffect(() => {
    if (!enabled) stop()
    return () => stop()
  }, [enabled, stop])

  if (!enabled) return null

  const togglePlay = () => {
    if (!supported) return
    if (speaking && !paused) {
      window.speechSynthesis.pause()
      setPaused(true)
    } else if (paused) {
      window.speechSynthesis.resume()
      setPaused(false)
    } else {
      const text = window.getSelection()?.toString().trim() ?? ''
      if (text.length >= 2) speak(text)
    }
  }

  const btn =
    'flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-connexo'
  const idleHint = coarse
    ? 'Desliza el dedo sobre el texto para escucharlo'
    : 'Selecciona un texto para escucharlo'

  return (
    <div
      data-a11y-ui
      role="region"
      aria-label="Lector de voz"
      className="glass fixed bottom-4 left-1/2 z-[55] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-abyss-900/90 px-3 py-2 shadow-card"
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      <SpeakerIcon
        className={`h-5 w-5 shrink-0 ${speaking && !paused ? 'text-connexo' : 'text-white/60'}`}
      />
      {!supported ? (
        <span className="px-1 text-sm text-white/70">Tu navegador no soporta lectura por voz.</span>
      ) : speaking ? (
        <>
          <span className="hidden px-1 text-sm text-white/80 sm:inline">
            {paused ? 'En pausa' : 'Leyendo…'}
          </span>
          <button
            onClick={togglePlay}
            className={`${btn} ${paused ? 'bg-connexo text-black hover:bg-connexo-400' : 'bg-white/10 text-white hover:bg-white/20'}`}
            aria-label={paused ? 'Reanudar lectura' : 'Pausar lectura'}
          >
            {paused ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
            <span className="hidden sm:inline">{paused ? 'Reanudar' : 'Pausar'}</span>
          </button>
          <button
            onClick={stop}
            className={`${btn} bg-white/10 text-white hover:bg-white/20`}
            aria-label="Detener lectura"
          >
            <StopIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Detener</span>
          </button>
        </>
      ) : (
        <span className="px-1 text-sm text-white/70">{idleHint}</span>
      )}
    </div>
  )
}
