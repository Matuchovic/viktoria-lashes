'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function LoadingScreen({ show }: { show: boolean }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!show) return
    const t = setInterval(() => setProgress(p => Math.min(p + 2, 100)), 30)
    return () => clearInterval(t)
  }, [show])

  const lashes = Array.from({length:14},(_,i)=>({
    angle: -35 + i * 5.5,
    len: 55 + i * 3,
    color: i%3===0?'#D4AA70':i%3===1?'#FF6BA8':'#E8A4BE',
    delay: i * 0.06,
  }))

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity:1 }}
          exit={{ opacity:0, scale:1.05 }}
          transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
          style={{ background:'#080608' }}
        >
          {/* Grid */}
          <div className="absolute inset-0 hero-grid-bg opacity-30"/>

          {/* Glow bg */}
          <div className="absolute inset-0 pointer-events-none"
            style={{background:'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(196,105,138,0.15) 0%,transparent 70%)'}}/>

          {/* Animated lash fan */}
          <div className="relative mb-12" style={{width:220,height:180}}>
            <svg width="220" height="180" viewBox="0 0 220 180">
              <defs>
                <filter id="ls-glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>

              {/* Root glow */}
              <motion.ellipse cx="110" cy="165" rx="50" ry="12"
                fill="rgba(255,107,168,0.2)"
                animate={{rx:[40,60,40],opacity:[0.15,0.35,0.15]}}
                transition={{duration:2,repeat:Infinity,ease:'easeInOut'}}/>

              {/* Lashes */}
              {lashes.map((l,i)=>{
                const rad = l.angle * Math.PI / 180
                const ex = 110 + Math.sin(rad) * l.len
                const ey = 160 - l.len * Math.cos(rad)
                const cx1 = 110 + Math.sin(rad)*l.len*0.25
                const cy1 = 160 - l.len * 0.35
                return (
                  <motion.path key={i}
                    d={`M 110 160 C ${cx1} ${cy1} ${ex*0.7+110*0.3} ${ey*0.6+160*0.4} ${ex} ${ey}`}
                    stroke={l.color} strokeWidth={1.5} strokeLinecap="round" fill="none"
                    filter="url(#ls-glow)"
                    initial={{pathLength:0,opacity:0}}
                    animate={{pathLength:1,opacity:[0,1,0.8]}}
                    transition={{duration:1.5,delay:l.delay,ease:[0.16,1,0.3,1]}}
                  />
                )
              })}

              {/* Sparkles */}
              {[{x:80,y:60},{x:110,y:30},{x:145,y:55},{x:165,y:90},{x:65,y:100}].map((s,i)=>(
                <motion.circle key={`s-${i}`} cx={s.x} cy={s.y} r={1.5}
                  fill={i%2===0?'#FF6BA8':'#D4AA70'}
                  animate={{opacity:[0,1,0],scale:[0,2,0]}}
                  transition={{duration:1.2,delay:0.8+i*0.2,repeat:Infinity,repeatDelay:1.5}}
                  style={{filter:`drop-shadow(0 0 6px ${i%2===0?'#FF6BA8':'#D4AA70'})`,transformOrigin:`${s.x}px ${s.y}px`}}
                />
              ))}
            </svg>
          </div>

          {/* Logo */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3,duration:0.8}}>
            <motion.div
              className="font-serif text-3xl font-light tracking-[8px] uppercase text-center mb-2"
              animate={{textShadow:['0 0 20px rgba(255,107,168,0.3)','0 0 60px rgba(255,107,168,0.7)','0 0 20px rgba(255,107,168,0.3)']}}
              transition={{duration:2,repeat:Infinity}}>
              Viktória <span style={{color:'#FF6BA8'}}>Lashes</span>
            </motion.div>
            <div className="font-sans font-light tracking-[6px] uppercase text-center"
              style={{fontSize:9,color:'rgba(245,238,242,0.3)'}}>
              Luxury Beauty Experience
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="mt-12 w-48 h-px relative overflow-hidden" style={{background:'rgba(255,255,255,0.08)'}}>
            <motion.div className="absolute left-0 top-0 bottom-0"
              style={{width:`${progress}%`,background:'linear-gradient(90deg,#C4698A,#FF6BA8,#D4AA70)',boxShadow:'0 0 10px rgba(255,107,168,0.6)'}}/>
          </div>
          <div className="font-sans font-light mt-3 tracking-[4px]" style={{fontSize:10,color:'rgba(245,238,242,0.25)'}}>
            Připravuji Váš zážitek...
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
