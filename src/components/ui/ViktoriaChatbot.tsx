'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Msg { role: 'user'|'assistant'; content: string }

export function ViktoriaChatbot() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([
    { role:'assistant', content:'Ahoj! Jsem Viktória ✨ Přijedu přímo k Vám domů! Na co se chcete zeptat?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [particles, setParticles] = useState<{id:number;x:number;y:number;c:string}[]>([])
  const pid = useRef(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [msgs])

  useEffect(() => {
    if (!hovered) return
    const t = setInterval(() => {
      const id = pid.current++
      const colors = ['#FF6BA8','#E8A4BE','#D4AA70']
      setParticles(p => [...p.slice(-8), { id, x:10+Math.random()*50, y:Math.random()*60, c:colors[Math.floor(Math.random()*3)] }])
      setTimeout(() => setParticles(p => p.filter(x=>x.id!==id)), 1200)
    }, 180)
    return () => clearInterval(t)
  }, [hovered])

  const send = async () => {
    const msg = input.trim()
    if (!msg || loading) return
    setInput('')
    const newMsgs: Msg[] = [...msgs, { role:'user', content:msg }]
    setMsgs(newMsgs)
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          message: msg,
          history: newMsgs.slice(-6).map(m => ({ role:m.role, content:m.content }))
        })
      })
      const data = await res.json()
      setMsgs(m => [...m, { role:'assistant', content:data.reply }])
    } catch {
      setMsgs(m => [...m, { role:'assistant', content:'Omlouvám se, zkuste to znovu 💕' }])
    } finally { setLoading(false) }
  }

  return (
    <div style={{ position:'fixed', bottom:20, right:20, zIndex:9999, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10, pointerEvents:'none' }}>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:20, scale:0.92 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:12, scale:0.95 }}
            transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
            style={{
              pointerEvents:'auto',
              background:'rgba(8,6,8,0.97)',
              border:'1px solid rgba(255,107,168,0.45)',
              borderRadius:20,
              width:300,
              maxHeight:420,
              display:'flex',
              flexDirection:'column',
              backdropFilter:'blur(20px)',
              boxShadow:'0 0 40px rgba(255,107,168,0.2), 0 12px 40px rgba(0,0,0,0.8)',
              overflow:'hidden',
            }}
          >
            {/* Header */}
            <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,107,168,0.2)', display:'flex', alignItems:'center', gap:10, background:'rgba(255,107,168,0.05)' }}>
              {/* Mini SVG avatar */}
              <svg width="36" height="36" viewBox="0 0 36 36" style={{ flexShrink:0 }}>
                <circle cx="18" cy="18" r="17" fill="#0d0508" stroke="#FF6BA8" strokeWidth="1"/>
                <ellipse cx="18" cy="14" rx="8" ry="9" fill="#C8906A"/>
                <ellipse cx="18" cy="10" rx="9" ry="6" fill="#0a0305"/>
                <ellipse cx="14" cy="14" rx="2.5" ry="2" fill="#0a0303"/>
                <ellipse cx="22" cy="14" rx="2.5" ry="2" fill="#0a0303"/>
                <circle cx="13.5" cy="13.5" r="0.8" fill="white" opacity=".8"/>
                <circle cx="21.5" cy="13.5" r="0.8" fill="white" opacity=".8"/>
                <path d="M 15 19 Q 18 21 21 19" stroke="#A85840" strokeWidth="1" fill="none" strokeLinecap="round"/>
                {/* mini lashes */}
                <line x1="11" y1="11" x2="10" y2="8" stroke="#050203" strokeWidth=".8" strokeLinecap="round"/>
                <line x1="13" y1="10" x2="12.5" y2="7" stroke="#050203" strokeWidth=".8" strokeLinecap="round"/>
                <line x1="15" y1="10" x2="15" y2="7" stroke="#050203" strokeWidth=".8" strokeLinecap="round"/>
                <line x1="21" y1="10" x2="21" y2="7" stroke="#050203" strokeWidth=".8" strokeLinecap="round"/>
                <line x1="23" y1="10" x2="23.5" y2="7" stroke="#050203" strokeWidth=".8" strokeLinecap="round"/>
                <line x1="25" y1="11" x2="26" y2="8" stroke="#050203" strokeWidth=".8" strokeLinecap="round"/>
                <path d="M 14 24 Q 18 27 22 24 Q 20 28 18 28 Q 16 28 14 24Z" fill="#FF6BA8" opacity=".7"/>
              </svg>
              <div>
                <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.95)', fontWeight:300 }}>Viktória</div>
                <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'#FF6BA8', textTransform:'uppercase' }}>✦ Online</div>
              </div>
              <button onClick={()=>setOpen(false)}
                style={{ marginLeft:'auto', background:'none', border:'none', color:'rgba(245,238,242,0.3)', cursor:'pointer', fontSize:16, lineHeight:1 }}>
                ×
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:'auto', padding:'12px 14px', display:'flex', flexDirection:'column', gap:8, scrollbarWidth:'thin', scrollbarColor:'rgba(255,107,168,0.2) transparent' }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display:'flex', justifyContent: m.role==='user'?'flex-end':'flex-start' }}>
                  <div style={{
                    maxWidth:'80%', padding:'8px 12px',
                    borderRadius: m.role==='user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: m.role==='user' ? 'linear-gradient(135deg,#C4698A,#FF6BA8)' : 'rgba(255,255,255,0.06)',
                    border: m.role==='assistant' ? '1px solid rgba(255,107,168,0.2)' : 'none',
                    fontFamily:'Georgia,serif', fontSize:12.5,
                    color: m.role==='user' ? 'white' : 'rgba(245,238,242,0.88)',
                    lineHeight:1.6,
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display:'flex', gap:4, padding:'8px 12px', background:'rgba(255,255,255,0.06)', borderRadius:'14px 14px 14px 4px', width:'fit-content', border:'1px solid rgba(255,107,168,0.2)' }}>
                  {[0,1,2].map(i=>(
                    <motion.div key={i} animate={{y:[0,-4,0]}} transition={{duration:0.5,delay:i*0.15,repeat:Infinity}}
                      style={{width:5,height:5,borderRadius:'50%',background:'rgba(255,107,168,0.7)'}}/>
                  ))}
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            {/* Input */}
            <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,107,168,0.15)', display:'flex', gap:8, background:'rgba(255,107,168,0.03)' }}>
              <input
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&send()}
                placeholder="Napište dotaz..."
                style={{
                  flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,107,168,0.25)',
                  borderRadius:20, padding:'7px 12px', color:'rgba(245,238,242,0.9)',
                  fontFamily:'Georgia,serif', fontSize:12, outline:'none',
                }}
              />
              <button onClick={send} disabled={loading||!input.trim()}
                style={{
                  background:'linear-gradient(135deg,#C4698A,#FF6BA8)', border:'none',
                  borderRadius:'50%', width:32, height:32, cursor:'pointer',
                  color:'white', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center',
                  opacity: loading||!input.trim() ? 0.5 : 1,
                  flexShrink:0,
                }}>
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar button */}
      <div style={{ position:'relative', pointerEvents:'auto' }}
        onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>

        {particles.map(p=>(
          <motion.div key={p.id}
            initial={{opacity:0.9,y:0,scale:1}} animate={{opacity:0,y:-45,scale:0}}
            transition={{duration:1.2,ease:'easeOut'}}
            style={{position:'absolute',bottom:4,left:p.x,width:3,height:3,borderRadius:'50%',background:p.c,boxShadow:`0 0 6px ${p.c}`,pointerEvents:'none'}}
          />
        ))}

        {/* Spinning ring */}
        <motion.div animate={{rotate:360}} transition={{duration:10,repeat:Infinity,ease:'linear'}}
          style={{position:'absolute',inset:-7,borderRadius:'50%',border:'1px dashed rgba(255,107,168,0.4)',pointerEvents:'none'}}>
          {['✦','◈','✸'].map((s,i)=>(
            <span key={i} style={{position:'absolute',fontSize:7,color:'#FF6BA8',textShadow:'0 0 5px #FF6BA8',
              top:i===0?'-5px':i===1?'42%':'90%',left:i===0?'40%':i===1?'-5px':'86%'}}>
              {s}
            </span>
          ))}
        </motion.div>

        {/* Main button */}
        <motion.div
          animate={{ boxShadow: hovered
            ? '0 0 0 2px #FF6BA8,0 0 30px rgba(255,107,168,0.6)'
            : open ? '0 0 0 2px rgba(255,107,168,0.6),0 0 20px rgba(255,107,168,0.4)'
            : '0 0 0 1.5px rgba(255,107,168,0.35),0 0 15px rgba(255,107,168,0.2)' }}
          style={{borderRadius:'50%',cursor:'none'}}
          onClick={()=>setOpen(o=>!o)}
        >
          <motion.div animate={{y:[0,-5,0]}} transition={{duration:3.5,repeat:Infinity,ease:'easeInOut'}}
            style={{width:72,height:72,borderRadius:'50%',overflow:'hidden',border:'none',background:'#0d0508',display:'flex',alignItems:'center',justifyContent:'center'}}>
            {/* SVG silueta */}
            <svg width="72" height="72" viewBox="0 0 72 72">
              <defs>
                <radialGradient id="face-g" cx="40%" cy="35%" r="55%">
                  <stop offset="0%" stopColor="#C8906A"/>
                  <stop offset="100%" stopColor="#8A6040"/>
                </radialGradient>
                <radialGradient id="dress-g" cx="50%" cy="20%" r="60%">
                  <stop offset="0%" stopColor="#FF6BA8"/>
                  <stop offset="100%" stopColor="#8B2252"/>
                </radialGradient>
                <clipPath id="cc"><circle cx="36" cy="36" r="34"/></clipPath>
              </defs>
              <circle cx="36" cy="36" r="36" fill="#0d0508"/>
              <g clipPath="url(#cc)">
                {/* dress */}
                <path d="M 18 50 Q 15 60 14 72 L 58 72 Q 57 60 54 50 Q 46 42 36 42 Q 26 42 18 50Z" fill="url(#dress-g)"/>
                {/* neck */}
                <rect x="32" y="38" width="8" height="8" rx="3" fill="#B89070"/>
                {/* face */}
                <ellipse cx="36" cy="28" rx="13" ry="15" fill="url(#face-g)"/>
                {/* hair */}
                <ellipse cx="36" cy="16" rx="14" ry="9" fill="#0a0305"/>
                <path d="M 23 24 Q 19 35 20 50" fill="#0a0305"/>
                <path d="M 49 24 Q 53 35 52 50" fill="#0a0305"/>
                {/* eyes */}
                <ellipse cx="30" cy="28" rx="4" ry="3" fill="white"/>
                <circle cx="30" cy="28" r="2.2" fill="#0a0303"/>
                <circle cx="29.2" cy="27.2" r="0.8" fill="white" opacity=".85"/>
                <ellipse cx="42" cy="28" rx="4" ry="3" fill="white"/>
                <circle cx="42" cy="28" r="2.2" fill="#0a0303"/>
                <circle cx="41.2" cy="27.2" r="0.8" fill="white" opacity=".85"/>
                {/* lashes */}
                <line x1="26" y1="25" x2="24" y2="21" stroke="#050203" strokeWidth="1" strokeLinecap="round"/>
                <line x1="28" y1="24" x2="27" y2="20" stroke="#050203" strokeWidth="1.1" strokeLinecap="round"/>
                <line x1="30" y1="24" x2="30" y2="20" stroke="#050203" strokeWidth="1.1" strokeLinecap="round"/>
                <line x1="32" y1="24" x2="33" y2="20" stroke="#050203" strokeWidth="1" strokeLinecap="round"/>
                <line x1="38" y1="24" x2="39" y2="20" stroke="#050203" strokeWidth="1" strokeLinecap="round"/>
                <line x1="40" y1="24" x2="42" y2="20" stroke="#050203" strokeWidth="1.1" strokeLinecap="round"/>
                <line x1="42" y1="24" x2="44" y2="20" stroke="#050203" strokeWidth="1.1" strokeLinecap="round"/>
                <line x1="44" y1="25" x2="47" y2="21" stroke="#050203" strokeWidth="1" strokeLinecap="round"/>
                {/* lips */}
                <path d="M 30 35 Q 36 38 42 35 Q 39 40 36 40 Q 33 40 30 35Z" fill="#C07858"/>
                {/* necklace */}
                <path d="M 28 41 Q 33 45 36 46 Q 39 45 44 41" fill="none" stroke="#D4AA70" strokeWidth="1" opacity=".9"/>
                {/* VL on dress */}
                <text x="36" y="62" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="rgba(255,255,255,.6)" letterSpacing="1">VL</text>
              </g>
              <circle cx="36" cy="36" r="34" fill="none" stroke="#FF6BA8" strokeWidth="1" strokeOpacity=".5"/>
            </svg>
          </motion.div>
        </motion.div>

        {/* Name tag */}
        <AnimatePresence>
          {hovered && !open && (
            <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              style={{position:'absolute',bottom:-18,left:'50%',transform:'translateX(-50%)',
                fontFamily:'Georgia,serif',fontSize:8,letterSpacing:2,color:'#FF6BA8',
                textTransform:'uppercase',whiteSpace:'nowrap',textShadow:'0 0 8px rgba(255,107,168,0.6)'}}>
              Viktória ✦
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
