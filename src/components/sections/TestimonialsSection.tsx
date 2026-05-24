'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const TESTIMONIALS = [
  {
    id:'1', authorName:'Karolína Nováková', initials:'KN', location:'Mladá Boleslav',
    textCs:'Viki u mě byla minulý týden a já fakt koukám do zrcadla každé ráno 😄 Čekala jsem že to bude trapný mít doma cizího člověka ale ona je tak příjemná že jsem to vůbec neřešila. Řasy jsou přesně takový jaký jsem chtěla.',
    rating:5, source:'Google', date:'před 3 dny',
  },
  {
    id:'2', authorName:'Michaela Procházková', initials:'MP', location:'Benátky nad Jizerou',
    textCs:'Nečekala jsem že přijede až do Benátek ale přijela 😊 Seděly jsme u mě v obýváku, povídaly a já měla nové řasy. Úplně jiný zážitek než jet někam do města. Už jsem ji objednala znovu.',
    rating:5, source:'Instagram', date:'před týdnem',
  },
  {
    id:'3', authorName:'Tereza Horáková', initials:'TH', location:'Bakov nad Jizerou',
    textCs:'Dala jsem si objem a jsem z toho stále trochu šílená jak to vypadá dobře 😂 Viki mi vysvětlila co mi bude slušet a měla pravdu. Navíc přijela k nám domů, takže žádné dojíždění. Skvělý.',
    rating:5, source:'Recenze', date:'před 2 týdny',
  },
  {
    id:'4', authorName:'Lucie Kopecká', initials:'LK', location:'Bělá pod Bezdězem',
    textCs:'Říkala jsem si jestli vůbec pojede až sem do Bělé — pojela 😄 Celé to trvalo asi hodinu, popovídaly jsme si a já měla krásné řasy. Dcera se ptala jestli mám upravené obočí nebo co se to stalo haha.',
    rating:5, source:'Facebook', date:'před měsícem',
  },
  {
    id:'5', authorName:'Simona Blahová', initials:'SB', location:'Mladá Boleslav',
    textCs:'Jsem líná chodit do salonu takže tohle je pro mě ideální řešení. Viki přijede, udělá to u mě doma a já nemusím nikam. Řasy mám teď pořád a konečně ráno nevypadám jako strašidlo bez make-upu 😅',
    rating:5, source:'Google', date:'před měsícem',
  },
  {
    id:'6', authorName:'Petra Dvořáčková', initials:'PD', location:'Benátky nad Jizerou',
    textCs:'Klasické řasy — chtěla jsem něco přirozenýho a to jsem taky dostala. Kolegyně v práci si myslely že jsem si nechala udělat jen obočí nebo tak něco. To je přesně co jsem chtěla. Viki poradí a nepřehání to.',
    rating:5, source:'Google', date:'před 2 měsíci',
  },
]

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-gold text-sm mb-5">
      {'★'.repeat(n)}
    </div>
  )
}

function TestimonialCard({ t, paused }: { t: typeof TESTIMONIALS[0]; paused: boolean }) {
  return (
    <div
      className="glass-card flex-shrink-0 w-80 md:w-96 p-8 relative overflow-hidden"
      style={{ cursor: 'none' }}
    >
      <div className="absolute top-0 left-5 font-serif text-[100px] leading-none text-pink-neon/8 pointer-events-none select-none" aria-hidden>"</div>
      <Stars n={t.rating} />
      <p className="text-text-muted font-light leading-relaxed italic mb-6 text-sm relative">{t.textCs}</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-deep to-pink-neon flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
          {t.initials}
        </div>
        <div>
          <div className="text-sm font-medium text-text-primary">{t.authorName}</div>
          <div className="text-xs text-text-dim font-light">{t.location} · {t.source} · {t.date}</div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [paused, setPaused] = useState(false)
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section id="recenze" className="bg-black-2 py-32 overflow-hidden">
      <div className="px-5 md:px-16 mb-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between flex-wrap gap-6"
        >
          <div>
            <div className="section-label mb-5">Recenze klientek</div>
            <h2 className="section-title">Co říkají <em>naše klientky</em></h2>
          </div>
          {/* Pause / Play button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            onClick={() => setPaused(p => !p)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: paused ? 'rgba(255,107,168,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${paused ? 'rgba(255,107,168,0.4)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 10, padding: '8px 16px',
              color: paused ? '#FF6BA8' : 'rgba(245,238,242,0.4)',
              fontFamily: 'Georgia,serif', fontSize: 11, letterSpacing: 2,
              textTransform: 'uppercase', cursor: 'none',
              transition: 'all 0.3s',
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <span style={{ fontSize: 14 }}>{paused ? '▶' : '⏸'}</span>
            {paused ? 'Přehrát' : 'Pozastavit'}
          </motion.button>
        </motion.div>
      </div>

      <div
        className="flex gap-6"
        style={{
          width: 'max-content',
          animation: paused ? 'none' : 'marquee 40s linear infinite',
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} t={t} paused={paused} />
        ))}
      </div>
    </section>
  )
}
