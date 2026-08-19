// ─────────────────────────────────────────────────────────────
//  HORIZONTE TERRESTRE  ·  el telón de fondo del Hero.
//
//  La Tierra vista desde el borde de la órbita, con el amanecer naranja
//  cresteando el limbo. Sobre la superficie oscura, una red de nodos que se
//  conectan entre sí (la expansión de Connexo por el planeta) y algunos nodos
//  "hub" que emiten un anillo de señal NFC.
//
//  REGLA DE ORO (ver fx/Ambient.tsx): todo es CSS puro sobre SVG y solo anima
//  `opacity`, `transform` (scale) y `stroke-dashoffset`. Nada de canvas, nada
//  de rAF por frame, nada de `filter`/`blur` animado. Los keyframes viven en
//  `tailwind.config.js` (`net-draw`, `node-pulse`, `nfc-ping`, `rim-shimmer`)
//  y `prefers-reduced-motion` los congela solo (§9 del CLAUDE.md): el frame
//  100% deja la red dibujada y quieta.
// ─────────────────────────────────────────────────────────────

// El limbo del planeta es esta curva cuadrática (M0,553 Q600,247 1200,553);
// pasa por (600,400) en el centro. Los nodos se posan justo debajo de ella,
// sobre la cara oscura, como luces de ciudad cerca del amanecer.
const LIMB = 'M0,553 Q600,247 1200,553'

type Node = { x: number; y: number; r: number; hub?: boolean }

// Nodos sobre el limbo + algunos más adentro de la superficie (más abajo).
const NODES: Node[] = [
  { x: 140, y: 500, r: 2.6 }, // 0
  { x: 300, y: 448, r: 3 }, // 1
  { x: 470, y: 418, r: 3.4 }, // 2
  { x: 600, y: 412, r: 4, hub: true }, // 3
  { x: 740, y: 419, r: 3.6, hub: true }, // 4
  { x: 880, y: 444, r: 3.2, hub: true }, // 5
  { x: 1030, y: 490, r: 3 }, // 6
  { x: 1170, y: 548, r: 2.6 }, // 7
  { x: 230, y: 560, r: 2.2 }, // 8
  { x: 560, y: 478, r: 2.6 }, // 9
  { x: 820, y: 516, r: 2.6 }, // 10
  { x: 980, y: 556, r: 2.2 }, // 11
]

// Qué nodo se une con cuál. El arco se dibuja combándose hacia arriba, como un
// enlace que salta por encima del borde del globo.
const LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
  [8, 1], [9, 3], [9, 4], [10, 5], [11, 6], [2, 9], [10, 4],
]

/** Arco cuadrático entre dos nodos, con el punto de control levantado. */
function arc(a: Node, b: Node): string {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dist = Math.hypot(b.x - a.x, b.y - a.y)
  const lift = Math.max(38, dist * 0.34)
  return `M${a.x},${a.y} Q${mx},${my - lift} ${b.x},${b.y}`
}

export default function EarthHorizon({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[62%] overflow-hidden ${className}`}
    >
      <svg
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMax slice"
        className="h-full w-full"
      >
        <defs>
          {/* Amanecer: foco cálido cresteando el horizonte. */}
          <radialGradient id="eh-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff6600" stopOpacity="0.55" />
            <stop offset="34%" stopColor="#ff6600" stopOpacity="0.26" />
            <stop offset="70%" stopColor="#ff6600" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
          </radialGradient>
          {/* Núcleo del sol, más concentrado. */}
          <radialGradient id="eh-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff9a44" stopOpacity="0.7" />
            <stop offset="55%" stopColor="#ff6600" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
          </radialGradient>
          {/* Cuerpo del planeta: casi negro, apenas templado cerca del limbo. */}
          <linearGradient id="eh-planet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#180a02" />
            <stop offset="34%" stopColor="#080300" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
          {/* Línea de atmósfera sobre el limbo. */}
          <linearGradient id="eh-rim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff6600" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#ff9a44" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ff6600" stopOpacity="0.15" />
          </linearGradient>
          {/* Halo suave de cada nodo. */}
          <radialGradient id="eh-node" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff9a44" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#ff6600" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Amanecer detrás del limbo */}
        <ellipse cx="720" cy="540" rx="620" ry="360" fill="url(#eh-sun)" />
        <ellipse cx="720" cy="530" rx="240" ry="130" fill="url(#eh-core)" />

        {/* Cuerpo del planeta (mismo limbo, cerrado hasta abajo) */}
        <path
          d={`${LIMB} L1200,700 L0,700 Z`}
          fill="url(#eh-planet)"
        />

        {/* Atmósfera: un trazo ancho tenue + la línea nítida que respira */}
        <path d={LIMB} fill="none" stroke="#ff6600" strokeOpacity="0.12" strokeWidth="10" />
        <path
          d={LIMB}
          fill="none"
          stroke="url(#eh-rim)"
          strokeWidth="2.4"
          strokeLinecap="round"
          className="animate-rim-shimmer"
        />

        {/* Red de conexiones (se dibujan y re-dibujan en bucle) */}
        <g>
          {LINKS.map(([ai, bi], i) => (
            <path
              key={`l${i}`}
              d={arc(NODES[ai], NODES[bi])}
              fill="none"
              stroke="#ff6600"
              strokeWidth="1.2"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1 1"
              className="animate-net-draw"
              style={{ animationDelay: `${-(i * 0.5).toFixed(2)}s` }}
            />
          ))}
        </g>

        {/* Nodos: halo latente + núcleo sólido; los hub emiten anillos NFC */}
        <g>
          {NODES.map((n, i) => (
            <g key={`n${i}`}>
              {n.hub && (
                <>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="14"
                    fill="none"
                    stroke="#ff6600"
                    strokeWidth="1.4"
                    className="animate-nfc-ping"
                    style={{
                      transformBox: 'fill-box',
                      transformOrigin: 'center',
                      animationDelay: `${-(i * 1.1).toFixed(2)}s`,
                    }}
                  />
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="14"
                    fill="none"
                    stroke="#ff6600"
                    strokeWidth="1.2"
                    className="animate-nfc-ping"
                    style={{
                      transformBox: 'fill-box',
                      transformOrigin: 'center',
                      animationDelay: `${-(i * 1.1 + 1.8).toFixed(2)}s`,
                    }}
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
              <circle cx={n.x} cy={n.y} r={n.r} fill="#ff9a44" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
