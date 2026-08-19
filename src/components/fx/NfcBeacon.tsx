// ─────────────────────────────────────────────────────────────
//  FARO NFC  ·  el telón de fondo del Hero.
//
//  El icono de NFC (símbolo contactless: tres ondas + el punto de toque) a gran
//  escala, centrado detrás del titular, parpadeando, con ondas que emanan en
//  bucle. Muy transparente para no pelear con las letras del título. Fondo negro.
//
//  REGLA DE ORO (ver fx/Ambient.tsx): CSS puro sobre SVG, solo `opacity` y
//  `transform`. Nada de canvas ni `filter` animado. Keyframes en
//  `tailwind.config.js` (`nfc-beacon`, `nfc-wave`). `prefers-reduced-motion` lo
//  congela solo: el frame 100% deja el glifo quieto y tenue (§12 del CLAUDE.md).
//
//  El glifo es el mismo trazo que `NfcIcon` (icons.tsx), escalado ×15 y centrado:
//  coord' = coord*15 + 20 sobre un viewBox de 400. El punto de toque queda a la
//  derecha (290,200) y las ondas abren hacia la izquierda, como el símbolo real.
// ─────────────────────────────────────────────────────────────

export default function NfcBeacon({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute left-1/2 top-[46%] h-[min(88vw,760px)] w-[min(88vw,760px)] -translate-x-1/2 -translate-y-1/2 ${className}`}
    >
      <svg viewBox="0 0 400 400" className="h-full w-full">
        {/* Ondas que emanan en bucle (las "ondas" del icono) */}
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx="200"
            cy="200"
            r="120"
            fill="none"
            stroke="#ff6600"
            strokeWidth="2"
            className="animate-nfc-wave"
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animationDelay: `${-(i * 1.6).toFixed(2)}s`,
            }}
          />
        ))}

        {/* El icono NFC (contactless), parpadeando */}
        <g
          className="animate-nfc-beacon"
          fill="none"
          stroke="#ff6600"
          strokeWidth="7"
          strokeLinecap="round"
        >
          <path d="M80,140 a300,300 0 0 1 0,120" />
          <path d="M140,110 a390,390 0 0 1 0,180" />
          <path d="M200,80 c60,75 60,165 0,240" />
          <circle cx="290" cy="200" r="26" fill="#ff6600" stroke="none" />
        </g>
      </svg>
    </div>
  )
}
