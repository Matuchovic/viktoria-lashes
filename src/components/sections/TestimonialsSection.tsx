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
    <div style={{ color:'#D4AA70', fontSize:14, marginBottom:16, letterSpacing:2 }}>
      {'★'.repeat(n)}
    </div>
  )
}

export function TestimonialsSection() {
  const ref = useRef(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [active, setActive] = useState(0)

  const scrollTo = (i: number) => {
    const el = scrollRef.current
    if (!el) return
    const card = el.children[i] as HTMLElement
    if (!card) return
    el.scrollTo({ left: card.offsetLeft - 20, behavior: 'smooth' })
    setActive(i)
  }

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const center = el.scrollLeft + el.clientWidth / 2
    let closest = 0
    let minDist = Infinity
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement
      const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center)
      if (dist < minDist) { minDist = dist; closest = i }
    })
    setActive(closest)
  }

  return (
    <section id="recenze" style={{ background:'#080608', paddingTop:80, paddingBottom:80, overflow:'hidden' }}>
      <div style={{ padding:'0 20px 0', maxWidth:1200, margin:'0 auto' }}>
        <motion.div ref={ref} initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8}}
          style={{ marginBottom:36 }}>
          <div className="section-label" style={{ marginBottom:16 }}>Recenze klientek</div>
          <h2 className="section-title">Co říkají <em>naše klientky</em></h2>
        </motion.div>
      </div>

      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          display:'flex',
          gap:16,
          overflowX:'auto',
          paddingLeft:20,
          paddingRight:20,
          paddingBottom:12,
          scrollSnapType:'x mandatory',
          WebkitOverflowScrolling:'touch',
          scrollbarWidth:'none',
          msOverflowStyle:'none',
          cursor:'grab',
        }}
        className="no-scrollbar"
      >
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{opacity:0, y:20}}
            animate={inView ? {opacity:1, y:0} : {}}
            transition={{delay: i * 0.1, duration:0.6}}
            style={{
              flexShrink:0,
              width:'min(340px, 80vw)',

              background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,107,168,0.15)',
              borderRadius:20,
              padding:24,
              position:'relative',
              overflow:'hidden',
            }}
          >
            <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.4),rgba(212,170,112,0.2),transparent)' }}/>
            {/* Quote mark */}
            <div style={{ fontFamily:'Georgia,serif', fontSize:80, lineHeight:0.8, color:'rgba(255,107,168,0.08)', position:'absolute', top:16, left:16, pointerEvents:'none', userSelect:'none' }}>"</div>

            <Stars n={t.rating} />
            <p style={{ fontFamily:'Georgia,serif', fontSize:14, fontWeight:300, lineHeight:1.75, color:'rgba(245,238,242,0.7)', fontStyle:'italic', marginBottom:24, position:'relative' }}>
              {t.textCs}
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#C4698A,#FF6BA8)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Georgia,serif', fontSize:14, color:'white', flexShrink:0 }}>
                {t.initials}
              </div>
              <div>
                <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.85)' }}>{t.authorName}</div>
                <div style={{ fontFamily:'Georgia,serif', fontSize:10, color:'rgba(245,238,242,0.3)' }}>{t.location} · {t.source} · {t.date}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dot navigation */}
      <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:20 }}>
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            style={{
              width: active===i ? 24 : 8,
              height:8,
              borderRadius:20,
              border:'none',
              background: active===i ? '#FF6BA8' : 'rgba(255,107,168,0.25)',
              cursor:'pointer',
              transition:'all 0.3s ease',
              padding:0,
            }}
          />
        ))}
      </div>
    </section>
  )
}
