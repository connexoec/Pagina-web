// ─────────────────────────────────────────────────────────────
//  ECOSISTEMAS  ·  Las NUEVE plantillas reales de la plataforma.
//  Fuente: Manual de Capacitación v0.52.1 — cap. 3 y Parte VI.
//  Se elige UNA sola por cliente, según su rubro. La asigna Connexo.
//
//  `image` apunta a /perfiles/*.png (public/perfiles). Las capturas son
//  pantallas de teléfono (ratio ≈ 0.512) y el carrusel las muestra dentro de
//  un marco con esa misma proporción → se ven completas, nunca recortadas.
//  `reserved: true` → tarjeta placeholder (aún sin captura).
// ─────────────────────────────────────────────────────────────
export interface Ecosystem {
  id: string
  /** Nombre de la plantilla, tal como se llama en la plataforma. */
  name: string
  /** Para quién es — una línea, concreta. */
  tagline: string
  /** Lo que SOLO esta plantilla hace. El gancho real, no una feature genérica. */
  edge: string
  image?: string
  /** true = sin captura todavía → se renderiza el placeholder reservado. */
  reserved?: boolean
}

export const ecosystems: Ecosystem[] = [
  {
    id: 'estandar',
    name: 'Estándar',
    tagline: 'Profesionales, consultores y empresas de servicios.',
    edge: 'Ordena tus secciones a mano y pon arriba lo que quieres que hagan primero.',
    image: '/perfiles/profesional.png',
  },
  {
    id: 'barberia',
    name: 'Barbería',
    tagline: 'Barberías, peluquerías, estética y estudios de tatuaje.',
    edge: 'Reserva por barbero, con el horario real de cada uno. Y sellos: el sexto corte gratis.',
    image: '/perfiles/barber.png',
  },
  {
    id: 'gastronomia',
    name: 'Gastronomía',
    tagline: 'Restaurantes, cafeterías, bares y food trucks.',
    edge: 'Comandas en vivo e inventario con recetas: si falta un ingrediente, el plato se agota solo.',
    image: '/perfiles/gastro.png',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    tagline: 'Tiendas, distribuidoras y emprendimientos de producto.',
    edge: 'Carrito con extras, precios por volumen y pedidos que el cliente rastrea con su código.',
    image: '/perfiles/ecommerce.png',
  },
  {
    id: 'petcare',
    name: 'Petcare',
    tagline: 'Veterinarias, pet shops y peluquería canina.',
    edge: 'Historia médica por mascota. La fecha de próxima vacuna es tu mejor recordatorio de venta.',
    image: '/perfiles/veterinaria.png',
  },
  {
    id: 'medico',
    name: 'Salud',
    tagline: 'Consultorios, médicos, odontólogos y diagnóstico.',
    edge: 'Botón de Emergencia 24/7 e historia clínica que el paciente descarga en PDF.',
    image: '/perfiles/medico.png',
  },
  {
    id: 'inmobiliaria',
    name: 'Inmobiliaria',
    tagline: 'Agencias, corredores y proyectos de bienes raíces.',
    edge: 'Una tarjeta NFC por agente. Quien entra por su enlace queda atribuido a él, solo.',
    image: '/perfiles/inmobiliaria.png',
  },
  {
    id: 'artista',
    name: 'Artista',
    tagline: 'Músicos, bandas, productores y DJ.',
    edge: 'Fan Base con campañas: sabes si ese seguidor llegó por el flyer o por la bio de Instagram.',
    // Falta la captura. Sube /perfiles/artistas.png y quita `reserved`.
    reserved: true,
  },
  {
    id: 'sublimados',
    name: 'Sublimados',
    tagline: 'Bordado, estampado, DTF y uniformes por volumen.',
    edge: 'Tramos de precio: el mayorista se cotiza solo y llega al pedido ya decidido.',
    // Falta la captura. Sube /perfiles/sublimados.png y quita `reserved`.
    reserved: true,
  },
]
