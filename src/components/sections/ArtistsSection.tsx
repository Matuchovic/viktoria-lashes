'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const TITLES = ['Zakladatelka', 'Specialistka', 'Expertka', 'Mistryně řas', 'Vaše stylistka']

export function ArtistsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [titleIdx, setTitleIdx] = useState(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setTitleIdx(i => (i + 1) % TITLES.length), 2200)
    return () => clearInterval(t)
  }, [])

  return (
    <section id="stylistky" className="bg-black-3 px-8 md:px-16 py-32 overflow-hidden">
      <motion.div ref={ref} initial={{ opacity:0, y:30 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.8 }} className="mb-16">
        <div className="section-label mb-5">O mně</div>
        <h2 className="section-title mb-6">Vaše stylistka</h2>
      </motion.div>

      <motion.div
        initial={{ opacity:0, y:40 }}
        animate={inView?{opacity:1,y:0}:{}}
        transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative max-w-3xl overflow-hidden"
        style={{
          background: hovered ? 'rgba(255,107,168,0.06)' : 'rgba(255,255,255,0.03)',
          border: '1px solid transparent',
          backgroundClip: 'padding-box',
          transition: 'background 0.5s',
        }}
      >
        {/* Animated glow border */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex:0 }}>
          {/* Top */}
          <motion.div animate={{ scaleX:[0,1,1,0], x:['0%','0%','100%','100%'] }} transition={{ duration:3, repeat:Infinity, ease:'linear' }}
            style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#FF6BA8,#D4AA70,transparent)', transformOrigin:'left' }}/>
          {/* Right */}
          <motion.div animate={{ scaleY:[0,1,1,0], y:['0%','0%','100%','100%'] }} transition={{ duration:3, delay:0.75, repeat:Infinity, ease:'linear' }}
            style={{ position:'absolute', top:0, right:0, bottom:0, width:2, background:'linear-gradient(180deg,transparent,#FF6BA8,#D4AA70,transparent)', transformOrigin:'top' }}/>
          {/* Bottom */}
          <motion.div animate={{ scaleX:[0,1,1,0], x:['100%','100%','0%','0%'] }} transition={{ duration:3, delay:1.5, repeat:Infinity, ease:'linear' }}
            style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#D4AA70,#FF6BA8,transparent)', transformOrigin:'right' }}/>
          {/* Left */}
          <motion.div animate={{ scaleY:[0,1,1,0], y:['100%','100%','0%','0%'] }} transition={{ duration:3, delay:2.25, repeat:Infinity, ease:'linear' }}
            style={{ position:'absolute', top:0, left:0, bottom:0, width:2, background:'linear-gradient(0deg,transparent,#D4AA70,#FF6BA8,transparent)', transformOrigin:'bottom' }}/>
        </div>

        {/* Corner accents */}
        {['top-0 left-0','top-0 right-0','bottom-0 left-0','bottom-0 right-0'].map((pos,i) => (
          <div key={i} className={`absolute ${pos} pointer-events-none`} style={{ zIndex:1 }}>
            <div style={{ width:20, height:20, borderTop: i<2 ? '2px solid #FF6BA8':'none', borderBottom: i>=2 ? '2px solid #FF6BA8':'none', borderLeft: i%2===0 ? '2px solid #FF6BA8':'none', borderRight: i%2===1 ? '2px solid #FF6BA8':'none', boxShadow:`0 0 10px rgba(255,107,168,0.5)` }}/>
          </div>
        ))}

        <div className="relative z-10 p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left — avatar + badges */}
          <div className="flex flex-col items-center gap-6">
            {/* Avatar with orbit */}
            <div className="relative w-40 h-40">
              {/* Orbit ring */}
              <motion.div animate={{ rotate:360 }} transition={{ duration:8, repeat:Infinity, ease:'linear' }}
                className="absolute inset-[-12px] rounded-full"
                style={{ border:'1px dashed rgba(255,107,168,0.3)' }}/>
              <motion.div animate={{ rotate:-360 }} transition={{ duration:12, repeat:Infinity, ease:'linear' }}
                className="absolute inset-[-24px] rounded-full"
                style={{ border:'1px dashed rgba(212,170,112,0.2)' }}/>

              {/* Orbit dots */}
              <motion.div animate={{ rotate:360 }} transition={{ duration:8, repeat:Infinity, ease:'linear' }}
                className="absolute inset-[-12px] rounded-full">
                <div className="absolute w-2 h-2 rounded-full bg-pink-neon top-0 left-1/2 -translate-x-1/2"
                  style={{ boxShadow:'0 0 8px #FF6BA8, 0 0 16px #FF6BA8' }}/>
              </motion.div>
              <motion.div animate={{ rotate:-360 }} transition={{ duration:12, repeat:Infinity, ease:'linear' }}
                className="absolute inset-[-24px] rounded-full">
                <div className="absolute w-1.5 h-1.5 rounded-full bg-gold top-0 left-1/2 -translate-x-1/2"
                  style={{ boxShadow:'0 0 8px #D4AA70' }}/>
              </motion.div>

              {/* Main avatar circle */}
              <div className="w-full h-full rounded-full flex items-center justify-center relative"
                style={{ background:'linear-gradient(135deg,#1a0510,#2d0a1e)', border:'1px solid rgba(255,107,168,0.3)', boxShadow:'0 0 40px rgba(255,107,168,0.2), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                <span className="font-serif text-6xl font-light"
                  style={{ background:'linear-gradient(135deg,#E8A4BE,#FF6BA8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', filter:'drop-shadow(0 0 10px rgba(255,107,168,0.5))' }}>V</span>
              </div>

              {/* Lash SVG decorations around avatar */}
              <svg className="absolute inset-[-40px] pointer-events-none" viewBox="0 0 220 220" style={{ width:220, height:220 }}>
                {[
                  { x:110, y:5,  ex:95,  ey:35,  c:'#FF6BA8' },
                  { x:110, y:5,  ex:110, ey:30,  c:'#D4AA70' },
                  { x:110, y:5,  ex:125, ey:35,  c:'#E8A4BE' },
                  { x:110, y:5,  ex:100, ey:38,  c:'#FF6BA8' },
                  { x:110, y:5,  ex:120, ey:38,  c:'#C4698A' },
                ].map((l,i) => (
                  <motion.line key={i} x1={l.x} y1={l.y} x2={l.ex} y2={l.ey}
                    stroke={l.c} strokeWidth={1.2} strokeLinecap="round"
                    initial={{ pathLength:0, opacity:0 }}
                    animate={{ pathLength:[0,1,1,0], opacity:[0,0.8,0.6,0] }}
                    transition={{ duration:2.5, delay:i*0.15, repeat:Infinity, repeatDelay:1.5, ease:'easeInOut' }}
                    style={{ filter:`drop-shadow(0 0 4px ${l.c})` }}
                  />
                ))}
              </svg>
            </div>

            {/* Animated rotating title */}
            <div className="text-center">
              <div className="font-serif text-2xl font-light mb-2">Viktória Ladiková</div>
              <div style={{ height:28, overflow:'hidden', position:'relative' }}>
                <AnimatePresence mode="wait">
                  <motion.div key={titleIdx}
                    initial={{ y:30, opacity:0 }}
                    animate={{ y:0, opacity:1 }}
                    exit={{ y:-30, opacity:0 }}
                    transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
                    className="font-sans font-light tracking-[4px] uppercase absolute inset-x-0"
                    style={{ fontSize:11, color:'#FF6BA8', textShadow:'0 0 15px rgba(255,107,168,0.7)', textAlign:'center' }}
                  >
                    {TITLES[titleIdx]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Specialties */}
            <div className="flex flex-wrap gap-2 justify-center">
              {['Klasické řasy','Mega Volume','Wet Look','Objemové'].map(s=>(
                <motion.span key={s} whileHover={{ scale:1.05, borderColor:'#FF6BA8', color:'#FF6BA8' }}
                  className="text-[10px] tracking-wider px-3 py-1 cursor-default transition-colors duration-300"
                  style={{ border:'1px solid rgba(255,255,255,0.1)', color:'rgba(245,238,242,0.4)' }}>
                  {s}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Right — info */}
          <div className="flex flex-col gap-6">
            {/* Luxury stat-like cards */}
            {[
              { icon:'✦', label:'Zkušenosti', value:'4+ roky v oboru' },
              { icon:'◈', label:'Oblast působení', value:'Mladá Boleslav & okolí' },
              { icon:'🏠', label:'Přijíždím k Vám', value:'Domů, za dokonalostí' },
              { icon:'❋', label:'Specializace', value:'Klasické · Volume · Mega' },
            ].map((item,i) => (
              <motion.div key={item.label}
                initial={{ opacity:0, x:20 }}
                animate={inView?{opacity:1,x:0}:{}}
                transition={{ delay:0.5+i*0.1, duration:0.6 }}
                whileHover={{ x:4 }}
                className="flex items-start gap-4 pb-4"
                style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}
              >
                <span style={{ fontSize:16, color:'#FF6BA8', textShadow:'0 0 12px rgba(255,107,168,0.6)', minWidth:20 }}>{item.icon}</span>
                <div>
                  <div className="font-sans font-light tracking-[2px] uppercase mb-0.5" style={{ fontSize:10, color:'rgba(245,238,242,0.35)' }}>{item.label}</div>
                  <div className="font-serif font-light" style={{ fontSize:15, color:'rgba(245,238,242,0.85)' }}>{item.value}</div>
                </div>
              </motion.div>
            ))}

            <p className="text-text-muted font-light leading-relaxed text-sm mt-2">
              S více než 4 lety zkušeností v oblasti prodlužování řas přijíždím přímo k Vám domů —
              pro maximální komfort a luxusní výsledky, které promění Váš pohled.
            </p>

            <Link href="/rezervace" className="btn-primary self-start mt-2">
              Rezervovat termín →
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
