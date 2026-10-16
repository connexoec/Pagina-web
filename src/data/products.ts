// ─────────────────────────────────────────────────────────────
//  PRODUCTOS FÍSICOS  ·  lo que muestra `ProductsMosaic`.
//
//  Tarjetas: PDF del cliente (`Tarjetas Connexo/`, ignorado en git) → WebP de
//  640×404 con esquinas transparentes en `public/tarjetas/`. Son tarjetas
//  REALES de negocios de la RED; el reverso lleva el QR de su perfil.
//  Pulseras: SVG del cliente (`Tarjetas Connexo/Pulseras/`) → WebP recortado
//  y con fondo transparente en `public/pulseras/`.
//
//  Para sumar una tarjeta: un WebP 640×404 y una entrada en el arreglo de su
//  cara. Sin nombres visibles: la web enseña el producto, no el catálogo.
// ─────────────────────────────────────────────────────────────

export interface ProductImage {
  src: string
  alt: string
  width: number
  height: number
}

const card = (src: string, alt: string): ProductImage => ({
  src,
  alt,
  width: 640,
  height: 404,
})

/** Portadas: el lado de la marca. */
export const cardFronts: ProductImage[] = [
  card(
    '/tarjetas/connexo-portada.webp',
    'Tarjeta Connexo negra: logo naranja de Connexo y el símbolo de toque.',
  ),
  card(
    '/tarjetas/quantum-code-portada.webp',
    'Tarjeta Quantum Code negra: logo circular dorado y el nombre de la marca.',
  ),
  card(
    '/tarjetas/fundacion-arupo-portada.webp',
    'Tarjeta blanca de la Fundación Arupo con el árbol de figuras de colores.',
  ),
  card(
    '/tarjetas/arupo-cti-portada.webp',
    'Tarjeta blanca de Arupo Centro Terapéutico Integral con su logo de colores.',
  ),
]

/** Reversos: el lado del QR. */
export const cardBacks: ProductImage[] = [
  card(
    '/tarjetas/connexo-reverso.webp',
    'Reverso de la tarjeta Connexo negra: código QR del perfil, nombre y cargo.',
  ),
  card(
    '/tarjetas/quantum-code-reverso.webp',
    'Reverso de la tarjeta Quantum Code negra: código QR del perfil, nombre y cargo.',
  ),
  card(
    '/tarjetas/fundacion-arupo-reverso.webp',
    'Reverso de la tarjeta blanca de la Fundación Arupo: código QR del perfil, nombre y cargo.',
  ),
  card(
    '/tarjetas/arupo-cti-reverso.webp',
    'Reverso de la tarjeta blanca de Arupo CTI: código QR del perfil, nombre y cargo.',
  ),
]

export const braceletRing: ProductImage = {
  src: '/pulseras/pulsera-aro.webp',
  alt: 'Pulsera Connexo negra de silicona, cerrada, con ondas de toque a los lados de la zona de lectura.',
  width: 1100,
  height: 562,
}

export const braceletPair: ProductImage = {
  src: '/pulseras/pulsera-par.webp',
  alt: 'Dos vistas de la pulsera Connexo: cerrada en aro y extendida.',
  width: 1000,
  height: 1057,
}
