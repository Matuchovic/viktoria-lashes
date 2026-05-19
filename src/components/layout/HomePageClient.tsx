'use client'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { HeroSection } from '@/components/sections/HeroSection'
import { StatsBanner } from '@/components/sections/StatsBanner'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { ArtistsSection } from '@/components/sections/ArtistsSection'
import { ContactSection } from '@/components/sections/ContactSection'

export function HomePageClient({ services }: { services: any[] }) {
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowLoader(false), 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <LoadingScreen show={showLoader} />
      <CustomCursor />
      <Navbar />
      <main className="page-enter">
        <HeroSection />
        <StatsBanner />
        <ServicesSection services={services.length ? services : undefined} />
        <TestimonialsSection />
        <ArtistsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
