'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

const CONTAINER_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}
const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

export function HeroSection() {
  const { scrollY } = useScroll()
  const y       = useTransform(scrollY, [0, 600], [0, 150])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const particles = Array.from({ length: 18 }, (_, i) => ({
    id:i, left:`${5+Math.random()*90}%`, delay:-Math.random()*10,
    dur:5+Math.random()*8, gold:i%4===0, drift:(Math.random()-0.5)*80,
  }))

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-5 md:px-16 pt-24 md:pt-28 pb-16 md:pb-20">
      {/* Background */}
      <div className="absolute inset-0" style={{
        background:'radial-gradient(ellipse 80% 60% at 55% 45%,rgba(196,105,138,0.16) 0%,transparent 60%),radial-gradient(ellipse 50% 70% at 15% 75%,rgba(255,107,168,0.07) 0%,transparent 50%),#080608'
      }}/>
      <div className="absolute inset-0 hero-grid-bg"/>

      {/* Orbit rings — hidden on mobile */}
      <div className="hidden md:block">
        {[{s:500,r:-120,o:0.25,d:'20s'},{s:750,r:-270,o:0.15,d:'30s',rev:true},{s:300,r:60,o:0.4,d:'14s'}].map((r,i)=>(
          <div key={i} className="absolute rounded-full border border-pink-glow pointer-events-none"
            style={{width:r.s,height:r.s,right:r.r,top:'50%',marginTop:-r.s/2,opacity:r.o,
              animation:`orbit ${r.d} linear infinite${r.rev?' reverse':''}`}}/>
        ))}
      </div>

      {/* Lash art — hidden on mobile for performance */}
      {mounted && (
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" style={{width:380,height:450,opacity:0.7}}>
          <svg width="380" height="450" viewBox="0 0 380 450">
            <defs>
              <radialGradient id="root-glow" cx="50%" cy="80%" r="40%">
                <stop offset="0%" stopColor="#FF6BA8" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="transparent"/>
              </radialGradient>
            </defs>
            <ellipse cx="200" cy="360" rx="70" ry="18" fill="url(#root-glow)"/>
            {Array.from({length:18},(_,i)=>{
              const angle = -40 + i*4.5
              const rad = angle*Math.PI/180
              const len = 55+i*4
              const x0=200, y0=360
              const ex = x0+Math.sin(rad)*20
              const ey = y0-len
              const col = i%3===0?'#D4AA70':i%3===1?'#FF6BA8':'#E8A4BE'
              return <motion.path key={i} d={`M ${x0} ${y0} Q ${x0+15} ${y0-len*0.5} ${ex} ${ey}`}
                stroke={col} strokeWidth={0.8} strokeLinecap="round" fill="none"
                style={{filter:`drop-shadow(0 0 3px ${col})`}}
                initial={{pathLength:0,opacity:0}}
                animate={{pathLength:[0,1,1,0],opacity:[0,0.65,0.45,0]}}
                transition={{duration:2.5+i*0.12,delay:i*0.1,repeat:Infinity,repeatDelay:1+Math.random(),ease:'easeInOut'}}
              />
            })}
          </svg>
        </div>
      )}

      {/* Particles — fewer on mobile */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map(p=>(
            <motion.div key={p.id} className="absolute rounded-full"
              style={{width:p.gold?2:1.5,height:p.gold?2:1.5,left:p.left,bottom:'-10px',
                background:p.gold?'#D4AA70':'#FF6BA8',
                boxShadow:`0 0 ${p.gold?8:6}px ${p.gold?'#D4AA70':'#FF6BA8'}`}}
              animate={{y:['0px','-110vh'],x:[0,p.drift],opacity:[0,0.8,0.4,0]}}
              transition={{duration:p.dur,delay:p.delay,repeat:Infinity,ease:'linear'}}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <motion.div style={{y,opacity}} className="relative z-10 max-w-5xl w-full">
        <motion.div variants={CONTAINER_VARIANTS} initial="hidden" animate="show" className="flex flex-col gap-6 md:gap-8">

          <motion.div variants={ITEM_VARIANTS} className="section-label text-xs md:text-sm">
            Mladá Boleslav &amp; okolí · Přijedu k Vám domů
          </motion.div>

          <motion.div variants={ITEM_VARIANTS} className="relative">
            <h1 className="font-serif font-light leading-none" style={{fontSize:'clamp(52px,11vw,130px)',letterSpacing:'-1px'}}>
              <div className="overflow-hidden">
                {'Viktória'.split('').map((ch,i)=>(
                  <motion.span key={i} initial={{y:'100%',opacity:0}} animate={{y:0,opacity:1}}
                    transition={{delay:0.4+i*0.06,duration:0.7,ease:[0.16,1,0.3,1]}}
                    style={{display:'inline-block'}}>{ch}</motion.span>
                ))}
              </div>
              <div className="overflow-hidden relative">
                <motion.span initial={{y:'100%',opacity:0}} animate={{y:0,opacity:1}}
                  transition={{delay:1.0,duration:0.9,ease:[0.16,1,0.3,1]}} style={{display:'block'}}>
                  <span className="not-italic" style={{
                    background:'linear-gradient(90deg,#E8A4BE 0%,#FF6BA8 25%,#D4AA70 50%,#FF6BA8 75%,#E8A4BE 100%)',
                    backgroundSize:'300% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                    backgroundClip:'text',animation:'shimmer 3s linear infinite',
                    filter:'drop-shadow(0 0 25px rgba(255,107,168,0.7))',display:'inline-block',
                  }}>Lashes</span>
                </motion.span>
                <motion.div initial={{scaleX:0,opacity:0}} animate={{scaleX:1,opacity:1}}
                  transition={{delay:1.6,duration:1,ease:[0.16,1,0.3,1]}}
                  style={{position:'absolute',bottom:4,left:0,right:'40%',height:2,
                    background:'linear-gradient(90deg,rgba(255,107,168,0.8),rgba(212,170,112,0.6),transparent)',
                    transformOrigin:'left',boxShadow:'0 0 10px rgba(255,107,168,0.5)'}}/>
              </div>
            </h1>
          </motion.div>

          <motion.p variants={ITEM_VARIANTS} className="text-text-muted font-light leading-relaxed max-w-lg text-sm md:text-base" style={{letterSpacing:0.3}}>
            Prémiové prodlužování řas přímo u Vás doma. Nemusíte nikam chodit —
            přijedu za Vámi a vytvoříme společně dokonalý výsledek z pohodlí domova.
          </motion.p>

          <motion.div variants={ITEM_VARIANTS} className="flex items-center gap-3 md:gap-5 flex-wrap">
            <Link href="/rezervace" className="btn-primary text-xs md:text-sm">Rezervovat termín →</Link>
            <Link href="#sluzby" className="btn-ghost text-xs md:text-sm">Naše služby</Link>
          </motion.div>

          {/* Badges — scrollable on mobile */}
          <motion.div variants={ITEM_VARIANTS} className="flex items-center gap-5 md:gap-8 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {[{icon:'🏠',label:'Přijedu k vám'},{icon:'✦',label:'Mladá Boleslav'},{icon:'💕',label:'Z pohodlí domova'}].map(b=>(
              <div key={b.label} className="flex items-center gap-3 flex-shrink-0">
                <div className="w-px h-7 bg-glass-border"/>
                <div>
                  <div className="font-serif text-base font-light text-pink-soft">{b.icon}</div>
                  <div className="text-text-dim font-light tracking-wider uppercase whitespace-nowrap" style={{fontSize:9}}>{b.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Lash Body teaser */}
          <motion.div variants={ITEM_VARIANTS}>
            <Link href="/vernostni-program" style={{textDecoration:'none',display:'block',maxWidth:420}}>
              <motion.div whileTap={{scale:0.97}}
                style={{display:'flex',alignItems:'center',gap:12,
                  background:'linear-gradient(135deg,rgba(212,170,112,0.08),rgba(255,107,168,0.06))',
                  border:'1px solid rgba(212,170,112,0.3)',borderRadius:16,padding:'12px 18px',
                  position:'relative',overflow:'hidden',cursor:'none'}}>
                <motion.div animate={{x:['-100%','200%']}} transition={{duration:2.5,repeat:Infinity,ease:'easeInOut',repeatDelay:1}}
                  style={{position:'absolute',top:0,left:0,height:1,background:'linear-gradient(90deg,transparent,#D4AA70,#FF6BA8,transparent)',width:'60%'}}/>
                <motion.div animate={{rotate:[0,10,-10,0],scale:[1,1.15,1]}} transition={{duration:2,repeat:Infinity,repeatDelay:2}} style={{fontSize:20,flexShrink:0}}>👑</motion.div>
                <div>
                  <div style={{fontFamily:'Georgia,serif',fontSize:8,letterSpacing:3,textTransform:'uppercase',color:'#D4AA70',marginBottom:3}}>✦ Věrnostní program</div>
                  <div style={{fontFamily:'Georgia,serif',fontSize:13,fontWeight:300,color:'rgba(245,238,242,0.85)',lineHeight:1.3}}>
                    Sbírejte <span style={{color:'#D4AA70'}}>Lash Body</span> a získejte exkluzivní odměny
                  </div>
                </div>
                <motion.div animate={{x:[0,5,0]}} transition={{duration:1.5,repeat:Infinity,ease:'easeInOut'}}
                  style={{fontFamily:'Georgia,serif',fontSize:16,color:'rgba(212,170,112,0.7)',flexShrink:0,marginLeft:'auto'}}>→</motion.div>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.5}}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px bg-gradient-to-b from-pink-neon to-transparent animate-pulse" style={{height:48}}/>
        <span className="text-text-dim font-light tracking-[4px] uppercase" style={{fontSize:8}}>Scroll</span>
      </motion.div>
    </section>
  )
}
