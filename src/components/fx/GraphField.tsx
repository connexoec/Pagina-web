// ─────────────────────────────────────────────────────────────
//  GRAPH FIELD  ·  el telón de fondo del Hero (estética "graphify").
//
//  Un grafo de conocimiento: cúmulos de nodos con un hub central ("nodo dios")
//  del que salen radios, más unos pocos enlaces largos que cosen los cúmulos
//  entre sí. Es lo que se ve al mapear archivos conectados. Muy tenue: es
//  atmósfera, no contenido (aria-hidden). Reemplazó al faro NFC (§12).
//
//  REGLA DE ORO (ver fx/Ambient.tsx): CSS puro sobre SVG, solo `opacity` y
//  `transform`. Nada de canvas, rAF por frame ni `filter` animado. Cada cúmulo
//  es un <g> que DERIVA lentamente (keyframes `graph-a/b/c` de tailwind.config,
//  repartidos por índice) para que la red respire; los hubs además parpadean con
//  `pulse-glow`. `prefers-reduced-motion` lo congela solo: el frame 0% deja todo
//  quieto y tenue (index.css colapsa la duración).
//
//  Layout DETERMINISTA (PRNG con semilla fija) → estable entre recargas, cero
//  saltos. Paleta: solo negro + #ff6600 (§2), sin tintes.
// ─────────────────────────────────────────────────────────────

const W = 1000
const H = 700

type GNode = { x: number; y: number; r: number; hub: boolean }
type GEdge = { x1: number; y1: number; x2: number; y2: number }
type Cluster = { nodes: GNode[]; edges: GEdge[]; anim: number }

// mulberry32 — PRNG minúsculo y determinista. Misma semilla ⇒ mismo grafo.
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// El grafo se construye UNA vez, al cargar el módulo.
const { clusters, longEdges } = build()

function build(): { clusters: Cluster[]; longEdges: GEdge[] } {
  const rand = mulberry32(20260903)
  const CLUSTERS = 7
  const clusters: Cluster[] = []
  const hubs: { x: number; y: number }[] = []

  for (let c = 0; c < CLUSTERS; c++) {
    const angle = (c / CLUSTERS) * Math.PI * 2 + rand() * 0.7
    const dist = 150 + rand() * 210
    // El eje Y se comprime un poco: el grafo es más ancho que alto, como el real.
    const hx = W / 2 + Math.cos(angle) * dist
    const hy = H / 2 + Math.sin(angle) * dist * 0.66
    hubs.push({ x: hx, y: hy })

    const nodes: GNode[] = [{ x: hx, y: hy, r: 5.5 + rand() * 3.5, hub: true }]
    const edges: GEdge[] = []

    const leaves = 9 + Math.floor(rand() * 11)
    for (let i = 0; i < leaves; i++) {
      const a = rand() * Math.PI * 2
      const d = 26 + rand() * 105
      const lx = hx + Math.cos(a) * d
      const ly = hy + Math.sin(a) * d
      nodes.push({ x: lx, y: ly, r: 1.6 + rand() * 2.6, hub: false })
      edges.push({ x1: hx, y1: hy, x2: lx, y2: ly })
      // Alguna hoja se ramifica en un nodo satélite (da textura de red real).
      if (rand() > 0.78) {
        const a2 = rand() * Math.PI * 2
        const d2 = 18 + rand() * 30
        const sx = lx + Math.cos(a2) * d2
        const sy = ly + Math.sin(a2) * d2
        nodes.push({ x: sx, y: sy, r: 1.3 + rand() * 1.7, hub: false })
        edges.push({ x1: lx, y1: ly, x2: sx, y2: sy })
      }
    }

    clusters.push({ nodes, edges, anim: c % 3 })
  }

  // Enlaces largos entre hubs: el tejido conectivo. Van en una capa estática
  // (no derivan con ningún cúmulo) para no despegarse; a esta opacidad no se nota.
  const longEdges: GEdge[] = []
  for (let c = 0; c < CLUSTERS; c++) {
    const near = hubs[(c + 1) % CLUSTERS]
    longEdges.push({ x1: hubs[c].x, y1: hubs[c].y, x2: near.x, y2: near.y })
    if (rand() > 0.5) {
      const far = hubs[(c + 3) % CLUSTERS]
      longEdges.push({ x1: hubs[c].x, y1: hubs[c].y, x2: far.x, y2: far.y })
    }
  }

  return { clusters, longEdges }
}

const DRIFT = ['animate-graph-a', 'animate-graph-b', 'animate-graph-c']

export default function GraphField({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      // Se desvanece hacia los bordes: densa al centro, aire en las orillas.
      style={{
        maskImage: 'radial-gradient(120% 95% at 50% 42%, #000 30%, transparent 78%)',
        WebkitMaskImage: 'radial-gradient(120% 95% at 50% 42%, #000 30%, transparent 78%)',
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        {/* Tejido conectivo — enlaces largos entre hubs (capa estática, tenue). */}
        <g stroke="#ff6600" strokeWidth="0.9" strokeOpacity="0.08" fill="none">
          {longEdges.map((e, i) => (
            <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
          ))}
        </g>

        {/* Cada cúmulo deriva por su cuenta (respira). */}
        {clusters.map((cl, ci) => (
          <g
            key={ci}
            className={DRIFT[cl.anim]}
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animationDelay: `${-(ci * 2.9).toFixed(2)}s`,
            }}
          >
            {/* Radios del cúmulo */}
            <g stroke="#ff6600" strokeWidth="0.8" strokeOpacity="0.13" fill="none">
              {cl.edges.map((e, i) => (
                <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
              ))}
            </g>
            {/* Nodos */}
            {cl.nodes.map((n, i) =>
              n.hub ? (
                <circle
                  key={i}
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill="#ff6600"
                  fillOpacity="0.42"
                  className="animate-pulse-glow"
                  style={{ animationDelay: `${-(ci * 0.7).toFixed(2)}s` }}
                />
              ) : (
                <circle
                  key={i}
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill="#ff6600"
                  fillOpacity="0.26"
                />
              ),
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
