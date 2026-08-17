import { motion } from 'framer-motion'
import { members } from '../data/directory'
import { ArrowIcon, SignalIcon } from './icons'
import SectionKicker from './SectionKicker'
import { Link } from '../router'

/**
 * Banda de la portada que anuncia la RED CONNEXO y manda a su página (/red).
 * El directorio en sí NO vive aquí: vive en `pages/RedPage.tsx`. Esta banda
 * solo mantiene el hilo narrativo y el camino de entrada desde la portada.
 */
export default function RedTeaser() {
  const rubros = new Set(members.map((m) => m.ecosystem)).size

  return (
    <section
      id="red"
      className="relative overflow-hidden border-y border-white/[0.06] bg-abyss-900 py-20 sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-nodes [background-size:26px_26px] opacity-[0.14]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-connexo/10 blur-[120px]" />

      <div className="section-pad relative">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-4 flex justify-center">
            <SectionKicker label="el mapa de los que ya se atrevieron" />
          </div>

          <h2 className="font-heading text-3xl leading-tight text-white sm:text-4xl">
            RED CONNEXO: el directorio de quienes ya cambiaron el papel por un
            toque.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-white/60">
            Un mapa abierto de negocios reales. Entras, ves qué hace cada uno y
            saltas a su perfil. Sin intermediarios y sin pagar por salir arriba.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/red" className="btn-cta group">
              <SignalIcon className="h-5 w-5" />
              ENTRAR AL DIRECTORIO
              <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <p className="mt-5 text-xs text-white/35">
            {members.length === 1
              ? '1 negocio dentro'
              : `${members.length} negocios dentro`}
            {' · '}
            {rubros === 1 ? '1 rubro activo' : `${rubros} rubros activos`}
            {' · '}la red recién abre
          </p>
        </motion.div>
      </div>
    </section>
  )
}
