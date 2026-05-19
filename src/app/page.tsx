// src/app/page.tsx
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { HeroSection } from '@/components/sections/HeroSection'
import { StatsBanner } from '@/components/sections/StatsBanner'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { ArtistsSection } from '@/components/sections/ArtistsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  // Fetch real data from DB, fall back to static if DB not ready
  let services = []
  try {
    services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
  } catch {}

  return (
    <>
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
