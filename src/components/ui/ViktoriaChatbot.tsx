'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const IMG = "data:image/jpeg;base64,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"

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
            <img src={IMG} alt="Viktória"
              style={{ width:'130%', height:'130%', objectFit:'cover', objectPosition:'center top', marginLeft:'-15%', marginTop:'-5%',
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
