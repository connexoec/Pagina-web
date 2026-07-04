// ─────────────────────────────────────────────────────────────
//  ECOSISTEMAS  ·  8 espacios exactos para el carrusel 3D.
//  `image` apunta a /perfiles/*.png (public/perfiles).
//  `reserved: true` → tarjeta placeholder cinematográfica (sin imagen).
// ─────────────────────────────────────────────────────────────
export interface Ecosystem {
  id: string
  name: string
  tagline: string
  image?: string
  /** true = espacio sin asset todavía → se renderiza placeholder. */
  reserved?: boolean
}

export const ecosystems: Ecosystem[] = [
  {
    id: 'profesional',
    name: 'Profesional',
    tagline: 'Tu CV vivo. Contacto, portafolio y agenda en un solo toque.',
    image: '/perfiles/profesional.png',
  },
  {
    id: 'gastro',
    name: 'Gastronomía',
    tagline: 'Menú digital, reservas y reseñas capturadas al instante.',
    image: '/perfiles/gastro.png',
  },
  {
    id: 'barber',
    name: 'Barber & Beauty',
    tagline: 'Reservas de cita, catálogo de servicios y fidelización.',
    image: '/perfiles/barber.png',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    tagline: 'Catálogo, pagos y links de venta directa sin fricción.',
    image: '/perfiles/ecommerce.png',
  },
  {
    id: 'artistas',
    name: 'Artistas',
    tagline: 'Música, shows y merch. Convierte fans en clientes.',
    // Sin asset todavía → placeholder. Sube /perfiles/artistas.png para activarlo.
    reserved: true,
  },
  {
    id: 'corporativo',
    name: 'Corporativo B2B',
    tagline: 'Tarjetas de equipo unificadas y captura de leads corporativos.',
    // Sin asset todavía → placeholder. Sube /perfiles/corporativo.png para activarlo.
    reserved: true,
  },
  {
    id: 'servicios',
    name: 'Servicios & Citas',
    tagline: 'Agenda médica, veterinaria e inmobiliaria en tiempo real.',
    image: '/perfiles/medico.png',
  },
  {
    id: 'proximamente',
    name: 'Próximamente',
    tagline: 'Un nuevo ecosistema en camino. Espacio reservado.',
    reserved: true,
  },
]
