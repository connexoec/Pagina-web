import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { site } from '../config/site'

const links = [
  { label: 'Ecosistemas', href: '#ecosistemas' },
  { label: 'Cómo opera', href: '#opera' },
  { label: 'Planes', href: '#planes' },
  { label: 'Causa', href: '#arupo' },
  { label: 'RED CONNEXO', href: '#red', badge: 'Directorio' },
]

/** Lockup oficial: isotipo + palabra, PNG con fondo transparente. */
function Brand({ className = 'h-7' }: { className?: string }) {
  return (
    <img
      src="/connexo-lockup.png"
      alt="Connexo"
      width={2153}
      height={301}
      decoding="async"
      className={`${className} w-auto`}
    />
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
        <a href="#top" aria-label="Connexo — inicio" className="flex items-center">
          <Brand className="h-6 sm:h-7" />
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
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
              </a>
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
              <a
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
              </a>
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
