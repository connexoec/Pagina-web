import { motion } from 'framer-motion'
import { ArrowIcon, NfcIcon, WhatsappIcon } from './icons'
import { wa, waMsg } from '../config/site'
import { ecosystems } from '../data/ecosystems'
import { Aurora, PerspectiveGrid } from './fx/Ambient'
import { DecodeText, Magnetic, Marquee, NfcRings } from './fx/Motion'

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
      className="relative overflow-hidden bg-abyss-950 pt-28 pb-16 sm:pt-36 sm:pb-20"
    >
      {/* Atmósfera: bloom radial + auroras a la deriva + rejilla en fuga */}
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <Aurora />
      <PerspectiveGrid />

      {/* Anillos de señal emanando del punto de toque, detrás del titular */}
      <NfcRings className="pointer-events-none absolute left-1/2 top-[18%] h-[560px] w-[560px] -translate-x-1/2 opacity-40 sm:opacity-55" />

      <div className="section-pad relative">
        <motion.div
          variants={fade}
          custom={0}
          initial="hidden"
          animate="show"
          className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm"
        >
          <NfcIcon className="h-4 w-4 text-connexo" />
          Pensado, diseñado y armado en Ecuador
        </motion.div>

        <motion.h1
          variants={fade}
          custom={1}
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
          custom={2}
          initial="hidden"
          animate="show"
          className="mx-auto mt-6 max-w-2xl text-center text-base text-white/60 sm:text-lg"
        >
          Deja la tarjeta de papel en el pasado. Un toque abre tu perfil, y ese
          perfil cobra, agenda, arma el pedido y se acuerda de tus clientes.
        </motion.p>

        <motion.div
          variants={fade}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
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
          <a href="#ecosistemas" className="btn-outline w-full text-base sm:w-auto">
            Ver los nueve rubros
          </a>
        </motion.div>

        <motion.p
          variants={fade}
          custom={4}
          initial="hidden"
          animate="show"
          className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-white/40"
        >
          <WhatsappIcon className="h-3.5 w-3.5 text-connexo/70" />
          Se arranca con una prueba gratis. Sin tarjeta, sin formularios.
        </motion.p>

        {/* Trust strip */}
        <motion.div
          variants={fade}
          custom={5}
          initial="hidden"
          animate="show"
          className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center text-xs uppercase tracking-widest text-white/35"
        >
          <span>Nada que descargar</span>
          <span className="hidden sm:inline">·</span>
          <span>Tu perfil vive en segundos</span>
          <span className="hidden sm:inline">·</span>
          <span>Cada toque, un contacto</span>
        </motion.div>
      </div>

      {/* Cinta de rubros — el catálogo entero pasando de largo */}
      <motion.div
        variants={fade}
        custom={6}
        initial="hidden"
        animate="show"
        className="relative mt-14"
      >
        <Marquee items={ecosystems.map((e) => e.name)} duration={38} />
      </motion.div>
    </section>
  )
}
