import { useState } from 'react'
import { motion } from 'framer-motion'
import { plans } from '../data/pricing'
import { CheckIcon } from './icons'

type Cycle = 'monthly' | 'yearly'

export default function Pricing() {
  const [cycle, setCycle] = useState<Cycle>('monthly')

  return (
    <section id="planes" className="relative bg-abyss-950 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-60" />
      <div className="section-pad relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-connexo">
            Escalabilidad
          </p>
          <h2 className="font-heading text-3xl text-white sm:text-4xl">
            Precios fijos. Sin sorpresas.
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
        </div>

        {/* Plan grid */}
        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const price = cycle === 'monthly' ? plan.monthly : plan.yearly
            const isFree = price === 0
            const unit = isFree
              ? '/mes'
              : cycle === 'monthly'
                ? '/mes'
                : '/año'

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
                    Más elegido
                  </span>
                )}

                <div className="mb-1 flex items-baseline justify-between">
                  <h3 className="font-heading text-xl text-white">{plan.name}</h3>
                </div>
                <p className="mb-6 text-sm text-white/50">{plan.tagline}</p>

                <div className="mb-6 flex items-end gap-1">
                  <span className="font-heading text-5xl text-white">
                    ${price}
                  </span>
                  <span className="mb-1.5 text-sm text-white/50">{unit}</span>
                </div>

                <a
                  href="#login"
                  className={`mb-7 w-full text-center ${
                    plan.featured ? 'btn-cta' : 'btn-outline'
                  }`}
                >
                  {plan.ctaLabel}
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
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
