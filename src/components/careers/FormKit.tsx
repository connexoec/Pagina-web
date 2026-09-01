import {
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
  useId,
} from 'react'

// ─────────────────────────────────────────────────────────────
//  PRIMITIVAS DE FORMULARIO  ·  compartidas por los formularios de /trabaja.
//  Presentacionales y accesibles: cada campo enlaza label ↔ control y expone
//  aria-invalid + un mensaje de error asociado. La lógica vive en cada form.
//  Coherente con la marca: superficies negras, foco naranja, sin color extra.
// ─────────────────────────────────────────────────────────────

const controlBase =
  'w-full rounded-xl border bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 ' +
  'transition-colors focus:outline-none focus:ring-1 focus:ring-connexo/40 focus:border-connexo/60'

function borderFor(invalid?: boolean) {
  return invalid ? 'border-red-500/70' : 'border-white/10'
}

/** Envoltura de un campo: etiqueta, marca de obligatorio, pista y error. */
export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline gap-1 text-sm font-medium text-white/80">
        {label}
        {required && (
          <span className="text-connexo" aria-hidden>
            *
          </span>
        )}
        {hint && <span className="ml-auto text-xs font-normal text-white/35">{hint}</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }

export function TextInput({ invalid, className = '', ...rest }: TextInputProps) {
  return (
    <input
      {...rest}
      aria-invalid={invalid || undefined}
      className={`${controlBase} ${borderFor(invalid)} ${className}`}
    />
  )
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }

export function TextArea({ invalid, className = '', ...rest }: TextAreaProps) {
  return (
    <textarea
      {...rest}
      aria-invalid={invalid || undefined}
      className={`${controlBase} resize-none ${borderFor(invalid)} ${className}`}
    />
  )
}

/**
 * Grupo de chips seleccionables. `selected` es SIEMPRE un array: en modo simple
 * guarda 0 o 1 valor; en `multiple`, los que estén activos. Un clic sobre el ya
 * activo lo deselecciona (útil para dejar un campo opcional vacío).
 */
export function ChipGroup({
  options,
  selected,
  onSelect,
  multiple = false,
  ariaLabel,
}: {
  options: readonly { value: string; label: string; hint?: string }[]
  selected: string[]
  onSelect: (next: string[]) => void
  multiple?: boolean
  ariaLabel: string
}) {
  const toggle = (value: string) => {
    const isOn = selected.includes(value)
    if (multiple) {
      onSelect(isOn ? selected.filter((v) => v !== value) : [...selected, value])
    } else {
      onSelect(isOn ? [] : [value])
    }
  }

  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const isOn = selected.includes(o.value)
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            aria-pressed={isOn}
            title={o.hint}
            className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-all active:scale-[0.97] ${
              isOn
                ? 'border-connexo bg-connexo text-black'
                : 'border-white/10 text-white/60 hover:border-white/25 hover:text-white'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Trampa anti-spam invisible. Un bot rellena todos los campos; si este viene
 * con texto, se descarta el envío. Sale del flujo visual y del tab-order.
 */
export function Honeypot({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const id = useId()
  return (
    <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden" style={{ opacity: 0 }}>
      <label htmlFor={id}>No llenar</label>
      <input
        id={id}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
