'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export function AppSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [prompt, setPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const [installing, setInstalling] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIOS(ios)
    const handler = (e: any) => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (prompt) {
      setInstalling(true)
      prompt.prompt()
      const result = await prompt.userChoice
      if (result.outcome === 'accepted') setInstalled(true)
      setInstalling(false)
    } else if (isIOS) {
      setShowIOSGuide(true)
    }
  }

  const FEATURES = [
    { icon:'📅', title:'Rychlá rezervace', desc:'Rezervujte termín jedním klepnutím' },
    { icon:'🔔', title:'Připomínky', desc:'Upozornění na váš termín včas' },
    { icon:'💕', title:'Lash Body body', desc:'Sledujte věrnostní body a odměny' },
    { icon:'⚡', title:'Funguje offline', desc:'Přístup bez připojení k internetu' },
  ]

  return (
    <section ref={ref} style={{ background:'linear-gradient(180deg,#080608 0%,#0d0508 50%,#080608 100%)', padding:'80px 20px', overflow:'hidden', position:'relative' }}>
      {/* Background glow */}
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:400, background:'radial-gradient(ellipse,rgba(255,107,168,0.08) 0%,transparent 70%)', pointerEvents:'none' }}/>

      <div style={{ maxWidth:900, margin:'0 auto' }}>
        <motion.div initial={{ opacity:0, y:30 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.8 }}
          style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:12 }}>✦ Mobilní aplikace</div>
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(28px,5vw,48px)', fontWeight:300, marginBottom:16, lineHeight:1.2 }}>
            Přidejte si nás<br/><em style={{ color:'#FF6BA8' }}>na plochu telefonu</em>
          </h2>
          <p style={{ fontFamily:'Georgia,serif', fontSize:'clamp(14px,2vw,17px)', color:'rgba(245,238,242,0.5)', lineHeight:1.8, maxWidth:480, margin:'0 auto' }}>
            Bez App Store, zdarma. Funguje jako appka přímo z vašeho telefonu nebo počítače.
          </p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, alignItems:'start' }}>

          {/* Left — features */}
          <motion.div initial={{ opacity:0, x:-30 }} animate={inView?{opacity:1,x:0}:{}} transition={{ duration:0.7, delay:0.2 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
              {FEATURES.map((f,i) => (
                <motion.div key={f.title} initial={{ opacity:0, y:20 }} animate={inView?{opacity:1,y:0}:{}} transition={{ delay:0.3+i*0.1 }}
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,107,168,0.12)', borderRadius:16, padding:'18px 16px', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.3),transparent)' }}/>
                  <div style={{ fontSize:24, marginBottom:8 }}>{f.icon}</div>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.85)', marginBottom:4 }}>{f.title}</div>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.4)', lineHeight:1.5 }}>{f.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — install card */}
          <motion.div initial={{ opacity:0, x:30 }} animate={inView?{opacity:1,x:0}:{}} transition={{ duration:0.7, delay:0.3 }}>
            <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,107,168,0.25)', borderRadius:24, padding:28, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#FF6BA8,#D4AA70,transparent)' }}/>

              {/* App preview */}
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24, padding:'14px 16px', background:'rgba(255,107,168,0.05)', borderRadius:14, border:'1px solid rgba(255,107,168,0.15)' }}>
                <img src="/apple-touch-icon.png" alt="VL" style={{ width:52, height:52, borderRadius:12, flexShrink:0, boxShadow:'0 4px 16px rgba(255,107,168,0.3)' }}/>
                <div>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:16, color:'rgba(245,238,242,0.95)', marginBottom:3 }}>Viktória Lashes</div>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.4)', marginBottom:6 }}>viktoria-lashes.cz</div>
                  <div style={{ display:'flex', gap:4 }}>
                    {['Zdarma','Bez reklam','Offline'].map(t => (
                      <span key={t} style={{ fontFamily:'Georgia,serif', fontSize:8, padding:'2px 8px', borderRadius:20, background:'rgba(255,107,168,0.1)', color:'rgba(255,107,168,0.7)', border:'1px solid rgba(255,107,168,0.2)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {installed ? (
                <div style={{ textAlign:'center', padding:'20px 0' }}>
                  <div style={{ fontSize:40, marginBottom:8 }}>✅</div>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:16, color:'#4ade80', marginBottom:4 }}>Appka je nainstalována!</div>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.4)' }}>Najdete ji na ploše vašeho zařízení</div>
                </div>
              ) : showIOSGuide ? (
                <div>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.7)', marginBottom:16, lineHeight:1.7 }}>
                    Jak přidat na iPhone:
                  </div>
                  {[
                    { icon:'1️⃣', text:'Klepněte na ikonu Sdílet dole v Safari (čtverec se šipkou nahoru)' },
                    { icon:'2️⃣', text:'Srolujte dolů a klepněte na "Přidat na plochu"' },
                    { icon:'3️⃣', text:'Klepněte na "Přidat" vpravo nahoře' },
                  ].map(s => (
                    <div key={s.icon} style={{ display:'flex', gap:10, marginBottom:12, alignItems:'flex-start' }}>
                      <span style={{ fontSize:18, flexShrink:0 }}>{s.icon}</span>
                      <span style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.65)', lineHeight:1.6 }}>{s.text}</span>
                    </div>
                  ))}
                  <button onClick={() => setShowIOSGuide(false)}
                    style={{ width:'100%', marginTop:8, padding:'12px', borderRadius:12, background:'rgba(255,107,168,0.1)', border:'1px solid rgba(255,107,168,0.3)', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:13, cursor:'pointer' }}>
                    Zavřít návod
                  </button>
                </div>
              ) : (
                <div>
                  <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                    onClick={install}
                    style={{ width:'100%', padding:'16px', borderRadius:14, background:'linear-gradient(135deg,#C4698A,#FF6BA8)', border:'none', color:'white', fontFamily:'Georgia,serif', fontSize:15, cursor:'pointer', boxShadow:'0 0 30px rgba(255,107,168,0.4)', marginBottom:12, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    {installing ? '⏳ Instaluji...' : isIOS ? '📱 Přidat na iPhone' : '💻 Nainstalovat appku'}
                  </motion.button>

                  {/* Platform instructions */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                    <div style={{ padding:'12px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', textAlign:'center' }}>
                      <div style={{ fontSize:20, marginBottom:4 }}>🍎</div>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:10, color:'rgba(245,238,242,0.5)', lineHeight:1.5 }}>iPhone / iPad<br/>Safari → Sdílet → Přidat na plochu</div>
                    </div>
                    <div style={{ padding:'12px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', textAlign:'center' }}>
                      <div style={{ fontSize:20, marginBottom:4 }}>🤖</div>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:10, color:'rgba(245,238,242,0.5)', lineHeight:1.5 }}>Android / PC<br/>Klikněte tlačítko výše</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
