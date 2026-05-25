'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

export async function subscribeToPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false
  try {
    const reg = await navigator.serviceWorker.ready
    const existing = await reg.pushManager.getSubscription()
    if (existing) {
      await fetch('/api/push/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(existing) })
      return true
    }
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
    })
    await fetch('/api/push/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sub) })
    return true
  } catch (e) {
    console.error('Push subscribe error:', e)
    return false
  }
}

export function PWAInstaller() {
  const [prompt, setPrompt] = useState<any>(null)
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(async reg => {
        // Request push permission after SW registered
        if ('PushManager' in window && Notification.permission === 'default') {
          setTimeout(async () => {
            const perm = await Notification.requestPermission()
            if (perm === 'granted') await subscribeToPush()
          }, 8000)
        } else if (Notification.permission === 'granted') {
          await subscribeToPush()
        }
      }).catch(console.error)
    }

    if (window.matchMedia('(display-mode: standalone)').matches) { setInstalled(true); return }
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIOS(ios)
    const handler = (e: any) => { e.preventDefault(); setPrompt(e); setTimeout(() => setShow(true), 3000) }
    window.addEventListener('beforeinstallprompt', handler)
    if (ios && !localStorage.getItem('vl_pwa_ios_seen')) setTimeout(() => setShow(true), 5000)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (prompt) {
      prompt.prompt()
      const result = await prompt.userChoice
      if (result.outcome === 'accepted') { setInstalled(true); setShow(false) }
    }
  }

  const dismiss = () => { setShow(false); localStorage.setItem('vl_pwa_ios_seen', '1') }

  if (installed) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity:0, y:100 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:100 }}
          transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
          style={{ position:'fixed', bottom:20, left:16, right:16, zIndex:99990, background:'rgba(8,6,8,0.97)', border:'1px solid rgba(255,107,168,0.35)', borderRadius:20, padding:'16px 18px', backdropFilter:'blur(20px)', boxShadow:'0 -4px 40px rgba(255,107,168,0.15)', maxWidth:420, margin:'0 auto' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, borderRadius:'20px 20px 0 0', background:'linear-gradient(90deg,transparent,#FF6BA8,#D4AA70,transparent)' }}/>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
            <img src="/apple-touch-icon.png" alt="VL" style={{ width:44, height:44, borderRadius:10, flexShrink:0 }}/>
            <div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:14, color:'rgba(245,238,242,0.95)', marginBottom:2 }}>Přidat na plochu</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.4)' }}>Viktória Lashes · viktoria-lashes.cz</div>
            </div>
            <button onClick={dismiss} style={{ marginLeft:'auto', background:'none', border:'none', color:'rgba(245,238,242,0.3)', fontSize:20, cursor:'pointer', flexShrink:0 }}>×</button>
          </div>
          {isIOS ? (
            <div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.55)', lineHeight:1.7, marginBottom:10 }}>Přidejte na plochu iPhone:</div>
              {[
                '1️⃣ Klikněte na ikonu Sdílet dole v Safari',
                '2️⃣ Vyberte "Přidat na plochu"',
                '3️⃣ Klikněte "Přidat" vpravo nahoře',
              ].map(s => <div key={s} style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.6)', marginBottom:6 }}>{s}</div>)}
              <button onClick={dismiss} style={{ width:'100%', marginTop:8, padding:'11px', borderRadius:12, background:'rgba(255,107,168,0.1)', border:'1px solid rgba(255,107,168,0.3)', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:13, cursor:'pointer' }}>Rozumím ✓</button>
            </div>
          ) : (
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={install} style={{ flex:1, padding:'12px', borderRadius:12, background:'linear-gradient(135deg,#C4698A,#FF6BA8)', border:'none', color:'white', fontFamily:'Georgia,serif', fontSize:13, cursor:'pointer', boxShadow:'0 0 20px rgba(255,107,168,0.3)' }}>
                📲 Nainstalovat appku
              </button>
              <button onClick={dismiss} style={{ padding:'12px 16px', borderRadius:12, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(245,238,242,0.4)', fontFamily:'Georgia,serif', fontSize:13, cursor:'pointer' }}>Později</button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
