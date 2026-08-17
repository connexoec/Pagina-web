import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
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
    title: 'El reparto se sigue con el mismo código.',
    desc: 'Si el pedido es a domicilio, entra el estado de envío. Un solo código para todo el recorrido.',
  },
  {
    key: 'Entregado',
    title: 'Se cierra, y queda en tus números.',
    desc: 'El pedido entra al panel de ventas: total vendido, cantidad y ticket promedio. Y se descarga en PDF cuando lo necesites.',
  },
]

/**
 * Cuánto scroll dura cada estado, en vh.
 * Con `sticky` el panel queda quieto mientras el contenedor pasa por detrás, así
 * que este número es literalmente "cuánto hay que rodar para que cambie un
 * paso". Demasiado alto = pantallas enteras sin que ocurra nada.
 */
const VH_PER_STAGE = 55

export default function Operations() {
  const ref = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // El estado solo cambia cuando cambia el índice, no en cada frame.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(STAGES.length - 1, Math.max(0, Math.floor(v * STAGES.length)))
    setStep((prev) => (prev === next ? prev : next))
  })

  // La barra sigue al scroll de forma continua: no da saltos entre pasos.
  const barScale = useTransform(scrollYProgress, [0, 1], [1 / STAGES.length, 1])

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
      <div
        ref={ref}
        className="relative"
        style={{ height: `${STAGES.length * VH_PER_STAGE}vh` }}
      >
        {/* `svh` en vez de `vh`: en móvil la barra del navegador cambia el alto
            del viewport al scrollear y con `vh` el panel da tirones. */}
        <div className="sticky top-0 flex min-h-[100svh] items-center py-16">
          <div className="section-pad w-full">
            {/* Rejilla acotada: con `max-w-7xl` + `grid-cols-2` las dos mitades
                quedaban a ~250px una de otra en escritorio. La columna del
                teléfono es fija y el texto ocupa el resto, pegados. */}
            <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)] lg:gap-14">
              {/* Rastreador — lo que ve el cliente final */}
              <div className="relative mx-auto w-full max-w-[330px]">
                {/* inset corto a propósito: un halo más ancho desbordaría el
                    viewport en teléfono, y aquí no se puede usar
                    `overflow-hidden` porque rompería el sticky. */}
                <div className="pointer-events-none absolute -inset-3 rounded-full bg-connexo/10 blur-3xl" />

                <div className="relative rounded-3xl border border-white/[0.08] bg-abyss-800 p-5 shadow-card sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
                      <BoxIcon className="h-4 w-4 text-connexo" />
                      Rastrear mi pedido
                    </span>
                    <span className="rounded-md bg-white/[0.06] px-2 py-1 font-mono text-[11px] text-white/60">
                      #GT-2481
                    </span>
                  </div>

                  <ul className="mt-5">
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
                                  : 'border-white/[0.12] bg-white/[0.03] text-white/25'
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

                          {/* Punto sin `layoutId`: una animación de layout entre
                              filas daba saltos al scrollear rápido. */}
                          <span
                            className={`ml-auto h-2 w-2 rounded-full bg-connexo transition-opacity duration-300 ${
                              current ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        </li>
                      )
                    })}
                  </ul>

                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                    <motion.div
                      className="h-full w-full origin-left rounded-full bg-connexo"
                      style={{ scaleX: barScale }}
                    />
                  </div>
                </div>
              </div>

              {/* Texto del paso activo.
                  Los cinco bloques están montados y solo cambia su opacidad. Con
                  `key` se remontaba en cada paso y la animación de entrada se
                  reproducía otra vez: al scrollear rápido, parpadeaba. */}
              <div className="relative min-h-[230px] sm:min-h-[210px]">
                {STAGES.map((s, i) => {
                  const active = i === step
                  return (
                    <motion.div
                      key={s.key}
                      className="absolute inset-x-0 top-0"
                      aria-hidden={!active}
                      initial={false}
                      animate={{
                        opacity: active ? 1 : 0,
                        y: active ? 0 : 14,
                      }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{ pointerEvents: active ? 'auto' : 'none' }}
                    >
                      <span className="inline-flex items-center gap-2 rounded-full border border-connexo/35 bg-connexo/10 px-3 py-1 text-xs font-semibold text-connexo">
                        {String(i + 1).padStart(2, '0')} · {s.key}
                      </span>
                      <h3 className="mt-4 font-heading text-2xl leading-tight text-white sm:text-3xl">
                        {s.title}
                      </h3>
                      <p className="mt-3 max-w-md text-base leading-relaxed text-white/60">
                        {s.desc}
                      </p>
                    </motion.div>
                  )
                })}
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
