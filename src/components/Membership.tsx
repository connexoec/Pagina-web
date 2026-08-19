import { motion } from 'framer-motion'
import { CardIcon, StampIcon, UsersIcon, CheckIcon } from './icons'
import { TiltCard } from './fx/Motion'

// Fuente: manual cap. 18. Cada plantilla tiene su propio formato de código.
const CODES = [
  { code: 'B-4821', club: 'Club Barber', rubro: 'Barbería' },
  { code: 'E-1093', club: 'Club de la tienda', rubro: 'E-Commerce' },
  { code: 'R-0457', club: 'Club de Inversionistas', rubro: 'Inmobiliaria' },
  { code: 'S-2210', club: 'Club Mayorista', rubro: 'Sublimados' },
  { code: 'F-7734', club: 'Fan Base', rubro: 'Artista' },
]

const PERKS = [
  'Se autocompletan sus datos: no vuelve a escribir nada.',
  'Su descuento se aplica solo, sin que nadie lo calcule.',
  'Ve su carnet, sus beneficios y su historial desde tu perfil.',
  'Y si se registra dos veces, no se duplica: conserva su código.',
]

export default function Membership() {
  return (
    <section id="club" className="relative overflow-hidden bg-abyss-950 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-70" />

      <div className="section-pad relative">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <h2 className="font-heading text-3xl leading-tight text-white sm:text-4xl">
              Un código corto es todo lo que separa a un cliente de un cliente que
              regresa.
            </h2>
            <p className="mt-5 text-white/60">
              Tu cliente se une al club desde tu perfil y recibe un código en
              pantalla. Ese código es la herramienta de recompra más efectiva que
              tiene la plataforma, y funciona sin que tú hagas nada.
            </p>

            <ul className="mt-8 space-y-3">
              {PERKS.map((p, i) => (
                <motion.li
                  key={p}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="flex items-start gap-3 text-sm"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-connexo/15 text-connexo">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-white/70">{p}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-abyss-800 px-4 py-2.5 text-sm text-white/70">
                <StampIcon className="h-4 w-4 text-connexo" />
                Sellos en barbería: el sexto corte, gratis
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-abyss-800 px-4 py-2.5 text-sm text-white/70">
                <UsersIcon className="h-4 w-4 text-connexo" />
                VIP, descuentos y notas internas
              </span>
            </div>
          </div>

          {/* Carnets apilados */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-connexo/[0.07] blur-3xl" />

            <div className="relative space-y-3">
              {CODES.map((c, i) => (
                <motion.div
                  key={c.code}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <TiltCard
                    max={7}
                    className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-gradient-to-r from-abyss-800 to-abyss-700 px-5 py-4 transition-colors hover:border-connexo/40"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-connexo/30 bg-connexo/10 text-connexo">
                        <CardIcon className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="font-heading text-lg tracking-wide text-white">
                          {c.code}
                        </div>
                        <div className="text-xs text-white/45">{c.club}</div>
                      </div>
                    </div>
                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/40">
                      {c.rubro}
                    </span>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
