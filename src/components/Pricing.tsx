import { useState } from 'react'
import { motion } from 'framer-motion'
import { plans } from '../data/pricing'
import { CheckIcon, HeartIcon, WhatsappIcon } from './icons'
import PlanMatrix from './PlanMatrix'
import { site, wa, waMsg } from '../config/site'
import { Magnetic } from './fx/Motion'

type Cycle = 'monthly' | 'yearly'

export default function Pricing() {
  const [cycle, setCycle] = useState<Cycle>('monthly')

  return (
    <section id="planes" className="relative bg-abyss-950 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-60" />
      <div className="section-pad relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl text-white sm:text-4xl">
            El precio que ves es el que pagas.
          </h2>

          {/* Cycle toggle */}
          <div className="mt-8 inline-flex items-center rounded-full border border-white/10 bg-abyss-800 p-1">
            {(['monthly', 'yearly'] as Cycle[]).map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className="relative rounded-full px-5 py-2 text-sm font-semibold transition-colors"
              >
                {c === cycle && (
                  <motion.span
                    layoutId="cycle-pill"
                    className="absolute inset-0 rounded-full bg-connexo"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    c === cycle ? 'text-black' : 'text-white/60'
                  }`}
                >
                  {c === 'monthly' ? 'Mensual' : 'Anual'}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/40">
            {cycle === 'yearly'
              ? 'Facturación anual — el mejor precio por mes.'
              : 'Facturación mensual — cancela cuando quieras.'}
          </p>

          {/* Vínculo precio ↔ causa: el 10% es de la Fundación Arupo */}
          <a
            href="#arupo"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-connexo/30 bg-connexo/[0.07] px-4 py-1.5 text-xs text-white/70 transition-colors hover:border-connexo/60 hover:text-white"
          >
            <HeartIcon className="h-3.5 w-3.5 text-connexo" />
            De cada plan, el <span className="font-semibold text-connexo">10%</span> es
            de la Fundación Arupo
          </a>
        </div>

        {/* Plan grid */}
        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const price = cycle === 'monthly' ? plan.monthly : plan.yearly
            const isTrial = price === null

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex flex-col rounded-3xl border p-7 ${
                  plan.featured
                    ? 'border-connexo/60 bg-abyss-800 shadow-glow-lg lg:-my-3 lg:py-10'
                    : 'border-white/[0.07] bg-abyss-800'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-connexo px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
                    El más pedido
                  </span>
                )}

                <div className="mb-1 flex items-baseline justify-between">
                  <h3 className="font-heading text-xl text-white">{plan.name}</h3>
                </div>
                <p className="mb-6 text-sm text-white/50">{plan.tagline}</p>

                <div className="mb-6 flex min-h-[60px] items-end gap-1">
                  {isTrial ? (
                    <span className="font-heading text-3xl leading-tight text-connexo">
                      Prueba gratis
                    </span>
                  ) : (
                    <>
                      <span className="font-heading text-5xl text-white">
                        ${price}
                      </span>
                      <span className="mb-1.5 text-sm text-white/50">
                        {cycle === 'monthly' ? '/mes' : '/año'}
                      </span>
                    </>
                  )}
                </div>

                {/* No hay auto-registro: la cuenta la crea Connexo. */}
                <Magnetic className="mb-4 w-full">
                  <a
                    href={isTrial ? wa(waMsg.trial) : site.store}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full text-center ${
                      plan.featured ? 'btn-cta' : 'btn-outline'
                    }`}
                  >
                    {plan.ctaLabel}
                  </a>
                </Magnetic>

                <a
                  href={wa(waMsg.plan(plan.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-7 inline-flex items-center justify-center gap-1.5 text-xs text-white/40 transition-colors hover:text-connexo"
                >
                  <WhatsappIcon className="h-3.5 w-3.5" />
                  Prefiero que me expliquen primero
                </a>

                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          plan.featured
                            ? 'bg-connexo/20 text-connexo'
                            : 'bg-white/[0.06] text-white/70'
                        }`}
                      >
                        <CheckIcon className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-white/70">{f}</span>
                    </li>
                  ))}
                </ul>

                {plan.note && (
                  <p className="mt-6 border-t border-white/[0.06] pt-4 text-xs leading-relaxed text-white/40">
                    {plan.note}
                  </p>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      <PlanMatrix />
    </section>
  )
}
