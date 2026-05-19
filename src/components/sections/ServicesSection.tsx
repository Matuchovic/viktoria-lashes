'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

const SERVICES = [
  { id:'1', num:'01', icon:'✦', nameCs:'Klasické řasy',  tag:'50D – 60D',        tagSub:'Možnost si určit velikost', descriptionCs:'Přirozený, elegantní výsledek a přirozený efekt pro každodenní nošení.',                                                              priceKc:499, durationLabel:'cca 15 – 45 min', glowColor:'#C4698A' },
  { id:'2', num:'02', icon:'❋', nameCs:'Objemové řasy',  tag:'80D',              tagSub:'Možnost si určit velikost', descriptionCs:'Dramatický a plný efekt. Ideální pro výraznější, fotogenický look pro každou příležitost.',                                             priceKc:599, durationLabel:'cca 20 – 60 min', glowColor:'#FF6BA8' },
  { id:'3', num:'03', icon:'✸', nameCs:'Mega Volume',    tag:'100D',             tagSub:'Absolutní extravagance',   descriptionCs:'Maximální hustota a intenzita. Absolutní extravagance pro výjimečné příležitosti.',                                                       priceKc:799, durationLabel:'cca 30 – 60 min', glowColor:'#D4AA70' },
  { id:'4', num:'04', icon:'◈', nameCs:'Wet Look',       tag:'60D',              tagSub:'Možnost si určit velikost', descriptionCs:'Trendový „mokrý" efekt, který imituje čerstvě nanesené řasenky. Dramatický, moderní a naprosto nezapomenutelný výraz.',                 priceKc:999, durationLabel:'cca 30 – 60 min', glowColor:'#E8A4BE' },
  { id:'5', num:'05', icon:'◉', nameCs:'Doplnění řas',   tag:'Každé 2–3 týdny', tagSub:'Doporučená péče',          descriptionCs:'Péče o váš stávající set. Obnovení plnosti a dokonalosti mezi návštěvami.',                                                             priceKc:199, durationLabel:'cca 15 – 20 min', glowColor:'#C4698A' },
  { id:'6', num:'06', icon:'○', nameCs:'Odstranění řas', tag:'Šetrné & bezpečné',tagSub:'Ochrana přírodních řas',  descriptionCs:'Bezpečné a šetrné odstranění umělých řas. Ochrana vašich přirozených řas je naší prioritou.',                                            priceKc:99,  durationLabel:'25 min',           glowColor:'#FF6BA8' },
]

// Hover stav řízený čistě přes useState + inline style transition (žádný CSS animation hack)
function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin:'-60px' })
  const [hov, setHov] = useState(false)

  const gc = service.glowColor

  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:60 }}
      animate={inView?{opacity:1,y:0}:{}}
      transition={{ duration:0.8, delay:(index%3)*0.12, ease:[0.16,1,0.3,1] }}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      className="relative flex flex-col overflow-hidden cursor-none"
      style={{
        background: hov ? `${gc}12` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hov ? gc+'70' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hov ? `0 0 50px ${gc}25, inset 0 1px 0 ${gc}30` : 'none',
        transition: 'background 0.4s, border-color 0.4s, box-shadow 0.4s',
      }}
    >
      {/* Top accent */}
      <div style={{
        position:'absolute',top:0,left:0,right:0,height:2,
        background:`linear-gradient(90deg,transparent,${gc},transparent)`,
        opacity: hov ? 1 : 0,
        transform: hov ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin:'left',
        transition:'opacity 0.4s, transform 0.5s cubic-bezier(0.16,1,0.3,1)',
      }}/>

      <div className="relative z-10 p-8 flex flex-col h-full">
        {/* Num + rotating icon */}
        <div className="flex items-start justify-between mb-6">
          <span className="font-serif text-5xl font-light leading-none" style={{color:'rgba(245,238,242,0.12)'}}>{service.num}</span>
          <span style={{
            fontSize:22, display:'inline-block',
            color: hov ? gc : 'rgba(232,164,190,0.4)',
            transform: hov ? 'scale(1.5) rotate(180deg)' : 'scale(1) rotate(0deg)',
            textShadow: hov ? `0 0 20px ${gc}, 0 0 40px ${gc}80` : 'none',
            transition:'all 0.5s cubic-bezier(0.16,1,0.3,1)',
          }}>{service.icon}</span>
        </div>

        {/* NAME — framer-motion color transition, NOT css animation */}
        <div className="mb-3">
          <motion.h3
            className="font-serif font-light leading-tight"
            style={{ fontSize:'clamp(22px,2.2vw,27px)' }}
            animate={hov
              ? { color: gc, textShadow: `0 0 20px ${gc}90, 0 0 40px ${gc}50` }
              : { color: '#F5EEF2', textShadow: 'none' }
            }
            transition={{ duration:0.35 }}
          >
            {service.nameCs}
          </motion.h3>
        </div>

        {/* Tag */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="px-3 py-1 text-[10px] font-light tracking-[2px] uppercase" style={{
            background: hov ? `${gc}20` : 'rgba(255,255,255,0.05)',
            border:`1px solid ${hov ? gc+'80' : 'rgba(255,255,255,0.08)'}`,
            color: hov ? gc : 'rgba(245,238,242,0.4)',
            transition:'all 0.35s',
          }}>{service.tag}</span>
          <span className="font-light" style={{fontSize:11,color:'rgba(245,238,242,0.35)'}}>{service.tagSub}</span>
        </div>

        {/* Description */}
        <p className="font-light leading-relaxed flex-1 mb-8" style={{fontSize:13.5,color:'rgba(245,238,242,0.55)'}}>{service.descriptionCs}</p>

        {/* Price + CTA */}
        <div className="flex items-end justify-between pt-6" style={{borderTop:'1px solid rgba(255,255,255,0.05)'}}>
          <div>
            <motion.div
              className="font-serif font-light leading-none mb-1"
              style={{fontSize:'clamp(28px,3vw,38px)'}}
              animate={hov
                ? { color: gc, textShadow:`0 0 25px ${gc}, 0 0 50px ${gc}60` }
                : { color:'#FF6BA8', textShadow:'none' }
              }
              transition={{duration:0.35}}
            >
              {service.priceKc.toLocaleString('cs-CZ')} Kč
            </motion.div>
            <div className="font-light tracking-[2px] uppercase" style={{fontSize:10,color:'rgba(245,238,242,0.3)'}}>{service.durationLabel}</div>
          </div>
          <Link href={`/rezervace?service=${service.id}`} className="w-11 h-11 flex items-center justify-center cursor-none" style={{
            border:`1px solid ${hov ? gc : 'rgba(255,255,255,0.1)'}`,
            color: hov ? gc : 'rgba(245,238,242,0.3)',
            transform: hov ? 'rotate(45deg)' : 'rotate(0deg)',
            background: hov ? `${gc}20` : 'transparent',
            transition:'all 0.35s ease',
          }}>→</Link>
        </div>
      </div>
    </motion.div>
  )
}

export function ServicesSection({ services }: { services?: any[] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section id="sluzby" className="bg-black-2 px-8 md:px-16 py-32">
      <motion.div ref={ref} initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8}} className="mb-16">
        <div className="section-label mb-5">Ceník služeb · Mladá Boleslav & okolí</div>
        <motion.h2
          className="section-title mb-6"
          style={{
            textShadow:'0 0 40px rgba(255,107,168,0.15)',
          }}
        >
          Přijedu za <em style={{
            background:'linear-gradient(135deg,#E8A4BE,#FF6BA8)',
            WebkitBackgroundClip:'text',
            WebkitTextFillColor:'transparent',
            backgroundClip:'text',
            filter:'drop-shadow(0 0 20px rgba(255,107,168,0.5))',
          }}>Vámi domů</em>
        </motion.h2>
        <p className="text-text-muted font-light leading-relaxed max-w-xl" style={{fontSize:16}}>
          Nemusíte nikam chodit — každá technika přizpůsobena přímo Vám, z pohodlí Vašeho domova.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map((s,i)=><ServiceCard key={s.id} service={s} index={i}/>)}
      </div>
      <motion.div initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:0.6}} className="flex justify-center mt-12">
        <Link href="/rezervace" className="btn-primary">Rezervovat termín →</Link>
      </motion.div>
    </section>
  )
}
