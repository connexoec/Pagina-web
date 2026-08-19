import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/**
 * Motor de accesibilidad — portado del sistema de la Fundación Arupo y adaptado
 * a Connexo (TS strict · Tailwind v3 · marca negro + naranja, sin tema claro).
 *
 * Principio: el estado NO aplica estilos inline salvo `fontSize` / `lineSpacing`.
 * Todo lo demás es CSS puro (clases `a11y-*` en `index.css`) activado por una
 * clase en el `<html>`. Copiar el CSS + este contexto basta para portarlo.
 */
export interface A11ySettings {
  fontSize: number // 1 | 1.25 | 1.5 → multiplicador de fuente
  lineSpacing: number // 1 | 1.5 | 2 → interlineado
  highContrast: boolean // Alto contraste (negro/blanco puro)
  grayscale: boolean // Escala de grises total
  highlightInteractions: boolean // Resalta enlaces y botones
  reducedMotion: boolean // Desactiva animaciones
  visualAccessibilityMode: boolean // MODO VISUAL TOTAL (negro / amarillo)
}

const STORAGE_KEY = 'accessibility-settings'

const DEFAULTS: A11ySettings = {
  fontSize: 1,
  lineSpacing: 1,
  highContrast: false,
  grayscale: false,
  highlightInteractions: false,
  reducedMotion: false,
  visualAccessibilityMode: false,
}

interface A11yContextValue {
  settings: A11ySettings
  updateSetting: <K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) => void
  resetSettings: () => void
}

const AccessibilityContext = createContext<A11yContextValue | null>(null)

// Guarda `typeof window` para portabilidad (SSR): lee localStorage solo si existe.
function readInitial(): A11ySettings {
  if (typeof window === 'undefined') return DEFAULTS
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    // Merge con DEFAULTS: si el JSON guardado es de una versión previa a la que
    // le falte una clave, no queda `undefined`.
    return saved ? { ...DEFAULTS, ...(JSON.parse(saved) as Partial<A11ySettings>) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<A11ySettings>(readInitial)

  useEffect(() => {
    const root = window.document.documentElement

    // Modo Visual Total: sus propios overrides de tipografía mandan sobre
    // fontSize / lineSpacing del usuario (nota de precedencia del documento).
    root.classList.toggle('a11y-visual-total', settings.visualAccessibilityMode)

    if (settings.visualAccessibilityMode) {
      root.style.fontSize = '24px'
      root.style.lineHeight = '1.5'
    } else {
      root.style.fontSize = settings.fontSize === 1 ? '' : `${settings.fontSize * 16}px`
      root.style.lineHeight = settings.lineSpacing === 1 ? '' : String(settings.lineSpacing)
    }

    root.classList.toggle('a11y-high-contrast', settings.highContrast)
    root.classList.toggle('a11y-grayscale', settings.grayscale)
    root.classList.toggle('a11y-highlight', settings.highlightInteractions)
    root.classList.toggle('a11y-reduced-motion', settings.reducedMotion)

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      /* localStorage lleno o bloqueado — no es fatal para la sesión actual. */
    }
  }, [settings])

  const updateSetting = useCallback(
    <K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const resetSettings = useCallback(() => setSettings(DEFAULTS), [])

  const value = useMemo<A11yContextValue>(
    () => ({ settings, updateSetting, resetSettings }),
    [settings, updateSetting, resetSettings],
  )

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
}

export function useAccessibility(): A11yContextValue {
  const ctx = useContext(AccessibilityContext)
  if (!ctx) throw new Error('useAccessibility debe usarse dentro de <AccessibilityProvider>')
  return ctx
}
