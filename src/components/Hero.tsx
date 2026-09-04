import { motion } from 'framer-motion'
import { ArrowIcon } from './icons'
import { wa, waMsg } from '../config/site'
import { Aurora } from './fx/Ambient'
import { DecodeText, Magnetic } from './fx/Motion'
import GraphField from './fx/GraphField'
import { Link } from '../router'

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-abyss-950 pt-28 pb-16 sm:pt-36 sm:pb-24"
    >
      {/* Atmósfera: bloom radial + auroras a la deriva */}
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <Aurora />

      {/* Grafo de conocimiento de fondo (estética "graphify"): cúmulos de nodos
          conectados que derivan lento. Muy tenue para no pelear con el título.
          Detrás del contenido. Reemplazó al faro NFC. */}
      <GraphField />

      <div className="section-pad relative">
        <motion.h1
          variants={fade}
          custom={0}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-4xl text-center font-heading text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl"
        >
          Tu Identidad Digital no debería ser un adorno.{' '}
          <span className="text-connexo">
            <DecodeText text="Debe ser un Motor de Ventas." delay={520} />
          </span>
        </motion.h1>

        <motion.p
          variants={fade}
          custom={1}
          initial="hidden"
          animate="show"
          className="mx-auto mt-6 max-w-2xl text-center text-base text-white/70 sm:text-lg"
        >
          Connexo, la forma inteligente de compartir quién eres.
        </motion.p>

        <motion.p
          variants={fade}
          custom={2}
          initial="hidden"
          animate="show"
          className="mx-auto mt-4 flex items-center justify-center gap-3 text-center font-sans text-sm font-semibold uppercase tracking-[0.28em] text-connexo sm:text-base"
        >
          Conecta
          <span className="h-1 w-1 rounded-full bg-connexo/70" />
          Comparte
          <span className="h-1 w-1 rounded-full bg-connexo/70" />
          Crece
        </motion.p>

        <motion.div
          variants={fade}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Magnetic className="w-full sm:w-auto">
            <a
              href={wa(waMsg.trial)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta group w-full text-base sm:w-auto"
            >
              DESBLOQUEA TU PERFIL
              <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </Magnetic>
          <Link href="/red" className="btn-outline w-full text-base sm:w-auto">
            RED CONNEXO
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
