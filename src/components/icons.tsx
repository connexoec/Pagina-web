import type { SVGProps } from 'react'

// Minimalist line icons — no external icon dependency (keeps bundle lean).
type IconProps = SVGProps<SVGSVGElement>

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
}

export const NfcIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 8a20 20 0 0 1 0 8" />
    <path d="M8 6a26 26 0 0 1 0 12" />
    <path d="M12 4c4 5 4 11 0 16" />
    <circle cx="18" cy="12" r="2" />
  </svg>
)

export const BoltIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
  </svg>
)

export const RadarIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 12 20 6" />
    <path d="M4 12a8 8 0 1 0 8-8" />
    <path d="M7.5 12a4.5 4.5 0 1 0 4.5-4.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
)

export const CheckIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m5 12 4.5 4.5L19 7" />
  </svg>
)

export const ArrowIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
)

export const ChevronLeft = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m15 6-6 6 6 6" />
  </svg>
)

export const ChevronRight = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
)

export const LockIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
)

export const SparkIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4Z" />
  </svg>
)

// Connexo wordmark glyph
export const ConnexoMark = (p: IconProps) => (
  <svg viewBox="0 0 32 32" fill="none" {...p}>
    <path
      d="M22 9a8 8 0 1 0 0 14"
      stroke="#ff6600"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="23" cy="16" r="2.4" fill="#ff6600" />
  </svg>
)
