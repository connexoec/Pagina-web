import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Mechanism from './components/Mechanism'

// Below-the-fold sections are code-split → smaller initial bundle, faster paint.
const EcosystemsCarousel = lazy(() => import('./components/EcosystemsCarousel'))
const Platform = lazy(() => import('./components/Platform'))
const Operations = lazy(() => import('./components/Operations'))
const Membership = lazy(() => import('./components/Membership'))
const Payments = lazy(() => import('./components/Payments'))
const Analytics = lazy(() => import('./components/Analytics'))
// Solo la banda que invita: el directorio vive en su propia página (/red).
const RedTeaser = lazy(() => import('./components/RedTeaser'))
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
          <Platform />
          <Operations />
          <Membership />
          <Payments />
          <Analytics />
          <RedTeaser />
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
