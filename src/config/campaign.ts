// ─────────────────────────────────────────────────────────────
//  MÓDULO DE CAMPAÑAS  ·  Single toggle to power the promo banner
//  on/off. Flip `enabled` to false and the banner disappears with
//  zero layout breakage. Edit the copy in-place for new launches.
// ─────────────────────────────────────────────────────────────
export interface CampaignConfig {
  /** Master switch — false hides the banner entirely (no layout shift). */
  enabled: boolean
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
  headline: 'Los primeros en Ecuador arrancan con 2 meses de PRO.',
  subline:
    'Activa tu identidad NFC ahora, entra como fundador a la RED CONNEXO y deja tu tarjeta de papel donde debe estar: en el pasado.',
  ctaLabel: 'QUIERO SER FUNDADOR',
  ctaHref: '#planes',
}
