import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { site } from '../config/site'
import { Link } from '../router'

// Rutas absolutas a propósito: el navbar también se monta en /red, donde un
// `#planes` suelto apuntaría a una sección que ahí no existe.
const links = [
  { label: 'Ecosistemas', href: '/#ecosistemas' },
  { label: 'Cómo opera', href: '/#opera' },
  { label: 'Planes', href: '/#planes' },
  { label: 'Causa', href: '/#arupo' },
  { label: 'RED CONNEXO', href: '/red', badge: 'Directorio' },
]

/** Cuánto se queda la palabra escrita en yautja antes de volver a leerse. */
const YAUTJA_MS = 2600

/**
 * Logo oficial (isotipo + palabra) con un huevo de pascua: al hacer clic, las
 * letras se decodifican al alfabeto yautja unos segundos y vuelven solas.
 *
 * Reglas que respeta:
 * - El lockup nunca sale del flujo: es el que reserva el espacio, así que el
 *   cambio no mueve un pixel de la barra (cero CLS).
 * - Los glifos van absolutos y centrados por flexbox, no por `translate`: si el
 *   centrado viniera de una clase Tailwind, el `transform` en línea de Framer
 *   la pisaría y el logo se iría de sitio.
 * - Solo se animan `opacity` y `transform` (§6 del CLAUDE.md).
 */
function Brand({ className = 'h-7' }: { className?: string }) {
  const [yautja, setYautja] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const reduce = useReducedMotion()

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Vuelve a arrancar el reloj si insisten con el clic.
  const decode = useCallback(() => {
    setYautja(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setYautja(false), YAUTJA_MS)
  }, [])

  return (
    <Link
      href="/"
      aria-label="Connexo — inicio"
      onClick={decode}
      className="relative flex items-center"
    >
      <motion.img
        src="/connexo-lockup.png"
        alt="Connexo"
        width={2153}
        height={301}
        decoding="async"
        className={`${className} w-auto`}
        animate={{ opacity: yautja ? 0 : 1, scale: yautja ? 0.97 : 1 }}
        transition={{ duration: reduce ? 0.15 : 0.26, ease: 'easeOut' }}
      />

      {/* Glifos yautja — misma anchura óptica que el lockup (150% de alto) */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <AnimatePresence>
          {yautja && (
            <motion.img
              key="yautja"
              src="/connexo-yautja.png"
              alt=""
              aria-hidden="true"
              width={640}
              height={142}
              decoding="async"
              className="h-[150%] w-auto max-w-none"
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, scaleX: 1.14, scaleY: 0.82 }
              }
              animate={
                reduce
                  ? { opacity: 1 }
                  : { opacity: [0, 1, 0.3, 1], scaleX: 1, scaleY: 1 }
              }
              exit={{
                opacity: 0,
                scaleX: 0.94,
                transition: { duration: 0.22, ease: 'easeIn' },
              }}
              transition={
                reduce
                  ? { duration: 0.15 }
                  : {
                      duration: 0.45,
                      times: [0, 0.35, 0.55, 1],
                      ease: [0.22, 1, 0.36, 1],
                    }
              }
            />
          )}
        </AnimatePresence>
      </span>

      {/* Barrido de señal: cruza el logo una vez, solo con `transform` */}
      {yautja && !reduce && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-4 w-5 bg-gradient-to-r from-transparent via-connexo/70 to-transparent"
          initial={{ x: 0, opacity: 0.9 }}
          animate={{ x: '1000%', opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      )}
    </Link>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass' : 'bg-transparent'
      }`}
    >
      <nav className="section-pad flex h-16 items-center justify-between">
        <Brand className="h-6 sm:h-7" />

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group relative inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {l.label}
                {l.badge && (
                  <span className="rounded-full border border-connexo/40 bg-connexo/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-connexo">
                    {l.badge}
                  </span>
                )}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-connexo transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Right CTA — el panel real del cliente, no un signup que no existe */}
        <div className="hidden lg:block">
          <a
            href={site.app}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-sm"
          >
            INICIAR SESIÓN
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menú"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white lg:hidden"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-px w-5 bg-current transition-transform ${
                open ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-px w-5 bg-current transition-opacity ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-px w-5 bg-current transition-transform ${
                open ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu — nunca más ancho que la pantalla, y si algún día crece
          de más, hace scroll dentro de sí mismo en vez de salirse. */}
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="glass w-full max-w-full overflow-hidden lg:hidden"
      >
        <ul className="section-pad flex max-h-[calc(100vh-4rem)] flex-col gap-1 overflow-y-auto py-4">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 py-2 text-white/80"
              >
                {l.label}
                {l.badge && (
                  <span className="rounded-full border border-connexo/40 bg-connexo/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-connexo">
                    {l.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <a
              href={site.app}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="btn-outline w-full text-sm"
            >
              INICIAR SESIÓN
            </a>
          </li>
        </ul>
      </motion.div>
    </motion.header>
  )
}
