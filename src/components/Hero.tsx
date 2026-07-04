import { motion } from 'framer-motion'
import { ArrowIcon, NfcIcon } from './icons'

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
      className="relative overflow-hidden bg-abyss-950 pt-28 pb-20 sm:pt-36 sm:pb-28"
    >
      {/* Cinematic orange bloom */}
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-connexo/20 blur-[140px]" />

      <div className="section-pad relative">
        <motion.div
          variants={fade}
          custom={0}
          initial="hidden"
          animate="show"
          className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-white/70"
        >
          <NfcIcon className="h-4 w-4 text-connexo" />
          Identidad digital NFC + IA · Hecho en Ecuador
        </motion.div>

        <motion.h1
          variants={fade}
          custom={1}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-4xl text-center font-heading text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl"
        >
          Tu Identidad Digital no debería ser un adorno.{' '}
          <span className="text-connexo">Debe ser un Motor de Ventas.</span>
        </motion.h1>

        <motion.p
          variants={fade}
          custom={2}
          initial="hidden"
          animate="show"
          className="mx-auto mt-6 max-w-2xl text-center text-base text-white/60 sm:text-lg"
        >
          Olvida las tarjetas de papel. Connexo es la infraestructura NFC e IA que
          convierte cada interacción en un lead capturado, una reserva y una
          transacción directa.
        </motion.p>

        <motion.div
          variants={fade}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a href="#planes" className="btn-cta group w-full text-base sm:w-auto">
            DESBLOQUEA TU PERFIL
            <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
          <a href="#ecosistemas" className="btn-outline w-full text-base sm:w-auto">
            Ver ecosistemas
          </a>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          variants={fade}
          custom={4}
          initial="hidden"
          animate="show"
          className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center text-xs uppercase tracking-widest text-white/35"
        >
          <span>Cero apps</span>
          <span className="hidden sm:inline">·</span>
          <span>URL dedicada en milisegundos</span>
          <span className="hidden sm:inline">·</span>
          <span>Leads en tiempo real</span>
        </motion.div>
      </div>
    </section>
  )
}
