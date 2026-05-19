'use client'
import { useEffect, useState } from 'react'
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

// Animated floating lash strand (SVG path)
function FloatingLash({ x, y, length, angle, color, delay, duration }: {
  x:number; y:number; length:number; angle:number; color:string; delay:number; duration:number
}) {
  const rad = (angle * Math.PI) / 180
  const curveAmt = 20 + Math.random() * 30
  const ex = x + Math.sin(rad) * curveAmt
  const ey = y - length * Math.cos(rad)
  const cx1 = x + curveAmt * 0.2; const cy1 = y - length * 0.35
  const cx2 = ex + curveAmt * 0.15; const cy2 = ey + length * 0.25

  return (
    <motion.path
      d={`M ${x} ${y} C ${cx1} ${cy1} ${cx2} ${cy2} ${ex} ${ey}`}
      stroke={color} strokeWidth={0.8 + Math.random() * 0.6}
      strokeLinecap="round" fill="none"
      style={{ filter:`drop-shadow(0 0 3px ${color})` }}
      initial={{ pathLength:0, opacity:0 }}
      animate={{ pathLength:[0,1,1,0], opacity:[0,0.7,0.5,0] }}
      transition={{ duration, delay, repeat:Infinity, repeatDelay:Math.random()*2+1, ease:'easeInOut' }}
    />
  )
}

export function HeroSection() {
  const { scrollY } = useScroll()
  const y       = useTransform(scrollY, [0, 600], [0, 180])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const particles = Array.from({ length: 28 }, (_, i) => ({
    id:i, left:`${5+Math.random()*90}%`, delay:-Math.random()*10,
    dur:5+Math.random()*8, gold:i%4===0, drift:(Math.random()-0.5)*100,
  }))

  // Right-side floating lashes decoration (no eye — just pure lashes fanning out elegantly)
  const fanLashes = Array.from({ length: 22 }, (_, i) => ({
    x: 320 + Math.sin((i/22)*Math.PI*0.8 - 0.2) * 60,
    y: 200 + Math.cos((i/22)*Math.PI*0.8 - 0.2) * 20,
    length: 50 + i * 4.5,
    angle: -35 + i * 4,
    color: i % 3 === 0 ? '#D4AA70' : i % 3 === 1 ? '#FF6BA8' : '#E8A4BE',
    delay: i * 0.12,
    duration: 2.5 + i * 0.15,
  }))

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-8 md:px-16 pt-28 pb-20">
      {/* Background */}
      <div className="absolute inset-0" style={{
        background:'radial-gradient(ellipse 80% 60% at 55% 45%,rgba(196,105,138,0.16) 0%,transparent 60%),radial-gradient(ellipse 50% 70% at 15% 75%,rgba(255,107,168,0.07) 0%,transparent 50%),#080608'
      }}/>
      <div className="absolute inset-0 hero-grid-bg"/>

      {/* Orbit rings */}
      {[{s:500,r:-120,o:0.25,d:'20s'},{s:750,r:-270,o:0.15,d:'30s',rev:true},{s:300,r:60,o:0.4,d:'14s'}].map((r,i)=>(
        <div key={i} className="absolute rounded-full border border-pink-glow pointer-events-none"
          style={{width:r.s,height:r.s,right:r.r,top:'50%',marginTop:-r.s/2,opacity:r.o,
            animation:`orbit ${r.d} linear infinite${r.rev?' reverse':''}`}}/>
      ))}

      {/* Right side — elegant fanned lashes (no eye, just pure lash art) */}
      {mounted && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" style={{width:420,height:480,opacity:0.75}}>
          {/* Subtle root arc */}
          <svg width="420" height="480" viewBox="0 0 420 480">
            <defs>
              <radialGradient id="root-glow" cx="50%" cy="80%" r="40%">
                <stop offset="0%" stopColor="#FF6BA8" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="transparent"/>
              </radialGradient>
              <filter id="lash-blur"><feGaussianBlur stdDeviation="1"/></filter>
            </defs>

            {/* Glow source at lash root */}
            <ellipse cx="220" cy="380" rx="80" ry="20" fill="url(#root-glow)"/>
            <ellipse cx="220" cy="380" rx="40" ry="10" fill="rgba(255,107,168,0.15)"/>

            {/* Animated lash fan */}
            {fanLashes.map((l,i) => <FloatingLash key={i} {...l}/>)}

            {/* Decorative sparkles along lashes */}
            {[{x:180,y:160},{x:230,y:100},{x:270,y:140},{x:310,y:200},{x:160,y:220}].map((s,i)=>(
              <motion.circle key={`sp-${i}`} cx={s.x} cy={s.y} r={1.5}
                fill={i%2===0?'#FF6BA8':'#D4AA70'}
                style={{filter:`drop-shadow(0 0 6px ${i%2===0?'#FF6BA8':'#D4AA70'})`}}
                animate={{opacity:[0,1,0],scale:[0,1.8,0],r:[0.5,2,0.5]}}
                transition={{duration:1.8,delay:i*0.5+1,repeat:Infinity,repeatDelay:2}}
              />
            ))}

            {/* Label below fan */}
            <motion.text x="220" y="415" textAnchor="middle"
              fontFamily="Georgia,serif" fontSize="11" letterSpacing="4" fill="rgba(255,107,168,0.4)"
              initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2}}>
              LUXURY LASH STUDIO
            </motion.text>
          </svg>
        </div>
      )}

      {/* Particles */}
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
          {['✦','✸','◈','❋','✦'].map((s,i)=>(
            <motion.span key={`fl-${i}`} className="absolute pointer-events-none select-none font-serif"
              style={{fontSize:10+i*3,color:i%2===0?'#FF6BA8':'#D4AA70',left:`${10+i*14}%`,top:`${15+i*13}%`,
                textShadow:`0 0 12px ${i%2===0?'#FF6BA8':'#D4AA70'}`}}
              animate={{y:[-6,6,-6],rotate:[0,18,-18,0],opacity:[0.25,0.65,0.25],scale:[0.85,1.1,0.85]}}
              transition={{duration:2.5+i*0.6,repeat:Infinity,delay:i*0.5,ease:'easeInOut'}}
            >{s}</motion.span>
          ))}
        </div>
      )}

      {/* Main content */}
      <motion.div style={{y,opacity}} className="relative z-10 max-w-5xl w-full">
        <motion.div variants={CONTAINER_VARIANTS} initial="hidden" animate="show" className="flex flex-col gap-8">
          <motion.div variants={ITEM_VARIANTS} className="section-label">
            Mladá Boleslav &amp; okolí · Přijedu k Vám domů
          </motion.div>

          <motion.div variants={ITEM_VARIANTS} className="relative">
            <h1 className="font-serif font-light leading-none" style={{fontSize:'clamp(64px,11vw,130px)',letterSpacing:'-2px'}}>
              <div className="overflow-hidden">
                {'Viktória'.split('').map((ch,i)=>(
                  <motion.span key={i} initial={{y:'100%',opacity:0}} animate={{y:0,opacity:1}}
                    transition={{delay:0.5+i*0.07,duration:0.7,ease:[0.16,1,0.3,1]}}
                    style={{display:'inline-block'}}>{ch}</motion.span>
                ))}
              </div>
              <div className="overflow-hidden relative">
                <motion.span initial={{y:'100%',opacity:0}} animate={{y:0,opacity:1}}
                  transition={{delay:1.1,duration:0.9,ease:[0.16,1,0.3,1]}} style={{display:'block'}}>
                  <span className="not-italic" style={{
                    background:'linear-gradient(90deg,#E8A4BE 0%,#FF6BA8 25%,#D4AA70 50%,#FF6BA8 75%,#E8A4BE 100%)',
                    backgroundSize:'300% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                    backgroundClip:'text',animation:'shimmer 3s linear infinite',
                    filter:'drop-shadow(0 0 35px rgba(255,107,168,0.7)) drop-shadow(0 0 70px rgba(255,107,168,0.3))',
                    display:'inline-block',
                  }}>Lashes</span>
                </motion.span>
                <motion.div initial={{scaleX:0,opacity:0}} animate={{scaleX:1,opacity:1}}
                  transition={{delay:1.8,duration:1,ease:[0.16,1,0.3,1]}}
                  style={{position:'absolute',bottom:6,left:0,right:'40%',height:2,
                    background:'linear-gradient(90deg,rgba(255,107,168,0.8),rgba(212,170,112,0.6),transparent)',
                    transformOrigin:'left',boxShadow:'0 0 10px rgba(255,107,168,0.5)'}}/>
              </div>
            </h1>
          </motion.div>

          <motion.p variants={ITEM_VARIANTS} className="text-text-muted font-light leading-relaxed max-w-lg" style={{fontSize:16,letterSpacing:0.5}}>
            Prémiové prodlužování řas přímo u Vás doma. Nemusíte nikam chodit —
            přijedu za Vámi a vytvoříme společně dokonalý výsledek z pohodlí domova.
          </motion.p>

          <motion.div variants={ITEM_VARIANTS} className="flex items-center gap-5 flex-wrap">
            <Link href="/rezervace" className="btn-primary">Rezervovat termín →</Link>
            <Link href="#sluzby" className="btn-ghost">Naše služby</Link>
          </motion.div>

          <motion.div variants={ITEM_VARIANTS} className="flex items-center gap-8 pt-2">
            {[{icon:'🏠',label:'Přijedu k vám'},{icon:'✦',label:'Mladá Boleslav'},{icon:'💕',label:'Z pohodlí domova'}].map(b=>(
              <div key={b.label} className="flex items-center gap-3">
                <div className="w-px h-8 bg-glass-border"/>
                <div>
                  <div className="font-serif text-lg font-light text-pink-soft">{b.icon}</div>
                  <div className="text-text-dim font-light tracking-wider uppercase" style={{fontSize:10}}>{b.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Lash Body teaser */}
          <motion.div variants={ITEM_VARIANTS}>
            <Link href="/vernostni-program" style={{textDecoration:'none',display:'inline-block'}}>
              <motion.div
                whileHover={{scale:1.02, boxShadow:'0 0 50px rgba(212,170,112,0.3), 0 0 80px rgba(255,107,168,0.15)'}}
                whileTap={{scale:0.98}}
                style={{
                  display:'inline-flex', alignItems:'center', gap:16,
                  background:'linear-gradient(135deg,rgba(212,170,112,0.08),rgba(255,107,168,0.06))',
                  border:'1px solid rgba(212,170,112,0.3)',
                  borderRadius:16, padding:'14px 22px',
                  position:'relative', overflow:'hidden',
                  boxShadow:'0 0 30px rgba(212,170,112,0.1)',
                  cursor:'none',
                }}
              >
                <motion.div
                  animate={{x:['-100%','200%']}}
                  transition={{duration:2.5, repeat:Infinity, ease:'easeInOut', repeatDelay:1}}
                  style={{position:'absolute',top:0,left:0,height:1,
                    background:'linear-gradient(90deg,transparent,#D4AA70,#FF6BA8,transparent)',
                    width:'60%'}}
                />
                <motion.div
                  animate={{rotate:[0,10,-10,0], scale:[1,1.15,1]}}
                  transition={{duration:2, repeat:Infinity, repeatDelay:2}}
                  style={{fontSize:22, flexShrink:0}}>
                  👑
                </motion.div>
                <div>
                  <div style={{fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, textTransform:'uppercase',
                    color:'#D4AA70', marginBottom:4, textShadow:'0 0 10px rgba(212,170,112,0.5)'}}>
                    ✦ Věrnostní program
                  </div>
                  <div style={{fontFamily:'Georgia,serif', fontSize:14, fontWeight:300, color:'rgba(245,238,242,0.85)', lineHeight:1.3}}>
                    Sbírejte <span style={{color:'#D4AA70', textShadow:'0 0 12px rgba(212,170,112,0.5)'}}>Lash Body</span> a získejte exkluzivní odměny
                  </div>
                </div>
                <motion.div
                  animate={{x:[0,5,0]}}
                  transition={{duration:1.5, repeat:Infinity, ease:'easeInOut'}}
                  style={{fontFamily:'Georgia,serif', fontSize:16, color:'rgba(212,170,112,0.7)', flexShrink:0}}>
                  →
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.5}}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="w-px bg-gradient-to-b from-pink-neon to-transparent animate-pulse" style={{height:60}}/>
        <span className="text-text-dim font-light tracking-[4px] uppercase" style={{fontSize:9}}>Scroll</span>
      </motion.div>
    </section>
  )
}
