import { motion } from 'framer-motion'
import type { ComponentType, SVGProps } from 'react'
import { PhoneIcon, GlobeIcon, BellIcon, SparkIcon } from './icons'
import { TiltCard, Counter, BeamDivider } from './fx/Motion'

interface Card {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  desc: string
  stat?: { to: number; suffix: string; label: string }
}

// Fuente: manual cap. 6 (instalación), 7 (tour e idiomas) y 21 (avisos).
const cards: Card[] = [
  {
    icon: PhoneIcon,
    title: 'Se instala. Sin pasar por ninguna tienda.',
    desc: 'Tu panel queda como un ícono más en la pantalla de inicio, en Android, iPhone y computador. Se abre solo, carga más rápido y se actualiza sin que hagas nada.',
  },
  {
    icon: BellIcon,
    title: 'El aviso llega con la app cerrada.',
    desc: 'Pedido nuevo, cita nueva, reseña por aprobar: suena en tu teléfono. Y a las 18:00 te dice cuántas citas tienes mañana, a las 07:00 cuántas tienes hoy.',
  },
  {
    icon: GlobeIcon,
    title: 'Habla el idioma de quien lo maneja.',
    desc: 'El panel está en ocho idiomas y recuerda el que elegiste. Lo que tú escribes —tus productos, tu biografía— se queda tal como lo escribiste.',
    stat: { to: 8, suffix: '', label: 'idiomas' },
  },
  {
    icon: SparkIcon,
    title: 'La primera vez, se explica solo.',
    desc: 'Al entrar arranca un recorrido que va señalando cada pestaña y cada botón. Solo muestra lo que tú tienes contratado, y queda guardado por si lo quieres repasar.',
  },
]

export default function Platform() {
  return (
    <section id="plataforma" className="relative overflow-hidden bg-abyss-900 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-grid-nodes [background-size:34px_34px] opacity-[0.12]" />
      <div className="pointer-events-none absolute inset-x-0 top-0">
        <BeamDivider />
      </div>

      <div className="section-pad relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl text-white sm:text-4xl">
            No es un sitio web que revisas. Es la app que llevas encima.
          </h2>
          <p className="mt-4 text-white/55">
            Todo lo que pasa en tu negocio te busca a ti, no al revés.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.09 }}
            >
              <TiltCard
                max={6}
                className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-abyss-800 p-7 transition-colors hover:border-connexo/40"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-connexo/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-connexo/30 bg-connexo/10 text-connexo">
                    <c.icon className="h-6 w-6" />
                  </div>
                  {c.stat && (
                    <div className="text-right">
                      <Counter
                        to={c.stat.to}
                        suffix={c.stat.suffix}
                        className="font-heading text-3xl text-connexo"
                      />
                      <div className="text-[11px] uppercase tracking-wide text-white/40">
                        {c.stat.label}
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="mb-2 text-lg font-semibold text-white">{c.title}</h3>
                <p className="text-sm leading-relaxed text-white/55">{c.desc}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-white/35">
          En iPhone los avisos exigen instalar la app desde Safari y abrirla desde
          su ícono. Te lo decimos aquí y no en la letra chica.
        </p>
      </div>
    </section>
  )
}
