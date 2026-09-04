// ─────────────────────────────────────────────────────────────
//  GRAPH FIELD  ·  el telón de fondo del Hero (estética "graphify").
//
//  Un grafo de conocimiento como el que dibuja graphify: un NÚCLEO denso de hubs
//  entrelazados en el centro, rodeado de cúmulos "diente de león" (un hub con
//  MUCHOS radios finos que estallan en 360°), cosidos al núcleo por enlaces
//  largos. Es lo que se ve al mapear archivos conectados. Muy tenue: es
//  atmósfera, no contenido (aria-hidden). Reemplazó al faro NFC (§12).
//
//  REGLA DE ORO (ver fx/Ambient.tsx): CSS puro sobre SVG, solo `opacity` y
//  `transform`. Nada de canvas, rAF por frame ni `filter` animado. Cada cúmulo
//  es un <g> que DERIVA lento (keyframes `graph-a/b/c`, repartidos por índice)
//  para que la red respire. `prefers-reduced-motion` lo congela solo (el frame
//  0% es el reposo). El borde se desvanece a negro con una máscara en el
//  contenedor (espacio de pantalla), así NO se corta seco contra la sección de
//  abajo pase lo que pase con el recorte del SVG.
//
//  Layout DETERMINISTA (PRNG con semilla fija) → estable entre recargas, cero
//  saltos. Paleta: solo negro + #ff6600 (§2), sin tintes.
// ─────────────────────────────────────────────────────────────

const W = 1000
const H = 700
const CX = W / 2
const CY = H * 0.42

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
  const clusters: Cluster[] = []
  const longEdges: GEdge[] = []

  // ── NÚCLEO: malla densa de hubs entrelazados cerca del centro ──────────
  const CORE = 6
  const coreHubs: { x: number; y: number }[] = []
  const coreNodes: GNode[] = []
  const coreEdges: GEdge[] = []
  for (let i = 0; i < CORE; i++) {
    const a = (i / CORE) * Math.PI * 2 + rand() * 0.6
    const d = 35 + rand() * 130
    const hx = CX + Math.cos(a) * d
    const hy = CY + Math.sin(a) * d * 0.72
    coreHubs.push({ x: hx, y: hy })
    coreNodes.push({ x: hx, y: hy, r: 4 + rand() * 3.5, hub: true })
    // hojas alrededor de cada hub del núcleo
    const leaves = 7 + Math.floor(rand() * 9)
    for (let j = 0; j < leaves; j++) {
      const la = rand() * Math.PI * 2
      const ld = 14 + rand() * 74
      const lx = hx + Math.cos(la) * ld
      const ly = hy + Math.sin(la) * ld
      coreNodes.push({ x: lx, y: ly, r: 1.1 + rand() * 2, hub: false })
      coreEdges.push({ x1: hx, y1: hy, x2: lx, y2: ly })
    }
  }
  // Entrelazar los hubs del núcleo entre sí (la maraña central).
  for (let i = 0; i < CORE; i++) {
    for (let j = i + 1; j < CORE; j++) {
      if (rand() > 0.45) {
        coreEdges.push({ x1: coreHubs[i].x, y1: coreHubs[i].y, x2: coreHubs[j].x, y2: coreHubs[j].y })
      }
    }
  }
  clusters.push({ nodes: coreNodes, edges: coreEdges, anim: 0 })

  // ── SATÉLITES "diente de león": un hub con muchos radios finos en 360° ──
  const SAT = 9
  for (let s = 0; s < SAT; s++) {
    const a = (s / SAT) * Math.PI * 2 + rand() * 0.5
    const d = 225 + rand() * 195
    const hx = CX + Math.cos(a) * d
    const hy = CY + Math.sin(a) * d * 0.64
    const nodes: GNode[] = [{ x: hx, y: hy, r: 2.8 + rand() * 3, hub: true }]
    const edges: GEdge[] = []

    const spokes = 16 + Math.floor(rand() * 24)
    for (let k = 0; k < spokes; k++) {
      const sa = rand() * Math.PI * 2
      const sd = 16 + rand() * 78
      const lx = hx + Math.cos(sa) * sd
      const ly = hy + Math.sin(sa) * sd
      nodes.push({ x: lx, y: ly, r: 0.9 + rand() * 1.9, hub: false })
      edges.push({ x1: hx, y1: hy, x2: lx, y2: ly })
      // A veces un segundo anillo (le da profundidad al estallido).
      if (rand() > 0.82) {
        const sa2 = sa + (rand() - 0.5) * 0.6
        const sd2 = sd + 12 + rand() * 26
        const l2x = hx + Math.cos(sa2) * sd2
        const l2y = hy + Math.sin(sa2) * sd2
        nodes.push({ x: l2x, y: l2y, r: 0.8 + rand() * 1.3, hub: false })
        edges.push({ x1: lx, y1: ly, x2: l2x, y2: l2y })
      }
    }

    clusters.push({ nodes, edges, anim: 1 + (s % 2) })

    // Cose el satélite al núcleo (uno o dos enlaces largos).
    const near = coreHubs[Math.floor(rand() * coreHubs.length)]
    longEdges.push({ x1: hx, y1: hy, x2: near.x, y2: near.y })
    if (rand() > 0.6) {
      const near2 = coreHubs[Math.floor(rand() * coreHubs.length)]
      longEdges.push({ x1: hx, y1: hy, x2: near2.x, y2: near2.y })
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
      // Se desvanece a negro por los cuatro lados —sobre todo abajo— para que
      // NO se corte seco contra la sección siguiente. La máscara va en espacio
      // de pantalla (no del SVG): dos capas intersecadas, un óvalo radial + un
      // fundido vertical que apaga por completo antes del borde inferior.
      style={{
        maskImage:
          'radial-gradient(125% 100% at 50% 40%, #000 34%, transparent 82%), linear-gradient(to bottom, transparent 0%, #000 14%, #000 60%, transparent 97%)',
        WebkitMaskImage:
          'radial-gradient(125% 100% at 50% 40%, #000 34%, transparent 82%), linear-gradient(to bottom, transparent 0%, #000 14%, #000 60%, transparent 97%)',
        maskComposite: 'intersect',
        WebkitMaskComposite: 'source-in',
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        {/* Tejido conectivo — enlaces largos núcleo↔satélites (capa estática). */}
        <g stroke="#ff6600" strokeWidth="0.8" strokeOpacity="0.07" fill="none">
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
              animationDelay: `${-(ci * 2.6).toFixed(2)}s`,
            }}
          >
            {/* Radios/aristas del cúmulo */}
            <g stroke="#ff6600" strokeWidth="0.7" strokeOpacity="0.12" fill="none">
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
                  style={{ animationDelay: `${-(ci * 0.6).toFixed(2)}s` }}
                />
              ) : (
                <circle
                  key={i}
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill="#ff6600"
                  fillOpacity="0.24"
                />
              ),
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
