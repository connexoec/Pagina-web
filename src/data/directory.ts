// ─────────────────────────────────────────────────────────────
//  RED CONNEXO · DIRECTORIO DE EMPRENDEDORES
//
//  El mapa público de los negocios que ya viven en Connexo. Cualquiera puede
//  entrar, buscar por rubro o ciudad, ver qué hace cada negocio y saltar a su
//  perfil real en connexoapp.com.
//
//  ⚠️ REGLA INNEGOCIABLE: aquí SOLO van negocios reales, con un perfil Connexo
//  publicado y verificable. Nunca inventar miembros para "llenar" la grilla:
//  un directorio con negocios falsos engaña al visitante y quema la marca.
//  Mientras haya pocos, la sección muestra espacios libres — la escasez juega
//  a favor, la mentira no.
//
//  CÓMO SUMAR UN NEGOCIO
//  1. Confirmar que su perfil abre en connexoapp.com/<usuario>.
//  2. Añadir su objeto aquí abajo.
//  3. (Opcional) Subir su foto a `public/red/<id>.jpg` y apuntarla en `image`.
//     Sin foto no pasa nada: la tarjeta dibuja su identidad sola.
// ─────────────────────────────────────────────────────────────

export interface Member {
  id: string
  /** Nombre comercial, tal como el negocio quiere que lo lean. */
  name: string
  /** id de la plantilla en `data/ecosystems.ts`. Alimenta los filtros. */
  ecosystem: string
  /** Ciudad y provincia. Alimenta el filtro geográfico. */
  city: string
  /** Qué hace, en una línea concreta. Nada de adjetivos vacíos. */
  what: string
  /** URL pública del perfil Connexo. Debe abrir de verdad. */
  profile: string
  /** Foto o portada en `public/red/`. Opcional. */
  image?: string
  /** Perfil revisado por Connexo. */
  verified?: boolean
}

export const members: Member[] = [
  {
    id: 'connexo',
    name: 'Connexo',
    ecosystem: 'ecommerce',
    city: 'Quito, Pichincha',
    what: 'Perfiles digitales NFC y tarjetas para negocios. El primer perfil de la red es el nuestro.',
    profile: 'https://www.connexoapp.com/connexo',
    verified: true,
  },
]

/** Espacios libres que se dibujan después de los miembros reales. */
export const OPEN_SLOTS = 5

/** Ciudades presentes, deducidas de los miembros (no una lista inventada). */
export function cities(list: Member[] = members) {
  return Array.from(new Set(list.map((m) => m.city))).sort()
}
