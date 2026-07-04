// ─────────────────────────────────────────────────────────────
//  MÓDULO DE CAMPAÑAS  ·  Single toggle to power the promo banner
//  on/off. Flip `enabled` to false and the banner disappears with
//  zero layout breakage. Edit the copy in-place for new launches.
// ─────────────────────────────────────────────────────────────
export interface CampaignConfig {
  /** Master switch — false hides the banner entirely (no layout shift). */
  enabled: boolean
  /** Small eyebrow / kicker above the headline. */
  eyebrow: string
  /** Main promotional claim (rendered with impact font). */
  headline: string
  /** Supporting one-liner. */
  subline: string
  /** CTA label. */
  ctaLabel: string
  /** CTA target (anchor or URL). */
  ctaHref: string
}

export const campaign: CampaignConfig = {
  enabled: true,
  eyebrow: 'LANZAMIENTO ECUADOR · CUPOS LIMITADOS',
  headline: '2 meses de PRO gratis en tu primer perfil.',
  subline:
    'Activa tu identidad digital NFC ahora y asegura tu lugar en la RED CONNEXO antes del cierre de cupos.',
  ctaLabel: 'RECLAMAR PROMO',
  ctaHref: '#planes',
}
