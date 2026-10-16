// ─────────────────────────────────────────────────────────────
//  TARJETAS CONNEXO  ·  los diseños que muestra `CardsShowcase`.
//
//  Son tarjetas REALES hechas para clientes (el reverso lleva el QR del perfil
//  publicado en connexoapp.com). Las imágenes salen de los PDF de
//  `Tarjetas Connexo/` rasterizados a 1200×758 y viven en `public/tarjetas/`.
//
//  Para sumar un diseño: dos PNG (`<id>-portada.png` y `<id>-reverso.png`,
//  proporción 1200×758 con esquinas transparentes) y una entrada aquí.
// ─────────────────────────────────────────────────────────────

/** Proporción de todas las caras (ancho / alto). Ver `CardsShowcase`. */
export const CARD_W = 1200
export const CARD_H = 758

export interface CardFace {
  src: string
  alt: string
}

export interface CardDesign {
  id: string
  /** Texto del selector. */
  name: string
  /** Una línea bajo el selector: qué se ve en este diseño. */
  blurb: string
  front: CardFace
  back: CardFace
}

export const cardDesigns: CardDesign[] = [
  {
    id: 'connexo',
    name: 'Connexo',
    blurb:
      'La de la casa: negro, logo naranja y el símbolo de toque. Atrás, el nombre, el cargo y el QR del perfil.',
    front: {
      src: '/tarjetas/connexo-portada.png',
      alt: 'Tarjeta Connexo, portada: logo naranja de Connexo sobre fondo negro y el símbolo de pago por aproximación en la esquina.',
    },
    back: {
      src: '/tarjetas/connexo-reverso.png',
      alt: 'Tarjeta Connexo, reverso: código QR del perfil a la izquierda y, a la derecha, nombre y cargo.',
    },
  },
  {
    id: 'quantum-code',
    name: 'Quantum Code',
    blurb:
      'La marca del cliente al frente y la de Connexo abajo. Cada negocio pone su identidad, no la nuestra.',
    front: {
      src: '/tarjetas/quantum-code-portada.png',
      alt: 'Tarjeta Quantum Code, portada: logo circular dorado y blanco con el nombre Quantum Code sobre fondo negro, con el logo de Connexo abajo.',
    },
    back: {
      src: '/tarjetas/quantum-code-reverso.png',
      alt: 'Tarjeta Quantum Code, reverso: código QR del perfil a la izquierda y, a la derecha, nombre y cargo.',
    },
  },
  {
    id: 'fundacion-arupo',
    name: 'Fundación Arupo',
    blurb:
      'Versión clara, con el árbol de la Fundación. El mismo toque, otro carácter.',
    front: {
      src: '/tarjetas/fundacion-arupo-portada.png',
      alt: 'Tarjeta de la Fundación Arupo, portada: árbol de figuras de colores sobre fondo blanco, con el logo de Connexo abajo.',
    },
    back: {
      src: '/tarjetas/fundacion-arupo-reverso.png',
      alt: 'Tarjeta de la Fundación Arupo, reverso: código QR del perfil a la izquierda y, a la derecha, nombre y cargo.',
    },
  },
  {
    id: 'arupo-cti',
    name: 'Arupo CTI',
    blurb:
      'Centro Terapéutico Integral: colores vivos sobre blanco, con el QR del perfil por detrás.',
    front: {
      src: '/tarjetas/arupo-cti-portada.png',
      alt: 'Tarjeta Arupo Centro Terapéutico Integral, portada: logo con árbol de colores sobre fondo blanco, con el logo de Connexo abajo.',
    },
    back: {
      src: '/tarjetas/arupo-cti-reverso.png',
      alt: 'Tarjeta Arupo Centro Terapéutico Integral, reverso: código QR del perfil a la izquierda y, a la derecha, nombre y cargo.',
    },
  },
]
