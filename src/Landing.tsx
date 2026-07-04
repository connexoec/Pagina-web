import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Mechanism from './components/Mechanism'

// Below-the-fold sections are code-split → smaller initial bundle, faster paint.
const EcosystemsCarousel = lazy(() => import('./components/EcosystemsCarousel'))
const RedConnexo = lazy(() => import('./components/RedConnexo'))
const Pricing = lazy(() => import('./components/Pricing'))
const Arupo = lazy(() => import('./components/Arupo'))
const CampaignBanner = lazy(() => import('./components/CampaignBanner'))
const Footer = lazy(() => import('./components/Footer'))

// Neutral placeholder keeps layout height stable while a chunk loads.
function SectionFallback() {
  return <div className="min-h-[320px] w-full bg-abyss-950" aria-hidden />
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-abyss-950 text-white/90">
      <Navbar />
      <main>
        <Hero />
        <Mechanism />
        <Suspense fallback={<SectionFallback />}>
          <EcosystemsCarousel />
          <RedConnexo />
          <Pricing />
          <Arupo />
          <CampaignBanner />
        </Suspense>
      </main>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
    </div>
  )
}
