import { motion } from 'framer-motion'
import { ngoMembers } from '../data/directory'
import { ArrowIcon, CheckIcon, HeartIcon, SignalIcon, UsersIcon } from './icons'
import SectionKicker from './SectionKicker'
import { Counter, TiltCard } from './fx/Motion'
import { site, wa, waMsg } from '../config/site'

// ─────────────────────────────────────────────────────────────
//  CONVENIOS CON ORGANIZACIONES  ·  cabecera de la RED CONNEXO.
//
//  Las organizaciones aliadas activan perfiles Connexo a los emprendedores que
//  acompañan, y esos perfiles entran a la red como cualquier otro.
//
//  ⚠️ Las organizaciones que se listan son REALES y salen de `data/directory.ts`
//  (`ngo: true`). Los cupos libres son eso, cupos: nunca inventar una alianza
//  que no existe — una ONG falsa en una página pública es un problema serio,
//  no un adorno de maqueta.
// ─────────────────────────────────────────────────────────────

/** Cuántos cupos de convenio se muestran abiertos junto a los aliados. */
const OPEN_AGREEMENTS = 2

const HOW = [
  {
    icon: UsersIcon,
    title: 'La organización acompaña',
    desc: 'Un programa social, una fundación o una cooperativa ya trabaja con emprendedores que venden sin tener dónde mostrarse.',
  },
  {
    icon: SignalIcon,
    title: 'Connexo les activa el perfil',
    desc: 'Por convenio, cada emprendedor recibe su perfil con su enlace propio, su catálogo y su forma de cobrar.',
  },
  {
    icon: HeartIcon,
    title: 'Entran a la red, a la vista de todos',
    desc: 'Ese perfil aparece aquí, en el directorio, junto a cualquier otro negocio. Sin sección aparte ni etiqueta de caridad.',
  },
]

export default function NgoAlliance() {
  const allies = ngoMembers()

  return (
    <section
      id="convenios"
      className="relative overflow-hidden border-b border-white/[0.06] bg-abyss-950 py-16 sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-70" />

      <div className="section-pad relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex justify-center">
            <SectionKicker label="la red también se abre hacia afuera" />
          </div>

          <h2 className="font-heading text-2xl leading-tight text-white sm:text-4xl">
            Hay negocios que llegan aquí porque una organización les abrió la
            puerta.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-white/60">
            Connexo firma convenios con organizaciones sociales para activarles
            el perfil a los emprendedores que acompañan. Entran al directorio
            como cualquier otro negocio, con el mismo peso y el mismo tamaño de
            tarjeta.
          </p>
        </div>

        {/* Cómo funciona */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {HOW.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.45, delay: i * 0.09 }}
              className="rounded-2xl border border-white/[0.06] bg-abyss-800 p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-connexo/30 bg-connexo/10 text-connexo">
                <h.icon className="h-5 w-5" />
              </div>
              <div className="mb-1 font-mono text-[10px] tracking-widest text-white/30">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="mb-2 font-semibold text-white">{h.title}</h3>
              <p className="text-sm leading-relaxed text-white/55">{h.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* El compromiso del 10% */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.5 }}
          className="mt-6 flex flex-col items-center gap-5 rounded-2xl border border-connexo/25 bg-connexo/[0.06] p-7 text-center sm:flex-row sm:text-left"
        >
          <div className="flex shrink-0 items-baseline gap-1">
            <Counter to={10} suffix="%" className="font-heading text-5xl text-connexo" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">
              De cada plan vendido, el 10% es de la Fundación Arupo.
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/60">
              No es un porcentaje de las ganancias ni de lo que sobre: es del
              plan. Cada negocio que entra a esta red sostiene ese compromiso sin
              tener que hacer nada más que existir aquí.
            </p>
          </div>
          <a
            href={site.arupo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline shrink-0 text-sm"
          >
            Conocer la fundación
          </a>
        </motion.div>

        {/* Organizaciones aliadas + cupos abiertos */}
        <div className="mt-10">
          <h3 className="mb-5 text-center text-xs uppercase tracking-[0.2em] text-white/35">
            Organizaciones con convenio
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {allies.map((org, i) => (
              <motion.a
                key={org.id}
                href={org.profile}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <TiltCard
                  max={6}
                  className="group flex h-full flex-col items-center rounded-2xl border border-white/[0.07] bg-abyss-800 p-5 text-center transition-colors hover:border-connexo/50"
                >
                  <div className="flex h-16 w-full items-center justify-center">
                    {org.logo ? (
                      <img
                        src={org.logo}
                        alt={org.name}
                        loading="lazy"
                        decoding="async"
                        className="max-h-16 max-w-full object-contain"
                      />
                    ) : (
                      <span className="font-heading text-3xl text-white/20">
                        {org.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1 rounded-full border border-connexo/30 bg-connexo/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-connexo">
                    <CheckIcon className="h-2.5 w-2.5" />
                    Convenio activo
                  </span>

                  <p className="mt-2.5 text-sm font-semibold leading-tight text-white">
                    {org.name}
                  </p>
                </TiltCard>
              </motion.a>
            ))}

            {Array.from({ length: OPEN_AGREEMENTS }, (_, i) => (
              <motion.a
                key={`open-${i}`}
                href={wa(waMsg.ngo)}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: (allies.length + i) * 0.07 }}
                className="group flex min-h-[170px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.12] bg-black/30 p-5 text-center transition-colors hover:border-connexo/50 hover:bg-connexo/[0.04]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/30 transition-colors group-hover:border-connexo/40 group-hover:text-connexo">
                  <SignalIcon className="h-5 w-5" />
                </span>
                <span className="mt-3 text-sm font-semibold text-white/55 transition-colors group-hover:text-white">
                  Convenio abierto
                </span>
                <span className="mt-1 text-[11px] leading-relaxed text-white/35">
                  Para organizaciones que acompañan emprendedores
                </span>
              </motion.a>
            ))}
          </div>
        </div>

        {/* CTA para organizaciones */}
        <div className="mt-10 text-center">
          <a
            href={wa(waMsg.ngo)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta group"
          >
            SOMOS UNA ORGANIZACIÓN
            <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
          <p className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-white/35">
            Los convenios se acuerdan uno por uno y se anuncian aquí solo cuando
            están firmados. Los espacios marcados como abiertos son eso: espacios,
            no alianzas en trámite.
          </p>
        </div>
      </div>
    </section>
  )
}
