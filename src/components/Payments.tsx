import { motion } from 'framer-motion'
import type { ComponentType, SVGProps } from 'react'
import { LinkIcon, CardIcon, BankIcon, WhatsappIcon } from './icons'
import SectionKicker from './SectionKicker'
import { BeamDivider } from './fx/Motion'

interface Method {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  name: string
  desc: string
}

// Fuente: manual cap. 23.5. Se activan por separado y solo aparecen en la
// ficha del producto los que estén activos.
const METHODS: Method[] = [
  {
    icon: LinkIcon,
    name: 'Link de pago',
    desc: 'Pegas tu enlace de cobro y el cliente llega con el monto ya cargado. Sin calculadoras ni malentendidos.',
  },
  {
    icon: CardIcon,
    name: 'PayPhone',
    desc: 'Pasarela integrada: el cliente paga con tarjeta sin salir de tu perfil.',
  },
  {
    icon: BankIcon,
    name: 'Transferencia',
    desc: 'Banco, cuenta y titular a la vista. El cliente copia el número y te manda el comprobante.',
  },
  {
    icon: WhatsappIcon,
    name: 'WhatsApp',
    desc: 'Abre el chat con el detalle y el monto ya escritos. Para cerrar a la antigua, pero sin escribir a mano.',
  },
]

export default function Payments() {
  return (
    <section id="cobros" className="relative overflow-hidden bg-abyss-900 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0">
        <BeamDivider />
      </div>

      <div className="section-pad relative">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4">
            <SectionKicker label="que el dinero no espere" />
          </div>
          <h2 className="font-heading text-3xl text-white sm:text-4xl">
            Cuatro maneras de cobrar. Prendes las que uses y apagas el resto.
          </h2>
          <p className="mt-4 text-white/55">
            El precio que ve tu cliente ya trae aplicado su descuento de miembro.
            Nadie tiene que sacar cuentas en el mostrador.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {METHODS.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-abyss-800 p-6 transition-colors hover:border-connexo/40"
            >
              <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-connexo/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-connexo/30 bg-connexo/10 text-connexo">
                <m.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold text-white">{m.name}</h3>
              <p className="text-sm leading-relaxed text-white/55">{m.desc}</p>
            </motion.div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-white/40">
          ¿Te piden factura? El cliente la solicita desde la misma pantalla de
          confirmación, con RUC y razón social. Si es miembro del club, esos datos
          ya vienen llenos.
        </p>
      </div>
    </section>
  )
}
