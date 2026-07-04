import { ConnexoMark } from './icons'

const legal = [
  { label: 'Términos', href: '#terminos' },
  { label: 'Privacidad', href: '#privacidad' },
  { label: 'Cookies', href: '#cookies' },
]

const SUPPORT_EMAIL = 'connexoec@gmail.com'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-abyss-950 py-12">
      <div className="section-pad">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          {/* Brand */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <a href="#top" className="flex items-center gap-2.5">
              <ConnexoMark className="h-7 w-7" />
              <span className="font-heading text-lg tracking-tight text-white">
                CONNEXO
              </span>
            </a>
            <p className="max-w-xs text-center text-sm text-white/45 md:text-left">
              Identidad digital NFC e IA. Convierte cada interacción en una venta.
            </p>
          </div>

          {/* Links + contact */}
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
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-sm font-medium text-connexo hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
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
