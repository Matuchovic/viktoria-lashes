'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export function ArtistsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section id="stylistky" className="bg-black-3 px-8 md:px-16 py-32">
      <motion.div ref={ref} initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8}} className="mb-16">
        <div className="section-label mb-5">O mně</div>
        <h2 className="section-title mb-6">Vaše stylistka</h2>
      </motion.div>
      <motion.div
        initial={{opacity:0,y:40}} animate={inView?{opacity:1,y:0}:{}}
        transition={{duration:0.7,ease:[0.16,1,0.3,1]}}
        className="max-w-2xl glass-card p-10 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-neon to-transparent"/>
        <div className="relative w-28 h-28 mx-auto mb-6">
          <div className="w-full h-full rounded-full border border-glass-border flex items-center justify-center">
            <span className="font-serif text-5xl font-light text-pink-soft">V</span>
          </div>
          <div className="absolute inset-[-4px] rounded-full border border-pink-glow opacity-60"/>
        </div>
        <h3 className="font-serif text-3xl font-light mb-2">Viktória Ladiková</h3>
        <div className="font-light tracking-[2px] uppercase text-pink-neon mb-6" style={{fontSize:11}}>Zakladatelka</div>
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {['Klasické řasy','Objemové řasy','Mega Volume','Wet Look'].map(s=>(
            <span key={s} className="text-[10px] tracking-wider border border-glass-border px-3 py-1 text-text-dim">{s}</span>
          ))}
        </div>
        <p className="text-text-muted text-sm font-light leading-relaxed mb-8">
          S více než 4 roky zkušeností v oblasti prodlužování řas. Přijíždím přímo k Vám domů
          v oblasti Mladé Boleslavi a okolí — pro Váš maximální komfort a luxusní výsledky.
        </p>
        <a href="/rezervace" className="btn-primary inline-flex">Rezervovat termín →</a>
      </motion.div>
    </section>
  )
}
