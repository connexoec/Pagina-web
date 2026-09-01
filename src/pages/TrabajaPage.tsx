import { lazy, Suspense, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { Link } from '../router'
import { TiltCard } from '../components/fx/Motion'
import SellerForm from '../components/careers/SellerForm'
import VolunteerForm from '../components/careers/VolunteerForm'
import { sellerPerks } from '../data/careers'
import { site } from '../config/site'
import {
  ArrowIcon,
  BoltIcon,
  BriefcaseIcon,
  ChartIcon,
  GlobeIcon,
  HeartIcon,
  SparkIcon,
  StampIcon,
  UsersIcon,
} from '../components/icons'

// ─────────────────────────────────────────────────────────────
//  TRABAJA CON NOSOTROS · página propia (/trabaja)
//  Dos caminos en un conmutador: postularse como Vendedor/Distribuidor
//  (Connexo Sellers) o como Voluntario/a. Cada uno con su formulario que
//  envía a Discord (config/discord) y respalda por WhatsApp.
//  Estética de la marca: negro + naranja, sin colores por sección (§2).
// ─────────────────────────────────────────────────────────────

const Footer = lazy(() => import('../components/Footer'))

type Tab = 'sellers' | 'volunteers'

const TABS: { id: Tab; label: string; short: string; Icon: typeof BriefcaseIcon }[] = [
  { id: 'sellers', label: 'Vendedor / Distribuidor', short: 'Vender', Icon: BriefcaseIcon },
  { id: 'volunteers', label: 'Voluntariado', short: 'Voluntariado', Icon: HeartIcon },
]

const PERK_ICONS = {
  bolt: BoltIcon,
  chart: ChartIcon,
  users: UsersIcon,
  stamp: StampIcon,
  spark: SparkIcon,
  globe: GlobeIcon,
} as const

/** Textura de la portada: rejilla de nodos + halo naranja. Barata y estática. */
function HeaderBackdrop() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-grid-nodes [background-size:28px_28px] opacity-[0.12]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-connexo/10 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />
    </>
  )
}

function PerkCard({ icon, title, body }: (typeof sellerPerks)[number]) {
  const Icon = PERK_ICONS[icon]
  return (
    <TiltCard className="h-full">
      <div className="flex h-full gap-4 rounded-2xl border border-white/[0.08] bg-abyss-800 p-5 transition-colors hover:border-connexo/40">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-connexo/12 text-connexo">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-sans text-[15px] font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-white/55">{body}</p>
        </div>
      </div>
    </TiltCard>
  )
}

/** Panel-pitch de Vendedor/Distribuidor. */
function SellerPitch() {
  return (
    <div>
      <h2 className="font-heading text-2xl leading-tight text-white sm:text-3xl">
        Vende la forma más simple de tener un negocio digital.
      </h2>
      <p className="mt-4 text-white/60">
        Connexo es identidad digital NFC + software de ventas, hecho en Ecuador. Tú
        pones la calle y la conversación; nosotros el producto, la formación y el
        respaldo. No necesitas experiencia: necesitas ganas de vender.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sellerPerks.map((p) => (
          <PerkCard key={p.title} {...p} />
        ))}
      </div>
      <p className="mt-6 text-sm text-white/40">
        Los números finos (comisiones, metas, sueldo base) los revisamos contigo en
        la entrevista. Deja tus datos, agenda tu cita y conversamos todo en persona.
      </p>
    </div>
  )
}

/** Panel-pitch de Voluntariado. Copy general — pendiente de afinar con el cliente. */
function VolunteerPitch() {
  return (
    <div>
      <h2 className="font-heading text-2xl leading-tight text-white sm:text-3xl">
        Sé parte del lado humano de Connexo.
      </h2>
      <p className="mt-4 text-white/60">
        Connexo trabaja en el cruce entre tecnología, comunicación y accesibilidad
        digital. Y el 10% de cada plan que vendemos es de la{' '}
        <a
          href={site.arupo}
          target="_blank"
          rel="noopener noreferrer"
          className="text-connexo hover:underline"
        >
          Fundación Arupo
        </a>
        . Si te mueve construir algo con impacto y accesible para todos, hay un lugar
        para ti.
      </p>

      <ul className="mt-8 space-y-4">
        {[
          {
            Icon: HeartIcon,
            t: 'Aportas donde eres bueno',
            d: 'Diseño, redes, tecnología, logística de eventos o trabajo en territorio: sumas desde tu talento.',
          },
          {
            Icon: UsersIcon,
            t: 'Con un equipo real',
            d: 'Trabajas junto a la gente de Connexo y la Fundación Arupo, no en solitario.',
          },
          {
            Icon: SparkIcon,
            t: 'Experiencia que suma',
            d: 'Aprendes de un proyecto real de tecnología e impacto social en Ecuador.',
          },
        ].map((it) => (
          <li key={it.t} className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-connexo/12 text-connexo">
              <it.Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-sans text-[15px] font-semibold text-white">{it.t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/55">{it.d}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function TrabajaPage() {
  const [tab, setTab] = useState<Tab>('sellers')
  const reduced = useReducedMotion()

  return (
    <div className="min-h-screen bg-abyss-950 text-white/90">
      <Navbar />

      <main>
        {/* Portada */}
        <section className="relative overflow-hidden border-b border-white/[0.06] bg-abyss-900 pt-28 pb-14 sm:pt-36 sm:pb-16">
          <HeaderBackdrop />
          <div className="section-pad relative">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-xs text-white/40 transition-colors hover:text-connexo"
            >
              <ArrowIcon className="h-3.5 w-3.5 rotate-180" />
              Volver a Connexo
            </Link>

            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-heading text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                TRABAJA CON NOSOTROS
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base text-white/60 sm:text-lg">
                Dos formas de sumarte a Connexo: llevando el producto a la calle como
                vendedor o distribuidor, o poniendo tu talento al servicio de la causa
                como voluntario/a. Elige tu camino.
              </p>
            </div>

            {/* Conmutador de pestañas — píldora que se desliza (layoutId). */}
            <div className="mx-auto mt-10 flex max-w-md rounded-full border border-white/10 bg-black/40 p-1 backdrop-blur-sm">
              {TABS.map((t) => {
                const active = tab === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    aria-pressed={active}
                    className="relative flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors"
                  >
                    {active && (
                      <motion.span
                        layoutId="trabaja-tab-pill"
                        className="absolute inset-0 rounded-full bg-connexo"
                        transition={
                          reduced
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 420, damping: 34 }
                        }
                      />
                    )}
                    <span
                      className={`relative z-10 flex items-center gap-2 ${
                        active ? 'text-black' : 'text-white/60'
                      }`}
                    >
                      <t.Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{t.label}</span>
                      <span className="sm:hidden">{t.short}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contenido de la pestaña activa.
            NO se usa `AnimatePresence mode="wait"` aquí: cada formulario tiene su
            PROPIO AnimatePresence anidado (pasos, campos condicionales), y al
            exigir el "wait" del contenedor esos exits anidados podían colgar la
            salida y dejar la pestaña anterior montada. En su lugar, `key={tab}`
            remonta el contenido y la animación de entrada da el cruce, sin exit
            que esperar. */}
        <section className="relative bg-abyss-950 py-14 sm:py-20">
          <div className="section-pad">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-10 lg:grid-cols-[1fr_minmax(0,520px)] lg:gap-14"
            >
                {/* Izquierda: pitch */}
                <div>{tab === 'sellers' ? <SellerPitch /> : <VolunteerPitch />}</div>

                {/* Derecha: formulario */}
                <div className="lg:pt-1">
                  <div className="rounded-2xl border border-white/[0.08] bg-abyss-900/60 p-6 backdrop-blur-sm sm:p-8">
                    <div className="mb-6">
                      <h3 className="font-heading text-xl text-white">
                        {tab === 'sellers' ? 'Postúlate como vendedor' : 'Postúlate como voluntario/a'}
                      </h3>
                      <p className="mt-1 text-sm text-white/45">
                        Toma menos de un minuto. Te contactamos nosotros.
                      </p>
                    </div>
                    {tab === 'sellers' ? <SellerForm /> : <VolunteerForm />}
                  </div>
                </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Suspense fallback={<div className="min-h-[280px] bg-abyss-950" aria-hidden />}>
        <Footer />
      </Suspense>
    </div>
  )
}
