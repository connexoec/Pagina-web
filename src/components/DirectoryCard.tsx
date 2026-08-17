import { motion } from 'framer-motion'
import type { Member } from '../data/directory'
import { ecosystems } from '../data/ecosystems'
import { ArrowIcon, CheckIcon, SignalIcon } from './icons'
import { TiltCard } from './fx/Motion'
import { wa, waMsg } from '../config/site'

/** Nombre legible del rubro a partir de su id. */
function rubroName(id: string) {
  return ecosystems.find((e) => e.id === id)?.name ?? id
}

/** Código de nodo estable, derivado del id. Puro cosmético, pero da identidad. */
function nodeCode(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return `CX-${String(h % 10000).padStart(4, '0')}`
}

/**
 * Portada de la ficha. Tres casos, en este orden:
 *  1. `logo`  → contenido y con aire. Un logotipo recortado a la caja se ve
 *               roto, así que NUNCA se usa `object-cover` aquí.
 *  2. `image` → foto o portada: sí se recorta a la caja.
 *  3. nada    → se dibuja sola con la inicial. Nunca queda un hueco gris.
 */
function Cover({ member }: { member: Member }) {
  if (member.logo) {
    return (
      <>
        <div className="absolute inset-0 bg-grid-nodes [background-size:20px_20px] opacity-20" />
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-connexo/15 blur-2xl" />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <img
            src={member.logo}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
      </>
    )
  }

  if (member.image) {
    return (
      <img
        src={member.image}
        alt={member.name}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
    )
  }

  return (
    <>
      <div className="absolute inset-0 bg-grid-nodes [background-size:20px_20px] opacity-25" />
      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-connexo/15 blur-2xl" />
      <span className="absolute inset-0 flex items-center justify-center font-heading text-6xl text-white/[0.13]">
        {member.name.charAt(0).toUpperCase()}
      </span>
    </>
  )
}

/** Ficha de un negocio de la RED. */
export function MemberCard({ member, index }: { member: Member; index: number }) {
  const hasMeta = Boolean(member.ecosystem || member.city)

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.05 }}
    >
      <TiltCard
        max={6}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-abyss-800 transition-colors duration-300 hover:border-connexo/50"
      >
        {/* Barrido de escaneo al pasar el cursor */}
        <div className="pointer-events-none absolute inset-x-0 -top-px z-10 h-px bg-gradient-to-r from-transparent via-connexo to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Portada */}
        <div className="relative h-40 shrink-0 overflow-hidden bg-gradient-to-br from-abyss-700 via-abyss-800 to-black">
          <Cover member={member} />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss-800 via-transparent to-transparent" />

          <span className="absolute left-3 top-3 rounded-md bg-black/60 px-2 py-1 font-mono text-[10px] tracking-wider text-white/50 backdrop-blur-sm">
            {nodeCode(member.id)}
          </span>

          {member.verified && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-connexo px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
              <CheckIcon className="h-3 w-3" />
              Verificado
            </span>
          )}
        </div>

        {/* Cuerpo */}
        <div className="flex flex-1 flex-col p-5">
          {hasMeta && (
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {member.ecosystem && (
                <span className="rounded-full border border-connexo/30 bg-connexo/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-connexo">
                  {rubroName(member.ecosystem)}
                </span>
              )}
              {member.city && (
                <span className="text-[11px] text-white/40">{member.city}</span>
              )}
            </div>
          )}

          <h3 className="font-heading text-xl leading-tight text-white">
            {member.name}
          </h3>

          {member.what && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/55">
              {member.what}
            </p>
          )}

          {/* `mt-auto` mantiene el enlace abajo aunque la ficha tenga menos
              datos: todas las tarjetas de la fila terminan alineadas. */}
          <a
            href={member.profile}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-connexo transition-colors hover:text-connexo-300"
          >
            Abrir su perfil
            <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </TiltCard>
    </motion.div>
  )
}

/** Espacio todavía sin dueño. Se dibuja después de los miembros reales. */
export function OpenSlotCard({ index }: { index: number }) {
  return (
    <motion.a
      href={wa(waMsg.red)}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.05 }}
      className="group relative flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.12] bg-black/30 p-6 text-center transition-colors duration-300 hover:border-connexo/50 hover:bg-connexo/[0.04]"
    >
      <div className="absolute inset-0 rounded-2xl bg-grid-nodes [background-size:20px_20px] opacity-[0.12]" />

      <span className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 text-white/30 transition-colors group-hover:border-connexo/40 group-hover:text-connexo">
        <SignalIcon className="h-6 w-6" />
      </span>

      <span className="relative mt-4 font-heading text-lg text-white/60 transition-colors group-hover:text-white">
        Este lugar está libre
      </span>
      <span className="relative mt-1.5 max-w-[15rem] text-xs leading-relaxed text-white/35">
        La red está abriendo. Entrar ahora cuesta lo mismo que entrar después,
        pero no se ve igual.
      </span>
      <span className="relative mt-4 text-xs font-semibold text-connexo opacity-0 transition-opacity group-hover:opacity-100">
        Reclamar mi nodo →
      </span>
    </motion.a>
  )
}
