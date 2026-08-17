// ─────────────────────────────────────────────────────────────
//  DATOS OFICIALES DE CONNEXO  ·  única fuente de verdad de contacto.
//  No hardcodear números, correos ni URLs en los componentes: importar de aquí.
// ─────────────────────────────────────────────────────────────

/** Número de WhatsApp de ventas, en formato internacional sin signos. */
const WHATSAPP_E164 = '593994307367'

export const site = {
  /** Cómo se muestra el número al humano. */
  phoneDisplay: '+593 99 430 7367',
  email: 'connexoec@gmail.com',

  /** Perfil E-commerce de la propia Connexo: es donde se contratan los planes. */
  store: 'https://www.connexoapp.com/connexo',
  /** Raíz de la aplicación (panel del cliente). */
  app: 'https://www.connexoapp.com',

  arupo: 'https://www.fundacionarupo.org/',
} as const

/**
 * Enlace de WhatsApp con el mensaje ya escrito.
 * No existe auto-registro: toda cuenta la crea Connexo, así que el camino real
 * de conversión es esta conversación, no un formulario de signup.
 */
export function wa(message: string) {
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(message)}`
}

/** Mensajes reutilizables, para que el copy del WhatsApp también tenga voz. */
export const waMsg = {
  trial: 'Hola Connexo, quiero arrancar mi prueba gratis. ¿Me cuentan cómo?',
  plan: (name: string) =>
    `Hola Connexo, me interesa el plan ${name}. ¿Me cuentan cómo lo activo?`,
  ecosystem: (name: string) =>
    `Hola Connexo, quiero un perfil de ${name}. ¿Cómo empiezo?`,
  general: 'Hola Connexo, quiero información sobre los perfiles digitales.',
} as const
