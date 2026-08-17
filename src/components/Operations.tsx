import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { BoxIcon, CheckIcon, LockIcon } from './icons'
import SectionKicker from './SectionKicker'

// Fuente: manual cap. 24.6 (pedido gastronómico), 25.5 (e-commerce) y 30.5
// (mayorista). El cliente sigue el pipeline en vivo con su código de rastreo.
const STAGES = [
  {
    key: 'Pendiente',
    title: 'Entra el pedido y te suena el teléfono.',
    desc: 'El cliente arma su pedido desde tu menú y recibe un código en pantalla. A ti te llega el aviso aunque tengas la app cerrada.',
  },
  {
    key: 'Preparando',
    title: 'No avanza hasta que el pago esté confirmado.',
    desc: 'Es un candado deliberado, no un descuido: evita que la cocina trabaje sobre un pedido que nadie pagó. Tú confirmas el pago y recién ahí arranca.',
    locked: true,
  },
  {
    key: 'Listo',
    title: 'Cargas el tiempo estimado. El cliente lo ve.',
    desc: 'Deja de responder "¿ya está?" por WhatsApp. El estado y el tiempo viajan solos al rastreador del cliente.',
  },
  {
    key: 'En camino',
    title: 'El reparto también se sigue desde el mismo código.',
    desc: 'Si el pedido es a domicilio, entra el estado de envío. Un solo código para todo el recorrido.',
  },
  {
    key: 'Entregado',
    title: 'Se cierra, y queda en tus números.',
    desc: 'El pedido entra al panel de ventas: total vendido, cantidad, ticket promedio. Y se descarga en PDF cuando lo necesites.',
  },
]

export default function Operations() {
  const ref = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // Solo se actualiza el estado cuando cambia el índice, no en cada frame.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(STAGES.length - 1, Math.floor(v * STAGES.length))
    setStep((prev) => (prev === next ? prev : next))
  })

  const stage = STAGES[step]

  return (
    <section id="opera" className="relative bg-abyss-950">
      <div className="section-pad pt-20 sm:pt-28">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4">
            <SectionKicker label="no es una página, es tu operación" />
          </div>
          <h2 className="font-heading text-3xl text-white sm:text-4xl">
            El pedido no se pierde en un chat. Camina solo, y tu cliente lo ve
            caminar.
          </h2>
        </div>
      </div>

      {/* Contenedor alto: el scroll dentro de él mueve el pipeline */}
      <div ref={ref} className="relative" style={{ height: `${STAGES.length * 72}vh` }}>
        <div className="sticky top-0 flex min-h-screen items-center">
          <div className="section-pad w-full">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              {/* Rastreador — lo que ve el cliente final */}
              <div className="relative mx-auto w-full max-w-sm">
                <div className="pointer-events-none absolute -inset-8 rounded-full bg-connexo/10 blur-3xl" />

                <div className="relative rounded-3xl border border-white/[0.08] bg-abyss-800 p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
                      <BoxIcon className="h-4 w-4 text-connexo" />
                      Rastrear mi pedido
                    </span>
                    <span className="rounded-md bg-white/[0.06] px-2 py-1 font-mono text-[11px] text-white/60">
                      #GT-2481
                    </span>
                  </div>

                  <ul className="mt-6 space-y-1">
                    {STAGES.map((s, i) => {
                      const done = i < step
                      const current = i === step
                      return (
                        <li key={s.key} className="flex items-center gap-3 py-2">
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                              done
                                ? 'border-connexo bg-connexo text-black'
                                : current
                                  ? 'border-connexo bg-connexo/15 text-connexo'
                                  : 'border-white/12 bg-white/[0.03] text-white/25'
                            }`}
                          >
                            {done ? (
                              <CheckIcon className="h-3.5 w-3.5" />
                            ) : s.locked && current ? (
                              <LockIcon className="h-3.5 w-3.5" />
                            ) : (
                              <span className="text-[11px] font-semibold">{i + 1}</span>
                            )}
                          </span>

                          <span
                            className={`text-sm transition-colors duration-300 ${
                              current
                                ? 'font-semibold text-white'
                                : done
                                  ? 'text-white/65'
                                  : 'text-white/30'
                            }`}
                          >
                            {s.key}
                          </span>

                          {current && (
                            <motion.span
                              layoutId="stage-pulse"
                              className="ml-auto h-2 w-2 rounded-full bg-connexo"
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                          )}
                        </li>
                      )
                    })}
                  </ul>

                  {/* Barra de avance: transform puro (scaleX) */}
                  <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                    <motion.div
                      className="h-full origin-left rounded-full bg-connexo"
                      animate={{ scaleX: (step + 1) / STAGES.length }}
                      transition={{ type: 'spring', stiffness: 180, damping: 26 }}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Texto del paso activo */}
              <div className="relative min-h-[220px]">
                <motion.div
                  key={stage.key}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-connexo/35 bg-connexo/10 px-3 py-1 text-xs font-semibold text-connexo">
                    {String(step + 1).padStart(2, '0')} · {stage.key}
                  </span>
                  <h3 className="mt-5 font-heading text-2xl leading-tight text-white sm:text-3xl">
                    {stage.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-white/60">
                    {stage.desc}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-pad pb-20 sm:pb-28">
        <p className="mx-auto max-w-2xl text-center text-sm text-white/45">
          El mismo motor mueve las comandas de un restaurante, los pedidos de una
          tienda y la cotización de una fábrica de uniformes. Cambian las palabras,
          no la mecánica.
        </p>
      </div>
    </section>
  )
}
