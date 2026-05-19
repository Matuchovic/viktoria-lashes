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

// Single 3D lash strand rendered with SVG
function Lash3D({ x, y, length, angle, color, delay, duration, curveX, opacity }: {
  x:number; y:number; length:number; angle:number; color:string; delay:number; duration:number; curveX:number; opacity:number
}) {
  const id = `lash-${x}-${y}`
  const rad = (angle * Math.PI) / 180
  const ex = x + Math.sin(rad) * curveX
  const ey = y - length * Math.cos(rad)
  const cx1 = x + curveX * 0.3
  const cy1 = y - length * 0.4
  const cx2 = ex + curveX * 0.2
  const cy2 = ey + length * 0.3

  return (
    <motion.path
      d={`M ${x} ${y} C ${cx1} ${cy1} ${cx2} ${cy2} ${ex} ${ey}`}
      stroke={color}
      strokeWidth={1.2 + Math.random() * 0.8}
      strokeLinecap="round"
      fill="none"
      style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{
        pathLength: [0, 1, 1, 0],
        opacity: [0, opacity, opacity * 0.8, 0],
        strokeWidth: [0.5, 1.5, 1.2, 0.5],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3,
        ease: 'easeInOut',
      }}
    />
  )
}

// Eye shape with lashes
function LashEyeDecoration({ style }: { style?: React.CSSProperties }) {
  const lashes = [
    // upper lashes
    { x:120, y:85,  l:45, a:-15, cx:-8,  c:'#FF6BA8', o:0.9 },
    { x:145, y:78,  l:52, a:-8,  cx:-4,  c:'#FF6BA8', o:0.95 },
    { x:168, y:72,  l:58, a:0,   cx:0,   c:'#FF6BA8', o:1   },
    { x:190, y:70,  l:62, a:5,   cx:4,   c:'#D4AA70', o:0.9 },
    { x:212, y:72,  l:60, a:10,  cx:8,   c:'#FF6BA8', o:0.95 },
    { x:233, y:76,  l:55, a:16,  cx:12,  c:'#E8A4BE', o:0.85},
    { x:252, y:82,  l:45, a:22,  cx:14,  c:'#FF6BA8', o:0.8 },
    // between
    { x:132, y:82,  l:38, a:-12, cx:-5,  c:'#C4698A', o:0.6 },
    { x:156, y:75,  l:48, a:-4,  cx:-2,  c:'#D4AA70', o:0.7 },
    { x:178, y:71,  l:54, a:3,   cx:2,   c:'#C4698A', o:0.65},
    { x:200, y:71,  l:56, a:8,   cx:6,   c:'#E8A4BE', o:0.7 },
    { x:222, y:74,  l:50, a:14,  cx:10,  c:'#C4698A', o:0.65},
    { x:243, y:79,  l:42, a:20,  cx:13,  c:'#FF6BA8', o:0.6 },
  ]

  return (
    <svg
      viewBox="60 20 220 130"
      className="absolute pointer-events-none"
      style={style}
    >
      <defs>
        <radialGradient id="iris-grad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#1a0510"/>
          <stop offset="60%" stopColor="#2d0a1e"/>
          <stop offset="100%" stopColor="#0a0005"/>
        </radialGradient>
        <radialGradient id="iris-pink" cx="35%" cy="35%" r="45%">
          <stop offset="0%" stopColor="#FF6BA8" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <filter id="glow-eye">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Eye white */}
      <ellipse cx="186" cy="95" rx="72" ry="28" fill="#08020a" opacity="0.9"/>

      {/* Iris */}
      <circle cx="186" cy="93" r="20" fill="url(#iris-grad)"/>
      <circle cx="186" cy="93" r="20" fill="url(#iris-pink)"/>

      {/* Iris detail rings */}
      <circle cx="186" cy="93" r="20" fill="none" stroke="rgba(255,107,168,0.15)" strokeWidth="1"/>
      <circle cx="186" cy="93" r="14" fill="none" stroke="rgba(212,170,112,0.1)" strokeWidth="0.5"/>

      {/* Pupil */}
      <circle cx="186" cy="93" r="9" fill="#000" opacity="0.95"/>

      {/* Pupil highlight */}
      <circle cx="180" cy="88" r="3" fill="white" opacity="0.15"/>
      <circle cx="183" cy="86" r="1.5" fill="white" opacity="0.3"/>

      {/* Iris glow */}
      <circle cx="186" cy="93" r="21" fill="none" stroke="#FF6BA8" strokeWidth="0.5" opacity="0.4"/>

      {/* Eye outline top */}
      <path
        d="M 114 93 Q 150 62 186 58 Q 222 62 258 93"
        fill="none" stroke="rgba(255,107,168,0.5)" strokeWidth="1.5" strokeLinecap="round"
      />
      {/* Eye outline bottom */}
      <path
        d="M 114 93 Q 150 118 186 120 Q 222 118 258 93"
        fill="none" stroke="rgba(196,105,138,0.3)" strokeWidth="1" strokeLinecap="round"
      />

      {/* Lower lashes (subtle) */}
      {[130,150,168,186,204,222,242].map((lx,i)=>(
        <motion.line key={`lo-${i}`}
          x1={lx} y1={110} x2={lx + (i-3)*2} y2={118 + Math.abs(i-3)*1.5}
          stroke="rgba(196,105,138,0.4)" strokeWidth="0.8" strokeLinecap="round"
          initial={{opacity:0,scaleY:0}} animate={{opacity:1,scaleY:1}}
          transition={{delay:2+i*0.05,duration:0.4}}
          style={{transformOrigin:`${lx}px 110px`}}
        />
      ))}

      {/* Upper lashes - animated one by one */}
      {lashes.map((l,i)=>(
        <Lash3D key={i}
          x={l.x} y={l.y} length={l.l} angle={l.a}
          color={l.c} opacity={l.o}
          curveX={l.cx}
          delay={0.3 + i * 0.08}
          duration={3 + i * 0.2}
        />
      ))}

      {/* Glitter sparks on iris */}
      {[{cx:178,cy:87},{cx:193,cy:89},{cx:186,cy:83}].map((s,i)=>(
        <motion.circle key={`spark-${i}`} cx={s.cx} cy={s.cy} r={0.8}
          fill="#D4AA70"
          animate={{opacity:[0,1,0],scale:[0,1.5,0]}}
          transition={{duration:1.5,delay:2+i*0.4,repeat:Infinity,repeatDelay:2}}
          style={{transformOrigin:`${s.cx}px ${s.cy}px`}}
        />
      ))}
    </svg>
  )
}

export function HeroSection() {
  const { scrollY } = useScroll()
  const y       = useTransform(scrollY, [0, 600], [0, 180])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    delay: -Math.random() * 10,
    dur: 5 + Math.random() * 8,
    isGold: i % 4 === 0,
    drift: (Math.random() - 0.5) * 100,
  }))

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-8 md:px-16 pt-28 pb-20">
      {/* Background */}
      <div className="absolute inset-0" style={{
        background:'radial-gradient(ellipse 80% 60% at 55% 45%, rgba(196,105,138,0.15) 0%,transparent 60%), radial-gradient(ellipse 50% 70% at 15% 75%, rgba(255,107,168,0.07) 0%,transparent 50%), #080608'
      }}/>
      <div className="absolute inset-0 hero-grid-bg"/>

      {/* Orbit rings */}
      {[{s:500,r:-120,o:0.25,d:'20s'},{s:750,r:-270,o:0.15,d:'30s',rev:true},{s:300,r:60,o:0.4,d:'14s'}].map((r,i)=>(
        <div key={i} className="absolute rounded-full border border-pink-glow pointer-events-none"
          style={{width:r.s,height:r.s,right:r.r,top:'50%',marginTop:-r.s/2,opacity:r.o,
            animation:`orbit ${r.d} linear infinite${r.rev?' reverse':''}`}}
        />
      ))}

      {/* 3D Eye with lashes — right side */}
      {mounted && (
        <>
          <LashEyeDecoration style={{
            width:420, height:200,
            top:'50%', right:'-20px',
            transform:'translateY(-55%)',
            opacity:0.85,
            zIndex:1,
          }}/>

          {/* Additional floating lashes around the eye */}
          <svg className="absolute pointer-events-none" style={{width:600,height:400,top:'30%',right:-60,opacity:0.5,zIndex:0}}>
            {Array.from({length:12},(_,i)=>(
              <Lash3D key={`fl-${i}`}
                x={480-i*8} y={150+i*15}
                length={30+i*5} angle={-20+i*8}
                color={i%3===0?'#D4AA70':i%3===1?'#FF6BA8':'#E8A4BE'}
                opacity={0.3+Math.random()*0.3}
                curveX={-10+i*4}
                delay={i*0.15}
                duration={4+i*0.3}
              />
            ))}
          </svg>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map(p=>(
              <motion.div key={p.id}
                className="absolute rounded-full"
                style={{
                  width:p.isGold?2:1.5, height:p.isGold?2:1.5,
                  left:p.left, bottom:'-10px',
                  background:p.isGold?'#D4AA70':'#FF6BA8',
                  boxShadow:`0 0 ${p.isGold?8:6}px ${p.isGold?'#D4AA70':'#FF6BA8'}`,
                }}
                animate={{y:['0px','-110vh'],x:[0,p.drift],opacity:[0,0.8,0.4,0]}}
                transition={{duration:p.dur,delay:p.delay,repeat:Infinity,ease:'linear'}}
              />
            ))}

            {/* Floating sparkles */}
            {['✦','✸','◈','❋','✦'].map((s,i)=>(
              <motion.span key={`sp-${i}`}
                className="absolute pointer-events-none select-none font-serif"
                style={{
                  fontSize:12+i*4,
                  color:i%2===0?'#FF6BA8':'#D4AA70',
                  left:`${15+i*15}%`,
                  top:`${20+i*12}%`,
                  textShadow:`0 0 15px ${i%2===0?'#FF6BA8':'#D4AA70'}`,
                }}
                animate={{y:[-8,8,-8],rotate:[0,20,-20,0],opacity:[0.3,0.7,0.3],scale:[0.8,1.1,0.8]}}
                transition={{duration:2.5+i*0.6,repeat:Infinity,delay:i*0.5,ease:'easeInOut'}}
              >{s}</motion.span>
            ))}
          </div>
        </>
      )}

      {/* Main content */}
      <motion.div style={{y,opacity}} className="relative z-10 max-w-5xl w-full">
        <motion.div variants={CONTAINER_VARIANTS} initial="hidden" animate="show" className="flex flex-col gap-8">

          <motion.div variants={ITEM_VARIANTS} className="section-label">
            Mladá Boleslav &amp; okolí · Přijedu k Vám domů
          </motion.div>

          {/* WOW Title */}
          <motion.div variants={ITEM_VARIANTS} className="relative">
            <h1 className="font-serif font-light leading-none" style={{fontSize:'clamp(64px,11vw,130px)',letterSpacing:'-2px'}}>
              {/* VIKTORIA — letter by letter */}
              <div className="overflow-hidden">
                {'Viktoria'.split('').map((ch,i)=>(
                  <motion.span key={i}
                    initial={{y:'100%',opacity:0}}
                    animate={{y:0,opacity:1}}
                    transition={{delay:0.5+i*0.07,duration:0.7,ease:[0.16,1,0.3,1]}}
                    style={{display:'inline-block'}}
                  >{ch}</motion.span>
                ))}
              </div>
              {/* LASHES — shimmer gold-pink gradient */}
              <div className="overflow-hidden relative">
                <motion.span
                  initial={{y:'100%',opacity:0}}
                  animate={{y:0,opacity:1}}
                  transition={{delay:1.1,duration:0.9,ease:[0.16,1,0.3,1]}}
                  style={{display:'block'}}
                >
                  <span className="not-italic" style={{
                    background:'linear-gradient(90deg,#E8A4BE 0%,#FF6BA8 25%,#D4AA70 50%,#FF6BA8 75%,#E8A4BE 100%)',
                    backgroundSize:'300% auto',
                    WebkitBackgroundClip:'text',
                    WebkitTextFillColor:'transparent',
                    backgroundClip:'text',
                    animation:'shimmer 3s linear infinite',
                    filter:'drop-shadow(0 0 35px rgba(255,107,168,0.7)) drop-shadow(0 0 70px rgba(255,107,168,0.3))',
                    display:'inline-block',
                  }}>Lashes</span>
                </motion.span>
                {/* Golden underline */}
                <motion.div
                  initial={{scaleX:0,opacity:0}}
                  animate={{scaleX:1,opacity:1}}
                  transition={{delay:1.8,duration:1,ease:[0.16,1,0.3,1]}}
                  style={{
                    position:'absolute',bottom:6,left:0,right:'40%',height:2,
                    background:'linear-gradient(90deg,rgba(255,107,168,0.8),rgba(212,170,112,0.6),transparent)',
                    transformOrigin:'left',
                    boxShadow:'0 0 10px rgba(255,107,168,0.5)',
                  }}
                />
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

          <motion.div variants={ITEM_VARIANTS} className="flex items-center gap-8 pt-4">
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
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.5}}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="w-px bg-gradient-to-b from-pink-neon to-transparent animate-pulse" style={{height:60}}/>
        <span className="text-text-dim font-light tracking-[4px] uppercase" style={{fontSize:9}}>Scroll</span>
      </motion.div>
    </section>
  )
}
