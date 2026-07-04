import { motion } from 'framer-motion'
import { campaign } from '../config/campaign'
import { SparkIcon, ArrowIcon } from './icons'

// Dynamic promo banner. Controlled entirely by `campaign.enabled`.
// When false → renders nothing, no layout shift, no leftover spacing.
export default function CampaignBanner() {
  if (!campaign.enabled) return null

  return (
    <section aria-label="Campaña" className="relative bg-abyss-950 pb-8">
      <div className="section-pad">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-connexo/40 bg-gradient-to-br from-connexo/20 via-abyss-800 to-black p-8 sm:p-10"
        >
          {/* Glow accents */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-connexo/30 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-grid-nodes [background-size:26px_26px] opacity-20" />

          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-connexo/50 bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-connexo">
                <SparkIcon className="h-3.5 w-3.5" />
                {campaign.eyebrow}
              </span>
              <h3 className="mt-4 font-heading text-2xl leading-tight text-white sm:text-3xl">
                {campaign.headline}
              </h3>
              <p className="mt-2 text-sm text-white/65 sm:text-base">
                {campaign.subline}
              </p>
            </div>

            <a
              href={campaign.ctaHref}
              className="btn-cta group shrink-0 text-base"
            >
              {campaign.ctaLabel}
              <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
