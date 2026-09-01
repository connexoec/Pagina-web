import { useEffect, useMemo, useState } from 'react'
import { INTERVIEW } from '../../data/careers'
import { getTakenSlots, isRemoteBooking } from '../../config/slots'

// ─────────────────────────────────────────────────────────────
//  Selector de cupo de entrevista. Genera días hábiles + horas de oficina,
//  marca los cupos ya ocupados como no disponibles y sube al padre el
//  `slotId` + su etiqueta legible. Solo `transform`/`opacity` para lo animado.
// ─────────────────────────────────────────────────────────────

export interface SlotChoice {
  slotId: string // "YYYY-MM-DD_HH"
  label: string // "martes 9 de sep · 10:00"
}

const pad = (n: number) => String(n).padStart(2, '0')
const dateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

const dayFmt = new Intl.DateTimeFormat('es-EC', { weekday: 'short', day: 'numeric', month: 'short' })
const longDayFmt = new Intl.DateTimeFormat('es-EC', { weekday: 'long', day: 'numeric', month: 'short' })

/** Próximos N días hábiles (salta sábado y domingo), a partir de hoy. */
function businessDays(count: number): Date[] {
  const out: Date[] = []
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  while (out.length < count) {
    const wd = d.getDay()
    if (wd !== 0 && wd !== 6) out.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return out
}

export default function InterviewScheduler({
  value,
  onChange,
  reloadSignal = 0,
}: {
  value: SlotChoice | null
  onChange: (choice: SlotChoice) => void
  /** Cambia este número para forzar recarga de cupos ocupados (tras un conflicto). */
  reloadSignal?: number
}) {
  const days = useMemo(() => businessDays(INTERVIEW.businessDaysAhead), [])
  const [activeDay, setActiveDay] = useState<string>(() => (days[0] ? dateKey(days[0]) : ''))
  const [taken, setTaken] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    setLoading(true)
    getTakenSlots().then((s) => {
      if (alive) {
        setTaken(s)
        setLoading(false)
      }
    })
    return () => {
      alive = false
    }
  }, [reloadSignal])

  const now = new Date()
  const activeDate = days.find((d) => dateKey(d) === activeDay) ?? days[0]

  return (
    <div>
      {/* Selector de día — tira horizontal desplazable */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
        {days.map((d) => {
          const key = dateKey(d)
          const isActive = key === activeDay
          const parts = dayFmt.formatToParts(d)
          const wd = parts.find((p) => p.type === 'weekday')?.value ?? ''
          const day = parts.find((p) => p.type === 'day')?.value ?? ''
          const mon = parts.find((p) => p.type === 'month')?.value ?? ''
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveDay(key)}
              aria-pressed={isActive}
              className={`flex shrink-0 flex-col items-center rounded-xl border px-3.5 py-2.5 transition-all active:scale-[0.97] ${
                isActive
                  ? 'border-connexo bg-connexo text-black'
                  : 'border-white/10 text-white/60 hover:border-white/25 hover:text-white'
              }`}
            >
              <span className="text-[10px] font-medium uppercase tracking-wide opacity-70">
                {wd}
              </span>
              <span className="font-heading text-lg leading-none">{day}</span>
              <span className="text-[10px] uppercase tracking-wide opacity-70">{mon}</span>
            </button>
          )
        })}
      </div>

      {/* Selector de hora */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {INTERVIEW.hours.map((h) => {
          const slotId = `${activeDay}_${pad(h)}`
          const isTaken = taken.has(slotId)
          // Si el día activo es hoy y la hora ya pasó, no se puede agendar.
          const isPast =
            activeDate &&
            dateKey(activeDate) === dateKey(now) &&
            h <= now.getHours()
          const disabled = isTaken || isPast || loading
          const isSelected = value?.slotId === slotId
          return (
            <button
              key={h}
              type="button"
              disabled={disabled}
              onClick={() => {
                const label = `${longDayFmt.format(activeDate)} · ${pad(h)}:00`
                onChange({ slotId, label })
              }}
              aria-pressed={isSelected}
              className={`rounded-lg border py-2.5 text-sm font-medium transition-all active:scale-[0.97] ${
                isSelected
                  ? 'border-connexo bg-connexo text-black'
                  : disabled
                    ? 'cursor-not-allowed border-white/[0.06] text-white/20 line-through'
                    : 'border-white/10 text-white/70 hover:border-connexo/50 hover:text-white'
              }`}
              title={isTaken ? 'Cupo ya reservado' : undefined}
            >
              {pad(h)}:00
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-xs text-white/35">
        {loading
          ? 'Cargando cupos disponibles…'
          : isRemoteBooking()
            ? 'Los cupos ocupados aparecen tachados. Al confirmar, tu horario queda reservado para ti.'
            : 'Modo demo: el bloqueo de cupos funciona solo en este dispositivo (falta configurar el servidor).'}
      </p>
    </div>
  )
}
