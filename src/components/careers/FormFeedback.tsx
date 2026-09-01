import { motion } from 'framer-motion'
import { Magnetic } from '../fx/Motion'
import { CheckIcon, SendIcon, SpinnerIcon, WhatsappIcon } from '../icons'

// ─────────────────────────────────────────────────────────────
//  Estados de envío de los formularios de /trabaja.
//  · idle → botón de enviar (magnético).
//  · sending → botón con aro girando, deshabilitado.
//  · success → tarjeta de confirmación.
//  · error → tarjeta con respaldo a WhatsApp (nunca se pierde el lead).
// ─────────────────────────────────────────────────────────────

export type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export function SubmitButton({
  status,
  label,
}: {
  status: FormStatus
  label: string
}) {
  const sending = status === 'sending'
  return (
    <Magnetic className="w-full">
      <button
        type="submit"
        disabled={sending}
        className="btn-cta group w-full py-3.5 text-sm tracking-wide disabled:cursor-wait disabled:opacity-80"
      >
        {sending ? (
          <>
            <SpinnerIcon className="h-5 w-5 animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            {label}
            <SendIcon className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        )}
      </button>
    </Magnetic>
  )
}

/** Tarjeta de éxito. Se muestra en lugar del formulario tras enviar. */
export function SuccessCard({
  title,
  body,
  onReset,
}: {
  title: string
  body: string
  onReset: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-connexo/30 bg-abyss-800 p-8 text-center shadow-glow"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 16 }}
        className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-connexo/15"
      >
        <CheckIcon className="h-8 w-8 text-connexo" />
      </motion.div>
      <h3 className="font-heading text-2xl text-white">{title}</h3>
      <p className="mx-auto mt-3 max-w-sm text-sm text-white/55">{body}</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 text-sm font-semibold text-connexo hover:underline"
      >
        Enviar otra postulación
      </button>
    </motion.div>
  )
}

/**
 * Aviso de error EN LÍNEA (no reemplaza el formulario): los datos siguen ahí
 * para reintentar, y ofrece el respaldo por WhatsApp con el mensaje prellenado.
 */
export function ErrorNotice({ waHref }: { waHref: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-white/80"
      role="alert"
    >
      <p className="font-medium text-red-300">No pudimos enviar tu postulación.</p>
      <p className="mt-1 text-white/60">
        Puede ser la conexión. Reintenta el envío, o escríbenos directo por WhatsApp
        y no pierdes nada de lo que llenaste.
      </p>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 font-semibold text-connexo hover:underline"
      >
        <WhatsappIcon className="h-4 w-4" />
        Escribir por WhatsApp
      </a>
    </motion.div>
  )
}
