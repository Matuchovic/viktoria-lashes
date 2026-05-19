'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

const CONTAINER_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
}
const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
}

// Floating lash-inspired particle
function LashParticle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: 1,
        height: `${20 + Math.random() * 40}px`,
        background: 'linear-gradient(to bottom, transparent, rgba(255,107,168,0.6), transparent)',
        borderRadius: 2,
        ...style,
      }}
    />
  )
}

export function HeroSection() {
  const { scrollY } = useScroll()
  const y       = useTransform(scrollY, [0, 600], [0, 180])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left:  `${Math.random() * 100}%`,
    top:   `${Math.random() * 100}%`,
    delay: `${-Math.random() * 10}s`,
    dur:   `${5 + Math.random() * 8}s`,
    size:  Math.random() > 0.5 ? 'gold' : 'pink',
    drift: (Math.random() - 0.5) * 120,
  }))

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-8 md:px-16 pt-28 pb-20">
      {/* Background */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(196,105,138,0.14) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 20% 80%, rgba(255,107,168,0.07) 0%, transparent 50%), #080608'
      }}/>
      <div className="absolute inset-0 hero-grid-bg"/>

      {/* Orbit rings */}
      {[
        { size:500, right:-100, opacity:0.3, dur:'20s' },
        { size:750, right:-250, opacity:0.18, dur:'30s', reverse:true },
        { size:280, right:50,   opacity:0.45, dur:'15s' },
      ].map((r,i) => (
        <div key={i} className="absolute rounded-full border border-pink-glow pointer-events-none"
          style={{
            width:r.size, height:r.size,
            right:r.right, top:'50%', marginTop:-r.size/2,
            opacity:r.opacity,
            animation:`${r.reverse?'orbit 30s linear infinite reverse':`orbit ${r.dur} linear infinite`}`,
          }}
        />
      ))}

      {/* Particles */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.size === 'gold' ? 1.5 : 1,
                height: p.size === 'gold' ? 1.5 : 1,
                left: p.left, top: p.top,
                background: p.size === 'gold' ? '#D4AA70' : '#FF6BA8',
                boxShadow: p.size === 'gold' ? '0 0 6px #D4AA70' : '0 0 6px #FF6BA8',
              }}
              animate={{
                y: ['0vh', '-110vh'],
                x: [0, p.drift],
                opacity: [0, 0.8, 0.4, 0],
                scale: [0, 1, 0.5, 0],
              }}
              transition={{
                duration: parseFloat(p.dur),
                delay: parseFloat(p.delay),
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}

          {/* Lash strokes floating */}
          {Array.from({length:8},(_,i)=>(
            <motion.div key={`lash-${i}`}
              className="absolute pointer-events-none"
              style={{
                width:1.5,
                height:`${25+i*5}px`,
                left:`${10+i*11}%`,
                background:'linear-gradient(to bottom, transparent, rgba(255,107,168,0.4), transparent)',
                borderRadius:2,
              }}
              animate={{
                y:['-10px','10px','-10px'],
                opacity:[0.2,0.5,0.2],
                rotate:[-3,3,-3],
              }}
              transition={{
                duration: 3+i*0.5,
                repeat: Infinity,
                delay: i*0.3,
                ease:'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <motion.div style={{ y, opacity }} className="relative z-10 max-w-5xl w-full">
        <motion.div variants={CONTAINER_VARIANTS} initial="hidden" animate="show" className="flex flex-col gap-8">

          {/* Label */}
          <motion.div variants={ITEM_VARIANTS} className="section-label">
            Mladá Boleslav &amp; okolí · Přijedu k Vám domů
          </motion.div>

          {/* WOW Title */}
          <motion.div variants={ITEM_VARIANTS} className="relative">
            <h1 className="font-serif font-light leading-none" style={{ fontSize:'clamp(64px,11vw,130px)', letterSpacing:'-2px' }}>

              {/* VIKTORIA — letter-by-letter reveal */}
              <div className="overflow-hidden">
                {'Viktoria'.split('').map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.06, duration: 0.7, ease: [0.16,1,0.3,1] }}
                    style={{ display:'inline-block' }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </div>

              {/* LASHES — shimmer + glow */}
              <div className="overflow-hidden relative">
                <motion.span
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.9, ease: [0.16,1,0.3,1] }}
                  style={{ display:'block' }}
                >
                  <span
                    className="not-italic"
                    style={{
                      background: 'linear-gradient(90deg, #E8A4BE 0%, #FF6BA8 30%, #D4AA70 50%, #FF6BA8 70%, #E8A4BE 100%)',
                      backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'shimmer 4s linear infinite',
                      filter: 'drop-shadow(0 0 30px rgba(255,107,168,0.5))',
                      display: 'inline-block',
                    }}
                  >
                    Lashes
                  </span>
                </motion.span>

                {/* Decorative glow line under Lashes */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 1.6, duration: 1, ease: [0.16,1,0.3,1] }}
                  style={{
                    position:'absolute', bottom:8, left:0, right:0, height:2,
                    background:'linear-gradient(90deg, transparent, rgba(255,107,168,0.6), rgba(212,170,112,0.4), transparent)',
                    transformOrigin:'left',
                  }}
                />
              </div>
            </h1>

            {/* Floating sparkles around the title */}
            {mounted && ['✦','✸','◈','❋'].map((s,i)=>(
              <motion.span key={s}
                className="absolute pointer-events-none select-none"
                style={{
                  fontSize: 14+i*3,
                  color: i%2===0 ? '#FF6BA8' : '#D4AA70',
                  top: `${-10+i*30}%`,
                  right: `${-2+i*3}%`,
                  textShadow: `0 0 15px ${i%2===0?'#FF6BA8':'#D4AA70'}`,
                }}
                animate={{
                  y: [-5,5,-5],
                  rotate: [0,15,-15,0],
                  opacity: [0.4,0.9,0.4],
                  scale: [0.9,1.1,0.9],
                }}
                transition={{ duration:2+i*0.7, repeat:Infinity, delay:i*0.4, ease:'easeInOut' }}
              >
                {s}
              </motion.span>
            ))}
          </motion.div>

          {/* Sub */}
          <motion.p variants={ITEM_VARIANTS} className="text-text-muted font-light leading-relaxed max-w-lg" style={{fontSize:16,letterSpacing:0.5}}>
            Prémiové prodlužování řas přímo u Vás doma. Nemusíte nikam chodit —
            přijedu za Vámi a vytvoříme společně dokonalý výsledek z pohodlí domova.
          </motion.p>

          {/* CTA */}
          <motion.div variants={ITEM_VARIANTS} className="flex items-center gap-5 flex-wrap">
            <Link href="/rezervace" className="btn-primary">Rezervovat termín →</Link>
            <Link href="#sluzby" className="btn-ghost">Naše služby</Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={ITEM_VARIANTS} className="flex items-center gap-8 pt-4">
            {[
              { icon:'🏠', label:'Přijedu k vám' },
              { icon:'✦',  label:'Mladá Boleslav' },
              { icon:'💕', label:'Z pohodlí domova' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-3">
                <div className="w-px h-8 bg-glass-border"/>
                <div>
                  <div className="font-serif text-lg font-light text-pink-soft">{b.icon}</div>
                  <div className="text-text-dim font-light tracking-wider uppercase" style={{fontSize:10}}>{b.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2}}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="w-px bg-gradient-to-b from-pink-neon to-transparent animate-pulse" style={{height:60}}/>
        <span className="text-text-dim font-light tracking-[4px] uppercase" style={{fontSize:9}}>Scroll</span>
      </motion.div>
    </section>
  )
}
