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
      setParticles(p => [...p.slice(-10), { id, x:15+Math.random()*60, y:Math.random()*80, c:colors[Math.floor(Math.random()*4)] }])
      setTimeout(() => setParticles(p => p.filter(x=>x.id!==id)), 1400)
    }, 130)
    return () => clearInterval(t)
  }, [hovered])

  return (
    <div style={{ position:'fixed', bottom:20, right:20, zIndex:9999, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10, pointerEvents:'none' }}>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:16, scale:0.92 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:8, scale:0.95 }}
            transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
            style={{ pointerEvents:'auto', background:'rgba(8,6,8,0.96)', border:'1px solid rgba(255,107,168,0.45)', borderRadius:'18px 18px 4px 18px', padding:'14px 16px', maxWidth:220, backdropFilter:'blur(20px)', boxShadow:'0 0 40px rgba(255,107,168,0.25), 0 8px 32px rgba(0,0,0,0.6)' }}
          >
            <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'#FF6BA8', textTransform:'uppercase', marginBottom:8, textShadow:'0 0 12px rgba(255,107,168,0.7)' }}>✦ Viktória</div>
            <AnimatePresence mode="wait">
              {typing ? (
                <motion.div key="t" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{ display:'flex', gap:4, alignItems:'center', padding:'6px 0' }}>
                  {[0,1,2].map(i=>(
                    <motion.div key={i} animate={{y:[0,-4,0]}} transition={{duration:0.5,delay:i*0.15,repeat:Infinity}}
                      style={{width:5,height:5,borderRadius:'50%',background:'rgba(255,107,168,0.7)'}}/>
                  ))}
                </motion.div>
              ) : (
                <motion.p key={msgIdx} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
                  style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.88)', lineHeight:1.65, margin:0 }}>
                  {MSGS[msgIdx]}
                </motion.p>
              )}
            </AnimatePresence>
            <a href="/rezervace" style={{ display:'inline-block', marginTop:10, fontFamily:'Georgia,serif', fontSize:10, letterSpacing:2, color:'#FF6BA8', textDecoration:'none', textTransform:'uppercase', borderBottom:'1px solid rgba(255,107,168,0.4)', paddingBottom:1 }}>
              Rezervovat →
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position:'relative', pointerEvents:'auto' }}
        onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>

        {particles.map(p=>(
          <motion.div key={p.id}
            initial={{opacity:0.9,y:0,scale:1}} animate={{opacity:0,y:-55,scale:0}}
            transition={{duration:1.4,ease:'easeOut'}}
            style={{position:'absolute',bottom:0,left:p.x,width:4,height:4,borderRadius:'50%',background:p.c,boxShadow:`0 0 8px ${p.c}`,pointerEvents:'none'}}
          />
        ))}

        <motion.div animate={{rotate:360}} transition={{duration:9,repeat:Infinity,ease:'linear'}}
          style={{position:'absolute',inset:-8,borderRadius:'50%',border:'1px dashed rgba(255,107,168,0.35)',pointerEvents:'none'}}>
          {['✦','✸','◈'].map((s,i)=>(
            <span key={i} style={{position:'absolute',fontSize:7,color:'#FF6BA8',textShadow:'0 0 6px #FF6BA8',
              top:i===0?'-4px':i===1?'40%':'85%',
              left:i===0?'42%':i===1?'-5px':'88%',
            }}>{s}</span>
          ))}
        </motion.div>

        <motion.div
          animate={{ boxShadow: hovered
            ? '0 0 0 3px rgba(255,107,168,0.7),0 0 35px rgba(255,107,168,0.5)'
            : open ? '0 0 0 2px rgba(255,107,168,0.5),0 0 20px rgba(255,107,168,0.3)'
            : '0 0 0 1.5px rgba(255,107,168,0.3),0 0 15px rgba(255,107,168,0.2)' }}
          style={{ borderRadius:'50%', cursor:'none' }}
          onClick={()=>setOpen(o=>!o)}
        >
          <motion.div
            animate={{ y:[0,-5,0] }}
            transition={{ duration:3.5, repeat:Infinity, ease:'easeInOut' }}
            style={{ width:88, height:88, borderRadius:'50%', overflow:'hidden', border:'2px solid rgba(255,107,168,0.5)', background:'#0a0608' }}
          >
            <img
              src="/viktoria-avatar.png"
              alt="Viktória"
              style={{ width:'140%', height:'140%', objectFit:'cover', objectPosition:'center top', marginLeft:'-20%', marginTop:'-5%',
                filter: hovered ? 'brightness(1.12) contrast(1.05)' : 'brightness(1)',
                transition:'filter 0.3s' }}
            />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {hovered && (
            <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              style={{position:'absolute',bottom:-20,left:'50%',transform:'translateX(-50%)',
                fontFamily:'Georgia,serif',fontSize:8,letterSpacing:3,color:'#FF6BA8',
                textTransform:'uppercase',whiteSpace:'nowrap',textShadow:'0 0 10px rgba(255,107,168,0.6)'}}>
              Viktória ✦
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
