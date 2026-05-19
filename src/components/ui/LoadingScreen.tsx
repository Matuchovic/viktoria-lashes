'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function LoadingScreen({ show }: { show: boolean }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0) // 0=lashes drawing, 1=logo appears, 2=progress

  useEffect(() => {
    if (!show) { setProgress(0); setPhase(0); return }
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => setPhase(2), 1400)
    const t3 = setInterval(() => setProgress(p => { if(p>=100){clearInterval(t3);return 100} return p+2.5 }), 30)
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(t3) }
  }, [show])

  // 20 lashes fanning out from center-bottom
  const lashes = Array.from({ length: 20 }, (_, i) => {
    const angle = -40 + i * 4.2
    const rad   = angle * Math.PI / 180
    const len   = 70 + i * 4
    const bx    = 200; const by = 280
    const cx1   = bx + Math.sin(rad)*len*0.25
    const cy1   = by - len*0.35
    const ex    = bx + Math.sin(rad)*len
    const ey    = by - len*Math.cos(rad)
    return {
      d: `M ${bx} ${by} C ${cx1} ${cy1} ${bx+Math.sin(rad)*len*0.6} ${by-len*0.7} ${ex} ${ey}`,
      color: i%3===0 ? '#D4AA70' : i%3===1 ? '#FF6BA8' : '#E8A4BE',
      width: 1.2 + (i>8&&i<12 ? 0.6 : 0),
      delay: i * 0.06,
    }
  })

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity:1 }}
          exit={{ opacity:0 }}
          transition={{ duration:1, ease:[0.16,1,0.3,1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background:'#080608' }}
        >
          {/* Radial bg glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:'radial-gradient(ellipse 70% 70% at 50% 50%,rgba(196,105,138,0.12) 0%,transparent 70%)' }}/>
          <div className="absolute inset-0 hero-grid-bg" style={{ opacity:0.2 }}/>

          {/* Slow orbit rings */}
          {[{s:500,d:'25s'},{s:700,d:'35s',rev:true},{s:900,d:'45s'}].map((r,i)=>(
            <div key={i} className="absolute rounded-full pointer-events-none"
              style={{ width:r.s, height:r.s, left:'50%', top:'50%', marginLeft:-r.s/2, marginTop:-r.s/2,
                border:'1px solid rgba(255,107,168,0.07)',
                animation:`orbit ${r.d} linear infinite${r.rev?' reverse':''}` }}/>
          ))}

          {/* Main SVG — lash fan */}
          <div className="relative" style={{ width:400, height:310 }}>
            <svg width="400" height="310" viewBox="0 0 400 310" className="absolute inset-0">
              <defs>
                <filter id="ls-glow3">
                  <feGaussianBlur stdDeviation="2.5" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <radialGradient id="root-g" cx="50%" cy="100%" r="40%">
                  <stop offset="0%" stopColor="#FF6BA8" stopOpacity="0.5"/>
                  <stop offset="100%" stopColor="transparent"/>
                </radialGradient>
              </defs>

              {/* Root glow */}
              <motion.ellipse cx="200" cy="282" rx="60" ry="14"
                fill="url(#root-g)"
                animate={{ rx:[40,70,40], opacity:[0.4,0.8,0.4] }}
                transition={{ duration:2.5, repeat:Infinity, ease:'easeInOut' }}/>

              {/* Lashes — draw in one by one */}
              {lashes.map((l,i) => (
                <motion.path key={i}
                  d={l.d} stroke={l.color} strokeWidth={l.width}
                  strokeLinecap="round" fill="none"
                  filter="url(#ls-glow3)"
                  initial={{ pathLength:0, opacity:0 }}
                  animate={{ pathLength:1, opacity:[0, 1, 0.85] }}
                  transition={{ duration:1.2, delay:l.delay, ease:[0.16,1,0.3,1] }}
                />
              ))}

              {/* Floating sparkles along the fan */}
              {[{x:130,y:100},{x:170,y:50},{x:200,y:35},{x:235,y:55},{x:265,y:95},{x:155,y:155},{x:245,y:150}].map((s,i)=>(
                <motion.circle key={`ls-sp-${i}`} cx={s.x} cy={s.y} r={1.8}
                  fill={i%2===0?'#FF6BA8':'#D4AA70'}
                  style={{ filter:`drop-shadow(0 0 8px ${i%2===0?'#FF6BA8':'#D4AA70'})` }}
                  animate={{ opacity:[0,1,0], scale:[0,2,0] }}
                  transition={{ duration:1.5, delay:1+i*0.18, repeat:Infinity, repeatDelay:2 }}
                />
              ))}
            </svg>
          </div>

          {/* Logo — appears after lashes */}
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity:0, y:20, scale:0.95 }}
                animate={{ opacity:1, y:0, scale:1 }}
                transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
                className="text-center mt-6"
              >
                <motion.div
                  className="font-serif font-light tracking-[10px] uppercase"
                  style={{ fontSize:'clamp(28px,5vw,42px)' }}
                  animate={{
                    background:['linear-gradient(90deg,#E8A4BE,#FF6BA8,#D4AA70,#FF6BA8,#E8A4BE)'],
                    backgroundSize:['300% auto'],
                    WebkitBackgroundClip:['text'],
                    WebkitTextFillColor:['transparent'],
                  }}
                >
                  <span style={{
                    background:'linear-gradient(90deg,#E8A4BE 0%,#FF6BA8 25%,#D4AA70 50%,#FF6BA8 75%,#E8A4BE 100%)',
                    backgroundSize:'300% auto',
                    WebkitBackgroundClip:'text',
                    WebkitTextFillColor:'transparent',
                    backgroundClip:'text',
                    animation:'shimmer 3s linear infinite',
                    filter:'drop-shadow(0 0 30px rgba(255,107,168,0.7))',
                    display:'inline-block',
                  }}>
                    Viktória Lashes
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
                  className="font-sans font-light tracking-[6px] uppercase mt-2"
                  style={{ fontSize:10, color:'rgba(245,238,242,0.3)' }}
                >
                  Luxury Beauty Experience
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress */}
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                initial={{ opacity:0, y:10 }}
                animate={{ opacity:1, y:0 }}
                transition={{ duration:0.6 }}
                className="mt-10 flex flex-col items-center gap-3"
              >
                <div className="relative" style={{ width:200, height:2, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                  <motion.div
                    style={{ position:'absolute', left:0, top:0, bottom:0, width:`${progress}%`,
                      background:'linear-gradient(90deg,#C4698A,#FF6BA8,#D4AA70)',
                      boxShadow:'0 0 12px rgba(255,107,168,0.7)',
                    }}
                  />
                  {/* Shine on progress bar */}
                  <motion.div
                    animate={{ x:['-100%','200%'] }} transition={{ duration:1, repeat:Infinity, ease:'easeInOut' }}
                    style={{ position:'absolute', top:0, bottom:0, width:'30%',
                      background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)' }}
                  />
                </div>
                <div className="font-sans font-light tracking-[4px]"
                  style={{ fontSize:9, color:'rgba(245,238,242,0.2)' }}>
                  Připravuji Váš zážitek...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
