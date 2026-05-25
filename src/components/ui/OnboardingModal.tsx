'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const STEPS = [
  { icon:'👋', title:'Vítejte u Viktórie!', desc:'Přijede za vámi přímo domů. Žádné dojíždění, žádný stres.' },
  { icon:'📅', title:'Rezervace je snadná', desc:'Klikněte na růžové tlačítko "Rezervovat termín" a vyberte datum.' },
  { icon:'📍', title:'Zadejte svoji adresu', desc:'Napište adresu a Viktória za vámi přijede. Jednoduché!' },
  { icon:'✅', title:'Hotovo!', desc:'Dostanete potvrzení a Viktória se ozve den předem.' },
]

export function OnboardingModal() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    // Show only on first visit
    const seen = localStorage.getItem('vl_onboarding_seen')
    if (!seen) {
      setTimeout(() => setShow(true), 2000)
    }
  }, [])

  const close = () => {
    localStorage.setItem('vl_onboarding_seen', '1')
    setShow(false)
  }

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s+1)
    else close()
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:99998, display:'flex', alignItems:'center', justifyContent:'center', padding:20, backdropFilter:'blur(8px)' }}>
          <motion.div initial={{ opacity:0, scale:0.92, y:30 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
            transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
            style={{ background:'#0d0508', border:'1px solid rgba(255,107,168,0.35)', borderRadius:28, width:'100%', maxWidth:420, overflow:'hidden', boxShadow:'0 0 80px rgba(255,107,168,0.2)', position:'relative' }}>

            {/* Top gradient line */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,transparent,#FF6BA8,#D4AA70,transparent)' }}/>

            {/* Close */}
            <button onClick={close} style={{ position:'absolute', top:16, right:16, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, width:32, height:32, color:'rgba(245,238,242,0.35)', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1 }}>×</button>

            {/* Header */}
            <div style={{ padding:'28px 28px 0', textAlign:'center' }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:5, color:'rgba(255,107,168,0.6)', textTransform:'uppercase', marginBottom:6 }}>✦ Vítejte</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:13, letterSpacing:4, textTransform:'uppercase', fontWeight:300, marginBottom:4 }}>
                Viktória <span style={{ color:'#FF6BA8' }}>Lashes</span>
              </div>
            </div>

            {/* Step content */}
            <div style={{ padding:'24px 28px' }}>
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}
                  transition={{ duration:0.3 }} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:56, marginBottom:16, lineHeight:1 }}>{STEPS[step].icon}</div>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:'clamp(20px,5vw,26px)', fontWeight:300, color:'rgba(245,238,242,0.95)', marginBottom:12 }}>{STEPS[step].title}</div>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:'clamp(14px,3vw,16px)', color:'rgba(245,238,242,0.55)', lineHeight:1.8 }}>{STEPS[step].desc}</div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div style={{ display:'flex', justifyContent:'center', gap:8, paddingBottom:8 }}>
              {STEPS.map((_,i) => (
                <div key={i} style={{ width: step===i ? 20 : 7, height:7, borderRadius:20, background: step===i ? '#FF6BA8' : 'rgba(255,107,168,0.2)', transition:'all 0.3s' }}/>
              ))}
            </div>

            {/* Buttons */}
            <div style={{ padding:'12px 28px 28px', display:'flex', flexDirection:'column', gap:10 }}>
              <motion.button whileTap={{ scale:0.97 }} onClick={next}
                style={{ padding:'16px', borderRadius:50, background:'linear-gradient(135deg,#C4698A,#FF6BA8)', border:'none', color:'white', fontFamily:'Georgia,serif', fontSize:16, cursor:'pointer', boxShadow:'0 0 30px rgba(255,107,168,0.35)' }}>
                {step < STEPS.length-1 ? 'Další →' : 'Rozumím, jdeme na to! 💕'}
              </motion.button>

              {step === STEPS.length-1 && (
                <Link href="/jak-rezervovat" onClick={close}
                  style={{ display:'block', padding:'13px', borderRadius:50, background:'rgba(255,107,168,0.08)', border:'1px solid rgba(255,107,168,0.25)', color:'#FF6BA8', textDecoration:'none', fontFamily:'Georgia,serif', fontSize:14, textAlign:'center' }}>
                  📖 Zobrazit podrobný návod
                </Link>
              )}

              <button onClick={close} style={{ background:'none', border:'none', color:'rgba(245,238,242,0.25)', fontFamily:'Georgia,serif', fontSize:12, cursor:'pointer', padding:8 }}>
                Přeskočit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
