// ─────────────────────────────────────────────────────────────
//  CONTENIDO DE "TRABAJA CON NOSOTROS" (/trabaja)
//
//  Datos separados de la vista: aquí se editan textos y opciones de los dos
//  formularios (Vendedor/Distribuidor y Voluntariado), no en el JSX.
//
//  ⚠️ SSOT §0: NO publicar cifras internas del plan de comisiones/sueldos
//  (viven en el proyecto Connexo Sellers y en el manual confidencial). Aquí se
//  TEASEA la oportunidad para generar interés; el detalle se conversa en la
//  entrevista. "Solo lo necesario para generar dudas."
// ─────────────────────────────────────────────────────────────

export interface Perk {
  icon: 'bolt' | 'chart' | 'users' | 'stamp' | 'spark' | 'globe'
  title: string
  body: string
}

/** Por qué vender Connexo — ganchos, sin números concretos. */
export const sellerPerks: Perk[] = [
  {
    icon: 'chart',
    title: 'Ganas por cada plan',
    body: 'Comisión sobre cada plan que activas. Mientras más vendes, mejor tu porcentaje.',
  },
  {
    icon: 'bolt',
    title: 'Sueldo base por metas',
    body: 'Al cumplir tu meta del mes desbloqueas un sueldo base. La constancia paga.',
  },
  {
    icon: 'users',
    title: 'Arma tu propia red',
    body: 'Sube a distribuidor, forma tu equipo de vendedores y gana también por lo que vende tu red.',
  },
  {
    icon: 'stamp',
    title: 'Academia y certificación',
    body: 'Te formamos y certificas. No necesitas experiencia previa, necesitas ganas.',
  },
]

/** Cómo le gustaría empezar al candidato (selección única). */
export const sellerStartOptions = [
  { value: 'vendedor', label: 'Vendedor', hint: 'Vender planes y ganar comisión' },
  { value: 'distribuidor', label: 'Distribuidor', hint: 'Armar y liderar mi propia red' },
  { value: 'no-se', label: 'Aún no sé', hint: 'Cuéntenme y decido' },
] as const

/** Nivel de experiencia en ventas (selección única). */
export const sellerExperienceOptions = [
  { value: 'mucha', label: 'Tengo experiencia' },
  { value: 'algo', label: 'Algo de experiencia' },
  { value: 'ninguna', label: 'Ninguna, pero le meto ganas' },
] as const

// ── Agendamiento de entrevista (paso 2 del formulario de Sellers) ─────────────
// Horarios normales de trabajo. Se generan cupos por hora en días hábiles.
export const INTERVIEW = {
  /** Cuántos días hábiles hacia adelante ofrecer (salta fines de semana). */
  businessDaysAhead: 12,
  /** Horas de inicio de cada cupo (formato 24h). Salta el almuerzo (13:00). */
  hours: [9, 10, 11, 12, 14, 15, 16, 17],
  /** Prefijo del código de entrevista que recibe el candidato. */
  codePrefix: 'ENT',
} as const

// ── Voluntariado ──────────────────────────────────────────────
// Fiel al Google Form "Formulario de Voluntariado – CONNEXO" (19 preguntas).
// CONNEXO trabaja en el cruce de tecnología, comunicación y accesibilidad
// digital; el formulario recoge perfil, disponibilidad y necesidades de
// accesibilidad. El campo "Email" autogenerado de Google Forms se fusiona con
// "Correo electrónico" (uno solo).

/** Área en la que desea colaborar (selección única — "Mark only one oval"). */
export const volunteerAreas = [
  { value: 'comunicacion', label: 'Comunicación' },
  { value: 'audiovisual', label: 'Producción audiovisual' },
  { value: 'diseno', label: 'Diseño gráfico / UX UI' },
  { value: 'desarrollo', label: 'Programación / Desarrollo' },
  { value: 'marketing', label: 'Marketing digital' },
  { value: 'investigacion', label: 'Investigación y documentación' },
  { value: 'educacion', label: 'Educación / formación' },
  { value: 'otro', label: 'Otro' },
] as const

/** ¿Tiene alguna discapacidad o condición a considerar? (única) */
export const volunteerDisabilityOptions = [
  { value: 'no', label: 'No' },
  { value: 'si', label: 'Sí (especificar)' },
] as const

/** Apoyos o ajustes razonables que podría necesitar (única). */
export const volunteerSupportOptions = [
  { value: 'horario', label: 'Flexibilidad de horario' },
  { value: 'escrita', label: 'Comunicación escrita' },
  { value: 'subtitulos', label: 'Subtítulos / transcripciones' },
  { value: 'lectores', label: 'Material compatible con lectores de pantalla' },
  { value: 'ninguno', label: 'Ninguno' },
  { value: 'otro', label: 'Otro' },
] as const

/** Nivel de conocimiento en accesibilidad digital (única). */
export const volunteerA11yLevelOptions = [
  { value: 'ninguno', label: 'Ninguno' },
  { value: 'basico', label: 'Básico' },
  { value: 'intermedio', label: 'Intermedio' },
  { value: 'avanzado', label: 'Avanzado' },
] as const

/** Opciones Sí/No reutilizables para los compromisos. */
export const yesNoOptions = [
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
] as const
