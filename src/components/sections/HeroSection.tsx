'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

const HEARTS = [
  {left:'72%',size:22,delay:0,   dur:8},
  {left:'85%',size:14,delay:2.5, dur:10},
  {left:'60%',size:18,delay:1.2, dur:9},
  {left:'90%',size:12,delay:4.0, dur:11},
  {left:'78%',size:20,delay:3.5, dur:8.5},
  {left:'65%',size:16,delay:6.0, dur:9.5},
]

const SPARKLES = [
  {s:'✦',top:-18,left:'8%', col:'#D4AA70',delay:1.9,dur:3},
  {s:'✦',top:-8, left:'55%',col:'#FF6BA8',delay:2.3,dur:3.5},
  {s:'◈',top:-14,left:'82%',col:'#E8A4BE',delay:2.0,dur:2.8},
]

const CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}
const ITEM = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

export function HeroSection() {
  const { scrollY } = useScroll()
  const y       = useTransform(scrollY, [0, 600], [0, 150])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-5 md:px-16 pt-24 md:pt-28 pb-16 md:pb-20">

      {/* Background */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 70% 55% at 70% 45%,rgba(196,105,138,0.14) 0%,transparent 60%),radial-gradient(ellipse 40% 50% at 30% 70%,rgba(255,107,168,0.05) 0%,transparent 50%),#080608'
      }}/>
      <div className="absolute inset-0 hero-grid-bg"/>

      {/* Decorative orbit rings — right side only, no overflow */}
      <div className="hidden md:block absolute pointer-events-none" style={{right:0,top:0,bottom:0,width:'45%',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'50%',right:'-10%',transform:'translateY(-50%)',width:500,height:500,borderRadius:'50%',border:'1px solid rgba(255,107,168,0.1)'}}/>
        <div style={{position:'absolute',top:'50%',right:'-20%',transform:'translateY(-50%)',width:720,height:720,borderRadius:'50%',border:'1px solid rgba(196,105,138,0.06)'}}/>
        <div style={{position:'absolute',top:'50%',right:'15%',transform:'translateY(-50%)',width:280,height:280,borderRadius:'50%',border:'1px solid rgba(212,170,112,0.08)',animation:'orbit 18s linear infinite'}}/>
      </div>

      {/* Floating hearts — balloon style */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {HEARTS.map((h, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: h.left,
                bottom: '-5%',
                fontSize: h.size,
                lineHeight: 1,
                filter: `drop-shadow(0 0 ${h.size * 0.4}px #FF6BA8)`,
                animation: `floatHeart ${h.dur}s ease-in-out ${h.delay}s infinite`,
                willChange: 'transform',
              }}
            >💕</div>
          ))}
        </div>
      )}

      {/* Particles */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 18 }, (_, i) => ({
            id: i,
            left: `${5 + (i * 5.2) % 90}%`,
            delay: -(i * 0.7),
            dur: 5 + (i % 4) * 2,
            gold: i % 4 === 0,
            drift: ((i % 5) - 2) * 30,
          })).map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.gold ? 2 : 1.5,
                height: p.gold ? 2 : 1.5,
                left: p.left,
                bottom: '-10px',
                background: p.gold ? '#D4AA70' : '#FF6BA8',
                boxShadow: `0 0 ${p.gold ? 8 : 6}px ${p.gold ? '#D4AA70' : '#FF6BA8'}`,
              }}
              animate={{ y: ['0px', '-110vh'], x: [0, p.drift], opacity: [0, 0.8, 0.4, 0] }}
              transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <motion.div style={{ y, opacity }} className="relative z-10 max-w-5xl w-full">
        <motion.div variants={CONTAINER} initial="hidden" animate="show" className="flex flex-col gap-6 md:gap-8">

          <motion.div variants={ITEM} className="section-label text-xs md:text-sm">
            Mladá Boleslav &amp; okolí · Přijedu k Vám domů
          </motion.div>

          {/* Heading */}
          <motion.div variants={ITEM} className="relative">
            <h1 className="font-serif font-light leading-none" style={{ fontSize: 'clamp(52px,11vw,130px)', letterSpacing: '-1px' }}>

              {/* Viktória */}
              <div className="overflow-hidden">
                {'Viktória'.split('').map((ch, i) => (
                  <motion.span key={i}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'inline-block' }}
                  >{ch}</motion.span>
                ))}
              </div>

              {/* Lashes */}
              <div className="relative" style={{ overflow: 'visible' }}>
                {/* Ambient glow */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 1.5 }}
                  style={{
                    position: 'absolute', top: '10%', left: '-5%', right: '30%', bottom: '-10%',
                    background: 'radial-gradient(ellipse at 35% 60%,rgba(196,105,138,0.22) 0%,rgba(212,170,112,0.06) 50%,transparent 70%)',
                    filter: 'blur(24px)', pointerEvents: 'none',
                  }}
                />

                <motion.span
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'block', position: 'relative' }}
                >
                  <span style={{
                    fontStyle: 'italic',
                    background: 'linear-gradient(135deg,#FFD0E8 0%,#FF6BA8 30%,#E8A4BE 55%,#D4AA70 75%,#FF6BA8 90%,#FFE8F4 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'shimmer 4s ease-in-out infinite',
                    display: 'inline-block',
                    filter: 'drop-shadow(0 0 30px rgba(255,107,168,0.5)) drop-shadow(0 4px 12px rgba(196,105,138,0.3))',
                  }}>Lashes</span>

                  {/* Sparkles */}
                  {mounted && SPARKLES.map((sp, i) => (
                    <motion.span key={i}
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: [0, 0.8, 0.4, 0.8, 0], y: [0, -8, 0, -6, 0] }}
                      transition={{ delay: sp.delay, duration: sp.dur, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        position: 'absolute', top: sp.top, left: sp.left,
                        fontSize: 9, color: sp.col,
                        filter: `drop-shadow(0 0 4px ${sp.col})`,
                        pointerEvents: 'none',
                      }}
                    >{sp.s}</motion.span>
                  ))}
                </motion.span>

                {/* Underline */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 1.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute', bottom: 6, left: 0, right: '38%', height: 2,
                    background: 'linear-gradient(90deg,#FF6BA8,#D4AA70,rgba(232,164,190,0.4),transparent)',
                    transformOrigin: 'left', borderRadius: 2,
                    boxShadow: '0 0 16px rgba(255,107,168,0.5)',
                  }}
                />
              </div>
            </h1>
          </motion.div>

          <motion.p variants={ITEM} className="text-text-muted font-light leading-relaxed max-w-lg text-sm md:text-base" style={{ letterSpacing: 0.3 }}>
            Prémiové prodlužování řas přímo u Vás doma. Nemusíte nikam chodit —
            přijedu za Vámi a vytvoříme společně dokonalý výsledek z pohodlí domova.
          </motion.p>

          <motion.div variants={ITEM} className="flex items-center gap-3 md:gap-5 flex-wrap">
            <Link href="/rezervace" className="btn-primary text-xs md:text-sm">Rezervovat termín →</Link>
            <Link href="#sluzby" className="btn-ghost text-xs md:text-sm">Naše služby</Link>
          </motion.div>

          {/* Badges */}
          <motion.div variants={ITEM} className="flex items-center gap-5 md:gap-8 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {[{icon:'🏠',label:'Přijedu k vám'},{icon:'✦',label:'Mladá Boleslav'},{icon:'💕',label:'Z pohodlí domova'}].map(b => (
              <div key={b.label} className="flex items-center gap-3 flex-shrink-0">
                <div className="w-px h-7 bg-glass-border"/>
                <div>
                  <div className="font-serif text-base font-light text-pink-soft">{b.icon}</div>
                  <div className="text-text-dim font-light tracking-wider uppercase whitespace-nowrap" style={{ fontSize: 9 }}>{b.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Lash Body teaser */}
          <motion.div variants={ITEM}>
            <Link href="/vernostni-program" style={{ textDecoration: 'none', display: 'block', maxWidth: 420 }}>
              <motion.div
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'linear-gradient(135deg,rgba(212,170,112,0.08),rgba(255,107,168,0.06))',
                  border: '1px solid rgba(212,170,112,0.3)', borderRadius: 16, padding: '12px 18px',
                  position: 'relative', overflow: 'hidden', cursor: 'none',
                }}
              >
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                  style={{ position: 'absolute', top: 0, left: 0, height: 1, background: 'linear-gradient(90deg,transparent,#D4AA70,#FF6BA8,transparent)', width: '60%' }}
                />
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                  style={{ fontSize: 20, flexShrink: 0 }}
                >👑</motion.div>
                <div>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', color: '#D4AA70', marginBottom: 3 }}>✦ Věrnostní program</div>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 13, fontWeight: 300, color: 'rgba(245,238,242,0.85)', lineHeight: 1.3 }}>
                    Sbírejte <span style={{ color: '#D4AA70' }}>Lash Body</span> a získejte exkluzivní odměny
                  </div>
                </div>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ fontFamily: 'Georgia,serif', fontSize: 16, color: 'rgba(212,170,112,0.7)', flexShrink: 0, marginLeft: 'auto' }}
                >→</motion.div>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px bg-gradient-to-b from-pink-neon to-transparent animate-pulse" style={{ height: 48 }}/>
        <span className="text-text-dim font-light tracking-[4px] uppercase" style={{ fontSize: 8 }}>Scroll</span>
      </motion.div>
    </section>
  )
}
