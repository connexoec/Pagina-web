import { motion } from 'framer-motion'
import { ArrowIcon } from './icons'
import SectionKicker from './SectionKicker'

const ARUPO_URL = 'https://www.fundacionarupo.org/'

// Compromiso de responsabilidad social: el 10% de cada plan vendido es de la
// Fundación Arupo (inclusión, derechos humanos e innovación social · Ecuador).
export default function Arupo() {
  return (
    <section
      id="arupo"
      className="relative overflow-hidden border-y border-white/[0.06] bg-abyss-900 py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute -left-20 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-connexo/10 blur-[130px]" />

      <div className="section-pad relative">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Cifra ancla — el 10% como número de impacto, no como asterisco */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-[2rem] border border-connexo/25 bg-gradient-to-br from-abyss-800 to-black"
          >
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-grid-nodes [background-size:26px_26px] opacity-25" />
            <div className="relative text-center">
              <span className="font-heading text-[7rem] leading-none text-connexo drop-shadow-[0_0_40px_rgba(255,102,0,0.35)] sm:text-[9rem]">
                10%
              </span>
              <p className="mt-2 text-sm tracking-tight text-white/60">
                de cada plan vendido
              </p>
            </div>
          </motion.div>

          {/* Manifiesto */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5">
              <SectionKicker label="no es marketing, es un trato" />
            </div>

            <h2 className="font-heading text-3xl leading-tight text-white sm:text-4xl">
              Diez de cada cien dólares no son nuestros.{' '}
              <span className="text-connexo">Son de la Fundación Arupo.</span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60">
              Cada identidad que se activa en Connexo sostiene el trabajo de la{' '}
              <span className="text-white/80">Fundación Arupo</span> en Ecuador:
              inclusión, derechos humanos e innovación social. No es un redondeo que
              te pedimos en la caja ni una campaña de temporada. Está adentro del
              precio, en cada plan, siempre.
            </p>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/60">
              Tú haces crecer tu negocio. Nosotros nos aseguramos de que crecer
              signifique algo más.
            </p>

            <a
              href={ARUPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline group mt-8"
            >
              Conoce a la Fundación Arupo
              <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
