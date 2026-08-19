import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useAccessibility, type A11ySettings } from '../context/AccessibilityContext'
import { AccessibilityIcon, CloseIcon } from './icons'

type RangeOption = {
  label: string
  key: 'fontSize' | 'lineSpacing'
  type: 'range'
  min: number
  max: number
  step: number
  desc: string
}
type ToggleOption = {
  label: string
  key: Exclude<keyof A11ySettings, 'fontSize' | 'lineSpacing'>
  type: 'toggle'
  desc: string
}
type Option = RangeOption | ToggleOption

const OPTIONS: Option[] = [
  { label: 'Tamaño de texto', key: 'fontSize', type: 'range', min: 1, max: 1.5, step: 0.25, desc: 'Aumenta el tamaño de la fuente para mejor legibilidad.' },
  { label: 'Espaciado de línea', key: 'lineSpacing', type: 'range', min: 1, max: 2, step: 0.5, desc: 'Aumenta el espacio entre líneas de texto.' },
  { label: 'Alto contraste', key: 'highContrast', type: 'toggle', desc: 'Negro y blanco puro, máximo contraste.' },
  { label: 'Blanco y negro', key: 'grayscale', type: 'toggle', desc: 'Elimina el color para evitar distracciones.' },
  { label: 'Resaltar enlaces', key: 'highlightInteractions', type: 'toggle', desc: 'Bordes y subrayado en todo lo que se puede tocar.' },
  { label: 'Desactivar animaciones', key: 'reducedMotion', type: 'toggle', desc: 'Elimina el movimiento de la página.' },
  { label: 'Modo Visual Total', key: 'visualAccessibilityMode', type: 'toggle', desc: 'Máximo contraste y simplificación: fondo negro, texto amarillo.' },
]

/**
 * Panel lateral de accesibilidad — diálogo modal accesible: role="dialog",
 * aria-modal, trampa de foco (Tab/Shift+Tab circulan dentro), cierre con ESC,
 * auto-foco al abrir y backdrop clicable. Portado del sistema de Arupo y
 * reestilado a la piel de Connexo (glass + naranja).
 */
export default function AccessibilityPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { settings, updateSetting, resetSettings } = useAccessibility()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          last.focus()
          e.preventDefault()
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus()
          e.preventDefault()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    // Auto-foco al primer control tras el montaje del panel.
    const t = window.setTimeout(() => panelRef.current?.querySelector('button')?.focus(), 100)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      window.clearTimeout(t)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="glass fixed right-0 top-0 z-[70] flex h-[100dvh] w-full max-w-sm flex-col border-l border-white/10 bg-abyss-900/95 p-6 shadow-card"
            role="dialog"
            aria-labelledby="a11y-title"
            aria-modal="true"
          >
            <div className="mb-8 flex items-center justify-between">
              <h2 id="a11y-title" className="flex items-center gap-2 font-heading text-xl text-white">
                <AccessibilityIcon className="a11y-icon h-6 w-6 text-connexo" />
                Accesibilidad
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-connexo"
                aria-label="Cerrar panel de accesibilidad"
              >
                <CloseIcon className="a11y-icon h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto pr-1">
              {OPTIONS.map((opt) => (
                <div key={opt.key} className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <label htmlFor={opt.key} className="flex flex-col font-semibold text-white">
                      {opt.label}
                      <span className="mt-1 text-xs font-normal text-white/50">{opt.desc}</span>
                    </label>

                    {opt.type === 'toggle' && (
                      <button
                        id={opt.key}
                        onClick={() => updateSetting(opt.key, !settings[opt.key])}
                        aria-pressed={settings[opt.key]}
                        aria-label={opt.label}
                        className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-connexo focus-visible:ring-offset-2 focus-visible:ring-offset-abyss-900 ${
                          settings[opt.key] ? 'bg-connexo' : 'bg-abyss-500'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings[opt.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {opt.type === 'range' && (
                    <div className="flex items-center gap-4">
                      <input
                        id={opt.key}
                        type="range"
                        min={opt.min}
                        max={opt.max}
                        step={opt.step}
                        value={settings[opt.key]}
                        onChange={(e) => updateSetting(opt.key, parseFloat(e.target.value))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-abyss-500 accent-connexo"
                      />
                      <span className="min-w-[3ch] font-mono text-sm text-connexo-300">
                        {settings[opt.key]}x
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-white/10 pt-6">
              <button
                onClick={resetSettings}
                className="w-full rounded-xl border border-white/15 py-3 font-semibold text-white/70 transition-colors hover:border-connexo/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-connexo"
              >
                Restablecer valores predeterminados
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
