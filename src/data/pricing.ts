// ─────────────────────────────────────────────────────────────
//  PLANES  ·  Precios fijos. Toggle Mensual / Anual cambia el valor
//  mostrado dinámicamente (ver componente Pricing).
// ─────────────────────────────────────────────────────────────
export interface Plan {
  id: string
  name: string
  /** Precio mensual en USD. */
  monthly: number
  /** Precio anual en USD (cobro único al año). */
  yearly: number
  tagline: string
  features: string[]
  /** Plan destacado con glow naranja. */
  featured?: boolean
  ctaLabel: string
}

export const plans: Plan[] = [
  {
    id: 'conecta',
    name: 'CONECTA',
    monthly: 0,
    yearly: 0,
    tagline: 'Empieza gratis, para siempre.',
    features: [
      'Perfil NFC digital básico',
      'URL dedicada Connexo',
      '1 ecosistema activo',
      'Botones de contacto directo',
      'Estadísticas de visitas básicas',
    ],
    ctaLabel: 'CREAR GRATIS',
  },
  {
    id: 'pro',
    name: 'PRO',
    monthly: 9,
    yearly: 97,
    tagline: 'Para quien vende en serio.',
    featured: true,
    features: [
      'Todo lo de CONECTA',
      'Captura de leads en tiempo real',
      'Reservas y agenda integrada',
      'Catálogo / menú digital',
      'Analítica avanzada de interacciones',
      'Perfil en la RED CONNEXO',
      'Dominio personalizado',
    ],
    ctaLabel: 'ELEGIR PRO',
  },
  {
    id: 'ultra',
    name: 'ULTRA',
    monthly: 17,
    yearly: 179,
    tagline: 'Todo el ecosistema, sin límites.',
    features: [
      'Todo lo de PRO',
      'IA de conversión y follow-up',
      'Multi-perfil / equipos ilimitados',
      'Integraciones (CRM, pagos, WhatsApp)',
      'Prioridad en directorio RED CONNEXO',
      'Soporte prioritario dedicado',
    ],
    ctaLabel: 'ELEGIR ULTRA',
  },
]
