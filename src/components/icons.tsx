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

// Broadcast/NFC ripple — Connexo's signature section marker (a signal
// emanating from a single touch point).
export const SignalIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <path d="M9 8.5a5 5 0 0 1 0 7" />
    <path d="M12.5 6a9 9 0 0 1 0 12" />
    <path d="M16 3.5a13 13 0 0 1 0 17" />
  </svg>
)

export const HeartIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 21C7 17 3.5 13.8 3.5 9.8 3.5 7 5.6 5 8 5c1.6 0 3 .9 4 2.3C13 5.9 14.4 5 16 5c2.4 0 4.5 2 4.5 4.8 0 4-3.5 7.2-8.5 11.2Z" />
  </svg>
)

export const PhoneIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
    <path d="M10.5 5.5h3" />
    <path d="M11 18.5h2" />
  </svg>
)

export const GlobeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
  </svg>
)

export const BellIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M18 9a6 6 0 0 0-12 0c0 5-2 6-2 6h16s-2-1-2-6Z" />
    <path d="M10.5 19a2 2 0 0 0 3 0" />
  </svg>
)

export const CardIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d="M2.5 10h19" />
    <path d="M6.5 14.5h4" />
  </svg>
)

export const BankIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m3 9 9-5 9 5" />
    <path d="M5 9v9M10 9v9M14 9v9M19 9v9" />
    <path d="M3 21h18" />
  </svg>
)

export const LinkIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M10 13a4 4 0 0 0 5.7.3l3-3A4 4 0 0 0 13 4.7l-1.7 1.7" />
    <path d="M14 11a4 4 0 0 0-5.7-.3l-3 3A4 4 0 0 0 11 19.3l1.7-1.7" />
  </svg>
)

export const WhatsappIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2.1 22l5.36-1.4a9.8 9.8 0 0 0 4.58 1.16h.01c5.43 0 9.84-4.4 9.84-9.84C21.89 6.4 17.48 2 12.04 2Zm0 17.92h-.01a8.2 8.2 0 0 1-4.16-1.14l-.3-.18-3.18.83.85-3.1-.2-.32a8.13 8.13 0 0 1-1.25-4.36c0-4.51 3.68-8.18 8.2-8.18 2.19 0 4.25.85 5.8 2.4a8.13 8.13 0 0 1 2.4 5.79c0 4.52-3.67 8.19-8.15 8.19Zm4.5-6.13c-.25-.13-1.46-.72-1.68-.8-.23-.09-.39-.13-.56.12-.16.25-.63.8-.78.96-.14.17-.29.19-.53.07-.25-.13-1.04-.39-1.98-1.22a7.4 7.4 0 0 1-1.37-1.7c-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.09-.17.05-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47c-.17 0-.44.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.02 2.57c.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.19.2-.58.2-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
  </svg>
)

export const ChartIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 3v18h18" />
    <path d="M7 15v3M12 10v8M17 6v12" />
  </svg>
)

export const GridIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
)

export const DownloadIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3v12" />
    <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
    <path d="M4 20h16" />
  </svg>
)

export const StampIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.2 12 2.6 2.6L16 9.4" />
  </svg>
)

export const BoxIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m12 3 8 4.2v9.6L12 21l-8-4.2V7.2L12 3Z" />
    <path d="m4 7.2 8 4.2 8-4.2" />
    <path d="M12 11.4V21" />
  </svg>
)

export const UsersIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6" />
    <path d="M17.5 14.4A6 6 0 0 1 21 20" />
  </svg>
)
