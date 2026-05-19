'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MSGS = [
  "Ahoj! Jsem Viktória ✨",
  "Přijedu přímo k Vám domů! 🏠",
  "Klasické řasy od 499 Kč 💕",
  "Mega Volume — extravagance ✸",
  "Wet Look — hit sezóny! 💧",
  "Rezervujte online 24/7",
  "Mladá Boleslav & okolí",
  "Doplnění od 199 Kč ◉",
  "+420 720 307 007 📞",
]

export function ViktoriaChatbot() {
  const [open, setOpen] = useState(false)
  const [msgIdx, setMsgIdx] = useState(0)
  const [typing, setTyping] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [particles, setParticles] = useState<{id:number;x:number;y:number;c:string}[]>([])
  const pid = useRef(0)

  useEffect(() => {
    if (!open) return
    const t = setInterval(() => {
      setTyping(true)
      setTimeout(() => { setMsgIdx(i => (i+1)%MSGS.length); setTyping(false) }, 1000)
    }, 4500)
    return () => clearInterval(t)
  }, [open])

  useEffect(() => {
    if (!hovered) return
    const t = setInterval(() => {
      const id = pid.current++
      const colors = ['#FF6BA8','#E8A4BE','#D4AA70','#fff']
      setParticles(p => [...p.slice(-8), { id, x:10+Math.random()*44, y:Math.random()*64, c:colors[Math.floor(Math.random()*4)] }])
      setTimeout(() => setParticles(p => p.filter(x=>x.id!==id)), 1200)
    }, 150)
    return () => clearInterval(t)
  }, [hovered])

  return (
    <div style={{
      position:'fixed', bottom:24, right:24, zIndex:9999,
      display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8,
      pointerEvents:'none',
    }}>
      {/* Chat bubble */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:12, scale:0.9, originX:1, originY:1 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:8, scale:0.95 }}
            transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
            style={{
              pointerEvents:'auto',
              background:'rgba(8,6,8,0.97)',
              border:'1px solid rgba(255,107,168,0.5)',
              borderRadius:'16px 16px 4px 16px',
              padding:'12px 14px',
              width:200,
              backdropFilter:'blur(20px)',
              boxShadow:'0 0 30px rgba(255,107,168,0.2), 0 8px 24px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'#FF6BA8', textTransform:'uppercase', marginBottom:7, textShadow:'0 0 10px rgba(255,107,168,0.7)' }}>
              ✦ Viktória
            </div>
            <AnimatePresence mode="wait">
              {typing ? (
                <motion.div key="t" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  style={{ display:'flex', gap:4, alignItems:'center', padding:'4px 0' }}>
                  {[0,1,2].map(i=>(
                    <motion.div key={i} animate={{y:[0,-3,0]}} transition={{duration:0.45,delay:i*0.12,repeat:Infinity}}
                      style={{width:4,height:4,borderRadius:'50%',background:'rgba(255,107,168,0.7)'}}/>
                  ))}
                </motion.div>
              ) : (
                <motion.p key={msgIdx} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}}
                  transition={{duration:0.3}}
                  style={{ fontFamily:'Georgia,serif', fontSize:12.5, color:'rgba(245,238,242,0.9)', lineHeight:1.6, margin:0 }}>
                  {MSGS[msgIdx]}
                </motion.p>
              )}
            </AnimatePresence>
            <a href="/rezervace" style={{
              display:'inline-block', marginTop:9,
              fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2,
              color:'#FF6BA8', textDecoration:'none', textTransform:'uppercase',
              borderBottom:'1px solid rgba(255,107,168,0.4)', paddingBottom:1,
            }}>
              Rezervovat →
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar */}
      <div style={{ position:'relative', pointerEvents:'auto' }}
        onMouseEnter={()=>setHovered(true)}
        onMouseLeave={()=>setHovered(false)}
      >
        {/* Particles */}
        {particles.map(p=>(
          <motion.div key={p.id}
            initial={{opacity:0.9,y:0,scale:1}}
            animate={{opacity:0,y:-50,scale:0}}
            transition={{duration:1.2,ease:'easeOut'}}
            style={{
              position:'absolute',bottom:4,left:p.x,
              width:3,height:3,borderRadius:'50%',
              background:p.c,boxShadow:`0 0 6px ${p.c}`,
              pointerEvents:'none',zIndex:1,
            }}
          />
        ))}

        {/* Spinning ring */}
        <motion.div
          animate={{rotate:360}}
          transition={{duration:10,repeat:Infinity,ease:'linear'}}
          style={{
            position:'absolute',inset:-6,borderRadius:'50%',
            border:'1px dashed rgba(255,107,168,0.4)',
            pointerEvents:'none',
          }}
        >
          {['✦','◈','✸'].map((s,i)=>(
            <span key={i} style={{
              position:'absolute',fontSize:7,color:'#FF6BA8',
              textShadow:'0 0 5px #FF6BA8',
              top: i===0?'-5px':i===1?'42%':'90%',
              left: i===0?'40%':i===1?'-5px':'85%',
            }}>{s}</span>
          ))}
        </motion.div>

        {/* Glow + click */}
        <motion.div
          animate={{ boxShadow: hovered
            ? '0 0 0 2px #FF6BA8, 0 0 25px rgba(255,107,168,0.6)'
            : open
              ? '0 0 0 2px rgba(255,107,168,0.6), 0 0 18px rgba(255,107,168,0.4)'
              : '0 0 0 1.5px rgba(255,107,168,0.35), 0 0 12px rgba(255,107,168,0.2)'
          }}
          transition={{duration:0.25}}
          style={{borderRadius:'50%',cursor:'none'}}
          onClick={()=>setOpen(o=>!o)}
        >
          {/* Floating photo */}
          <motion.div
            animate={{y:[0,-4,0]}}
            transition={{duration:3.5,repeat:Infinity,ease:'easeInOut'}}
            style={{
              width:64,height:64,borderRadius:'50%',
              overflow:'hidden',
              border:'1.5px solid rgba(255,107,168,0.6)',
              background:'#080608',
            }}
          >
            <img
              src="/viktoria-avatar.png"
              alt="Viktória"
              style={{
                width:'100%',height:'100%',
                objectFit:'cover',
                objectPosition:'center 10%',
                filter: hovered ? 'brightness(1.15)' : 'brightness(1)',
                transition:'filter 0.3s',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Name on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{opacity:0,y:3}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              style={{
                position:'absolute',bottom:-18,left:'50%',transform:'translateX(-50%)',
                fontFamily:'Georgia,serif',fontSize:8,letterSpacing:2,
                color:'#FF6BA8',textTransform:'uppercase',whiteSpace:'nowrap',
                textShadow:'0 0 8px rgba(255,107,168,0.6)',
              }}
            >
              Viktória
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
