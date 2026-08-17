import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { comparison, type Availability } from '../data/pricing'
import { CheckIcon } from './icons'

/**
 * Comparador plan por plan, tomado literal del manual (cap. 2.1).
 * Incluye el estado "según tu rubro" porque el producto es así: esconderlo
 * vende una vez y genera un reclamo después.
 */
function Cell({ value }: { value: Availability }) {
  if (value === true) {
    return (
      <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-connexo/15 text-connexo">
        <CheckIcon className="h-3.5 w-3.5" />
      </span>
    )
  }
  if (value === 'partial') {
    return (
      <span className="mx-auto block w-fit rounded-full border border-connexo/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-connexo/80">
        Según rubro
      </span>
    )
  }
  return <span className="mx-auto block h-px w-3 bg-white/15" />
}

export default function PlanMatrix() {
  return (
    <div className="section-pad mt-20">
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="font-heading text-2xl text-white sm:text-3xl">
          Lo que entra en cada plan, sin letra chica.
        </h3>
        <p className="mt-3 text-sm text-white/50">
          Los planes son acumulativos: PRO trae todo CONECTA, y ULTRA trae todo PRO.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="mx-auto mt-10 max-w-4xl overflow-x-auto rounded-2xl border border-white/[0.07] bg-abyss-800"
      >
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-white/[0.07]">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/40">
                Función
              </th>
              {['Conecta', 'Pro', 'Ultra'].map((p) => (
                <th
                  key={p}
                  className={`w-[104px] px-3 py-4 text-center font-heading text-base ${
                    p === 'Pro' ? 'text-connexo' : 'text-white/80'
                  }`}
                >
                  {p.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {comparison.map((group) => (
              <Fragment key={group.group}>
                <tr className="bg-white/[0.02]">
                  <td
                    colSpan={4}
                    className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-connexo/70"
                  >
                    {group.group}
                  </td>
                </tr>
                {group.rows.map((row) => (
                  <tr
                    key={row.label}
                    className="border-t border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3 text-white/70">{row.label}</td>
                    <td className="px-3 py-3 text-center">
                      <Cell value={row.conecta} />
                    </td>
                    <td className="bg-connexo/[0.03] px-3 py-3 text-center">
                      <Cell value={row.pro} />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Cell value={row.ultra} />
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </motion.div>

      <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-relaxed text-white/35">
        "Según rubro": en E-commerce las citas con vendedores entran desde PRO; en
        barbería, gastronomía, petcare y salud las reservas son de ULTRA. El plan y
        el rubro los activa Connexo al crear tu cuenta.
      </p>
    </div>
  )
}
