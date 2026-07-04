import { SignalIcon } from './icons'

/**
 * Marcador de sección — la firma visual de Connexo.
 * Reemplaza el clásico "eyebrow" mayúsculas+tracking (genérico de landings IA)
 * por el glifo de señal NFC + una etiqueta en minúscula con voz propia.
 */
export default function SectionKicker({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2.5 align-middle text-sm font-medium lowercase tracking-tight text-white/55">
      <SignalIcon className="h-[18px] w-[18px] text-connexo" />
      {label}
      <span className="h-px w-8 bg-gradient-to-r from-connexo/60 to-transparent" />
    </span>
  )
}
