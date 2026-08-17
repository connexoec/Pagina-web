// ─────────────────────────────────────────────────────────────
//  RED CONNEXO · DIRECTORIO DE EMPRENDEDORES
//
//  El mapa público de los negocios que ya viven en Connexo. Cualquiera entra,
//  busca por rubro o ciudad, ve qué hace cada negocio y salta a su perfil real
//  en connexoapp.com.
//
//  ⚠️ REGLA INNEGOCIABLE: aquí SOLO van negocios reales, con un perfil Connexo
//  publicado. Y solo se escriben datos CONFIRMADOS. `ecosystem`, `city` y
//  `what` son opcionales a propósito: es preferible una ficha con el nombre y
//  el enlace correctos que una ficha completa a base de suposiciones. La tarjeta
//  está hecha para verse bien sin esos campos.
//
//  CÓMO COMPLETAR UNA FICHA
//  1. Confirmar con el negocio su rubro, su ciudad y una línea de qué hace.
//  2. Rellenar `ecosystem` (un `id` de data/ecosystems.ts), `city` y `what`.
//  3. Imagen: `logo` para un logotipo (se dibuja contenido, con aire) o `image`
//     para una foto o portada (se dibuja recortada a la caja). Si no hay
//     ninguna, la tarjeta genera su propia identidad.
// ─────────────────────────────────────────────────────────────

export interface Member {
  id: string
  /** Nombre comercial, tal como el negocio quiere que lo lean. */
  name: string
  /** URL pública del perfil Connexo. */
  profile: string
  /** id de la plantilla en `data/ecosystems.ts`. Alimenta los filtros. */
  ecosystem?: string
  /** Ciudad o país. Alimenta el contador de ciudades. */
  city?: string
  /** Qué hace, en una línea concreta. Nada de adjetivos vacíos. */
  what?: string
  /** Logotipo en `public/red/`. Se dibuja CONTENIDO, sin recortar. */
  logo?: string
  /** Foto o portada en `public/red/`. Se dibuja RECORTADA a la caja. */
  image?: string
  /** Perfil revisado por Connexo. */
  verified?: boolean
}

export const members: Member[] = [
  {
    id: 'connexo',
    name: 'Connexo',
    profile: 'https://www.connexoapp.com/connexo',
    ecosystem: 'ecommerce',
    city: 'Ecuador',
    what: 'Perfiles digitales NFC y tarjetas para negocios. El primer nodo de la red es el nuestro.',
    logo: '/red/connexo.png',
    verified: true,
  },
  {
    id: 'stafix',
    name: 'Stafix',
    profile: 'https://www.connexoapp.com/stafix',
    logo: '/red/stafix.svg',
  },
  {
    id: 'jose-rivero',
    name: 'Jose Rivero',
    profile: 'https://www.connexoapp.com/jose%20enrique',
    city: 'Venezuela',
    what: 'Rectificación de cámaras.',
  },
  {
    id: 'quantum-code',
    name: 'Quantum Code',
    profile: 'https://www.connexoapp.com/quantum%20code',
  },
  {
    id: 'kris-morillo',
    name: 'Kris Morillo',
    profile: 'https://www.connexoapp.com/kris%20morillo',
  },
  {
    id: 'petrick-gonzalez',
    name: 'Petrick González',
    profile: 'https://www.connexoapp.com/Petrick%20González%20Pérez',
    what: 'Kairós Legal Ec.',
  },
  {
    id: 'delicias-a-tu-estilo',
    name: 'Delicias a tu Estilo',
    profile: 'https://www.connexoapp.com/delicias%20a%20tu%20estilo',
  },
  {
    id: 'black-world-tattoo',
    name: 'Black World Tattoo',
    profile: 'https://www.connexoapp.com/black%20world%20tattoo',
  },
  {
    id: 'citasa',
    name: 'CITASA',
    profile: 'https://www.connexoapp.com/citasa',
  },
  {
    id: 'farmacias-cruz-roja',
    name: 'Farmacias Cruz Roja',
    profile: 'https://www.connexoapp.com/farmacias%20cruz%20roja',
  },
  {
    id: 'veterinario',
    name: 'Veterinario',
    profile: 'https://www.connexoapp.com/veterinario',
  },
  {
    id: 'la-profe-store',
    name: 'La Profe Store',
    profile: 'https://www.connexoapp.com/la%20profe%20store',
  },
  {
    id: 'junior-ruiz',
    name: 'Junior Ruiz',
    profile: 'https://www.connexoapp.com/JuniorDev',
    what: 'Wycro Developers.',
  },
  {
    id: 'terraza-gourmet',
    name: 'Terraza Gourmet',
    profile: 'https://www.connexoapp.com/terraza-ultra',
  },
  {
    id: 'centro-terapeutico-arupo',
    name: 'Centro Terapéutico Integral Arupo',
    profile: 'https://www.connexoapp.com/Centro%20Terapéutico%20Integral%20Arupo',
    what: 'Organización sin fines de lucro.',
  },
  {
    id: 'fundacion-arupo',
    name: 'Fundación Arupo',
    profile: 'https://www.connexoapp.com/Fundación%20Arupo',
    city: 'Ecuador',
    what: 'Inclusión, derechos humanos e innovación social. El 10% de cada plan Connexo es suyo.',
  },
  {
    id: 'karter-code',
    name: 'Karter Code',
    profile: 'https://www.connexoapp.com/thony.karter',
  },
  {
    id: 'alex-abarca',
    name: 'Alex Abarca',
    profile: 'https://www.connexoapp.com/alex%20abarca',
  },
  {
    id: 'katherine-bencomo',
    name: 'Katherine Bencomo Lugo',
    profile: 'https://www.connexoapp.com/katherine%20bencomo%20lugo',
  },
]

/** Espacios libres que se dibujan después de los miembros reales. */
export const OPEN_SLOTS = 2

/** Ciudades confirmadas. Las fichas sin ciudad simplemente no cuentan. */
export function cities(list: Member[] = members) {
  return Array.from(
    new Set(list.map((m) => m.city).filter((c): c is string => Boolean(c))),
  ).sort()
}

/** Rubros confirmados. Igual: las fichas sin rubro no cuentan. */
export function activeEcosystems(list: Member[] = members) {
  return new Set(
    list.map((m) => m.ecosystem).filter((e): e is string => Boolean(e)),
  )
}
