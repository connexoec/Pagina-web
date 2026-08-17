import { site, wa, waMsg } from '../config/site'
import { WhatsappIcon } from './icons'

const legal = [
  { label: 'Términos', href: '#terminos' },
  { label: 'Privacidad', href: '#privacidad' },
  { label: 'Cookies', href: '#cookies' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-abyss-950 py-12">
      <div className="section-pad">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          {/* Brand */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <a href="#top" aria-label="Connexo — inicio" className="flex items-center">
              <img
                src="/connexo-lockup.png"
                alt="Connexo"
                width={2153}
                height={301}
                loading="lazy"
                decoding="async"
                className="h-7 w-auto"
              />
            </a>
            <p className="max-w-xs text-center text-sm text-white/45 md:text-left">
              Perfiles digitales NFC hechos en Ecuador. Un toque abre tu negocio
              entero: catálogo, agenda, clientes y pedidos.
            </p>
            <a
              href={site.arupo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-xs text-white/40 transition-colors hover:text-connexo md:text-left"
            >
              El 10% de cada plan es de la Fundación Arupo →
            </a>
          </div>

          {/* Links + contacto */}
          <div className="flex flex-col items-center gap-5 md:items-end">
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {legal.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm text-white/55 transition-colors hover:text-connexo"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="flex flex-col items-center gap-2 md:items-end">
              <a
                href={wa(waMsg.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-connexo hover:underline"
              >
                <WhatsappIcon className="h-4 w-4" />
                {site.phoneDisplay}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="text-sm text-white/55 transition-colors hover:text-connexo"
              >
                {site.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/[0.05] pt-6 text-center text-xs text-white/35">
          © {new Date().getFullYear()} Connexo · Ecuador. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  )
}
