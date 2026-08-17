// ─────────────────────────────────────────────────────────────
//  RED CONNEXO · DIRECTORIO DE EMPRENDEDORES
//
//  El mapa público de los negocios que ya viven en Connexo. Cualquiera entra,
//  busca por rubro o ciudad, ve qué hace cada negocio y salta a su perfil real
//  en connexoapp.com.
//
//  ⚠️ REGLA INNEGOCIABLE: aquí SOLO van negocios reales, con un perfil Connexo
//  publicado, y SOLO datos confirmados. `city` y `what` son opcionales a
//  propósito: es preferible una ficha con el nombre y el enlace correctos que
//  una ficha completa a base de suposiciones.
//
//  IMÁGENES
//  - `logo`  → logotipo. Se dibuja CONTENIDO y con aire (nunca recortado).
//  - `image` → foto o portada. Se dibuja RECORTADA a la caja.
//  Van en `public/red/`, en minúscula y sin espacios: un espacio en la ruta se
//  convierte en `%20` en cada URL.
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
  /** Organización aliada: además de su perfil, activa perfiles a terceros. */
  ngo?: boolean
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
    ecosystem: 'ecommerce',
    logo: '/red/stafix.svg',
  },
  {
    id: 'quantum-code',
    name: 'Quantum Code',
    profile: 'https://www.connexoapp.com/quantum%20code',
    ecosystem: 'ecommerce',
    what: 'Agencia multidisciplinaria de producción audiovisual, diseño y desarrollo. Construyendo el futuro desde el vacío.',
    logo: '/red/quantum-code.png',
  },
  {
    id: 'jose-rivero',
    name: 'Jose Rivero',
    profile: 'https://www.connexoapp.com/jose%20enrique',
    ecosystem: 'ecommerce',
    city: 'Venezuela',
    what: 'Rectificación de cámaras.',
  },
  {
    id: 'kris-morillo',
    name: 'Kris Morillo',
    profile: 'https://www.connexoapp.com/kris%20morillo',
    ecosystem: 'ecommerce',
  },
  {
    id: 'petrick-gonzalez',
    name: 'Petrick González',
    profile: 'https://www.connexoapp.com/Petrick%20González%20Pérez',
    ecosystem: 'ecommerce',
    what: 'Kairós Legal Ec.',
  },
  {
    id: 'delicias-a-tu-estilo',
    name: 'Delicias a tu Estilo',
    profile: 'https://www.connexoapp.com/delicias%20a%20tu%20estilo',
    ecosystem: 'ecommerce',
  },
  {
    id: 'black-world-tattoo',
    name: 'Black World Tattoo',
    profile: 'https://www.connexoapp.com/black%20world%20tattoo',
    ecosystem: 'ecommerce',
  },
  {
    id: 'citasa',
    name: 'CITASA',
    profile: 'https://www.connexoapp.com/citasa',
    ecosystem: 'ecommerce',
  },
  {
    id: 'farmacias-cruz-roja',
    name: 'Farmacias Cruz Roja',
    profile: 'https://www.connexoapp.com/farmacias%20cruz%20roja',
    ecosystem: 'medico',
  },
  {
    id: 'veterinario',
    name: 'Veterinario',
    profile: 'https://www.connexoapp.com/veterinario',
    ecosystem: 'petcare',
  },
  {
    id: 'la-profe-store',
    name: 'La Profe Store',
    profile: 'https://www.connexoapp.com/la%20profe%20store',
    ecosystem: 'ecommerce',
  },
  {
    id: 'junior-ruiz',
    name: 'Junior Ruiz',
    profile: 'https://www.connexoapp.com/JuniorDev',
    ecosystem: 'ecommerce',
    what: 'Wycro Developers.',
  },
  {
    id: 'terraza-gourmet',
    name: 'Terraza Gourmet',
    profile: 'https://www.connexoapp.com/terraza-ultra',
    ecosystem: 'gastronomia',
  },
  {
    id: 'tardon-la-voladora',
    name: 'Tardón La Voladora',
    profile: 'https://www.connexoapp.com/dustin%20estevan',
    ecosystem: 'ecommerce',
    city: 'Mira, Carchi, Ecuador',
  },
  {
    id: 'centro-terapeutico-arupo',
    name: 'Centro Terapéutico Integral Arupo',
    profile: 'https://www.connexoapp.com/Centro%20Terapéutico%20Integral%20Arupo',
    ecosystem: 'ecommerce',
    what: 'Organización sin fines de lucro.',
    logo: '/red/centro-terapeutico-arupo.png',
    ngo: true,
  },
  {
    id: 'fundacion-arupo',
    name: 'Fundación Arupo',
    profile: 'https://www.connexoapp.com/Fundación%20Arupo',
    ecosystem: 'ecommerce',
    city: 'Ecuador',
    what: 'Inclusión, derechos humanos e innovación social. El 10% de cada plan Connexo es suyo.',
    logo: '/red/fundacion-arupo.png',
    ngo: true,
  },
  {
    id: 'karter-code',
    name: 'Karter Code',
    profile: 'https://www.connexoapp.com/thony.karter',
    ecosystem: 'ecommerce',
  },
  {
    id: 'alex-abarca',
    name: 'Alex Abarca',
    profile: 'https://www.connexoapp.com/alex%20abarca',
    ecosystem: 'ecommerce',
  },
  {
    id: 'katherine-bencomo',
    name: 'Katherine Bencomo Lugo',
    profile: 'https://www.connexoapp.com/katherine%20bencomo%20lugo',
    ecosystem: 'ecommerce',
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

/** Organizaciones aliadas que ya están dentro de la red. */
export function ngoMembers(list: Member[] = members) {
  return list.filter((m) => m.ngo)
}
