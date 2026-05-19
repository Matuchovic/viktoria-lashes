'use client'
// src/components/sections/TestimonialsSection.tsx
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const TESTIMONIALS = [
  { id:'1', authorName:'Karolína Nováková',   initials:'KN', textCs:'Absolutně neuvěřitelná zkušenost! Viktoria je opravdová profesionálka — výsledek předčil moje největší očekávání. Řasy vypadají tak přirozeně, že každý myslí, že jsem se s nimi narodila.', rating:5, source:'Google',    date:'před 3 dny' },
  { id:'2', authorName:'Michaela Procházková',initials:'MP', textCs:'Studio je naprosto nádherné a celá atmosféra je luxusní. Viktoria je zlatíčko — pečlivě vysvětlila každý krok a výsledek je naprosto dokonalý. Mega volume byly snem!',                     rating:5, source:'Instagram', date:'před týdnem' },
  { id:'3', authorName:'Tereza Horáková',     initials:'TH', textCs:'Přišla jsem pro objemové řasy a odešla s pocitem absolutní luxusnosti. Wet look efekt je prostě fantastický — dostávám komplimenty každý den. Nejvíce doporučované studio v Praze!',          rating:5, source:'Recenze',   date:'před 2 týdny' },
  { id:'4', authorName:'Lucie Kopecká',       initials:'LK', textCs:'Online rezervace je tak snadná a pohodlná. Na místě pak čistota a profesionalita na nejvyšší úrovni. Moje řasy vydrží déle než kdekoli jinde. Vracím se každé tři týdny!',                    rating:5, source:'Facebook',  date:'před měsícem' },
  { id:'5', authorName:'Simona Blahová',      initials:'SB', textCs:'Lash lifting byl fantastická volba — moje vlastní řasy nikdy nevypadaly tak krásně! Přirozené, trvají 6 týdnů a ráno se prostě probudím krásná. Viktoria je génius!',                        rating:5, source:'Google',    date:'před měsícem' },
]

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[0] }) {
  return (
    <div className="glass-card flex-shrink-0 w-96 p-10 relative overflow-hidden">
      <div
        className="absolute top-0 left-5 font-serif text-[120px] leading-none text-pink-neon/10 pointer-events-none select-none"
        aria-hidden
      >
        "
      </div>
      <div className="flex gap-1 mb-5 text-gold text-sm">
        {'★'.repeat(t.rating)}
      </div>
      <p className="text-text-muted font-light leading-relaxed italic mb-8 text-sm relative">
        {t.textCs}
      </p>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-deep to-pink-neon flex items-center justify-center text-white font-medium text-xs">
          {t.initials}
        </div>
        <div>
          <div className="text-sm font-medium text-text-primary">{t.authorName}</div>
          <div className="text-xs text-text-dim font-light">{t.source} · {t.date}</div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section id="recenze" className="bg-black-2 py-32 overflow-hidden">
      <div className="px-8 md:px-16 mb-16">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="section-label mb-5">Recenze klientek</div>
          <h2 className="section-title">
            Co říkají <em>naše klientky</em>
          </h2>
        </motion.div>
      </div>

      <div className="flex gap-6 animate-marquee" style={{ width: 'max-content' }}>
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} t={t} />
        ))}
      </div>
    </section>
  )
}
