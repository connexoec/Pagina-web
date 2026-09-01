// ─────────────────────────────────────────────────────────────
//  ENVÍO DE POSTULACIONES  ·  webhooks de Discord.
//
//  Los formularios de "Trabaja con nosotros" (/trabaja) no tienen backend:
//  hacen un POST directo al webhook del canal de Discord de Connexo y la
//  postulación cae como un mensaje con embed (título, color de marca y campos).
//
//  ⚠️ Las URLs de webhook NO se hardcodean: se leen de variables de entorno
//  (`VITE_DISCORD_WEBHOOK_SELLERS` / `VITE_DISCORD_WEBHOOK_VOLUNTEERS`).
//  · En local van en un archivo `.env` (ignorado por git, ver `.env.example`).
//  · En producción van en Vercel → Environment Variables → Redeploy.
//  Son "secretas" a medias: Vite las inyecta en el bundle del cliente, así que
//  cualquiera con el bundle podría verlas. El riesgo es acotado (solo permiten
//  ESCRIBIR en ese canal); si alguien lo abusa, se regenera el webhook en
//  Discord y se actualiza la env var. No poner tokens de bot ni nada más aquí.
//
//  Si el webhook no está configurado o el POST falla, el formulario NO pierde
//  el lead: cae con gracia a un enlace de WhatsApp ya prellenado (ver `site.ts`).
// ─────────────────────────────────────────────────────────────

const WEBHOOKS = {
  sellers: import.meta.env.VITE_DISCORD_WEBHOOK_SELLERS as string | undefined,
  volunteers: import.meta.env.VITE_DISCORD_WEBHOOK_VOLUNTEERS as string | undefined,
} as const

export type WebhookChannel = keyof typeof WEBHOOKS

/** Naranja de marca (#ff6600) en el entero que Discord espera para el embed. */
const BRAND_COLOR = 0xff6600

/** Un campo del embed: etiqueta + valor. Los vacíos se descartan al armar. */
export interface DiscordField {
  name: string
  value: string
  inline?: boolean
}

export interface DiscordPayload {
  /** Encabezado del embed (p. ej. "Nueva postulación · Vendedor"). */
  title: string
  /** Línea de contexto bajo el título. */
  description?: string
  fields: DiscordField[]
}

export function isWebhookConfigured(channel: WebhookChannel): boolean {
  const url = WEBHOOKS[channel]
  return typeof url === 'string' && url.startsWith('https://')
}

/**
 * Envía la postulación al canal de Discord. Devuelve `true` si Discord la
 * aceptó (2xx). Nunca lanza: cualquier fallo (sin webhook, red caída, CORS,
 * rate-limit) devuelve `false` para que el llamador active el respaldo.
 *
 * Se usa `application/json` con un embed; Discord responde con las cabeceras
 * CORS correctas al POST desde el navegador.
 */
export async function sendToDiscord(
  channel: WebhookChannel,
  payload: DiscordPayload,
): Promise<boolean> {
  const url = WEBHOOKS[channel]
  if (!url || !url.startsWith('https://')) return false

  // Discord corta los campos largos: name ≤ 256, value ≤ 1024. Recortamos por
  // las dudas para que un mensaje kilométrico no haga rebotar el POST entero.
  const fields = payload.fields
    .filter((f) => f.value && f.value.trim() !== '')
    .slice(0, 25)
    .map((f) => ({
      name: f.name.slice(0, 256),
      value: f.value.slice(0, 1024),
      inline: f.inline ?? false,
    }))

  const body = {
    // El nombre y avatar del webhook los define Discord; no forzamos username
    // para que el server mande. Todo el contenido va en el embed.
    embeds: [
      {
        title: payload.title.slice(0, 256),
        description: payload.description?.slice(0, 4096),
        color: BRAND_COLOR,
        fields,
        footer: { text: 'connexoapp.com · Trabaja con nosotros' },
        timestamp: new Date().toISOString(),
      },
    ],
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.ok
  } catch {
    return false
  }
}
