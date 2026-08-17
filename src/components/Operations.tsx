import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
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

/** Icono de cada nodo según en qué punto del recorrido está. */
function StepGlyph({ index, step }: { index: number; step: number }) {
  const done = index < step
  const current = index === step
  if (done) return <CheckIcon className="h-3.5 w-3.5" />
  if (current && STAGES[index].locked) return <LockIcon className="h-3.5 w-3.5" />
  return <span className="text-[11px] font-semibold">{index + 1}</span>
}

function nodeClass(index: number, step: number) {
  if (index < step) return 'border-connexo bg-connexo text-black'
  if (index === step) return 'border-connexo bg-connexo/15 text-connexo'
  return 'border-white/[0.12] bg-white/[0.03] text-white/25'
}

/** Rastreador completo — columna izquierda en escritorio. */
function FullTracker({ step }: { step: number }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-3 rounded-full bg-connexo/10 blur-3xl" />

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

        <ul className="mt-5">
          {STAGES.map((s, i) => (
            <li key={s.key} className="flex items-center gap-3 py-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${nodeClass(i, step)}`}
              >
                <StepGlyph index={i} step={step} />
              </span>
              <span
                className={`text-sm transition-colors duration-300 ${
                  i === step
                    ? 'font-semibold text-white'
                    : i < step
                      ? 'text-white/65'
                      : 'text-white/30'
                }`}
              >
                {s.key}
              </span>
              {/* Sin `layoutId`: una animación de layout entre filas daba
                  tirones al scrollear rápido. */}
              <span
                className={`ml-auto h-2 w-2 rounded-full bg-connexo transition-opacity duration-300 ${
                  i === step ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </li>
          ))}
        </ul>

        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.07]">
          <motion.div
            className="h-full w-full origin-left rounded-full bg-connexo"
            animate={{ scaleX: (step + 1) / STAGES.length }}
            transition={{ type: 'spring', stiffness: 160, damping: 24 }}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Rastreador compacto — versión de teléfono, fijada bajo la barra.
 * En móvil la tarjeta vertical se comía media pantalla; esta ocupa ~90px y deja
 * el texto legible.
 */
function CompactTracker({ step }: { step: number }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40">
          <BoxIcon className="h-3.5 w-3.5 text-connexo" />
          Rastrear mi pedido
        </span>
        <span className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-white/55">
          #GT-2481
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-1.5">
        {STAGES.map((s, i) => (
          <Fragment key={s.key}>
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${nodeClass(i, step)}`}
            >
              <StepGlyph index={i} step={step} />
            </span>
            {i < STAGES.length - 1 && (
              <span
                className={`h-px flex-1 transition-colors duration-300 ${
                  i < step ? 'bg-connexo' : 'bg-white/[0.12]'
                }`}
              />
            )}
          </Fragment>
        ))}
      </div>

      <p className="mt-2 text-xs font-semibold text-connexo">{STAGES[step].key}</p>
    </div>
  )
}

/**
 * Un paso del relato. Avisa cuando su centro cruza el centro de la pantalla.
 *
 * Se usa `useInView` por bloque en vez de calcular el scroll a mano: no hay
 * alturas mágicas en vh que cuadrar, funciona igual en cualquier pantalla y no
 * depende de que un contenedor mida exactamente el alto del viewport.
 */
function StageBlock({
  index,
  onEnter,
}: {
  index: number
  onEnter: (i: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  // Franja de activación: solo el centro de la pantalla.
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  const s = STAGES[index]

  useEffect(() => {
    if (inView) onEnter(index)
  }, [inView, index, onEnter])

  return (
    <div ref={ref} className="flex min-h-[58vh] items-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-connexo/35 bg-connexo/10 px-3 py-1 text-xs font-semibold text-connexo">
          {String(index + 1).padStart(2, '0')} · {s.key}
        </span>
        <h3 className="mt-4 font-heading text-2xl leading-tight text-white sm:text-3xl">
          {s.title}
        </h3>
        <p className="mt-3 max-w-md text-base leading-relaxed text-white/60">
          {s.desc}
        </p>
      </motion.div>
    </div>
  )
}

export default function Operations() {
  const [step, setStep] = useState(0)

  // Estable: si cambiara en cada render, el efecto de cada bloque se
  // redispararía sin parar.
  const handleEnter = useCallback((i: number) => {
    setStep((prev) => (prev === i ? prev : i))
  }, [])

  return (
    <section id="opera" className="relative bg-abyss-950 py-20 sm:py-28">
      <div className="section-pad">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4">
            <SectionKicker label="no es una página, es tu operación" />
          </div>
          <h2 className="font-heading text-3xl text-white sm:text-4xl">
            El pedido no se pierde en un chat. Camina solo, y tu cliente lo ve
            caminar.
          </h2>
        </div>

        {/* Rastreador compacto fijado bajo la barra — solo teléfono */}
        <div className="sticky top-16 z-20 -mx-5 mt-12 border-y border-white/[0.06] bg-abyss-950/90 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 lg:hidden">
          <CompactTracker step={step} />
        </div>

        <div className="mt-6 grid gap-14 lg:mt-16 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start">
          {/* Rastreador completo, fijado al costado — solo escritorio.
              `sticky` sobre un elemento de alto natural: no hay contenedor de
              100vh que pueda quedar más alto que la pantalla. */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <FullTracker step={step} />
            </div>
          </div>

          {/* Columna del relato: es la que da la altura del recorrido */}
          <div>
            {STAGES.map((s, i) => (
              <StageBlock key={s.key} index={i} onEnter={handleEnter} />
            ))}
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-white/45">
          El mismo motor mueve las comandas de un restaurante, los pedidos de una
          tienda y la cotización de una fábrica de uniformes. Cambian las palabras,
          no la mecánica.
        </p>
      </div>
    </section>
  )
}
