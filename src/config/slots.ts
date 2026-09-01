// ─────────────────────────────────────────────────────────────
//  CUPOS DE ENTREVISTA  ·  reserva con bloqueo.
//
//  El candidato a vendedor elige día y hora y recibe un CÓDIGO de entrevista.
//  Requisito: si alguien agenda un cupo, nadie más puede agendar ESE cupo.
//
//  Ese bloqueo necesita estado COMPARTIDO entre visitantes → un servidor. El
//  sitio es estático, así que hay dos caminos y este módulo los conmuta solo:
//
//  1. SUPABASE (bloqueo REAL entre todos) — si defines `VITE_SUPABASE_URL` y
//     `VITE_SUPABASE_ANON_KEY`. La tabla `interview_slots` tiene `slot_id` como
//     PRIMARY KEY: dos personas no pueden insertar el mismo cupo (la 2.ª recibe
//     409 y el cupo se marca ocupado). Se habla por REST con `fetch`, sin SDK
//     (mantiene el repo sin dependencias nuevas, coherente con el router propio).
//     SQL y políticas RLS: ver el bloque al pie de este archivo.
//
//  2. LOCALSTORAGE (respaldo interino) — si no hay Supabase. SOLO evita doble
//     reserva EN EL MISMO NAVEGADOR; NO bloquea entre dispositivos. Sirve para
//     probar la UX, no para producción. La UI avisa cuando corre en este modo.
// ─────────────────────────────────────────────────────────────

import { INTERVIEW } from '../data/careers'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const TABLE = 'interview_slots'
const LOCAL_KEY = 'connexo-interview-slots'

/** ¿Hay bloqueo real (Supabase) o solo el respaldo local? */
export function isRemoteBooking(): boolean {
  return Boolean(SUPABASE_URL?.startsWith('https://') && SUPABASE_ANON_KEY)
}

function restHeaders(): Record<string, string> {
  return {
    apikey: SUPABASE_ANON_KEY as string,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  }
}

// ── Respaldo local ────────────────────────────────────────────
function localTaken(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_KEY) ?? '{}')
  } catch {
    return {}
  }
}
function localSave(map: Record<string, string>) {
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(map))
  } catch {
    /* cuota llena o storage bloqueado: no es fatal para la UX */
  }
}

// ── Código de entrevista ──────────────────────────────────────
// Sin caracteres ambiguos (0/O, 1/I) para poder dictarlo por teléfono.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export function makeInterviewCode(): string {
  let out = ''
  const arr = new Uint32Array(6)
  crypto.getRandomValues(arr)
  for (const n of arr) out += CODE_ALPHABET[n % CODE_ALPHABET.length]
  return `${INTERVIEW.codePrefix}-${out}`
}

// ── API pública ───────────────────────────────────────────────
export type BookResult =
  | { ok: true; code: string }
  | { ok: false; reason: 'taken' | 'error' }

export interface SlotMeta {
  code: string
  name: string
  whatsapp: string
  city: string
}

/** Cupos ya ocupados (sus `slot_id`), para deshabilitarlos en la UI. */
export async function getTakenSlots(): Promise<Set<string>> {
  if (isRemoteBooking()) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?select=slot_id`, {
        headers: restHeaders(),
      })
      if (!res.ok) return new Set()
      const rows = (await res.json()) as { slot_id: string }[]
      return new Set(rows.map((r) => r.slot_id))
    } catch {
      return new Set()
    }
  }
  return new Set(Object.keys(localTaken()))
}

/**
 * Reserva un cupo. Devuelve el código si se logró; `taken` si otra persona lo
 * tomó primero; `error` ante un fallo de red/servidor (el llamador respalda).
 */
export async function bookSlot(slotId: string, meta: SlotMeta): Promise<BookResult> {
  if (isRemoteBooking()) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
        method: 'POST',
        headers: { ...restHeaders(), Prefer: 'return=minimal' },
        body: JSON.stringify({
          slot_id: slotId,
          code: meta.code,
          name: meta.name,
          whatsapp: meta.whatsapp,
          city: meta.city,
        }),
      })
      if (res.ok) return { ok: true, code: meta.code }
      // 409 = violación de PK: alguien reservó ese cupo primero.
      if (res.status === 409) return { ok: false, reason: 'taken' }
      return { ok: false, reason: 'error' }
    } catch {
      return { ok: false, reason: 'error' }
    }
  }

  // Respaldo local: chequeo + escritura (solo este navegador).
  const map = localTaken()
  if (map[slotId]) return { ok: false, reason: 'taken' }
  map[slotId] = meta.code
  localSave(map)
  return { ok: true, code: meta.code }
}

/*
  SQL para Supabase (ejecutar una vez en el proyecto que uses):

  create table if not exists public.interview_slots (
    slot_id     text primary key,            -- "YYYY-MM-DD_HH" (bloquea el cupo)
    code        text not null,
    name        text,
    whatsapp    text,
    city        text,
    created_at  timestamptz not null default now()
  );

  alter table public.interview_slots enable row level security;

  -- Cualquiera puede VER qué cupos están ocupados (solo se lee slot_id en la app).
  create policy "slots_select_anon" on public.interview_slots
    for select using (true);

  -- Cualquiera puede RESERVAR (insertar). La PK impide duplicar un cupo.
  create policy "slots_insert_anon" on public.interview_slots
    for insert with check (true);

  -- Nadie puede editar ni borrar desde el cliente (sin políticas update/delete).
*/
