import { useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Field, TextInput, TextArea, ChipGroup, Honeypot } from './FormKit'
import { SubmitButton, SuccessCard, ErrorNotice, type FormStatus } from './FormFeedback'
import {
  volunteerA11yLevelOptions,
  volunteerAreas,
  volunteerDisabilityOptions,
  volunteerSupportOptions,
  yesNoOptions,
} from '../../data/careers'
import { sendToDiscord, type DiscordField } from '../../config/discord'
import { wa, waMsg } from '../../config/site'

// ─────────────────────────────────────────────────────────────
//  Postulación · Voluntariado. Fiel al Google Form "Formulario de Voluntariado
//  – CONNEXO": perfil, disponibilidad y necesidades de accesibilidad. Envía a
//  Discord (#voluntarios) con respaldo a WhatsApp.
// ─────────────────────────────────────────────────────────────

const one = (arr: string[]) => arr[0]
const labelOf = (opts: readonly { value: string; label: string }[], v?: string) =>
  opts.find((o) => o.value === v)?.label ?? ''

/** Rótulo de sección dentro del formulario. */
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-connexo">{children}</span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  )
}

export default function VolunteerForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [place, setPlace] = useState('') // país y ciudad
  const [age, setAge] = useState('')
  const [availability, setAvailability] = useState('')
  const [area, setArea] = useState<string[]>([])
  const [contribution, setContribution] = useState('')

  const [disability, setDisability] = useState<string[]>([])
  const [disabilityType, setDisabilityType] = useState('')
  const [support, setSupport] = useState<string[]>([])
  const [a11yLevel, setA11yLevel] = useState<string[]>([])
  const [interest, setInterest] = useState<string[]>([])

  const [motivation, setMotivation] = useState('')
  const [commitment, setCommitment] = useState<string[]>([])
  const [principles, setPrinciples] = useState<string[]>([])
  const [portfolio, setPortfolio] = useState('')
  const [anythingElse, setAnythingElse] = useState('')

  const [hp, setHp] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (name.trim().length < 2) e.name = 'Ingresa tus nombres y apellidos.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Ingresa un correo válido.'
    if (whatsapp.replace(/\D/g, '').length < 7) e.whatsapp = 'Ingresa un número de contacto.'
    if (place.trim().length < 2) e.place = 'Indica tu país y ciudad.'
    if (!age.trim()) e.age = 'Indica tu edad.'
    if (availability.trim().length < 2) e.availability = 'Cuéntanos tu disponibilidad.'
    if (!area.length) e.area = 'Elige un área.'
    if (contribution.trim().length < 5) e.contribution = 'Cuéntanos qué puedes aportar.'
    if (!disability.length) e.disability = 'Selecciona una opción.'
    if (!a11yLevel.length) e.a11yLevel = 'Selecciona tu nivel.'
    if (!interest.length) e.interest = 'Selecciona una opción.'
    if (motivation.trim().length < 10) e.motivation = 'Cuéntanos un poco más.'
    if (!commitment.length) e.commitment = 'Selecciona una opción.'
    if (!principles.length) e.principles = 'Selecciona una opción.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const fallbackHref = () => {
    const lines = [
      waMsg.volunteer,
      '',
      name && `Nombre: ${name}`,
      email && `Correo: ${email}`,
      whatsapp && `WhatsApp: ${whatsapp}`,
      place && `País y ciudad: ${place}`,
      area.length && `Área: ${labelOf(volunteerAreas, one(area))}`,
    ].filter(Boolean)
    return wa(lines.join('\n'))
  }

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    if (hp) return
    if (!validate()) {
      // Llevar el foco al primer error sería ideal; al menos no enviamos.
      return
    }

    setStatus('sending')
    const fields: DiscordField[] = [
      { name: 'Nombres y apellidos', value: name.trim(), inline: true },
      { name: 'Correo', value: email.trim(), inline: true },
      { name: 'WhatsApp', value: whatsapp.trim(), inline: true },
      { name: 'País y ciudad', value: place.trim(), inline: true },
      { name: 'Edad', value: age.trim(), inline: true },
      { name: 'Área', value: labelOf(volunteerAreas, one(area)), inline: true },
      { name: 'Disponibilidad semanal', value: availability.trim() },
      { name: '¿Qué puede aportar?', value: contribution.trim() },
      {
        name: '¿Discapacidad o condición a considerar?',
        value:
          labelOf(volunteerDisabilityOptions, one(disability)) +
          (one(disability) === 'si' && disabilityType.trim() ? ` — ${disabilityType.trim()}` : ''),
        inline: true,
      },
      { name: 'Apoyos / ajustes', value: labelOf(volunteerSupportOptions, one(support)), inline: true },
      { name: 'Nivel de accesibilidad digital', value: labelOf(volunteerA11yLevelOptions, one(a11yLevel)), inline: true },
      { name: '¿Aplicar criterios de accesibilidad?', value: labelOf(yesNoOptions, one(interest)), inline: true },
      { name: '¿Por qué ser voluntario/a?', value: motivation.trim() },
      { name: '¿Compromiso con tareas y tiempos?', value: labelOf(yesNoOptions, one(commitment)), inline: true },
      { name: '¿Acepta principios de inclusión/DDHH?', value: labelOf(yesNoOptions, one(principles)), inline: true },
      { name: 'Portafolio / redes', value: portfolio.trim() },
      { name: '¿Algo más?', value: anythingElse.trim() },
    ]
    const ok = await sendToDiscord('volunteers', {
      title: '💛 Nueva postulación · Voluntariado',
      description: 'Formulario de Voluntariado – CONNEXO (connexoapp.com/trabaja)',
      fields,
    })
    setStatus(ok ? 'success' : 'error')
  }

  const reset = () => {
    setName('')
    setEmail('')
    setWhatsapp('')
    setPlace('')
    setAge('')
    setAvailability('')
    setArea([])
    setContribution('')
    setDisability([])
    setDisabilityType('')
    setSupport([])
    setA11yLevel([])
    setInterest([])
    setMotivation('')
    setCommitment([])
    setPrinciples([])
    setPortfolio('')
    setAnythingElse('')
    setErrors({})
    setStatus('idle')
  }

  if (status === 'success') {
    return (
      <SuccessCard
        title="¡Gracias por querer sumarte!"
        body="Tu postulación al voluntariado de Connexo llegó a nuestro equipo. Te contactamos pronto para contarte los próximos pasos."
        onReset={reset}
      />
    )
  }

  const showDisabilityType = one(disability) === 'si'

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-5">
      <Honeypot value={hp} onChange={setHp} />

      <p className="rounded-xl border border-white/[0.08] bg-black/30 p-4 text-sm text-white/55">
        CONNEXO trabaja en el cruce entre tecnología, comunicación y accesibilidad
        digital. Este formulario busca conocer tu perfil, disponibilidad y necesidades
        de accesibilidad. Responde con honestidad: no hay respuestas correctas o
        incorrectas.
      </p>

      <Field label="Nombres y apellidos" htmlFor="v-name" required error={errors.name}>
        <TextInput
          id="v-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre completo"
          autoComplete="name"
          invalid={!!errors.name}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Correo electrónico" htmlFor="v-email" required error={errors.email}>
          <TextInput
            id="v-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            autoComplete="email"
            invalid={!!errors.email}
          />
        </Field>
        <Field label="WhatsApp" htmlFor="v-wa" required error={errors.whatsapp}>
          <TextInput
            id="v-wa"
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="09xx xxx xxx"
            autoComplete="tel"
            invalid={!!errors.whatsapp}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="País y ciudad" htmlFor="v-place" required error={errors.place}>
          <TextInput
            id="v-place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="Ecuador, Quito"
            invalid={!!errors.place}
          />
        </Field>
        <Field label="Edad" htmlFor="v-age" required error={errors.age}>
          <TextInput
            id="v-age"
            type="number"
            inputMode="numeric"
            min={14}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Tu edad"
            invalid={!!errors.age}
          />
        </Field>
      </div>

      <Field
        label="Disponibilidad semanal"
        htmlFor="v-avail"
        required
        hint="Días y horas"
        error={errors.availability}
      >
        <TextArea
          id="v-avail"
          rows={2}
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          placeholder="Ej.: lunes a viernes por la tarde, ~6 horas por semana"
          invalid={!!errors.availability}
        />
      </Field>

      <Field label="Área en la que deseas colaborar" htmlFor="v-area" required hint="Elige una" error={errors.area}>
        <ChipGroup ariaLabel="Área para colaborar" options={volunteerAreas} selected={area} onSelect={setArea} />
      </Field>

      <Field label="¿Qué puedes aportar concretamente a Connexo?" htmlFor="v-contrib" required error={errors.contribution}>
        <TextArea
          id="v-contrib"
          rows={3}
          value={contribution}
          onChange={(e) => setContribution(e.target.value)}
          placeholder="Habilidades, herramientas, experiencia…"
          invalid={!!errors.contribution}
        />
      </Field>

      <SectionLabel>Accesibilidad</SectionLabel>

      <Field
        label="¿Tienes alguna discapacidad o condición que debamos considerar para garantizar accesibilidad?"
        htmlFor="v-dis"
        required
        error={errors.disability}
      >
        <ChipGroup
          ariaLabel="Discapacidad o condición"
          options={volunteerDisabilityOptions}
          selected={disability}
          onSelect={setDisability}
        />
      </Field>

      <AnimatePresence>
        {showDisabilityType && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Field label="¿Qué tipo de discapacidad tienes?" htmlFor="v-distype" hint="Opcional">
              <TextInput
                id="v-distype"
                value={disabilityType}
                onChange={(e) => setDisabilityType(e.target.value)}
                placeholder="Cuéntanos lo que quieras compartir"
              />
            </Field>
          </motion.div>
        )}
      </AnimatePresence>

      <Field label="¿Qué apoyos o ajustes razonables podrías necesitar?" htmlFor="v-support" hint="Opcional">
        <ChipGroup
          ariaLabel="Apoyos o ajustes razonables"
          options={volunteerSupportOptions}
          selected={support}
          onSelect={setSupport}
        />
      </Field>

      <Field label="Nivel de conocimiento en accesibilidad digital" htmlFor="v-a11y" required error={errors.a11yLevel}>
        <ChipGroup
          ariaLabel="Nivel de accesibilidad digital"
          options={volunteerA11yLevelOptions}
          selected={a11yLevel}
          onSelect={setA11yLevel}
        />
      </Field>

      <Field
        label="¿Te interesa aplicar criterios de accesibilidad en los productos de Connexo?"
        htmlFor="v-interest"
        required
        error={errors.interest}
      >
        <ChipGroup ariaLabel="Interés en accesibilidad" options={yesNoOptions} selected={interest} onSelect={setInterest} />
      </Field>

      <SectionLabel>Compromiso</SectionLabel>

      <Field label="¿Por qué quieres ser voluntario/a en Connexo?" htmlFor="v-mot" required error={errors.motivation}>
        <TextArea
          id="v-mot"
          rows={3}
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          placeholder="Qué te mueve, qué esperas de la experiencia…"
          invalid={!!errors.motivation}
        />
      </Field>

      <Field label="¿Puedes comprometerte a cumplir tareas y tiempos acordados?" htmlFor="v-commit" required error={errors.commitment}>
        <ChipGroup ariaLabel="Compromiso con tareas y tiempos" options={yesNoOptions} selected={commitment} onSelect={setCommitment} />
      </Field>

      <Field
        label="¿Aceptas trabajar bajo principios de inclusión, respeto y derechos humanos?"
        htmlFor="v-princ"
        required
        error={errors.principles}
      >
        <ChipGroup ariaLabel="Principios de inclusión y DDHH" options={yesNoOptions} selected={principles} onSelect={setPrinciples} />
      </Field>

      <Field label="Portafolio / LinkedIn / GitHub / Redes" htmlFor="v-port" hint="Si aplica">
        <TextInput
          id="v-port"
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
          placeholder="Enlace o usuario"
        />
      </Field>

      <Field label="¿Algo más que debamos saber?" htmlFor="v-more" hint="Opcional">
        <TextArea
          id="v-more"
          rows={2}
          value={anythingElse}
          onChange={(e) => setAnythingElse(e.target.value)}
          placeholder="Lo que quieras contarnos"
        />
      </Field>

      <AnimatePresence>{status === 'error' && <ErrorNotice waHref={fallbackHref()} />}</AnimatePresence>

      <SubmitButton status={status} label="ENVIAR POSTULACIÓN" />

      <p className="text-center text-xs text-white/35">
        La información se usa únicamente para contacto y organización interna del
        voluntariado.
      </p>
    </form>
  )
}
