import { motion } from 'framer-motion'
import type { ComponentType, SVGProps } from 'react'
import { NfcIcon, BoltIcon, RadarIcon } from './icons'
import SectionKicker from './SectionKicker'

interface Step {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  kicker: string
  title: string
  desc: string
}

const steps: Step[] = [
  {
    icon: NfcIcon,
    kicker: 'El objeto',
    title: 'Acercas. Y ya está.',
    desc: 'Ni apps, ni QR borrosos, ni escaneos que fallan. La tarjeta o el accesorio Connexo abre tu perfil con un solo acercamiento.',
  },
  {
    icon: BoltIcon,
    kicker: 'El instante',
    title: 'Tu mundo, montado al vuelo',
    desc: 'Tu URL propia se levanta al momento. Cambias precios, fotos o agenda desde el panel y afuera ya está actualizado.',
  },
  {
    icon: RadarIcon,
    kicker: 'La huella',
    title: 'Nadie se va sin dejar rastro',
    desc: 'Cada acercamiento deja un dato: quién tocó, cuándo y qué buscó. Contactos capturados, no perdidos en una servilleta.',
  },
]

export default function Mechanism() {
  return (
    <section id="mecanismo" className="relative bg-abyss-950 py-20 sm:py-28">
      <div className="section-pad">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4">
            <SectionKicker label="bajo el toque" />
          </div>
          <h2 className="font-heading text-3xl text-white sm:text-4xl">
            Entre que te acercan la tarjeta y te llega la venta, pasan tres cosas.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.article
              key={s.kicker}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-abyss-800 p-7 transition-colors hover:border-connexo/40"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-connexo/10 blur-2xl transition-opacity group-hover:opacity-100 md:opacity-0" />
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-connexo/30 bg-connexo/10 text-connexo">
                <s.icon className="h-6 w-6" />
              </div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">
                {s.kicker}
              </p>
              <h3 className="mb-2 text-lg font-semibold text-white">{s.title}</h3>
              <p className="text-sm leading-relaxed text-white/55">{s.desc}</p>
              <span className="absolute right-6 top-6 font-heading text-4xl text-white/[0.06]">
                0{i + 1}
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
