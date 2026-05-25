'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/ui/CustomCursor'

const SERVICES = ['Klasické řasy', 'Objemové řasy', 'Mega Volume', 'Wet Look', 'Doplnění řas', 'Odstranění řas']

export default function NapsatRecenziPage() {
  const [form, setForm] = useState({ authorName:'', authorEmail:'', location:'', text:'', rating:5, service:'' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const inp: React.CSSProperties = { width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,107,168,0.2)', borderRadius:12, padding:'12px 14px', color:'rgba(245,238,242,0.85)', fontFamily:'Georgia,serif', fontSize:14, outline:'none', boxSizing:'border-box' }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/reviews', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
      const data = await res.json()
      if (res.ok) setSuccess(true)
      else setError(data.error || 'Chyba při odesílání.')
    } finally { setLoading(false) }
  }

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main style={{ minHeight:'100vh', background:'#080608', paddingTop:100, paddingBottom:80 }}>
        <div style={{ maxWidth:580, margin:'0 auto', padding:'0 20px' }}>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="success" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
                style={{ textAlign:'center', paddingTop:60 }}>
                <div style={{ fontSize:56, marginBottom:16 }}>💕</div>
                <h2 style={{ fontFamily:'Georgia,serif', fontSize:28, fontWeight:300, marginBottom:12 }}>Díky za recenzi!</h2>
                <p style={{ fontFamily:'Georgia,serif', fontSize:15, color:'rgba(245,238,242,0.5)', lineHeight:1.8, marginBottom:28 }}>
                  Vaše recenze byla odeslána ke schválení.<br/>Viktória ji brzy zkontroluje a zveřejní.
                </p>
                <Link href="/" style={{ display:'inline-block', padding:'14px 36px', borderRadius:50, background:'linear-gradient(135deg,#C4698A,#FF6BA8)', color:'white', textDecoration:'none', fontFamily:'Georgia,serif', fontSize:14 }}>
                  Zpět na hlavní stránku →
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}>
                <div style={{ textAlign:'center', marginBottom:36 }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:12 }}>✦ Sdílejte zkušenost</div>
                  <h1 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(26px,5vw,42px)', fontWeight:300, marginBottom:12 }}>Napište nám recenzi</h1>
                  <p style={{ fontFamily:'Georgia,serif', fontSize:14, color:'rgba(245,238,242,0.45)', lineHeight:1.8 }}>
                    Vaše zpětná vazba pomáhá ostatním klientkám a Viktórii se zlepšovat.
                  </p>
                </div>

                <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,107,168,0.15)', borderRadius:24, padding:28, position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#FF6BA8,#D4AA70,transparent)' }}/>

                  {error && (
                    <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
                      style={{ marginBottom:16, padding:'12px 16px', borderRadius:12, background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', fontFamily:'Georgia,serif', fontSize:13 }}>
                      {error}
                    </motion.div>
                  )}

                  <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                    {/* Rating stars */}
                    <div>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:8 }}>Hodnocení *</div>
                      <div style={{ display:'flex', gap:8 }}>
                        {[1,2,3,4,5].map(s => (
                          <button key={s} type="button" onClick={() => setForm(f => ({...f, rating:s}))}
                            style={{ fontSize:28, background:'none', border:'none', cursor:'pointer', opacity: s <= form.rating ? 1 : 0.25, transition:'all 0.15s', filter: s <= form.rating ? 'drop-shadow(0 0 4px #D4AA70)' : 'none' }}>
                            ★
                          </button>
                        ))}
                        <span style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.4)', alignSelf:'center', marginLeft:4 }}>
                          {['','Špatné','Průměrné','Dobré','Velmi dobré','Výborné'][form.rating]}
                        </span>
                      </div>
                    </div>

                    {/* Name + location */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                      <div>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:6 }}>Jméno *</div>
                        <input style={inp} placeholder="Jana Nováková" value={form.authorName} onChange={e => setForm(f => ({...f, authorName:e.target.value}))} required/>
                      </div>
                      <div>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:6 }}>Město</div>
                        <input style={inp} placeholder="Mladá Boleslav" value={form.location} onChange={e => setForm(f => ({...f, location:e.target.value}))}/>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:6 }}>E-mail (neveřejný)</div>
                      <input type="email" style={inp} placeholder="jana@email.cz" value={form.authorEmail} onChange={e => setForm(f => ({...f, authorEmail:e.target.value}))}/>
                    </div>

                    {/* Service */}
                    <div>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:6 }}>Jaká služba?</div>
                      <select style={{...inp, background:'#0d0508'}} value={form.service} onChange={e => setForm(f => ({...f, service:e.target.value}))}>
                        <option value="">Vyberte službu...</option>
                        {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    {/* Text */}
                    <div>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:6 }}>Vaše recenze *</div>
                      <textarea style={{...inp, resize:'none'}} rows={5} placeholder="Jak proběhla návštěva? Co se vám líbilo? Doporučíte Viktórii?" value={form.text} onChange={e => setForm(f => ({...f, text:e.target.value}))} required/>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:10, color:'rgba(245,238,242,0.2)', marginTop:4 }}>{form.text.length}/500 znaků</div>
                    </div>

                    <button type="submit" disabled={loading || !form.authorName || !form.text}
                      style={{ padding:'15px', borderRadius:14, background: loading||!form.authorName ? 'rgba(255,107,168,0.3)' : 'linear-gradient(135deg,#C4698A,#FF6BA8)', border:'none', color:'white', fontFamily:'Georgia,serif', fontSize:15, cursor:'pointer', boxShadow: form.authorName && form.text ? '0 0 30px rgba(255,107,168,0.35)' : 'none' }}>
                      {loading ? 'Odesílám...' : 'Odeslat recenzi 💕'}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  )
}
