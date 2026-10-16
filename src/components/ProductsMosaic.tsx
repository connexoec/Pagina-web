import { useRef, useState, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  braceletPair,
  braceletRing,
  cardBacks,
  cardFronts,
  type ProductImage,
} from '../data/products'
import { wa, waMsg } from '../config/site'
import { WhatsappIcon } from './icons'

/**
 * "Estos son nuestros productos": mosaico compacto de tarjetas y pulseras, justo
 * después de la matriz de planes. Dos filas en damero — pulsera + cinta de
 * portadas arriba, cinta de reversos + pulsera abajo — para que ocupe ~400 px
 * en escritorio y ~380 en móvil. Datos e imágenes en `data/products.ts`.
 *
 * Reglas que respeta (CLAUDE.md §6 y §15):
 * - **Solo `transform` y `opacity` se animan.** Resplandores, aro de neón y
 *   sombras son estáticos; lo que se mueve es la capa ya pintada.
 * - **CSS puro para lo que corre para siempre** (cintas, flotación, ondas) y
 *   en pausa cuando la sección sale de pantalla. Las cintas además se detienen
 *   al pasar el ratón, para poder mirar una tarjeta con calma.
 * - Las pulseras se mueven poco a propósito: una flotación de 7 px y un
 *   vaivén de ±2°, más tres ondas de toque NFC muy tenues. Elegante, no circo.
 * - `prefers-reduced-motion` no necesita código: la regla global de `index.css`
 *   colapsa las duraciones y el estado base de cada keyframe es el reposo.
 */

// Radio de las tarjetas medido sobre el arte: 40 px de 1200×758.
const CORNER = 'rounded-[3.33%/5.28%]'

const TILE =
  'relative overflow-hidden rounded-2xl border border-white/[0.07] bg-abyss-800 transition-colors duration-300 hover:border-connexo/35 h-[124px] sm:h-[164px] lg:h-[196px]'

/** Entrada escalonada al llegar a pantalla (una sola vez). */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Luz naranja estática detrás del producto + filete de neón en el borde alto. */
function Glow({ at = '50% 58%' }: { at?: string }) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(62% 90% at ${at}, rgba(255,102,0,0.2), transparent 72%)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-connexo/80 to-transparent"
      />
    </>
  )
}

function BraceletTile({
  image,
  variant,
  live,
  className,
  delay,
}: {
  image: ProductImage
  variant: 'ring' | 'pair'
  live: boolean
  className: string
  delay: number
}) {
  const ring = variant === 'ring'
  const state = live ? 'running' : 'paused'

  return (
    <Reveal delay={delay} className={`group ${TILE} ${className}`}>
      <Glow at={ring ? '50% 62%' : '50% 50%'} />

      {/* Aro de neón: el borde del mosaico lo recorta y solo asoma el arco. */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square h-[135%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-connexo/60 shadow-neon-soft animate-neon-flicker"
        style={{ animationPlayState: state }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`relative will-change-transform ${
            ring ? 'w-[72%] max-w-[310px] animate-product-float' : 'h-[86%] animate-product-sway'
          }`}
          style={{ animationDelay: ring ? '0s' : '-3s', animationPlayState: state }}
        >
          {/* Ondas de toque que nacen en la zona de lectura (solo la pulsera
              cerrada, donde se ve el óvalo). Detrás de la imagen. */}
          {ring &&
            [0, 1, 2].map((i) => (
              <span
                key={i}
                aria-hidden
                className="pointer-events-none absolute left-[52%] top-[80%] aspect-square w-[24%] -translate-x-1/2 -translate-y-1/2"
              >
                <span
                  className="absolute inset-0 animate-nfc-wave rounded-full border border-connexo opacity-0"
                  style={{ animationDelay: `${i * 1.6}s`, animationPlayState: state }}
                />
              </span>
            ))}

          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
            draggable={false}
            className={`relative block select-none transition-transform duration-500 group-hover:scale-[1.05] ${
              ring ? 'h-auto w-full' : 'h-full w-auto'
            }`}
          />
        </div>
      </div>
    </Reveal>
  )
}

function MarqueeRow({
  items,
  reverse = false,
  duration,
  live,
  className,
  delay,
}: {
  items: ProductImage[]
  reverse?: boolean
  duration: number
  live: boolean
  className: string
  delay: number
}) {
  const [hover, setHover] = useState(false)
  const running = live && !hover
  const fade = 'linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent)'

  return (
    <Reveal delay={delay} className={`${TILE} ${className}`}>
      <Glow />
      <div
        className="absolute inset-0 flex items-center overflow-hidden"
        style={{ maskImage: fade, WebkitMaskImage: fade }}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        {/* Tres copias: con una sola, en pantallas medianas el bucle dejaría
            un hueco a la derecha. Solo la primera se lee para tecnologías de
            asistencia. */}
        {[0, 1, 2].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy > 0}
            className="animate-marquee flex shrink-0 items-center gap-3 pr-3 sm:gap-4 sm:pr-4"
            style={{
              animationDuration: `${duration}s`,
              animationDirection: reverse ? 'reverse' : 'normal',
              animationPlayState: running ? 'running' : 'paused',
            }}
          >
            {items.map((item) => (
              <li key={item.src} className="shrink-0">
                <img
                  src={item.src}
                  alt={copy === 0 ? item.alt : ''}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className={`block h-auto w-[116px] select-none ring-1 ring-white/10 shadow-[0_12px_28px_-12px_rgba(255,102,0,0.5)] sm:w-[150px] lg:w-[212px] ${CORNER}`}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </Reveal>
  )
}

export default function ProductsMosaic() {
  const ref = useRef<HTMLElement>(null)
  // Fuera de pantalla todo el movimiento se pausa.
  const live = useInView(ref, { margin: '80px' })

  return (
    <section
      id="productos"
      ref={ref}
      aria-labelledby="productos-titulo"
      className="relative bg-abyss-950 pb-16 sm:pb-20"
    >
      <div className="section-pad">
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id="productos-titulo"
            className="text-balance font-heading text-3xl leading-tight text-white sm:text-4xl"
          >
            Estos son nuestros productos.
          </h2>
          <p className="mt-3 text-sm text-white/55 sm:text-base">
            Tarjetas y pulseras. Con cualquiera de las dos, un toque abre tu perfil.
          </p>
        </header>

        {/* Damero: en móvil las dos pulseras van lado a lado y las cintas
            ocupan el ancho; en escritorio se cruzan en diagonal. */}
        <div className="mx-auto mt-9 grid max-w-6xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12">
          <BraceletTile
            image={braceletRing}
            variant="ring"
            live={live}
            delay={0}
            className="col-span-1 lg:col-span-5 lg:col-start-1 lg:row-start-1"
          />
          <BraceletTile
            image={braceletPair}
            variant="pair"
            live={live}
            delay={0.12}
            className="col-span-1 lg:col-span-5 lg:col-start-8 lg:row-start-2"
          />
          <MarqueeRow
            items={cardFronts}
            duration={34}
            live={live}
            delay={0.06}
            className="col-span-2 lg:col-span-7 lg:col-start-6 lg:row-start-1"
          />
          <MarqueeRow
            items={cardBacks}
            reverse
            duration={40}
            live={live}
            delay={0.18}
            className="col-span-2 lg:col-span-7 lg:col-start-1 lg:row-start-2"
          />
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href={wa(waMsg.cards)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta"
          >
            <WhatsappIcon className="h-5 w-5" />
            QUIERO LA MÍA
          </a>
        </div>
      </div>
    </section>
  )
}
