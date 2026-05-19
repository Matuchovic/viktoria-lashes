'use client'
// src/components/sections/ServicesSection.tsx
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import type { Service } from '@/types'
import { formatPrice, SERVICE_ICONS } from '@/lib/utils'

const SERVICES_STATIC = [
  { id:'1', nameCs:'Klasické řasy',   descriptionCs:'Přirozený, elegantní výsledek pro každodenní nošení. Jedno umělé vlákno na každou přírodní řasu.',           category:'CLASSIC',    priceKc:1490, durationMin:105, sortOrder:1, depositPct:30, isActive:true, name:'Classic', description:'', },
  { id:'2', nameCs:'Objemové řasy',   descriptionCs:'Dramatický a plný efekt s 2D až 6D fanúšky. Ideální pro výraznější, fotogenický look.',                       category:'VOLUME',     priceKc:1890, durationMin:135, sortOrder:2, depositPct:30, isActive:true, name:'Volume',  description:'', },
  { id:'3', nameCs:'Mega Volume',     descriptionCs:'Maximální hustota a intenzita. 6D až 20D technologie pro luxusní runway efekt.',                              category:'MEGA_VOLUME',priceKc:2490, durationMin:165, sortOrder:3, depositPct:30, isActive:true, name:'Mega',    description:'', },
  { id:'4', nameCs:'Wet Look',        descriptionCs:'Trendový „mokrý" efekt. Dramatický, moderní a naprosto nezapomenutelný výraz.',                              category:'WET_LOOK',   priceKc:2190, durationMin:135, sortOrder:4, depositPct:30, isActive:true, name:'Wet',     description:'', },
  { id:'5', nameCs:'Hybridní řasy',   descriptionCs:'Kombinace klasických a objemových technik. Textura, hloubka i přirozenost v jednom celku.',                   category:'HYBRID',     priceKc:1690, durationMin:125, sortOrder:5, depositPct:30, isActive:true, name:'Hybrid',  description:'', },
  { id:'6', nameCs:'Doplnění řas',    descriptionCs:'Péče o váš stávající set. Obnovení plnosti a dokonalosti mezi návštěvami. Každé 2–3 týdny.',                  category:'INFILL',     priceKc:890,  durationMin:75,  sortOrder:6, depositPct:0,  isActive:true, name:'Infill',  description:'', },
  { id:'7', nameCs:'Lash Lifting',    descriptionCs:'Trvalá pro vaše vlastní řasy. Zdvihnutí a zakroucení s barvením pro intenzivní výraz.',                       category:'LIFTING',    priceKc:990,  durationMin:70,  sortOrder:7, depositPct:0,  isActive:true, name:'Lifting', description:'', },
  { id:'8', nameCs:'Odstranění řas',  descriptionCs:'Bezpečné a šetrné odstranění umělých řas specialistou. Ochrana vašich přirozených řas.',                      category:'REMOVAL',    priceKc:390,  durationMin:25,  sortOrder:8, depositPct:0,  isActive:true, name:'Removal', description:'', },
] as Service[]

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative glass-card-hover flex flex-col p-10 overflow-hidden cursor-none"
    >
      {/* Top accent on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-neon to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

      <div className="font-serif text-5xl font-light text-text-dim mb-6 leading-none">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="text-2xl text-pink-soft mb-2">{SERVICE_ICONS[service.category]}</div>

      <h3 className="font-serif text-3xl font-light mb-4 group-hover:text-pink-soft transition-colors duration-300">
        {service.nameCs}
      </h3>

      <p className="text-text-muted text-sm font-light leading-relaxed flex-1 mb-8">
        {service.descriptionCs}
      </p>

      <div className="flex items-end justify-between border-t border-glass-border pt-6">
        <div>
          <div className="font-serif text-4xl font-light text-pink-neon leading-none">
            {formatPrice(service.priceKc)}
          </div>
          <div className="text-text-dim font-light tracking-[2px] uppercase mt-1" style={{ fontSize: 11 }}>
            {Math.floor(service.durationMin / 60) > 0
              ? `${Math.floor(service.durationMin / 60)} hod ${service.durationMin % 60 > 0 ? `${service.durationMin % 60} min` : ''}`
              : `${service.durationMin} min`}
          </div>
        </div>
        <Link
          href={`/rezervace?service=${service.id}`}
          className="w-10 h-10 border border-glass-border flex items-center justify-center text-text-dim group-hover:border-pink-neon group-hover:text-pink-neon group-hover:rotate-45 transition-all duration-300 cursor-none"
        >
          →
        </Link>
      </div>
    </motion.div>
  )
}

export function ServicesSection({ services = SERVICES_STATIC }: { services?: Service[] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="sluzby" className="bg-black-2 px-8 md:px-16 py-32">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <div className="section-label mb-5">Naše portfolio</div>
        <h2 className="section-title mb-6">
          Umění <em>dokonalých</em><br />řas
        </h2>
        <p className="text-text-muted font-light leading-relaxed max-w-xl" style={{ fontSize: 16 }}>
          Každá technika je pečlivě přizpůsobena tvaru vašich očí, životnímu stylu a přání.
          Výsledek vždy překoná očekávání.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-glass-border border border-glass-border">
        {services.map((s, i) => (
          <ServiceCard key={s.id} service={s} index={i} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6 }}
        className="flex justify-center mt-12"
      >
        <Link href="/sluzby" className="btn-ghost">
          Zobrazit všechny služby →
        </Link>
      </motion.div>
    </section>
  )
}
