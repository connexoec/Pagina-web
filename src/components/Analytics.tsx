import { motion } from 'framer-motion'
import { ChartIcon, GridIcon, DownloadIcon } from './icons'
import SectionKicker from './SectionKicker'
import { Counter } from './fx/Motion'

// Fuente: manual cap. 15. Mapa de calor real: 7 días × franjas de 2 horas,
// calculado con la hora local del negocio.
const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const SLOTS = 12

/** Patrón fijo y determinista — no es dato real, es la forma de un negocio. */
function intensity(day: number, slot: number) {
  const hour = slot * 2
  // Dos picos: almuerzo y noche. Fin de semana pesa más.
  const lunch = Math.max(0, 1 - Math.abs(hour - 13) / 4)
  const night = Math.max(0, 1 - Math.abs(hour - 20) / 5)
  const weekend = day >= 4 ? 1.25 : 0.85
  const jitter = ((day * 7 + slot * 13) % 5) / 18
  return Math.min(1, (lunch * 0.75 + night) * weekend * 0.7 + jitter)
}

const METRICS = [
  { to: 1284, suffix: '', label: 'Visitas al perfil' },
  { to: 417, suffix: '', label: 'Clics en tus enlaces' },
  { to: 32, suffix: '%', label: 'Conversión' },
]

export default function Analytics() {
  return (
    <section id="analiticas" className="relative bg-abyss-950 py-20 sm:py-28">
      <div className="section-pad">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4">
            <SectionKicker label="deja de adivinar" />
          </div>
          <h2 className="font-heading text-3xl text-white sm:text-4xl">
            Sabes a qué hora entra la gente. Y a qué hora deberías publicar.
          </h2>
          <p className="mt-4 text-white/55">
            Los números se registran solos. Tú no tienes que hacer nada, ni
            configurar nada.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          {/* Indicadores */}
          <div className="flex flex-col gap-4">
            {METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-70px' }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-abyss-800 px-6 py-5"
              >
                <div>
                  <Counter
                    to={m.to}
                    suffix={m.suffix}
                    className="font-heading text-4xl text-white"
                  />
                  <div className="mt-1 text-sm text-white/45">{m.label}</div>
                </div>
                <ChartIcon className="h-6 w-6 text-connexo/60" />
              </motion.div>
            ))}

            <div className="rounded-2xl border border-connexo/20 bg-connexo/[0.06] px-6 py-5 text-sm leading-relaxed text-white/70">
              Dos cosas que casi nadie te dice: un mismo visitante cuenta una sola
              vez cada media hora, y <span className="text-connexo">tú no te cuentas a ti mismo</span>.
              Revisa tu perfil las veces que quieras.
            </div>
          </div>

          {/* Mapa de calor */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/[0.06] bg-abyss-800 p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold text-white">
                <GridIcon className="h-4 w-4 text-connexo" />
                Mapa de calor
              </span>
              <span className="rounded-full border border-connexo/30 bg-connexo/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-connexo">
                Ultra
              </span>
            </div>

            <div className="flex gap-2">
              {/* Etiquetas de día */}
              <div className="flex flex-col justify-around pr-1 text-[11px] text-white/35">
                {DAYS.map((d, i) => (
                  <span key={i}>{d}</span>
                ))}
              </div>

              <div className="grid flex-1 gap-[3px]" style={{ gridTemplateColumns: `repeat(${SLOTS}, minmax(0,1fr))` }}>
                {DAYS.map((_, day) =>
                  Array.from({ length: SLOTS }, (_, slot) => {
                    const v = intensity(day, slot)
                    return (
                      <motion.div
                        key={`${day}-${slot}`}
                        initial={{ opacity: 0, scale: 0.6 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.32,
                          delay: (day * SLOTS + slot) * 0.007,
                          ease: 'easeOut',
                        }}
                        className="aspect-square rounded-[3px]"
                        style={{
                          backgroundColor:
                            v < 0.12
                              ? 'rgba(255,255,255,0.045)'
                              : `rgba(255,102,0,${0.14 + v * 0.8})`,
                        }}
                      />
                    )
                  }),
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-white/30">
              <span>00h</span>
              <span>12h</span>
              <span>24h</span>
            </div>

            {/* Conclusiones automáticas */}
            <div className="mt-6 space-y-2 border-t border-white/[0.06] pt-5 text-sm">
              <p className="text-white/65">
                Tu día más activo es el <span className="font-semibold text-connexo">sábado</span>.
              </p>
              <p className="text-white/65">
                Tu franja pico va de <span className="font-semibold text-connexo">19h a 21h</span>.
              </p>
              <p className="text-white/65">
                Publica alrededor de las{' '}
                <span className="font-semibold text-connexo">18h</span>: justo antes
                de que llegue tu gente.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-abyss-800 px-4 py-2 text-sm text-white/60">
            <DownloadIcon className="h-4 w-4 text-connexo" />
            Tus citas y tu catálogo bajan a Excel cuando quieras
          </span>
          <p className="text-xs text-white/35">
            Y si todavía no hay actividad suficiente, la app te lo dice. No te
            inventa números para llenar la pantalla.
          </p>
        </div>
      </div>
    </section>
  )
}
