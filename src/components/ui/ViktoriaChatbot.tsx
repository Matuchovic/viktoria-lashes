'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Msg {
  role: 'user' | 'assistant'
  content: string
  image?: string // base64 thumbnail for display
}

type Mode = 'chat' | 'diagnosis' | 'refill' | 'photo'

const QUICK_ACTIONS = [
  {
    id: 'diagnosis',
    icon: '👁️',
    label: 'Diagnostika řas',
    desc: 'Popište tvar obličeje a očí — doporučím přesný typ, styl, délku a curl řas přímo pro Vás',
    badge: 'AI analýza',
    badgeCol: '#C4698A',
    mode: 'diagnosis' as Mode,
  },
  {
    id: 'refill',
    icon: '📅',
    label: 'Kdy na doplnění?',
    desc: 'Řekněte mi kdy jste naposledy byly u nás — spočítám optimální termín a připomenu Vám péči',
    badge: 'Chytrý výpočet',
    badgeCol: '#D4AA70',
    mode: 'refill' as Mode,
  },
  {
    id: 'photo',
    icon: '📸',
    label: 'Foto analýza obličeje',
    desc: 'Nahrajte svou fotku — AI analyzuje tvar Vašich očí a obličeje a navrhne ideální řasy',
    badge: 'Vision AI',
    badgeCol: '#FF6BA8',
    mode: 'photo' as Mode,
  },
]

const DIAGNOSIS_INTRO = `Skvěle! Provedu pro Vás profesionální diagnostiku řas 👁️✨

Povězte mi:
1. Jaký máte tvar obličeje? (kulatý / oválný / srdcovitý / hranatý)
2. Jaký máte tvar očí? (mandlové / kulaté / malé / monolíčka / přivřené)
3. Chcete výsledek přirozený, dramatický nebo někde uprostřed?`

const REFILL_INTRO = `Pomůžu Vám zjistit ideální termín na doplnění! 📅💕

Řekněte mi:
- Kdy jste naposledy měla řasy aplikované nebo doplněné?
- Jak rychle Vám rostou vlastní řasy?

(Např. "před 2 týdny" nebo "18. dubna")`

const PHOTO_INTRO = `Skvělé! Foto analýza je moje specialita 📸✨

Nahrajte prosím svoji fotku (nejlépe celého obličeje, přirozené osvětlení) a já navrhnu ideální typ, styl, délku a curl řas přímo pro Vás.`

function AvatarSVG({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72">
      <defs>
        <radialGradient id="fg" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#C8906A"/><stop offset="100%" stopColor="#8A6040"/>
        </radialGradient>
        <radialGradient id="dg" cx="50%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#FF6BA8"/><stop offset="100%" stopColor="#8B2252"/>
        </radialGradient>
        <clipPath id="cc2"><circle cx="36" cy="36" r="34"/></clipPath>
      </defs>
      <circle cx="36" cy="36" r="36" fill="#0d0508"/>
      <g clipPath="url(#cc2)">
        <path d="M 18 50 Q 15 60 14 72 L 58 72 Q 57 60 54 50 Q 46 42 36 42 Q 26 42 18 50Z" fill="url(#dg)"/>
        <rect x="32" y="38" width="8" height="8" rx="3" fill="#B89070"/>
        <ellipse cx="36" cy="28" rx="13" ry="15" fill="url(#fg)"/>
        <ellipse cx="36" cy="16" rx="14" ry="9" fill="#0a0305"/>
        <path d="M 23 24 Q 19 35 20 50" fill="#0a0305"/>
        <path d="M 49 24 Q 53 35 52 50" fill="#0a0305"/>
        <ellipse cx="30" cy="28" rx="4" ry="3" fill="white"/>
        <circle cx="30" cy="28" r="2.2" fill="#0a0303"/>
        <circle cx="29.2" cy="27.2" r="0.8" fill="white" opacity=".85"/>
        <ellipse cx="42" cy="28" rx="4" ry="3" fill="white"/>
        <circle cx="42" cy="28" r="2.2" fill="#0a0303"/>
        <circle cx="41.2" cy="27.2" r="0.8" fill="white" opacity=".85"/>
        <line x1="26" y1="25" x2="24" y2="21" stroke="#050203" strokeWidth="1" strokeLinecap="round"/>
        <line x1="28" y1="24" x2="27" y2="20" stroke="#050203" strokeWidth="1.1" strokeLinecap="round"/>
        <line x1="30" y1="24" x2="30" y2="20" stroke="#050203" strokeWidth="1.1" strokeLinecap="round"/>
        <line x1="32" y1="24" x2="33" y2="20" stroke="#050203" strokeWidth="1" strokeLinecap="round"/>
        <line x1="38" y1="24" x2="39" y2="20" stroke="#050203" strokeWidth="1" strokeLinecap="round"/>
        <line x1="40" y1="24" x2="42" y2="20" stroke="#050203" strokeWidth="1.1" strokeLinecap="round"/>
        <line x1="42" y1="24" x2="44" y2="20" stroke="#050203" strokeWidth="1.1" strokeLinecap="round"/>
        <line x1="44" y1="25" x2="47" y2="21" stroke="#050203" strokeWidth="1" strokeLinecap="round"/>
        <path d="M 30 35 Q 36 38 42 35 Q 39 40 36 40 Q 33 40 30 35Z" fill="#C07858"/>
        <path d="M 28 41 Q 33 45 36 46 Q 39 45 44 41" fill="none" stroke="#D4AA70" strokeWidth="1" opacity=".9"/>
        <text x="36" y="62" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="rgba(255,255,255,.6)" letterSpacing="1">VL</text>
      </g>
      <circle cx="36" cy="36" r="34" fill="none" stroke="#FF6BA8" strokeWidth="1" strokeOpacity=".5"/>
    </svg>
  )
}

export function ViktoriaChatbot() {
  const [open, setOpen]       = useState(false)
  const [mode, setMode]       = useState<Mode>('chat')
  const [msgs, setMsgs]       = useState<Msg[]>([
    { role: 'assistant', content: 'Ahoj! Jsem Viktória ✨ Přijedu přímo k Vám domů! Čím Vám mohu pomoci?' }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [showActions, setShowActions] = useState(true)
  const [pendingImage, setPendingImage] = useState<string | null>(null)
  const [particles, setParticles] = useState<{id:number;x:number;y:number;c:string}[]>([])
  const pid        = useRef(0)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const fileRef    = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, loading])

  useEffect(() => {
    if (!hovered) return
    const t = setInterval(() => {
      const id = pid.current++
      const colors = ['#FF6BA8','#E8A4BE','#D4AA70']
      setParticles(p => [...p.slice(-8), { id, x: 10 + Math.random() * 50, y: Math.random() * 60, c: colors[Math.floor(Math.random() * 3)] }])
      setTimeout(() => setParticles(p => p.filter(x => x.id !== id)), 1200)
    }, 180)
    return () => clearInterval(t)
  }, [hovered])

  const selectMode = useCallback((m: Mode) => {
    setMode(m)
    setShowActions(false)
    const intro = m === 'diagnosis' ? DIAGNOSIS_INTRO : m === 'refill' ? REFILL_INTRO : PHOTO_INTRO
    setMsgs(prev => [...prev, { role: 'assistant', content: intro }])
    if (m === 'photo') setTimeout(() => fileRef.current?.click(), 300)
  }, [])

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = (ev.target?.result as string).split(',')[1]
      setPendingImage(base64)
      setMsgs(prev => [...prev, {
        role: 'user',
        content: '📸 Nahrála jsem fotku pro analýzu',
        image: ev.target?.result as string,
      }])
      // Auto-send
      sendWithImage(base64)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [])

  const sendWithImage = async (base64: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Analyzuj prosím mou fotku a doporuč typ řas.',
          history: [],
          image: base64,
          mode: 'photo',
        })
      })
      const data = await res.json()
      setMsgs(m => [...m, { role: 'assistant', content: data.reply }])
    } catch {
      setMsgs(m => [...m, { role: 'assistant', content: 'Omlouvám se, foto se nepodařilo zpracovat. 💕' }])
    } finally {
      setLoading(false)
      setPendingImage(null)
    }
  }

  const send = async () => {
    const msg = input.trim()
    if (!msg || loading) return
    setInput('')
    setShowActions(false)
    const newMsgs: Msg[] = [...msgs, { role: 'user', content: msg }]
    setMsgs(newMsgs)
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          history: newMsgs.slice(-10).map(m => ({ role: m.role, content: m.content })),
          mode: mode !== 'photo' ? mode : 'chat',
        })
      })
      const data = await res.json()
      setMsgs(m => [...m, { role: 'assistant', content: data.reply }])
    } catch {
      setMsgs(m => [...m, { role: 'assistant', content: 'Omlouvám se, zkuste to znovu 💕' }])
    } finally { setLoading(false) }
  }

  const resetChat = () => {
    setMode('chat')
    setShowActions(true)
    setMsgs([{ role: 'assistant', content: 'Ahoj! Jsem Viktória ✨ Přijedu přímo k Vám domů! Čím Vám mohu pomoci?' }])
    setInput('')
    setPendingImage(null)
  }

  const S = {
    bubble: (role: 'user'|'assistant'): React.CSSProperties => ({
      maxWidth: '85%',
      padding: '9px 13px',
      borderRadius: role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
      background: role === 'user'
        ? 'linear-gradient(135deg,#C4698A,#FF6BA8)'
        : 'rgba(255,255,255,0.06)',
      border: role === 'assistant' ? '1px solid rgba(255,107,168,0.2)' : 'none',
      fontFamily: 'Georgia,serif',
      fontSize: 12.5,
      color: role === 'user' ? 'white' : 'rgba(245,238,242,0.88)',
      lineHeight: 1.65,
      whiteSpace: 'pre-wrap' as const,
    }),
  }

  return (
    <div style={{ position:'fixed', bottom:20, right:20, zIndex:99999, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10, pointerEvents:'none' }}>

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleFile}/>

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
              border:'1px solid rgba(255,107,168,0.4)',
              borderRadius:22,
              width:310,
              maxHeight:500,
              display:'flex',
              flexDirection:'column',
              backdropFilter:'blur(20px)',
              boxShadow:'0 0 50px rgba(255,107,168,0.18), 0 16px 50px rgba(0,0,0,0.9)',
              overflow:'hidden',
            }}
          >
            {/* Header */}
            <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,107,168,0.18)', display:'flex', alignItems:'center', gap:10, background:'rgba(255,107,168,0.04)' }}>
              <AvatarSVG size={36}/>
              <div>
                <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.95)', fontWeight:300 }}>Viktória</div>
                <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'#FF6BA8', textTransform:'uppercase' }}>✦ AI Lash Specialistka</div>
              </div>
              <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
                {msgs.length > 1 && (
                  <button onClick={resetChat} title="Nový chat"
                    style={{ background:'none', border:'none', color:'rgba(245,238,242,0.3)', cursor:'pointer', fontSize:13, lineHeight:1, padding:2 }}>↺</button>
                )}
                <button onClick={() => setOpen(false)}
                  style={{ background:'none', border:'none', color:'rgba(245,238,242,0.3)', cursor:'pointer', fontSize:18, lineHeight:1 }}>×</button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:'auto', padding:'12px 14px', display:'flex', flexDirection:'column', gap:10, scrollbarWidth:'thin', scrollbarColor:'rgba(255,107,168,0.2) transparent' }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display:'flex', justifyContent: m.role==='user'?'flex-end':'flex-start', gap:6, alignItems:'flex-end' }}>
                  {m.role === 'assistant' && <AvatarSVG size={22}/>}
                  <div style={{ display:'flex', flexDirection:'column', alignItems: m.role==='user'?'flex-end':'flex-start', gap:4 }}>
                    {m.image && (
                      <img src={m.image} alt="upload" style={{ maxWidth:120, borderRadius:10, border:'1px solid rgba(255,107,168,0.3)' }}/>
                    )}
                    <div style={S.bubble(m.role)}>{m.content}</div>
                  </div>
                </div>
              ))}

              {/* Quick action buttons */}
              {showActions && !loading && (
                <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
                  style={{ display:'flex', flexDirection:'column', gap:6, marginTop:4 }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, textTransform:'uppercase' as const, color:'rgba(245,238,242,0.25)', marginBottom:4 }}>
                    ✦ AI funkce — vyberte si
                  </div>
                  {QUICK_ACTIONS.map((a, ai) => (
                    <motion.button key={a.id}
                      initial={{ opacity:0, y:8 }}
                      animate={{ opacity:1, y:0 }}
                      transition={{ delay: ai * 0.1 + 0.1 }}
                      whileHover={{ scale:1.02, y:-1 }}
                      whileTap={{ scale:0.97 }}
                      onClick={() => selectMode(a.mode)}
                      style={{
                        display:'flex', alignItems:'flex-start', gap:12,
                        background:'rgba(255,255,255,0.03)',
                        border:`1px solid rgba(255,107,168,0.15)`,
                        borderRadius:14, padding:'12px 13px', cursor:'pointer',
                        textAlign:'left' as const,
                        position:'relative', overflow:'hidden',
                        boxShadow:'none',
                        transition:'all 0.25s',
                        width:'100%',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = `${a.badgeCol}60`
                        e.currentTarget.style.background = `${a.badgeCol}0a`
                        e.currentTarget.style.boxShadow = `0 4px 20px ${a.badgeCol}18`
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,107,168,0.15)'
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      {/* Top glow line on hover */}
                      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${a.badgeCol}60,transparent)`, opacity:0.6 }}/>
                      
                      {/* Icon */}
                      <div style={{
                        width:38, height:38, borderRadius:10, flexShrink:0,
                        background:`${a.badgeCol}15`,
                        border:`1px solid ${a.badgeCol}35`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:18,
                      }}>{a.icon}</div>

                      {/* Text */}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4, flexWrap:'wrap' as const }}>
                          <span style={{ fontFamily:'Georgia,serif', fontSize:12.5, color:'rgba(245,238,242,0.9)', fontWeight:400 }}>{a.label}</span>
                          <span style={{
                            fontFamily:'Georgia,serif', fontSize:8, letterSpacing:1.5,
                            textTransform:'uppercase' as const, padding:'2px 7px', borderRadius:20,
                            background:`${a.badgeCol}20`, color:a.badgeCol,
                            border:`1px solid ${a.badgeCol}40`, whiteSpace:'nowrap' as const,
                          }}>{a.badge}</span>
                        </div>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:10.5, color:'rgba(245,238,242,0.38)', lineHeight:1.55 }}>{a.desc}</div>
                      </div>

                      {/* Arrow */}
                      <span style={{ color:`${a.badgeCol}70`, fontSize:13, flexShrink:0, marginTop:10 }}>→</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Loading dots */}
              {loading && (
                <div style={{ display:'flex', alignItems:'flex-end', gap:6 }}>
                  <AvatarSVG size={22}/>
                  <div style={{ display:'flex', gap:4, padding:'10px 14px', background:'rgba(255,255,255,0.06)', borderRadius:'16px 16px 16px 4px', border:'1px solid rgba(255,107,168,0.2)' }}>
                    {[0,1,2].map(i => (
                      <motion.div key={i} animate={{y:[0,-5,0]}} transition={{duration:0.5,delay:i*0.15,repeat:Infinity}}
                        style={{width:5,height:5,borderRadius:'50%',background:'rgba(255,107,168,0.7)'}}/>
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            {/* Input bar */}
            <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,107,168,0.12)', background:'rgba(255,107,168,0.03)' }}>
              {/* Mode indicator */}
              {mode !== 'chat' && (
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:7 }}>
                  <span style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'rgba(255,107,168,0.6)' }}>
                    {mode === 'diagnosis' ? '👁️ Diagnostika' : mode === 'refill' ? '📅 Doplnění' : '📸 Foto analýza'}
                  </span>
                  <button onClick={resetChat} style={{ background:'none', border:'none', color:'rgba(245,238,242,0.25)', cursor:'pointer', fontFamily:'Georgia,serif', fontSize:10 }}>
                    (zpět)
                  </button>
                </div>
              )}
              <div style={{ display:'flex', gap:8 }}>
                {/* Photo button — visible in photo mode */}
                {mode === 'photo' && (
                  <button onClick={() => fileRef.current?.click()}
                    style={{ background:'rgba(255,107,168,0.1)', border:'1px solid rgba(255,107,168,0.3)', borderRadius:20, padding:'0 12px', color:'#FF6BA8', cursor:'pointer', fontSize:14, flexShrink:0 }}>
                    📸
                  </button>
                )}
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder={mode === 'diagnosis' ? 'Popis tvar obličeje...' : mode === 'refill' ? 'Kdy naposledy?...' : 'Napište dotaz...'}
                  style={{
                    flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,107,168,0.22)',
                    borderRadius:20, padding:'7px 13px', color:'rgba(245,238,242,0.9)',
                    fontFamily:'Georgia,serif', fontSize:12, outline:'none',
                  }}
                />
                <button onClick={send} disabled={loading || !input.trim()}
                  style={{
                    background: 'linear-gradient(135deg,#C4698A,#FF6BA8)', border:'none',
                    borderRadius:'50%', width:34, height:34, cursor:'pointer',
                    color:'white', fontSize:15, display:'flex', alignItems:'center', justifyContent:'center',
                    opacity: loading || !input.trim() ? 0.45 : 1, flexShrink:0,
                    boxShadow: !input.trim() ? 'none' : '0 0 12px rgba(255,107,168,0.4)',
                  }}>→</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar trigger */}
      <div style={{ position:'relative', pointerEvents:'auto' }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>

        {particles.map(p => (
          <motion.div key={p.id}
            initial={{opacity:0.9,y:0,scale:1}} animate={{opacity:0,y:-45,scale:0}}
            transition={{duration:1.2,ease:'easeOut'}}
            style={{position:'absolute',bottom:4,left:p.x,width:3,height:3,borderRadius:'50%',background:p.c,boxShadow:`0 0 6px ${p.c}`,pointerEvents:'none'}}
          />
        ))}

        <motion.div animate={{rotate:360}} transition={{duration:10,repeat:Infinity,ease:'linear'}}
          style={{position:'absolute',inset:-7,borderRadius:'50%',border:'1px dashed rgba(255,107,168,0.4)',pointerEvents:'none'}}>
          {['✦','◈','✸'].map((s,i)=>(
            <span key={i} style={{position:'absolute',fontSize:7,color:'#FF6BA8',textShadow:'0 0 5px #FF6BA8',
              top:i===0?'-5px':i===1?'42%':'90%',left:i===0?'40%':i===1?'-5px':'86%'}}>{s}</span>
          ))}
        </motion.div>

        <motion.div
          animate={{ boxShadow: hovered
            ? '0 0 0 2px #FF6BA8,0 0 30px rgba(255,107,168,0.6)'
            : open ? '0 0 0 2px rgba(255,107,168,0.6),0 0 20px rgba(255,107,168,0.4)'
            : '0 0 0 1.5px rgba(255,107,168,0.35),0 0 15px rgba(255,107,168,0.2)' }}
          style={{ borderRadius:'50%', cursor:'none' }}
          onClick={() => setOpen(o => !o)}
        >
          <motion.div animate={{y:[0,-5,0]}} transition={{duration:3.5,repeat:Infinity,ease:'easeInOut'}}
            style={{width:72,height:72,borderRadius:'50%',overflow:'hidden',background:'#0d0508',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <AvatarSVG size={72}/>
          </motion.div>
        </motion.div>

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
