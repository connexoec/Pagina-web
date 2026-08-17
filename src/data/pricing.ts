// ─────────────────────────────────────────────────────────────
//  PLANES  ·  Fuente: Manual de Capacitación v0.52.1, cap. 2.
//  Los planes son ACUMULATIVOS: PRO incluye todo CONECTA, ULTRA todo PRO.
//
//  CONECTA no publica precio: es la puerta de entrada en modo prueba gratuita,
//  y esa prueba se puede correr con las funciones de PRO o de ULTRA.
//  No existe auto-registro: la cuenta la crea Connexo (manual, cap. 5.1),
//  así que todos los CTA llevan a WhatsApp o al perfil de la tienda.
// ─────────────────────────────────────────────────────────────
export interface Plan {
  id: string
  name: string
  /** Precio mensual en USD. `null` = sin precio publicado (prueba gratuita). */
  monthly: number | null
  /** Precio anual en USD (cobro único al año). */
  yearly: number | null
  tagline: string
  features: string[]
  /** Plan destacado con glow naranja. */
  featured?: boolean
  ctaLabel: string
  /** Nota al pie de la tarjeta, para matizar sin ensuciar la lista. */
  note?: string
}

export const plans: Plan[] = [
  {
    id: 'conecta',
    name: 'CONECTA',
    monthly: null,
    yearly: null,
    tagline: 'Pruébalo antes de pagar nada.',
    features: [
      'Perfil público completo: foto, portada, bio y ubicación',
      'Enlaces personalizados ilimitados',
      'Redes sociales y horarios de atención',
      'Código QR y tarjeta de contacto (vCard)',
      'Analíticas de visitas, clics y conversión',
      'App instalable en el teléfono, sin tienda de apps',
    ],
    ctaLabel: 'EMPEZAR PRUEBA',
    note: 'La prueba se puede correr con las funciones de PRO o de ULTRA. Tú eliges cuál quieres ver funcionando.',
  },
  {
    id: 'pro',
    name: 'PRO',
    monthly: 9,
    yearly: 97,
    tagline: 'Para el negocio que ya vende o agenda.',
    featured: true,
    features: [
      'Todo lo de CONECTA',
      'Catálogo de productos o servicios (hasta 25)',
      'Galería y álbumes de fotos',
      'Reseñas de clientes con aprobación previa',
      'Base de clientes y club de fidelidad con códigos',
      'Captura de contactos desde el perfil',
      'Editor de preguntas frecuentes',
    ],
    ctaLabel: 'QUIERO PRO',
    note: 'Las citas dependen del rubro: en E-commerce entran desde PRO; en barbería, gastronomía, petcare y salud son de ULTRA.',
  },
  {
    id: 'ultra',
    name: 'ULTRA',
    monthly: 17,
    yearly: 179,
    tagline: 'Para operar el negocio entero dentro de la app.',
    features: [
      'Todo lo de PRO',
      'Catálogo sin tope + importación masiva desde Excel',
      'Reservas y citas con equipo y horarios propios',
      'Inventario con recetas y agotado automático',
      'Chat con visitantes y archivos descargables',
      'Mapa de calor de actividad por día y hora',
      'Videos destacados y preguntas publicadas',
    ],
    ctaLabel: 'QUIERO ULTRA',
  },
]

// ─────────────────────────────────────────────────────────────
//  COMPARADOR  ·  Tabla del manual (cap. 2.1), sin maquillaje.
//  'partial' existe porque el manual lo dice así: en reservas, depende
//  de la plantilla. Decirlo aquí evita el reclamo después de vender.
// ─────────────────────────────────────────────────────────────
export type Availability = true | false | 'partial'

export interface FeatureRow {
  label: string
  conecta: Availability
  pro: Availability
  ultra: Availability
}

export interface FeatureGroup {
  group: string
  rows: FeatureRow[]
}

export const comparison: FeatureGroup[] = [
  {
    group: 'Tu presencia',
    rows: [
      { label: 'Perfil público completo', conecta: true, pro: true, ultra: true },
      { label: 'Enlaces personalizados ilimitados', conecta: true, pro: true, ultra: true },
      { label: 'Redes sociales', conecta: true, pro: true, ultra: true },
      { label: 'Código QR y vCard', conecta: true, pro: true, ultra: true },
      { label: 'Horarios de atención', conecta: true, pro: true, ultra: true },
      { label: 'Galería y álbumes de fotos', conecta: false, pro: true, ultra: true },
      { label: 'Videos destacados (hasta 2)', conecta: false, pro: false, ultra: true },
      { label: 'Archivos digitales descargables', conecta: false, pro: false, ultra: true },
    ],
  },
  {
    group: 'Vender y agendar',
    rows: [
      { label: 'Catálogo de productos o servicios', conecta: false, pro: true, ultra: true },
      { label: 'Catálogo sin tope de 25 artículos', conecta: false, pro: false, ultra: true },
      { label: 'Importación masiva desde Excel o CSV', conecta: false, pro: false, ultra: true },
      { label: 'Reservas y citas con equipo', conecta: false, pro: 'partial', ultra: true },
      { label: 'Inventario con recetas y agotado automático', conecta: false, pro: false, ultra: true },
      { label: 'Enlace de agenda externa', conecta: false, pro: true, ultra: true },
    ],
  },
  {
    group: 'Clientes y confianza',
    rows: [
      { label: 'Base de clientes / club / CRM', conecta: false, pro: true, ultra: true },
      { label: 'Reseñas con aprobación previa', conecta: false, pro: true, ultra: true },
      { label: 'Chat con visitantes', conecta: false, pro: false, ultra: true },
      { label: 'Preguntas frecuentes (editor)', conecta: false, pro: true, ultra: true },
      { label: 'Preguntas frecuentes (publicadas)', conecta: false, pro: false, ultra: true },
    ],
  },
  {
    group: 'Saber qué pasa',
    rows: [
      { label: 'Analíticas de visitas, clics y conversión', conecta: true, pro: true, ultra: true },
      { label: 'Mapa de calor de actividad', conecta: false, pro: false, ultra: true },
    ],
  },
]
