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
import { cn } from '@/lib/utils'

const SERVICES = [
  { id:'s1', nameCs:'Klasické řasy (50D–60D)',  priceKc:499,  durationMin:45  },
  { id:'s2', nameCs:'Objemové řasy (80D)',       priceKc:599,  durationMin:60  },
  { id:'s3', nameCs:'Mega Volume (100D)',        priceKc:799,  durationMin:60  },
  { id:'s4', nameCs:'Wet Look (60D)',            priceKc:999,  durationMin:60  },
  { id:'s5', nameCs:'Doplnění řas',             priceKc:199,  durationMin:20  },
  { id:'s6', nameCs:'Odstranění řas',           priceKc:99,   durationMin:25  },
]

const ARTISTS = [
  { id:'a1', name:'Viktória Ladiková', titleCs:'Zakladatelka · Mladá Boleslav & okolí', initial:'V' },
]

const STEPS = ['Služba', 'Stylistka', 'Termín', 'Kontakt', 'Shrnutí']

const BENEFITS = [
  { icon:'💎', title:'Věrnostní body', desc:'Za každou návštěvu sbíráte body a získáváte slevy' },
  { icon:'🎁', title:'Slevové kupóny', desc:'Exkluzivní nabídky a akce jen pro registrované' },
  { icon:'📱', title:'Dashboard', desc:'Přehled všech rezervací a jejich stav online' },
  { icon:'⚡', title:'Rychlejší chat', desc:'Prioritní odpovědi od Viktórie' },
  { icon:'🔔', title:'Novinky & akce', desc:'Jako první se dozvíte o nových službách a slevách' },
]

function BookingContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [loading, setLoading] = useState(false)
  const [showBenefits, setShowBenefits] = useState(true)

  const [form, setForm] = useState({
    serviceId: searchParams.get('service') ?? '',
    artistId: '', date: '', time: '',
    name: session?.user?.name ?? '',
    email: session?.user?.email ?? '',
    phone: '', notes: '',
  })

  const service = SERVICES.find(s => s.id === form.serviceId)
  const artist  = ARTISTS.find(a => a.id === form.artistId)
  const isLoggedIn = !!session

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]
  const allSlots = generateTimeSlots('08:00', '20:00', 30)
  const takenSlots = ['10:00', '14:00', '16:00']

  const getSlotStatus = (time: string) => {
    if (takenSlots.includes(time)) return 'taken'
    return form.time === time ? 'selected' : 'available'
  }

  const canGoNext = () => {
    if (step === 0) return !!form.serviceId
    if (step === 1) return !!form.artistId
    if (step === 2) return !!form.date && !!form.time
    if (step === 3) return !!form.name && !!form.email && !!form.phone
    return true
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: form.serviceId,
          artistId: form.artistId,
          date: form.date,
          time: form.time,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          notes: form.notes,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setBookingRef(data.bookingRef)
        setSubmitted(true)
      } else {
        toast(data.error ?? 'Chyba při vytváření rezervace.', 'error')
      }
    } catch {
      toast('Nepodařilo se odeslat rezervaci.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // SUCCESS SCREEN
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8 py-20">
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
          className="max-w-2xl w-full">
          {/* Success card */}
          <div className="glass-card p-10 relative mb-6 text-center">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-neon to-transparent"/>
            <motion.div
              animate={{ boxShadow:['0 0 0 0 rgba(255,107,168,0.3)','0 0 0 20px rgba(255,107,168,0)','0 0 0 0 rgba(255,107,168,0)'] }}
              transition={{ repeat:Infinity, duration:2 }}
              className="w-20 h-20 rounded-full border border-pink-neon flex items-center justify-center mx-auto mb-6 text-3xl text-pink-neon">
              ✓
            </motion.div>
            <h2 className="font-serif text-4xl font-light mb-2">Rezervace přijata!</h2>
            <p className="text-text-muted font-light mb-8 text-sm">
              Potvrzení jsme odeslali na <span className="text-pink-soft">{form.email}</span>
            </p>
            <div className="grid grid-cols-2 gap-3 text-left mb-8">
              {[
                ['Č. rezervace', `#${bookingRef.slice(-8).toUpperCase()}`],
                ['Služba', service?.nameCs ?? ''],
                ['Datum', new Date(form.date).toLocaleDateString('cs-CZ',{day:'numeric',month:'long'})],
                ['Čas', form.time],
                ['Stylistka', artist?.name ?? ''],
                ['Celkem', formatPrice(service?.priceKc ?? 0)],
              ].map(([label, value]) => (
                <div key={label} className="glass-card p-4">
                  <div className="text-text-dim font-light tracking-[2px] uppercase mb-1" style={{fontSize:9}}>{label}</div>
                  <div className="font-serif font-light text-sm">{value}</div>
                </div>
              ))}
            </div>
            <a href="/" className="btn-primary block text-center">Zpět na web →</a>
          </div>

          {/* Registration CTA — only for guests */}
          {!isLoggedIn && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
              className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"/>
              <div className="absolute inset-0 opacity-5"
                style={{ background:'linear-gradient(135deg,#D4AA70 0%,transparent 60%)' }}/>
              <div className="relative z-10">
                <div className="font-light tracking-[3px] uppercase text-gold mb-2" style={{fontSize:10}}>✦ Speciální nabídka</div>
                <h3 className="font-serif text-2xl font-light mb-3">Zaregistrujte se a získejte výhody</h3>
                <p className="text-text-muted font-light text-sm mb-6">
                  Vaše rezervace je uložena. Vytvořte si účet a odemkněte věrnostní program, přehled rezervací a exkluzivní slevy.
                </p>
                <div className="grid grid-cols-1 gap-2 mb-6">
                  {BENEFITS.map(b => (
                    <div key={b.title} className="flex items-start gap-3 py-2 border-b border-glass-border last:border-none">
                      <span className="text-lg flex-shrink-0">{b.icon}</span>
                      <div>
                        <div className="font-light text-sm text-text-primary">{b.title}</div>
                        <div className="font-light text-xs text-text-dim">{b.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Link href={`/register?email=${form.email}&name=${form.name}`} className="btn-primary flex-1 text-center border-none">
                    Vytvořit účet zdarma →
                  </Link>
                  <a href="/" className="btn-ghost px-6 py-4">Přeskočit</a>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-8 md:px-16 py-32">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} className="mb-16">
          <div className="section-label mb-5">Rezervační systém</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light mb-4">
            Rezervujte <em className="text-pink-soft not-italic">svůj termín</em>
          </h1>
          <p className="text-text-muted font-light">
            Bez registrace i s účtem. Potvrzení obdržíte okamžitě na e-mail.
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-16">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <button onClick={() => i < step && setStep(i)}
                className={cn('flex items-center gap-2 font-sans font-light tracking-[2px] uppercase cursor-none transition-all duration-300',
                  step===i?'text-text-primary':i<step?'text-pink-neon':'text-text-dim')} style={{fontSize:10}}>
                <span className={cn('w-6 h-6 flex items-center justify-center border text-[10px] transition-all duration-300 flex-shrink-0',
                  step===i?'border-pink-neon text-pink-neon':i<step?'border-pink-neon bg-pink-neon text-black':'border-glass-border')}>
                  {i < step ? '✓' : i+1}
                </span>
                <span className="hidden md:block">{s}</span>
              </button>
              {i < STEPS.length-1 && <div className={cn('flex-1 h-px mx-3 transition-colors duration-500',i<step?'bg-pink-neon/50':'bg-glass-border')}/>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* STEP 0: Service */}
              {step === 0 && (
                <motion.div key="s0" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}>
                  <h2 className="font-serif text-2xl font-light mb-8">Vyberte službu</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-glass-border border border-glass-border">
                    {SERVICES.map(s => (
                      <button key={s.id} onClick={() => setForm(f => ({ ...f, serviceId:s.id }))}
                        className={cn('p-6 text-left transition-all duration-300 cursor-none group',
                          form.serviceId===s.id?'bg-pink-muted border-l-2 border-pink-neon':'bg-black hover:bg-white/[0.02]')}>
                        <div className="font-serif text-lg font-light mb-1 group-hover:text-pink-soft transition-colors">{s.nameCs}</div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-serif text-2xl text-pink-neon">{formatPrice(s.priceKc)}</span>
                          <span className="text-text-dim font-light tracking-wider text-[11px] uppercase">{s.durationMin} min</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 1: Artist */}
              {step === 1 && (
                <motion.div key="s1" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}>
                  <h2 className="font-serif text-2xl font-light mb-8">Vyberte stylistku</h2>
                  {ARTISTS.map(a => (
                    <button key={a.id} onClick={() => setForm(f => ({ ...f, artistId:a.id }))}
                      className={cn('w-full p-6 text-left glass-card flex items-center gap-5 transition-all duration-300 cursor-none',
                        form.artistId===a.id?'border-pink-deep/70 bg-pink-muted':'hover:border-glass-hover')}>
                      <div className={cn('w-14 h-14 rounded-full flex items-center justify-center font-serif text-2xl flex-shrink-0 transition-all duration-300',
                        form.artistId===a.id?'bg-gradient-to-br from-pink-deep to-pink-neon text-white':'border border-glass-border text-pink-soft')}>
                        {a.initial}
                      </div>
                      <div>
                        <div className="font-serif text-xl font-light">{a.name}</div>
                        <div className="text-text-dim font-light tracking-[2px] uppercase mt-1" style={{fontSize:11}}>{a.titleCs}</div>
                      </div>
                      {form.artistId===a.id && <span className="ml-auto text-pink-neon text-xl">✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* STEP 2: Date & Time */}
              {step === 2 && (
                <motion.div key="s2" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}>
                  <h2 className="font-serif text-2xl font-light mb-8">Vyberte termín</h2>
                  <div className="mb-6">
                    <label className="block font-light tracking-[3px] uppercase text-text-muted mb-3" style={{fontSize:11}}>Datum</label>
                    <input type="date" min={minDateStr} value={form.date}
                      onChange={e => setForm(f => ({ ...f, date:e.target.value, time:'' }))}
                      className="form-control max-w-xs"/>
                  </div>
                  {form.date && (
                    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
                      <label className="block font-light tracking-[3px] uppercase text-text-muted mb-3" style={{fontSize:11}}>Dostupné termíny</label>
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {allSlots.map(slot => {
                          const st = getSlotStatus(slot)
                          return (
                            <button key={slot} disabled={st==='taken'} onClick={() => setForm(f => ({ ...f, time:slot }))}
                              className={cn('py-3 border text-sm font-light transition-all duration-200 cursor-none',
                                st==='selected' && 'bg-pink-neon border-pink-neon text-black font-medium',
                                st==='available' && 'border-glass-border text-text-muted hover:border-pink-deep',
                                st==='taken' && 'border-glass-border/30 text-text-dim opacity-30 line-through cursor-not-allowed')}>
                              {slot}
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* STEP 3: Contact */}
              {step === 3 && (
                <motion.div key="s3" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}>
                  <h2 className="font-serif text-2xl font-light mb-8">Vaše kontaktní údaje</h2>

                  {/* Guest info banner */}
                  {!isLoggedIn && (
                    <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
                      className="glass-card p-5 mb-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"/>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-light tracking-[2px] uppercase text-gold mb-1" style={{fontSize:10}}>✦ Rezervujete bez účtu</div>
                          <p className="text-text-muted font-light text-xs leading-relaxed">
                            Potvrzení dostanete e-mailem. Přihlašte se pro přístup k dashboardu, věrnostním bodům a slevám.
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Link href="/login" className="text-[10px] tracking-wider font-light border border-pink-neon/50 text-pink-neon px-3 py-2 cursor-none hover:bg-pink-neon/10 transition-colors whitespace-nowrap">
                            Přihlásit →
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {isLoggedIn && (
                    <div className="glass-card p-4 mb-6 flex items-center gap-3 border-green-500/30">
                      <span className="text-green-400">✓</span>
                      <span className="text-text-muted font-light text-sm">Přihlášeni jako <span className="text-pink-soft">{session.user?.email}</span> — rezervace se propojí s vaším účtem</span>
                    </div>
                  )}

                  <div className="space-y-5">
                    {[
                      {key:'name', label:'Jméno a příjmení', type:'text', ph:'Jana Nováková'},
                      {key:'email', label:'E-mailová adresa', type:'email', ph:'jana@email.cz'},
                      {key:'phone', label:'Telefonní číslo', type:'tel', ph:'+420 000 000 000'},
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{fontSize:11}}>{f.label}</label>
                        <input type={f.type} placeholder={f.ph} className="form-control"
                          value={(form as any)[f.key]}
                          onChange={e => setForm(p => ({ ...p, [f.key]:e.target.value }))}/>
                      </div>
                    ))}
                    <div>
                      <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{fontSize:11}}>Poznámka (nepovinné)</label>
                      <textarea className="form-control resize-none" rows={3} placeholder="Zvláštní přání..."
                        value={form.notes} onChange={e => setForm(f => ({ ...f, notes:e.target.value }))}/>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Summary */}
              {step === 4 && (
                <motion.div key="s4" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}>
                  <h2 className="font-serif text-2xl font-light mb-8">Shrnutí rezervace</h2>
                  <div className="glass-card p-8 space-y-3 mb-6">
                    {[
                      ['Služba', service?.nameCs],
                      ['Stylistka', artist?.name],
                      ['Datum', form.date ? new Date(form.date).toLocaleDateString('cs-CZ',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : ''],
                      ['Čas', form.time],
                      ['Jméno', form.name],
                      ['E-mail', form.email],
                      ['Telefon', form.phone],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between text-sm py-2 border-b border-glass-border/50 last:border-none">
                        <span className="text-text-dim font-light uppercase tracking-wider" style={{fontSize:10}}>{label}</span>
                        <span className="text-text-muted font-light">{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-4 border-t border-glass-border">
                      <span className="text-text-dim font-light uppercase tracking-wider" style={{fontSize:10}}>Celková cena</span>
                      <span className="font-serif text-3xl text-pink-neon">{formatPrice(service?.priceKc ?? 0)}</span>
                    </div>
                  </div>

                  {/* Benefits reminder for guests */}
                  {!isLoggedIn && showBenefits && (
                    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                      className="glass-card p-6 mb-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right:0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"/>
                      <button onClick={() => setShowBenefits(false)}
                        className="absolute top-3 right-4 text-text-dim text-sm cursor-none">×</button>
                      <div className="font-light tracking-[3px] uppercase text-gold mb-3" style={{fontSize:10}}>✦ Výhody s registrací</div>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {BENEFITS.slice(0,4).map(b => (
                          <div key={b.title} className="flex items-center gap-2 text-xs text-text-muted font-light">
                            <span>{b.icon}</span> {b.title}
                          </div>
                        ))}
                      </div>
                      <Link href="/register" className="text-[10px] tracking-wider text-pink-neon border-b border-pink-neon/40 pb-0.5 cursor-none">
                        Vytvořit účet zdarma →
                      </Link>
                    </motion.div>
                  )}

                  <button onClick={handleSubmit} disabled={loading}
                    className="btn-primary w-full border-none font-sans text-sm">
                    {loading ? 'Vytvářím rezervaci...' : 'Potvrdit rezervaci →'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-10 pt-8 border-t border-glass-border">
              {step > 0 ? (
                <button onClick={() => setStep(s => s-1)} className="btn-ghost py-3 px-8">← Zpět</button>
              ) : <div/>}
              {step < 4 && (
                <button onClick={() => canGoNext() && setStep(s => s+1)}
                  disabled={!canGoNext()}
                  className={cn('btn-primary border-none font-sans', !canGoNext() && 'opacity-40 cursor-not-allowed')}>
                  Pokračovat →
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-8 sticky top-28">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-neon to-transparent"/>
              <h3 className="font-serif text-xl font-light mb-6">Vaše rezervace</h3>
              <div className="space-y-4 mb-6">
                {[
                  {label:'Služba', value:service?.nameCs, icon:'✦'},
                  {label:'Stylistka', value:artist?.name, icon:'◉'},
                  {label:'Datum', value:form.date?new Date(form.date).toLocaleDateString('cs-CZ',{day:'numeric',month:'long'}):undefined, icon:'◈'},
                  {label:'Čas', value:form.time, icon:'⌁'},
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3 py-3 border-b border-glass-border/50 last:border-none">
                    <span className="text-pink-neon text-xs mt-0.5">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-light tracking-[2px] uppercase text-text-dim mb-0.5" style={{fontSize:10}}>{item.label}</div>
                      <div className="text-sm text-text-muted font-light truncate">
                        {item.value || <span className="text-text-dim italic">nevybráno</span>}
                      </div>
                    </div>
                  </div>
                ))}
                {service && (
                  <div className="pt-4">
                    <div className="font-serif text-3xl text-pink-neon">{formatPrice(service.priceKc)}</div>
                    {service.priceKc > 0 && <div className="text-text-dim font-light text-xs mt-1">Záloha: {formatPrice(Math.round(service.priceKc*0.3))}</div>}
                  </div>
                )}
              </div>

              {/* Login/Register mini CTA in sidebar */}
              {!isLoggedIn && (
                <div className="pt-4 border-t border-glass-border/50">
                  <div className="font-light tracking-[2px] uppercase text-gold mb-3" style={{fontSize:9}}>✦ Máte účet?</div>
                  <Link href="/login" className="block text-center btn-ghost py-2 text-[10px] mb-2 cursor-none">
                    Přihlásit se
                  </Link>
                  <Link href="/register" className="block text-center text-[10px] tracking-wider text-text-dim hover:text-pink-soft transition-colors cursor-none">
                    Nebo vytvořit účet →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RezervaciPage() {
  return (
    <>
      <CustomCursor/>
      <Navbar/>
      <main className="page-enter bg-black min-h-screen">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-text-dim font-light tracking-widest">Načítám...</div></div>}>
          <BookingContent/>
        </Suspense>
      </main>
      <Footer/>
    </>
  )
}
