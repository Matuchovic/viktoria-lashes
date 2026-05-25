'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function PWAInstaller() {
  const [prompt, setPrompt] = useState<any>(null)
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error)
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    // iOS detection
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIOS(ios)

    // Android/Chrome install prompt
    const handler = (e: any) => {
      e.preventDefault()
      setPrompt(e)
      setTimeout(() => setShow(true), 3000)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // Show iOS instructions after 5s if on iOS Safari
    if (ios && !window.matchMedia('(display-mode: standalone)').matches) {
      const seen = localStorage.getItem('vl_pwa_ios_seen')
      if (!seen) setTimeout(() => setShow(true), 5000)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (prompt) {
      prompt.prompt()
      const result = await prompt.userChoice
      if (result.outcome === 'accepted') {
        setInstalled(true)
        setShow(false)
      }
    }
  }

  const dismiss = () => {
    setShow(false)
    localStorage.setItem('vl_pwa_ios_seen', '1')
  }

  if (installed) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity:0, y:100 }}
          animate={{ opacity:1, y:0 }}
          exit={{ opacity:0, y:100 }}
          transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
          style={{
            position:'fixed', bottom:20, left:16, right:16, zIndex:99990,
            background:'rgba(8,6,8,0.97)', border:'1px solid rgba(255,107,168,0.35)',
            borderRadius:20, padding:'16px 18px', backdropFilter:'blur(20px)',
            boxShadow:'0 -4px 40px rgba(255,107,168,0.15), 0 20px 60px rgba(0,0,0,0.8)',
            maxWidth:420, margin:'0 auto',
          }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, borderRadius:'20px 20px 0 0', background:'linear-gradient(90deg,transparent,#FF6BA8,#D4AA70,transparent)' }}/>

          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
            <img src="/apple-touch-icon.png" alt="VL" style={{ width:44, height:44, borderRadius:10, flexShrink:0 }}/>
            <div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:14, color:'rgba(245,238,242,0.95)', marginBottom:2 }}>Přidat na plochu</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.4)' }}>Viktória Lashes · viktoria-lashes.cz</div>
            </div>
            <button onClick={dismiss} style={{ marginLeft:'auto', background:'none', border:'none', color:'rgba(245,238,242,0.3)', fontSize:20, cursor:'pointer', flexShrink:0, padding:4 }}>×</button>
          </div>

          {isIOS ? (
            <div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.55)', lineHeight:1.7, marginBottom:12 }}>
                Přidejte web na plochu iPhone — bude fungovat jako appka:
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:12 }}>
                {[
                  { icon:'1️⃣', text:'Klikněte na ikonu Sdílet (čtverec se šipkou) dole v Safari' },
                  { icon:'2️⃣', text:'Vyberte "Přidat na plochu"' },
                  { icon:'3️⃣', text:'Klikněte "Přidat" vpravo nahoře' },
                ].map(s => (
                  <div key={s.icon} style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                    <span style={{ fontSize:14, flexShrink:0 }}>{s.icon}</span>
                    <span style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.65)', lineHeight:1.5 }}>{s.text}</span>
                  </div>
                ))}
              </div>
              <button onClick={dismiss}
                style={{ width:'100%', padding:'11px', borderRadius:12, background:'rgba(255,107,168,0.1)', border:'1px solid rgba(255,107,168,0.3)', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:13, cursor:'pointer' }}>
                Rozumím ✓
              </button>
            </div>
          ) : (
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={install}
                style={{ flex:1, padding:'12px', borderRadius:12, background:'linear-gradient(135deg,#C4698A,#FF6BA8)', border:'none', color:'white', fontFamily:'Georgia,serif', fontSize:13, cursor:'pointer', boxShadow:'0 0 20px rgba(255,107,168,0.3)' }}>
                📲 Nainstalovat appku
              </button>
              <button onClick={dismiss}
                style={{ padding:'12px 16px', borderRadius:12, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(245,238,242,0.4)', fontFamily:'Georgia,serif', fontSize:13, cursor:'pointer' }}>
                Později
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
