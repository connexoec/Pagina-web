import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '../router'
import { useAccessibility } from '../context/AccessibilityContext'
import AccessibilityPanel from './AccessibilityPanel'
import { AccessibilityIcon, EyeIcon } from './icons'

// Rutas absolutas a propósito: el navbar también se monta en /red, donde un
// `#planes` suelto apuntaría a una sección que ahí no existe.
const links = [
  { label: 'Ecosistemas', href: '/#ecosistemas' },
  { label: 'Cómo opera', href: '/#opera' },
  { label: 'Planes', href: '/#planes' },
  { label: 'Causa', href: '/#arupo' },
  { label: 'RED CONNEXO', href: '/red', badge: 'Directorio' },
  { label: 'Trabaja con nosotros', href: '/trabaja', badge: 'Únete' },
]

/**
 * Logo oficial (isotipo + palabra) con glitch permanente: cada ciclo de 12 s la
 * palabra se desarma y se lee unos segundos en alfabeto yautja, con unos
 * cuantos frames sucios de por medio, y vuelve sola. No hay clic ni estado: son
 * dos capas superpuestas con animaciones CSS complementarias
 * (`glitch-word` / `glitch-yautja`, definidas en `tailwind.config.js`).
 *
 * Reglas que respeta:
 * - **CSS puro, como el `Marquee`.** Está fijo en pantalla todo el rato: una
 *   animación de `opacity`/`transform` la resuelve el compositor y no cuesta
 *   un solo frame de main thread. Con JS (temporizadores o Framer) serían
 *   renders de React cada pocos milisegundos, para siempre.
 * - El lockup nunca sale del flujo: es el que reserva el espacio, así que el
 *   glitch no mueve un pixel de la barra (cero CLS).
 * - Los glifos van absolutos y centrados por flexbox, no por `translate`: el
 *   `transform` de la animación pisaría cualquier `-translate-x-1/2`.
 * - Solo se anima `opacity` y `transform` (§6 del CLAUDE.md). El tirón lateral
 *   va solo en los glifos: el lockup de marca nunca se deforma.
 * - Con `prefers-reduced-motion` la regla global de `index.css` colapsa la
 *   duración, y como el keyframe 100% es "Connexo visible / yautja oculto",
 *   queda el logo quieto y limpio. No hace falta nada más.
 */
function Brand({ className = 'h-7' }: { className?: string }) {
  return (
    <Link href="/" aria-label="Connexo — inicio" className="relative flex items-center">
      <img
        src="/connexo-lockup.png"
        alt="Connexo"
        width={2153}
        height={301}
        decoding="async"
        className={`${className} w-auto animate-glitch-word`}
      />

      {/* Glifos yautja — misma anchura óptica que el lockup (150% de alto) */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <img
          src="/connexo-yautja.png"
          alt=""
          aria-hidden="true"
          width={640}
          height={142}
          decoding="async"
          className="h-[150%] w-auto max-w-none animate-glitch-yautja opacity-0"
        />
      </span>
    </Link>
  )
}

/**
 * Botones de accesibilidad — siempre visibles (móvil y escritorio), porque el
 * acceso a la accesibilidad no puede depender de abrir el menú. El de "Modo
 * Visual Total" es un atajo directo; el otro abre el panel de 7 controles.
 * El motor vive en `context/AccessibilityContext`, agnóstico del componente.
 */
function A11yButtons({ onOpenPanel }: { onOpenPanel: () => void }) {
  const { settings, updateSetting } = useAccessibility()
  const totalOn = settings.visualAccessibilityMode

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={() => updateSetting('visualAccessibilityMode', !totalOn)}
        aria-pressed={totalOn}
        aria-label={totalOn ? 'Desactivar modo visual total' : 'Activar modo visual total'}
        title="Modo Accesibilidad Visual Total"
        className={`rounded-full p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-connexo ${
          totalOn ? 'bg-connexo text-black' : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        <EyeIcon className="a11y-icon h-[22px] w-[22px]" />
      </button>
      <button
        onClick={onOpenPanel}
        aria-label="Abrir panel de accesibilidad"
        aria-haspopup="dialog"
        title="Opciones de accesibilidad"
        className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-connexo"
      >
        <AccessibilityIcon className="a11y-icon h-[22px] w-[22px]" />
      </button>
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [isA11yOpen, setIsA11yOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
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

        {/* Cluster derecho: links (desktop) + accesibilidad (siempre) + menú (móvil) */}
        <div className="flex items-center gap-4 lg:gap-6">
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

        {/* Accesibilidad — visible en móvil y escritorio */}
        <A11yButtons onOpenPanel={() => setIsA11yOpen(true)} />

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
        </div>
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
        </ul>
      </motion.div>
    </motion.header>

    <AccessibilityPanel isOpen={isA11yOpen} onClose={() => setIsA11yOpen(false)} />
    </>
  )
}
