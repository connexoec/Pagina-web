import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Field, TextInput, TextArea, ChipGroup, Honeypot } from './FormKit'
import { SubmitButton, ErrorNotice, type FormStatus } from './FormFeedback'
import InterviewScheduler, { type SlotChoice } from './InterviewScheduler'
import { sellerExperienceOptions, sellerStartOptions } from '../../data/careers'
import { sendToDiscord, type DiscordField } from '../../config/discord'
import { bookSlot, isRemoteBooking, makeInterviewCode } from '../../config/slots'
import { wa, waMsg } from '../../config/site'
import { ArrowIcon, CheckIcon } from '../icons'

// ─────────────────────────────────────────────────────────────
//  Postulación · Vendedor / Distribuidor (Connexo Sellers).
//  Dos pasos: (1) datos mínimos "para generar dudas"; (2) agendar la entrevista
//  y recibir un CÓDIGO. Al confirmar se RESERVA el cupo (nadie más lo agenda) y
//  se avisa al equipo por Discord, con respaldo a WhatsApp.
// ─────────────────────────────────────────────────────────────

const labelOf = (opts: readonly { value: string; label: string }[], v?: string) =>
  opts.find((o) => o.value === v)?.label ?? ''

export default function SellerForm() {
  const [step, setStep] = useState<1 | 2>(1)

  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [city, setCity] = useState('')
  const [experience, setExperience] = useState<string[]>([])
  const [start, setStart] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [hp, setHp] = useState('')

  const [slot, setSlot] = useState<SlotChoice | null>(null)
  const [reloadSignal, setReloadSignal] = useState(0)
  const [slotError, setSlotError] = useState('')

  const [status, setStatus] = useState<FormStatus>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [result, setResult] = useState<{ code: string; label: string } | null>(null)

  const validateStep1 = () => {
    const e: Record<string, string> = {}
    if (name.trim().length < 2) e.name = 'Cuéntanos tu nombre.'
    if (whatsapp.replace(/\D/g, '').length < 7) e.whatsapp = 'Necesitamos un número para contactarte.'
    if (city.trim().length < 2) e.city = '¿Desde qué ciudad?'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /** WhatsApp de respaldo, con todo lo que llenó (incluida la cita si la eligió). */
  const fallbackHref = () => {
    const lines = [
      waMsg.seller,
      '',
      name && `Nombre: ${name}`,
      whatsapp && `WhatsApp: ${whatsapp}`,
      city && `Ciudad: ${city}`,
      start.length && `Empezar como: ${labelOf(sellerStartOptions, start[0])}`,
      experience.length && `Experiencia: ${labelOf(sellerExperienceOptions, experience[0])}`,
      slot && `Cita deseada: ${slot.label}`,
      message && `Mensaje: ${message}`,
    ].filter(Boolean)
    return wa(lines.join('\n'))
  }

  const goToSchedule = () => {
    if (validateStep1()) {
      setStep(2)
      setStatus('idle')
    }
  }

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    if (hp) return
    setSlotError('')
    if (!slot) {
      setSlotError('Elige un día y una hora para tu entrevista.')
      return
    }

    setStatus('sending')

    // 1) Reservar el cupo (bloqueo). Si otro lo tomó, pedir elegir otro.
    const code = makeInterviewCode()
    const booking = await bookSlot(slot.slotId, {
      code,
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      city: city.trim(),
    })

    if (!booking.ok) {
      if (booking.reason === 'taken') {
        setSlot(null)
        setReloadSignal((n) => n + 1)
        setSlotError('Ese cupo se acaba de ocupar. Elige otro horario, por favor.')
        setStatus('idle')
      } else {
        setStatus('error')
      }
      return
    }

    // 2) Avisar al equipo por Discord (best-effort).
    const fields: DiscordField[] = [
      { name: 'Código de entrevista', value: booking.code, inline: true },
      { name: 'Cita', value: slot.label, inline: true },
      { name: 'Nombre', value: name.trim(), inline: true },
      { name: 'WhatsApp', value: whatsapp.trim(), inline: true },
      { name: 'Ciudad', value: city.trim(), inline: true },
      { name: 'Quiere empezar como', value: labelOf(sellerStartOptions, start[0]), inline: true },
      { name: 'Experiencia', value: labelOf(sellerExperienceOptions, experience[0]), inline: true },
      { name: 'Mensaje', value: message.trim() },
    ]
    const discordOk = await sendToDiscord('sellers', {
      title: '🟠 Entrevista agendada · Vendedor / Distribuidor',
      description: `Cupo reservado · código **${booking.code}**`,
      fields,
    })

    // Con Supabase, la reserva ya quedó registrada (el equipo la ve en la tabla)
    // aunque falle Discord. En modo local, Discord es el único registro: si falla,
    // se ofrece el respaldo por WhatsApp.
    if (discordOk || isRemoteBooking()) {
      setResult({ code: booking.code, label: slot.label })
      setStatus('success')
    } else {
      setStatus('error')
    }
  }

  const reset = () => {
    setStep(1)
    setName('')
    setWhatsapp('')
    setCity('')
    setExperience([])
    setStart([])
    setMessage('')
    setSlot(null)
    setSlotError('')
    setErrors({})
    setResult(null)
    setStatus('idle')
  }

  // ── Éxito: código de entrevista ─────────────────────────────
  if (status === 'success' && result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-connexo/30 bg-abyss-800 p-8 text-center shadow-glow"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 16 }}
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-connexo/15"
        >
          <CheckIcon className="h-8 w-8 text-connexo" />
        </motion.div>
        <h3 className="font-heading text-2xl text-white">¡Entrevista agendada!</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm text-white/55">
          Guarda tu código de entrevista. Preséntalo el día de tu cita.
        </p>

        <div className="mx-auto mt-6 max-w-xs rounded-xl border border-connexo/40 bg-black/50 p-5">
          <p className="text-[11px] uppercase tracking-wider text-white/40">Tu código</p>
          <p className="font-heading text-3xl tracking-wider text-connexo">{result.code}</p>
          <div className="mt-4 border-t border-white/10 pt-3">
            <p className="text-[11px] uppercase tracking-wider text-white/40">Cita</p>
            <p className="mt-0.5 text-sm font-medium capitalize text-white">{result.label}</p>
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-sm text-xs text-white/40">
          Ese cupo ya quedó reservado a tu nombre: nadie más puede tomarlo. Te
          escribimos por WhatsApp para confirmar los detalles.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 text-sm font-semibold text-connexo hover:underline"
        >
          Agendar otra postulación
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-5">
      <Honeypot value={hp} onChange={setHp} />

      {/* Indicador de pasos */}
      <div className="flex items-center gap-2 text-xs text-white/40">
        <span className={step === 1 ? 'font-semibold text-connexo' : ''}>1 · Tus datos</span>
        <span className="h-px flex-1 bg-white/10" />
        <span className={step === 2 ? 'font-semibold text-connexo' : ''}>2 · Agenda</span>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nombre completo" htmlFor="s-name" required error={errors.name}>
                <TextInput
                  id="s-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  autoComplete="name"
                  invalid={!!errors.name}
                />
              </Field>
              <Field label="WhatsApp" htmlFor="s-wa" required error={errors.whatsapp}>
                <TextInput
                  id="s-wa"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="09xx xxx xxx"
                  autoComplete="tel"
                  invalid={!!errors.whatsapp}
                />
              </Field>
            </div>

            <Field label="Ciudad" htmlFor="s-city" required error={errors.city}>
              <TextInput
                id="s-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Quito, Guayaquil, Ambato…"
                invalid={!!errors.city}
              />
            </Field>

            <Field label="¿Cómo te gustaría empezar?" htmlFor="s-start" hint="Elige una">
              <ChipGroup
                ariaLabel="Cómo te gustaría empezar"
                options={sellerStartOptions}
                selected={start}
                onSelect={setStart}
              />
            </Field>

            <Field label="¿Tienes experiencia en ventas?" htmlFor="s-exp" hint="Elige una">
              <ChipGroup
                ariaLabel="Experiencia en ventas"
                options={sellerExperienceOptions}
                selected={experience}
                onSelect={setExperience}
              />
            </Field>

            <Field label="Algo que quieras contarnos" htmlFor="s-msg" hint="Opcional">
              <TextArea
                id="s-msg"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Por qué quieres vender Connexo, tu experiencia, tus horarios…"
              />
            </Field>

            <button type="button" onClick={goToSchedule} className="btn-cta group w-full py-3.5">
              CONTINUAR A LA AGENDA
              <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4 text-sm">
              <p className="text-white/50">
                <span className="text-white">{name || 'Tú'}</span>
                {city && ` · ${city}`}
              </p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-1 inline-flex items-center gap-1.5 text-xs text-connexo hover:underline"
              >
                <ArrowIcon className="h-3.5 w-3.5 rotate-180" />
                Editar mis datos
              </button>
            </div>

            <div>
              <h4 className="font-sans text-[15px] font-semibold text-white">
                Elige el día y la hora de tu entrevista
              </h4>
              <p className="mt-1 text-sm text-white/45">
                En horario de oficina. Al confirmar recibes tu código de entrevista.
              </p>
            </div>

            <InterviewScheduler value={slot} onChange={setSlot} reloadSignal={reloadSignal} />

            {slotError && (
              <p className="text-xs text-red-400" role="alert">
                {slotError}
              </p>
            )}

            {slot && (
              <div className="rounded-xl border border-connexo/30 bg-connexo/[0.06] p-3 text-sm text-white/80">
                Cita seleccionada: <span className="font-semibold capitalize text-connexo">{slot.label}</span>
              </div>
            )}

            <AnimatePresence>
              {status === 'error' && <ErrorNotice waHref={fallbackHref()} />}
            </AnimatePresence>

            <SubmitButton status={status} label="CONFIRMAR ENTREVISTA" />
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-xs text-white/35">
        Al enviar aceptas que Connexo te contacte por los datos que dejaste. Sin spam.
      </p>
    </form>
  )
}
