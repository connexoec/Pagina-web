import { useCallback, useEffect, useRef, useState } from 'react'
import { useAccessibility } from '../context/AccessibilityContext'
import { PauseIcon, PlayIcon, SpeakerIcon, StopIcon } from './icons'

/**
 * Lector de voz (Text-to-Speech) — Web Speech API nativa (`speechSynthesis`),
 * sin librerías. Control del panel (§13).
 *
 * UX (a criterio, 2026-09-21):
 * - Al SELECCIONAR texto se lee solo. El disparo va en `pointerup`/`keyup` (un
 *   gesto real), requisito de iOS/Safari para permitir hablar.
 * - Barra flotante con Pausar/Reanudar/Detener — imprescindible en teléfono y
 *   señal visible de que el modo está activo.
 * - Voz en español si el dispositivo la tiene; texto troceado por frases para
 *   esquivar el bug de Chrome que corta lecturas largas (>~15 s).
 * - Ignora selecciones dentro del panel de accesibilidad o de la propia barra.
 * - Si el navegador no soporta `speechSynthesis`, la barra lo avisa.
 */

// Trocea en frases y agrupa hasta ~180 chars: utterances cortas = no se cortan.
function chunk(text: string): string[] {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (!clean) return []
  const parts = clean.match(/[^.!?…\n]+[.!?…]*\s*/g) ?? [clean]
  const out: string[] = []
  let buf = ''
  for (const p of parts) {
    if ((buf + p).length > 180 && buf) {
      out.push(buf.trim())
      buf = p
    } else {
      buf += p
    }
  }
  if (buf.trim()) out.push(buf.trim())
  return out
}

function pickSpanishVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis?.getVoices?.() ?? []
  if (!voices.length) return null
  return (
    voices.find((v) => /^es[-_]?(419|mx|us|es)/i.test(v.lang)) ??
    voices.find((v) => /^es/i.test(v.lang)) ??
    null
  )
}

export default function SpeechReader() {
  const { settings } = useAccessibility()
  const enabled = settings.speech
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const lastSpokenRef = useRef('')

  const stop = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
    setPaused(false)
  }, [supported])

  const speak = useCallback(
    (text: string) => {
      if (!supported) return
      const chunks = chunk(text)
      if (!chunks.length) return
      window.speechSynthesis.cancel()
      lastSpokenRef.current = text
      const voice = pickSpanishVoice()
      setSpeaking(true)
      setPaused(false)
      chunks.forEach((c, i) => {
        const u = new SpeechSynthesisUtterance(c)
        u.lang = voice?.lang ?? 'es-ES'
        if (voice) u.voice = voice
        u.rate = 1
        u.pitch = 1
        if (i === chunks.length - 1) {
          u.onend = () => {
            setSpeaking(false)
            setPaused(false)
          }
        }
        u.onerror = () => {
          setSpeaking(false)
          setPaused(false)
        }
        window.speechSynthesis.speak(u)
      })
    },
    [supported],
  )

  // Leer la selección al soltar el puntero / tras selección con teclado.
  useEffect(() => {
    if (!enabled || !supported) return

    const insideUi = (node: Node | null): boolean => {
      let el = node instanceof Element ? node : node?.parentElement ?? null
      while (el) {
        if (el.closest('[data-a11y-ui]')) return true
        el = el.parentElement
      }
      return false
    }

    const handle = () => {
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed) return
      const text = sel.toString().trim()
      if (text.length < 2) return
      if (insideUi(sel.anchorNode)) return // no leer los propios controles
      if (text === lastSpokenRef.current && speaking) return
      speak(text)
    }
    // Pequeño respiro para que la selección se asiente (sobre todo en táctil).
    const onPointerUp = () => window.setTimeout(handle, 10)
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.shiftKey || e.key === 'ArrowLeft' || e.key === 'ArrowRight') window.setTimeout(handle, 10)
    }

    document.addEventListener('pointerup', onPointerUp)
    document.addEventListener('keyup', onKeyUp)
    return () => {
      document.removeEventListener('pointerup', onPointerUp)
      document.removeEventListener('keyup', onKeyUp)
    }
  }, [enabled, supported, speak, speaking])

  // Al apagar el modo (o desmontar), corta cualquier lectura en curso.
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
      // Sin lectura en curso: si hay texto seleccionado, léelo.
      const text = window.getSelection()?.toString().trim() ?? ''
      if (text.length >= 2) speak(text)
    }
  }

  const btn =
    'flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-connexo'

  return (
    <div
      data-a11y-ui
      role="region"
      aria-label="Lector de voz"
      className="glass fixed bottom-4 left-1/2 z-[55] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-abyss-900/90 px-3 py-2 shadow-card"
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      <SpeakerIcon className={`h-5 w-5 shrink-0 ${speaking && !paused ? 'text-connexo' : 'text-white/60'}`} />
      {!supported ? (
        <span className="px-1 text-sm text-white/70">Tu navegador no soporta lectura por voz.</span>
      ) : speaking ? (
        <>
          <span className="hidden px-1 text-sm text-white/80 sm:inline">
            {paused ? 'En pausa' : 'Leyendo…'}
          </span>
          <button onClick={togglePlay} className={`${btn} text-black ${paused ? 'bg-connexo hover:bg-connexo-400' : 'bg-white/10 text-white hover:bg-white/20'}`} aria-label={paused ? 'Reanudar lectura' : 'Pausar lectura'}>
            {paused ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
            <span className="hidden sm:inline">{paused ? 'Reanudar' : 'Pausar'}</span>
          </button>
          <button onClick={stop} className={`${btn} bg-white/10 text-white hover:bg-white/20`} aria-label="Detener lectura">
            <StopIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Detener</span>
          </button>
        </>
      ) : (
        <span className="px-1 text-sm text-white/70">Selecciona un texto para escucharlo</span>
      )}
    </div>
  )
}
