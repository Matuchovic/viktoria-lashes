// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌸 Seeding Viktoria Lashes database...')

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@viktoralashes.cz' },
    update: {},
    create: {
      name: 'Viktoria Admin',
      email: 'admin@viktoralashes.cz',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Services
  const services = [
    {
      name: 'Classic Lashes',
      nameCs: 'Klasické řasy',
      description: 'Natural elegant look, one fiber per lash.',
      descriptionCs: 'Přirozený, elegantní výsledek pro každodenní nošení. Jedno umělé vlákno na každou přírodní řasu pro dokonalý a přirozený efekt.',
      category: 'CLASSIC' as const,
      priceKc: 1490,
      durationMin: 105,
      depositPct: 30,
      sortOrder: 1,
    },
    {
      name: 'Volume Lashes',
      nameCs: 'Objemové řasy',
      description: 'Dramatic full effect with 2D-6D fans.',
      descriptionCs: 'Dramatický a plný efekt s 2D až 6D fanúšky. Ideální pro výraznější, fotogenický look pro každou příležitost.',
      category: 'VOLUME' as const,
      priceKc: 1890,
      durationMin: 135,
      depositPct: 30,
      sortOrder: 2,
    },
    {
      name: 'Mega Volume',
      nameCs: 'Mega Volume',
      description: 'Maximum density 6D-20D technology.',
      descriptionCs: 'Maximální hustota a intenzita. 6D až 20D technologie pro luxusní runway efekt. Absolutní extravagance pro výjimečné příležitosti.',
      category: 'MEGA_VOLUME' as const,
      priceKc: 2490,
      durationMin: 165,
      depositPct: 30,
      sortOrder: 3,
    },
    {
      name: 'Wet Look',
      nameCs: 'Wet Look',
      description: 'Trendy wet mascara effect.',
      descriptionCs: 'Trendový „mokrý" efekt, který imituje čerstvě nanesené řasenky. Dramatický, moderní a naprosto nezapomenutelný výraz.',
      category: 'WET_LOOK' as const,
      priceKc: 2190,
      durationMin: 135,
      depositPct: 30,
      sortOrder: 4,
    },
    {
      name: 'Hybrid Lashes',
      nameCs: 'Hybridní řasy',
      description: 'Mix of classic and volume techniques.',
      descriptionCs: 'Kombinace klasických a objemových technik pro jedinečný výsledek. Textura, hloubka i přirozenost v jednom harmonickém celku.',
      category: 'HYBRID' as const,
      priceKc: 1690,
      durationMin: 125,
      depositPct: 30,
      sortOrder: 5,
    },
    {
      name: 'Infill',
      nameCs: 'Doplnění řas',
      description: 'Maintenance of your existing set.',
      descriptionCs: 'Péče o váš stávající set. Obnovení plnosti a dokonalosti mezi návštěvami. Doporučujeme každé 2–3 týdny.',
      category: 'INFILL' as const,
      priceKc: 890,
      durationMin: 75,
      depositPct: 0,
      sortOrder: 6,
    },
    {
      name: 'Lash Lifting',
      nameCs: 'Lash Lifting',
      description: 'Permanent curl for your natural lashes.',
      descriptionCs: 'Trvalá pro vaše vlastní řasy. Zdvihnutí a zakroucení přirozených řas s barvením pro intenzivní výraz bez umělých vláken.',
      category: 'LIFTING' as const,
      priceKc: 990,
      durationMin: 70,
      depositPct: 0,
      sortOrder: 7,
    },
    {
      name: 'Lash Removal',
      nameCs: 'Odstranění řas',
      description: 'Safe professional lash removal.',
      descriptionCs: 'Bezpečné a šetrné odstranění umělých řas specialistou. Ochrana vašich přirozených řas je naší prioritou.',
      category: 'REMOVAL' as const,
      priceKc: 390,
      durationMin: 25,
      depositPct: 0,
      sortOrder: 8,
    },
  ]

  for (const svc of services) {
    await prisma.service.upsert({
      where: { name: svc.name },
      update: svc,
      create: svc,
    })
  }

  // Artists
  const artists = [
    {
      name: 'Viktoria Semenova',
      titleCs: 'Zakladatelka & Master Stylistka',
      bioCs: 'S více než 8 lety zkušeností a certifikací z Paříže, Milána a Londýna. Specialistka na Mega Volume a unikátní wet look techniky. Vítězka Czech Beauty Awards 2023.',
      yearsExp: 8,
      clientCount: 2000,
      certCount: 12,
      specialties: ['Mega Volume', 'Wet Look', 'Hybridní řasy'],
    },
    {
      name: 'Aneta Dvořáčková',
      titleCs: 'Senior Lash Stylistka',
      bioCs: 'Specialistka na klasické a hybridní techniky. Absolventka London Lash Academy. Její práce se vyznačuje přesností, přirozeností a dokonalou symetrií.',
      yearsExp: 5,
      clientCount: 1200,
      certCount: 8,
      specialties: ['Klasické řasy', 'Hybridní řasy', 'Doplnění'],
    },
    {
      name: 'Kristýna Malá',
      titleCs: 'Lash & Brow Specialistka',
      bioCs: 'Expertka na lash lifting, laminaci obočí a barvení. Kombinuje smysl pro detail s moderními technikami pro komplexní péči o oční rámec.',
      yearsExp: 3,
      clientCount: 600,
      certCount: 6,
      specialties: ['Lash Lifting', 'Klasické řasy', 'Odstranění'],
    },
  ]

  for (const artist of artists) {
    await prisma.artist.upsert({
      where: { name: artist.name },
      update: artist,
      create: artist,
    })
  }

  // Testimonials
  const testimonials = [
    { authorName: 'Karolína Nováková', initials: 'KN', textCs: 'Absolutně neuvěřitelná zkušenost! Viktoria je opravdová profesionálka — výsledek předčil moje největší očekávání. Řasy vypadají tak přirozeně, že každý myslí, že jsem se s nimi narodila.', rating: 5, source: 'Google', date: 'před 3 dny' },
    { authorName: 'Michaela Procházková', initials: 'MP', textCs: 'Studio je naprosto nádherné a celá atmosféra je luxusní. Viktoria je zlatíčko — pečlivě vysvětlila každý krok a výsledek je naprosto dokonalý. Mega volume byly snem!', rating: 5, source: 'Instagram', date: 'před týdnem' },
    { authorName: 'Tereza Horáková', initials: 'TH', textCs: 'Přišla jsem pro objemové řasy a odešla s pocitem absolutní luxusnosti. Wet look efekt je prostě fantastický — dostávám komplimenty každý den. Nejvíce doporučované studio v Praze!', rating: 5, source: 'Recenze', date: 'před 2 týdny' },
    { authorName: 'Lucie Kopecká', initials: 'LK', textCs: 'Online rezervace je tak snadná a pohodlná. Na místě pak čistota a profesionalita na nejvyšší úrovni. Moje řasy vydrží déle než kdekoli jinde. Vracím se každé tři týdny!', rating: 5, source: 'Facebook', date: 'před měsícem' },
    { authorName: 'Simona Blahová', initials: 'SB', textCs: 'Lash lifting byl fantastická volba — moje vlastní řasy nikdy nevypadaly tak krásně! Přirozené, trvají 6 týdnů a ráno se prostě probudím krásná. Viktoria je génius!', rating: 5, source: 'Google', date: 'před měsícem' },
  ]

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: { ...t, isActive: true } }).catch(() => {})
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
