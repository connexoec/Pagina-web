// ─────────────────────────────────────────────────────────────
//  HORIZONTE TERRESTRE  ·  el telón de fondo del Hero.
//
//  Un globo holográfico visto desde el borde de la órbita: el amanecer naranja
//  crestea el limbo, la superficie se dibuja con una malla de meridianos y
//  paralelos, un barrido tipo sensor la recorre, y sobre ella una red de nodos
//  que se conectan (la expansión de Connexo por el planeta). Los nodos "hub"
//  emiten un anillo de señal NFC.
//
//  REGLA DE ORO (ver fx/Ambient.tsx): todo es CSS puro sobre SVG y solo anima
//  `opacity`, `transform` y `stroke-dashoffset`. Nada de canvas, nada de rAF,
//  nada de `filter`/`blur` animado (el "glow" se finge apilando trazos). Los
//  keyframes viven en `tailwind.config.js`. `prefers-reduced-motion` los congela
//  solo: cada frame 100% es un estado estático decente (ver §12 del CLAUDE.md).
// ─────────────────────────────────────────────────────────────

const W = 1200
const H = 700

// El limbo del planeta: sube de los bordes (y=525) a la cresta (y=430).
// Control de la cuadrática: cy = 2*peak - edge.
const LIMB_EDGE = 525
const LIMB_PEAK = 430
const LIMB_CY = 2 * LIMB_PEAK - LIMB_EDGE // 335
const LIMB = `M0,${LIMB_EDGE} Q600,${LIMB_CY} ${W},${LIMB_EDGE}`

// Cuerpo del planeta = el limbo cerrado hasta abajo. Sirve de máscara para que
// la malla no se salga al espacio.
const BODY = `${LIMB} L${W},${H} L0,${H} Z`

// Paralelos: arcos anidados bajo el limbo, con menos curvatura hacia abajo.
const LATITUDES = Array.from({ length: 6 }, (_, i) => {
  const edge = 555 + i * 30
  const rise = 88 - i * 12
  const cy = edge - 2 * rise
  return `M0,${edge} Q600,${cy} ${W},${edge}`
})

// Meridianos: abanico desde el "polo" (600,300) hacia el borde inferior.
const LONGITUDES = Array.from({ length: 7 }, (_, i) => {
  const bx = 600 + (i - 3) * 235
  return `M600,300 Q${bx},470 ${bx},${H}`
})

// Estrellas en el espacio, por encima del limbo.
const STARS = [
  [90, 120, 1.1], [190, 240, 0.8], [300, 90, 1.3], [420, 200, 0.9],
  [520, 130, 1], [980, 110, 1.2], [1080, 220, 0.9], [1150, 90, 1.1],
  [700, 90, 0.8], [860, 180, 1], [560, 260, 0.8], [140, 330, 0.9],
  [1040, 320, 0.8], [250, 170, 0.7], [640, 200, 0.7], [930, 260, 0.9],
  [40, 210, 0.8], [1180, 300, 0.8], [380, 300, 0.7], [770, 250, 0.8],
] as const

type Node = { x: number; y: number; r: number; hub?: boolean }

// Nodos sobre la superficie, más densos cerca del amanecer (x 700-1050).
const NODES: Node[] = [
  { x: 180, y: 545, r: 2.4 }, // 0
  { x: 330, y: 560, r: 2.6 }, // 1
  { x: 470, y: 585, r: 2.4 }, // 2
  { x: 610, y: 560, r: 3.2, hub: true }, // 3
  { x: 720, y: 540, r: 2.8 }, // 4
  { x: 830, y: 520, r: 3.4, hub: true }, // 5  (junto al sol)
  { x: 940, y: 545, r: 2.8 }, // 6
  { x: 1040, y: 585, r: 2.6, hub: true }, // 7
  { x: 250, y: 640, r: 2.2 }, // 8
  { x: 560, y: 650, r: 2.4 }, // 9
  { x: 760, y: 635, r: 2.4 }, // 10
  { x: 900, y: 665, r: 2.2 }, // 11
]

const LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
  [8, 1], [9, 3], [10, 5], [11, 7], [3, 9], [5, 10], [4, 10],
]

/** Arco cuadrático entre dos nodos, con el control levantado. */
function arc(a: Node, b: Node): string {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dist = Math.hypot(b.x - a.x, b.y - a.y)
  const lift = Math.max(34, dist * 0.32)
  return `M${a.x},${a.y} Q${mx},${my - lift} ${b.x},${b.y}`
}

export default function EarthHorizon({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[72%] overflow-hidden ${className}`}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax slice"
        className="h-full w-full"
      >
        <defs>
          {/* Bloom del amanecer sobre el horizonte. */}
          <radialGradient id="eh-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff9a44" stopOpacity="0.55" />
            <stop offset="30%" stopColor="#ff6600" stopOpacity="0.3" />
            <stop offset="66%" stopColor="#ff6600" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
          </radialGradient>
          {/* Núcleo caliente del sol. */}
          <radialGradient id="eh-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffbd85" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#ff9a44" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
          </radialGradient>
          {/* Atmósfera: halo tenue por encima del limbo. */}
          <radialGradient id="eh-atmo" cx="50%" cy="72%" r="60%">
            <stop offset="0%" stopColor="#ff6600" stopOpacity="0.34" />
            <stop offset="55%" stopColor="#ff6600" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
          </radialGradient>
          {/* Cuerpo del planeta: casi negro, apenas templado arriba. */}
          <linearGradient id="eh-planet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#20100a" />
            <stop offset="30%" stopColor="#0a0402" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
          {/* Línea de atmósfera nítida sobre el limbo. */}
          <linearGradient id="eh-rim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff6600" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#ffbd85" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff6600" stopOpacity="0.12" />
          </linearGradient>
          {/* Halo de cada nodo. */}
          <radialGradient id="eh-node" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffbd85" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#ff6600" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
          </radialGradient>
          <clipPath id="eh-clip">
            <path d={BODY} />
          </clipPath>
        </defs>

        {/* — Espacio — */}
        {STARS.map(([x, y, r], i) => (
          <circle
            key={`s${i}`}
            cx={x}
            cy={y}
            r={r}
            fill="#ffbd85"
            className={i % 3 === 0 ? 'animate-twinkle' : ''}
            style={i % 3 === 0 ? { animationDelay: `${-(i * 0.5).toFixed(2)}s` } : undefined}
            opacity={0.7}
          />
        ))}

        {/* Bloom atmosférico y amanecer por detrás del planeta */}
        <ellipse cx="600" cy={LIMB_PEAK} rx="760" ry="230" fill="url(#eh-atmo)" />
        <ellipse cx="830" cy="470" rx="520" ry="300" fill="url(#eh-sun)" />

        {/* Cuerpo del planeta (tapa la mitad inferior de los glows) */}
        <path d={BODY} fill="url(#eh-planet)" />

        {/* Malla del globo, recortada a la superficie */}
        <g clipPath="url(#eh-clip)">
          {LATITUDES.map((d, i) => (
            <path key={`lat${i}`} d={d} fill="none" stroke="#ff6600" strokeOpacity="0.16" strokeWidth="1" />
          ))}
          {LONGITUDES.map((d, i) => (
            <path key={`lon${i}`} d={d} fill="none" stroke="#ff6600" strokeOpacity="0.14" strokeWidth="1" />
          ))}
          {/* Barrido tipo sensor */}
          <path
            d={`M0,470 Q600,320 ${W},470`}
            fill="none"
            stroke="#ff9a44"
            strokeWidth="2"
            strokeOpacity="0.9"
            className="animate-scan-sweep"
          />
        </g>

        {/* Atmósfera del limbo: glow apilado + línea nítida que respira */}
        <path d={LIMB} fill="none" stroke="#ff6600" strokeOpacity="0.06" strokeWidth="22" strokeLinecap="round" />
        <path d={LIMB} fill="none" stroke="#ff6600" strokeOpacity="0.12" strokeWidth="10" strokeLinecap="round" />
        <path
          d={LIMB}
          fill="none"
          stroke="url(#eh-rim)"
          strokeWidth="2.4"
          strokeLinecap="round"
          className="animate-rim-shimmer"
        />

        {/* El sol cresteando el horizonte (encima del cuerpo) */}
        <ellipse cx="830" cy="452" rx="210" ry="90" fill="url(#eh-core)" />
        <circle cx="830" cy="470" r="30" fill="url(#eh-core)" />

        {/* Red de conexiones (se dibujan y re-dibujan en bucle) */}
        <g>
          {LINKS.map(([ai, bi], i) => (
            <path
              key={`l${i}`}
              d={arc(NODES[ai], NODES[bi])}
              fill="none"
              stroke="#ff9a44"
              strokeWidth="1.2"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1 1"
              className="animate-net-draw"
              style={{ animationDelay: `${-(i * 0.5).toFixed(2)}s` }}
            />
          ))}
        </g>

        {/* Nodos: halo latente + núcleo; los hub emiten anillos NFC */}
        <g>
          {NODES.map((n, i) => (
            <g key={`n${i}`}>
              {n.hub && (
                <>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="13"
                    fill="none"
                    stroke="#ff6600"
                    strokeWidth="1.4"
                    className="animate-nfc-ping"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: `${-(i * 1.1).toFixed(2)}s` }}
                  />
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="13"
                    fill="none"
                    stroke="#ff6600"
                    strokeWidth="1.2"
                    className="animate-nfc-ping"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: `${-(i * 1.1 + 1.8).toFixed(2)}s` }}
                  />
                </>
              )}
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r * 3.4}
                fill="url(#eh-node)"
                className="animate-node-pulse"
                style={{ animationDelay: `${-(i * 0.37).toFixed(2)}s` }}
              />
              <circle cx={n.x} cy={n.y} r={n.r} fill="#ffbd85" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
