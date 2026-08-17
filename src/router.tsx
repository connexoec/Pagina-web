import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'

// ─────────────────────────────────────────────────────────────
//  ENRUTADOR MÍNIMO  ·  sin dependencias.
//
//  El sitio tiene dos páginas ("/" y "/red"). Meter react-router por eso serían
//  ~20 kB para resolver un `switch`. Esto usa la History API y pesa nada.
//  Si algún día hay muchas rutas con parámetros, ahí sí toca cambiarlo.
//
//  ⚠️ Requiere que el hosting reescriba todo a /index.html. Ya está: ver la
//  regla `rewrites` en `vercel.json`.
// ─────────────────────────────────────────────────────────────

interface RouterValue {
  path: string
  navigate: (to: string) => void
}

const RouterContext = createContext<RouterValue>({
  path: '/',
  navigate: () => {},
})

/**
 * Lleva la vista a un ancla. Reintenta unos frames porque las secciones bajo el
 * pliegue son `React.lazy`: al llegar desde otra página el elemento todavía no
 * existe en el DOM cuando se procesa el clic.
 */
function scrollToHash(hash: string, smooth: boolean, tries = 24) {
  const el = document.querySelector(hash)
  if (el) {
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
    return
  }
  if (tries > 0) requestAnimationFrame(() => scrollToHash(hash, smooth, tries - 1))
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname)

  // Botones atrás/adelante del navegador.
  useEffect(() => {
    const onPop = () => {
      setPath(window.location.pathname)
      if (window.location.hash) scrollToHash(window.location.hash, false)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Entrada directa a /ruta#ancla (enlace compartido, recarga).
  useEffect(() => {
    if (window.location.hash) scrollToHash(window.location.hash, false)
  }, [])

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.origin)
    const samePage = url.pathname === window.location.pathname

    if (!samePage) {
      window.history.pushState({}, '', url.pathname + url.hash)
      setPath(url.pathname)
    } else if (url.hash) {
      window.history.replaceState({}, '', url.pathname + url.hash)
    }

    if (url.hash) scrollToHash(url.hash, samePage)
    else if (!samePage) window.scrollTo(0, 0)
  }, [])

  const value = useMemo(() => ({ path, navigate }), [path, navigate])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter() {
  return useContext(RouterContext)
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

/**
 * Enlace interno. Los externos (http…, mailto:, tel:) y los clics con
 * modificador o rueda se dejan pasar al navegador tal cual: abrir en pestaña
 * nueva con Ctrl/⌘ tiene que seguir funcionando.
 */
export function Link({ href, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (!href.startsWith('/')) return
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(href)
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
