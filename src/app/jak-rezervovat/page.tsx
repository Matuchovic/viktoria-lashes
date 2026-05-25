'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/ui/CustomCursor'

const STEPS = [
  {
    num: 1,
    icon: '📱',
    title: 'Otevřete web',
    desc: 'Jste tady správně! Jste na stránce www.viktoria-lashes.cz',
    detail: 'Stránku si můžete uložit do telefonu — klikněte na tlačítko "Sdílet" a pak "Přidat na plochu". Příště ji najdete jedním klepnutím.',
    color: '#FF6BA8',
    tip: '💡 Tip: Uložte si stránku do oblíbených!',
  },
  {
    num: 2,
    icon: '👆',
    title: 'Klikněte na "Rezervovat termín"',
    desc: 'Velké růžové tlačítko je úplně nahoře na stránce.',
    detail: 'Pokud jedete na počítači, najdete tlačítko vpravo nahoře. Na telefonu je hned pod názvem Viktória Lashes.',
    color: '#FF6BA8',
    tip: '💡 Nehledejte dlouho — tlačítko je vždy růžové!',
  },
  {
    num: 3,
    icon: '💅',
    title: 'Vyberte si službu',
    desc: 'Klikněte na to, co byste chtěly. Nevíte co vybrat? Vyberte "Klasické řasy" — to je nejoblíbenější.',
    detail: 'Každá služba má napsanou cenu a jak dlouho trvá. Klikněte na tu která se vám líbí a pak klikněte na růžové tlačítko "Pokračovat".',
    color: '#E8A4BE',
    tip: '💡 Nevadí když si nejste jistá — Viktória poradí!',
  },
  {
    num: 4,
    icon: '📅',
    title: 'Vyberte datum a čas',
    desc: 'Klikněte na den v kalendáři a pak na čas který vám vyhovuje.',
    detail: 'Šedá políčka jsou obsazená, růžová nebo bílá jsou volná. Vyberte si co vám sedí a klikněte "Pokračovat".',
    color: '#D4AA70',
    tip: '💡 Termín si můžete kdykoliv zrušit — bez poplatku 48 hodin předem.',
  },
  {
    num: 5,
    icon: '📝',
    title: 'Vyplňte své jméno a telefon',
    desc: 'Napište své jméno, telefon a adresu. Viktória za vámi přijede domů!',
    detail: 'Vyplňte: Celé jméno, váš telefon (např. 602 123 456) a adresu kde máte být. Email není povinný. Pak klikněte "Pokračovat".',
    color: '#FF6BA8',
    tip: '💡 Viktória vás den před návštěvou zavolá pro potvrzení.',
  },
  {
    num: 6,
    icon: '✅',
    title: 'Potvrďte rezervaci',
    desc: 'Zkontrolujte si shrnutí a klikněte na velké tlačítko "Potvrdit rezervaci".',
    detail: 'Na obrazovce uvidíte přehled — datum, čas, službu a cenu. Pokud je vše správně, klikněte na tlačítko. Pak dostanete potvrzení.',
    color: '#4ade80',
    tip: '🎉 Hotovo! Viktória se vám ozve s potvrzením.',
  },
]

function VideoModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.92)', zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale:0.9, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.9 }}
        style={{ background:'#0d0508', border:'1px solid rgba(255,107,168,0.3)', borderRadius:24, padding:32, maxWidth:500, width:'100%', textAlign:'center' }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:4, color:'#FF6BA8', textTransform:'uppercase', marginBottom:16 }}>📹 Video návod</div>
        <div style={{ fontFamily:'Georgia,serif', fontSize:22, fontWeight:300, marginBottom:12 }}>Jak udělat rezervaci</div>
        <video
          src="/viktoria_lashes_2.mov"
          controls
          playsInline
          style={{ width:'100%', borderRadius:16, marginBottom:20, border:'1px solid rgba(255,107,168,0.25)', background:'#000', maxHeight:400 }}
        />
        <a href="tel:+420720307007"
          style={{ display:'block', padding:'16px', borderRadius:14, background:'linear-gradient(135deg,#C4698A,#FF6BA8)', color:'white', textDecoration:'none', fontFamily:'Georgia,serif', fontSize:16, marginBottom:10, boxShadow:'0 0 30px rgba(255,107,168,0.4)' }}>
          📞 Zavolat Viktorii: +420 720 307 007
        </a>
        <a href="https://wa.me/420720307007?text=Dobrý den, potřebuji pomoci s rezervací."
          target="_blank"
          style={{ display:'block', padding:'14px', borderRadius:14, background:'rgba(37,211,102,0.1)', border:'1px solid rgba(37,211,102,0.3)', color:'#25d166', textDecoration:'none', fontFamily:'Georgia,serif', fontSize:14, marginBottom:16 }}>
          💬 Napsat na WhatsApp
        </a>
        <button onClick={onClose}
          style={{ background:'none', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 24px', color:'rgba(245,238,242,0.4)', fontFamily:'Georgia,serif', fontSize:12, cursor:'pointer' }}>
          Zavřít
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function JakRezerovatPage() {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [showVideo, setShowVideo] = useState(false)

  return (
    <>
      <CustomCursor />
      <Navbar />
      <AnimatePresence>
        {showVideo && <VideoModal onClose={() => setShowVideo(false)}/>}
      </AnimatePresence>

      <main style={{ minHeight:'100vh', background:'#080608', paddingTop:100, paddingBottom:80 }}>
        <div style={{ maxWidth:680, margin:'0 auto', padding:'0 20px' }}>

          {/* Header */}
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }}
            style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:12 }}>✦ Průvodce rezervací</div>
            <h1 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(28px,6vw,52px)', fontWeight:300, lineHeight:1.2, marginBottom:16 }}>
              Jak si zarezervovat<br/><em style={{ color:'#FF6BA8' }}>Viktórii k sobě domů</em>
            </h1>
            <p style={{ fontFamily:'Georgia,serif', fontSize:'clamp(15px,2.5vw,18px)', color:'rgba(245,238,242,0.55)', lineHeight:1.8, maxWidth:480, margin:'0 auto 28px' }}>
              Je to jednoduché! Celá rezervace trvá asi <strong style={{ color:'rgba(245,238,242,0.8)' }}>2 minuty</strong>. Postupujte podle kroků níže.
            </p>

            {/* Video button */}
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              onClick={() => setShowVideo(true)}
              style={{ display:'inline-flex', alignItems:'center', gap:12, padding:'14px 28px', borderRadius:50, background:'linear-gradient(135deg,rgba(255,107,168,0.15),rgba(196,105,138,0.1))', border:'1.5px solid rgba(255,107,168,0.4)', cursor:'pointer', marginBottom:8 }}>
              <span style={{ width:36, height:36, borderRadius:'50%', background:'#FF6BA8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0, boxShadow:'0 0 16px rgba(255,107,168,0.5)' }}>▶</span>
              <div style={{ textAlign:'left' }}>
                <div style={{ fontFamily:'Georgia,serif', fontSize:15, color:'rgba(245,238,242,0.9)' }}>Podívat se na video návod</div>
                <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)' }}>Ukážeme vám to krok za krokem</div>
              </div>
            </motion.button>
          </motion.div>

          {/* Steps */}
          <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:48 }}>
            {STEPS.map((step, i) => (
              <motion.div key={step.num}
                initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.1, duration:0.5 }}>
                <motion.div
                  onClick={() => setActiveStep(activeStep===step.num ? null : step.num)}
                  whileTap={{ scale:0.99 }}
                  style={{ borderRadius:20, border:`1px solid ${activeStep===step.num ? step.color+'50' : 'rgba(255,255,255,0.07)'}`, background: activeStep===step.num ? `${step.color}08` : 'rgba(255,255,255,0.03)', cursor:'pointer', overflow:'hidden', transition:'all 0.3s' }}>

                  {/* Step header */}
                  <div style={{ display:'flex', alignItems:'center', gap:16, padding:'20px 20px' }}>
                    {/* Number circle */}
                    <div style={{ width:52, height:52, borderRadius:'50%', background: activeStep===step.num ? `linear-gradient(135deg,${step.color}80,${step.color})` : 'rgba(255,255,255,0.06)', border:`2px solid ${activeStep===step.num ? step.color : 'rgba(255,255,255,0.1)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.3s', boxShadow: activeStep===step.num ? `0 0 20px ${step.color}40` : 'none' }}>
                      <span style={{ fontFamily:'Georgia,serif', fontSize:22, color: activeStep===step.num ? 'white' : 'rgba(245,238,242,0.4)' }}>{step.num}</span>
                    </div>

                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:22 }}>{step.icon}</span>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:'clamp(16px,3vw,20px)', fontWeight:300, color:'rgba(245,238,242,0.92)' }}>{step.title}</div>
                      </div>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:'clamp(13px,2vw,15px)', color:'rgba(245,238,242,0.5)', lineHeight:1.5 }}>{step.desc}</div>
                    </div>

                    <div style={{ fontFamily:'Georgia,serif', fontSize:20, color:'rgba(245,238,242,0.25)', flexShrink:0, transition:'transform 0.3s', transform: activeStep===step.num ? 'rotate(180deg)' : 'none' }}>
                      ↓
                    </div>
                  </div>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {activeStep===step.num && (
                      <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.3 }}>
                        <div style={{ padding:'0 20px 20px 88px' }}>
                          <div style={{ padding:'16px 20px', borderRadius:14, background:`${step.color}10`, border:`1px solid ${step.color}25`, marginBottom:12 }}>
                            <p style={{ fontFamily:'Georgia,serif', fontSize:'clamp(14px,2.5vw,16px)', color:'rgba(245,238,242,0.75)', lineHeight:1.8, margin:0 }}>{step.detail}</p>
                          </div>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:step.color, padding:'8px 12px', background:`${step.color}10`, borderRadius:10, display:'inline-block' }}>
                            {step.tip}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.8 }}
            style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'Georgia,serif', fontSize:18, fontWeight:300, color:'rgba(245,238,242,0.7)', marginBottom:24 }}>
              Zvládli jste kroky? Jdeme na to! 💕
            </div>
            <Link href="/rezervace"
              style={{ display:'inline-block', padding:'18px 48px', borderRadius:50, background:'linear-gradient(135deg,#C4698A,#FF6BA8)', color:'white', textDecoration:'none', fontFamily:'Georgia,serif', fontSize:'clamp(15px,3vw,18px)', letterSpacing:2, boxShadow:'0 0 40px rgba(255,107,168,0.4)', marginBottom:16 }}>
              Rezervovat termín →
            </Link>
            <div style={{ marginTop:20 }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:14, color:'rgba(245,238,242,0.35)', marginBottom:12 }}>Nebo nám zavolejte a pomůžeme vám:</div>
              <a href="tel:+420720307007"
                style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'14px 28px', borderRadius:50, background:'rgba(255,107,168,0.08)', border:'1px solid rgba(255,107,168,0.3)', color:'#FF6BA8', textDecoration:'none', fontFamily:'Georgia,serif', fontSize:16 }}>
                📞 +420 720 307 007
              </a>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
