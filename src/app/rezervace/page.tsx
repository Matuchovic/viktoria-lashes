'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { useToast } from '@/components/ui/Toaster'
import { formatPrice, generateTimeSlots } from '@/lib/utils'

const SERVICES = [
  { id:'s1', nameCs:'Klasické řasy (50D–60D)', priceKc:499, durationMin:45 },
  { id:'s2', nameCs:'Objemové řasy (80D)',      priceKc:599, durationMin:60 },
  { id:'s3', nameCs:'Mega Volume (100D)',       priceKc:799, durationMin:60 },
  { id:'s4', nameCs:'Wet Look (60D)',           priceKc:999, durationMin:60 },
  { id:'s5', nameCs:'Doplnění řas',            priceKc:199, durationMin:20 },
  { id:'s6', nameCs:'Odstranění řas',          priceKc:99,  durationMin:25 },
]
const ARTISTS = [{ id:'a1', name:'Viktória Ladiková', titleCs:'Zakladatelka · Mladá Boleslav & okolí', initial:'V' }]
const STEPS = ['Služba','Stylistka','Termín','Kontakt','Shrnutí']

function BookingContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    serviceId: searchParams.get('service') ?? '',
    artistId:'', date:'', time:'',
    name: session?.user?.name ?? '',
    email: session?.user?.email ?? '',
    phone:'', notes:'',
  })

  const service = SERVICES.find(s=>s.id===form.serviceId)
  const artist  = ARTISTS.find(a=>a.id===form.artistId)
  const minDate = new Date(); minDate.setDate(minDate.getDate()+1)
  const minDateStr = minDate.toISOString().split('T')[0]
  const allSlots = generateTimeSlots('08:00','20:00',30)
  const takenSlots = ['10:00','14:00','16:00']
  const getSlotStatus = (t:string) => takenSlots.includes(t)?'taken':form.time===t?'selected':'available'

  const canGoNext = () => {
    if (step===0) return !!form.serviceId
    if (step===1) return !!form.artistId
    if (step===2) return !!form.date && !!form.time
    if (step===3) return !!form.name && !!form.email && !!form.phone
    return true
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/bookings',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({serviceId:form.serviceId,artistId:form.artistId,date:form.date,time:form.time,
          customerName:form.name,customerEmail:form.email,customerPhone:form.phone,notes:form.notes})})
      const data = await res.json()
      if (res.ok) { setBookingRef(data.bookingRef); setSubmitted(true) }
      else toast(data.error??'Chyba při vytváření rezervace.','error')
    } finally { setLoading(false) }
  }

  if (submitted) return (
    <div className="min-h-screen bg-black flex items-center justify-center px-5 py-16">
      <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} className="text-center max-w-sm">
        <div className="text-5xl mb-5">✨</div>
        <h2 className="font-serif text-2xl md:text-3xl font-light mb-3">Rezervace přijata!</h2>
        <p className="text-text-muted font-light text-sm mb-2">Číslo rezervace: <span style={{color:'#D4AA70'}}>#{bookingRef?.slice(-8).toUpperCase()}</span></p>
        <p className="text-text-muted font-light text-sm mb-8">Viktória se vám ozve s potvrzením.</p>
        <div className="flex flex-col gap-3">
          {!session && <Link href="/register" className="btn-primary border-none text-center">Zaregistrovat se a sledovat rezervaci →</Link>}
          <Link href="/" className="btn-ghost text-center text-sm">Zpět na hlavní stránku</Link>
        </div>
      </motion.div>
    </div>
  )

  // Input style
  const inp: React.CSSProperties = {background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,107,168,0.15)',borderRadius:10,padding:'12px 14px',color:'rgba(245,238,242,0.85)',fontFamily:'Georgia,serif',fontSize:14,width:'100%',outline:'none'}

  return (
    <div className="min-h-screen bg-black px-5 md:px-8 pt-24 pb-20">
      <div className="max-w-xl mx-auto">

        {/* Steps — horizontal scroll on mobile */}
        <div className="flex items-center gap-1 mb-8 md:mb-12 overflow-x-auto pb-1 no-scrollbar">
          {STEPS.map((s,i)=>(
            <div key={s} className="flex items-center gap-1 flex-shrink-0">
              <div className="flex flex-col items-center gap-1">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-serif transition-all duration-300"
                  style={{background:i<step?'linear-gradient(135deg,#C4698A,#FF6BA8)':i===step?'rgba(255,107,168,0.15)':'rgba(255,255,255,0.05)',
                    border:i===step?'1px solid rgba(255,107,168,0.5)':i<step?'none':'1px solid rgba(255,255,255,0.08)',
                    color:i<step?'white':i===step?'#FF6BA8':'rgba(245,238,242,0.3)'}}>
                  {i<step?'✓':(i+1)}
                </div>
                <div className="text-[8px] md:text-[9px] font-light tracking-wider whitespace-nowrap"
                  style={{color:i===step?'#FF6BA8':i<step?'rgba(245,238,242,0.5)':'rgba(245,238,242,0.2)'}}>{s}</div>
              </div>
              {i<STEPS.length-1 && <div className="w-6 md:w-10 h-px mb-4 flex-shrink-0 transition-all duration-300"
                style={{background:i<step?'rgba(255,107,168,0.5)':'rgba(255,255,255,0.08)'}}/>}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* STEP 0 — Service */}
          {step===0 && (
            <motion.div key="s0" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
              <h2 className="font-serif text-2xl md:text-3xl font-light mb-6">Vyberte službu</h2>
              <div className="grid gap-3">
                {SERVICES.map(s=>(
                  <motion.button key={s.id} whileTap={{scale:0.98}} onClick={()=>setForm(f=>({...f,serviceId:s.id}))}
                    className="w-full text-left p-4 rounded-2xl transition-all duration-200"
                    style={{background:form.serviceId===s.id?'rgba(255,107,168,0.1)':'rgba(255,255,255,0.03)',
                      border:`1px solid ${form.serviceId===s.id?'rgba(255,107,168,0.4)':'rgba(255,255,255,0.07)'}`,
                      boxShadow:form.serviceId===s.id?'0 0 20px rgba(255,107,168,0.1)':'none'}}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-serif font-light text-sm md:text-base" style={{color:'rgba(245,238,242,0.9)'}}>{s.nameCs}</div>
                        <div className="font-light text-xs mt-0.5" style={{color:'rgba(245,238,242,0.35)',letterSpacing:1}}>{s.durationMin} min</div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="font-serif text-lg md:text-xl" style={{color:'#FF6BA8'}}>{formatPrice(s.priceKc)}</div>
                        {form.serviceId===s.id && <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{background:'#FF6BA8',color:'white'}}>✓</div>}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 1 — Artist */}
          {step===1 && (
            <motion.div key="s1" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
              <h2 className="font-serif text-2xl md:text-3xl font-light mb-6">Stylistka</h2>
              {ARTISTS.map(a=>(
                <motion.button key={a.id} whileTap={{scale:0.98}} onClick={()=>setForm(f=>({...f,artistId:a.id}))}
                  className="w-full text-left p-5 rounded-2xl transition-all duration-200"
                  style={{background:form.artistId===a.id?'rgba(255,107,168,0.1)':'rgba(255,255,255,0.03)',
                    border:`1px solid ${form.artistId===a.id?'rgba(255,107,168,0.4)':'rgba(255,255,255,0.07)'}`}}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center font-serif text-xl flex-shrink-0"
                      style={{background:'linear-gradient(135deg,#C4698A,#FF6BA8)',color:'white',boxShadow:'0 0 20px rgba(255,107,168,0.3)'}}>
                      {a.initial}
                    </div>
                    <div>
                      <div className="font-serif text-lg font-light" style={{color:'rgba(245,238,242,0.9)'}}>{a.name}</div>
                      <div className="font-light text-xs mt-1" style={{color:'rgba(245,238,242,0.35)',letterSpacing:1}}>{a.titleCs}</div>
                    </div>
                    {form.artistId===a.id && <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{background:'#FF6BA8',color:'white'}}>✓</div>}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* STEP 2 — Date & Time */}
          {step===2 && (
            <motion.div key="s2" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
              <h2 className="font-serif text-2xl md:text-3xl font-light mb-6">Vyberte termín</h2>
              <div className="mb-5">
                <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{fontSize:10}}>Datum</label>
                <input type="date" style={inp} min={minDateStr} value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value,time:''}))}/>
              </div>
              {form.date && (
                <div>
                  <label className="block font-light tracking-[3px] uppercase text-text-muted mb-3" style={{fontSize:10}}>Čas</label>
                  <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                    {allSlots.map(t=>{
                      const st=getSlotStatus(t)
                      return (
                        <button key={t} disabled={st==='taken'} onClick={()=>setForm(f=>({...f,time:t}))}
                          className="py-2.5 rounded-xl text-xs font-serif font-light transition-all duration-200"
                          style={{background:st==='selected'?'rgba(255,107,168,0.2)':st==='taken'?'rgba(255,255,255,0.02)':'rgba(255,255,255,0.04)',
                            border:`1px solid ${st==='selected'?'rgba(255,107,168,0.5)':st==='taken'?'rgba(255,255,255,0.04)':'rgba(255,255,255,0.08)'}`,
                            color:st==='taken'?'rgba(245,238,242,0.2)':st==='selected'?'#FF6BA8':'rgba(245,238,242,0.6)',
                            cursor:st==='taken'?'not-allowed':'pointer'}}>
                          {t}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 3 — Contact */}
          {step===3 && (
            <motion.div key="s3" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
              <h2 className="font-serif text-2xl md:text-3xl font-light mb-6">Vaše kontaktní údaje</h2>
              <div className="space-y-4">
                {[
                  {k:'name', l:'Jméno a příjmení', t:'text', p:'Jana Nováková', req:true},
                  {k:'email',l:'E-mail',            t:'email',p:'jana@email.cz', req:true},
                  {k:'phone',l:'Telefon',           t:'tel',  p:'+420 123 456 789',req:true},
                  {k:'notes',l:'Poznámka (nepovinné)',t:'text',p:'Alergie, přání...', req:false},
                ].map(f=>(
                  <div key={f.k}>
                    <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{fontSize:10}}>{f.l}</label>
                    {f.k==='notes'
                      ? <textarea style={{...inp,resize:'none'}} rows={3} placeholder={f.p} value={(form as any)[f.k]} onChange={e=>setForm(prev=>({...prev,[f.k]:e.target.value}))}/>
                      : <input type={f.t} style={inp} placeholder={f.p} value={(form as any)[f.k]} onChange={e=>setForm(prev=>({...prev,[f.k]:e.target.value}))} required={f.req}/>
                    }
                  </div>
                ))}
              </div>
              {!session && (
                <div className="mt-5 p-4 rounded-xl" style={{background:'rgba(212,170,112,0.06)',border:'1px solid rgba(212,170,112,0.2)'}}>
                  <div className="font-serif text-sm mb-1" style={{color:'#D4AA70'}}>💡 Zaregistrujte se a získejte +250 bodů</div>
                  <Link href="/register" className="font-light text-xs hover:text-pink-soft transition-colors" style={{color:'rgba(245,238,242,0.4)'}}>Zaregistrovat se →</Link>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 4 — Summary */}
          {step===4 && (
            <motion.div key="s4" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
              <h2 className="font-serif text-2xl md:text-3xl font-light mb-6">Shrnutí rezervace</h2>
              <div className="rounded-2xl overflow-hidden mb-6" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,107,168,0.12)'}}>
                <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.4),transparent)'}}/>
                {[
                  ['Služba',service?.nameCs??'-'],
                  ['Stylistka',artist?.name??'-'],
                  ['Datum',form.date?new Date(form.date).toLocaleDateString('cs-CZ',{weekday:'long',day:'numeric',month:'long'}):'-'],
                  ['Čas',form.time||'-'],
                  ['Jméno',form.name],
                  ['E-mail',form.email],
                  ['Telefon',form.phone],
                ].map(([l,v])=>(
                  <div key={l} className="flex justify-between gap-4 px-5 py-3.5" style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    <span className="font-light text-xs tracking-wider uppercase" style={{color:'rgba(245,238,242,0.3)',minWidth:70}}>{l}</span>
                    <span className="font-serif font-light text-sm text-right" style={{color:'rgba(245,238,242,0.8)'}}>{v}</span>
                  </div>
                ))}
                <div className="flex justify-between gap-4 px-5 py-4">
                  <span className="font-light text-xs tracking-wider uppercase" style={{color:'rgba(245,238,242,0.3)'}}>Celkem</span>
                  <span className="font-serif text-xl" style={{color:'#FF6BA8'}}>{formatPrice(service?.priceKc??0)}</span>
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading}
                className="w-full py-4 rounded-xl font-serif text-sm tracking-widest uppercase transition-all"
                style={{background:'linear-gradient(135deg,#C4698A,#FF6BA8)',color:'white',boxShadow:loading?'none':'0 0 30px rgba(255,107,168,0.4)'}}>
                {loading?'Odesílám...':'Potvrdit rezervaci →'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step>0 && (
            <button onClick={()=>setStep(s=>s-1)} className="flex-1 py-3.5 rounded-xl font-serif text-sm font-light transition-all"
              style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'rgba(245,238,242,0.5)'}}>
              ← Zpět
            </button>
          )}
          {step<4 && (
            <motion.button whileTap={{scale:0.97}} onClick={()=>{ if(canGoNext()) setStep(s=>s+1) }} disabled={!canGoNext()}
              className="flex-1 py-3.5 rounded-xl font-serif text-sm tracking-widest uppercase transition-all"
              style={{background:canGoNext()?'linear-gradient(135deg,#C4698A,#FF6BA8)':'rgba(255,255,255,0.04)',
                color:canGoNext()?'white':'rgba(245,238,242,0.2)',
                boxShadow:canGoNext()?'0 0 25px rgba(255,107,168,0.3)':'none',
                border:canGoNext()?'none':'1px solid rgba(255,255,255,0.06)'}}>
              Pokračovat →
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function RezervacePage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-pink-neon font-serif text-sm tracking-widest">Načítám...</div></div>}>
        <BookingContent />
      </Suspense>
      <Footer />
    </>
  )
}
