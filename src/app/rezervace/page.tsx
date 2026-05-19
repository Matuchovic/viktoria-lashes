'use client'
// src/app/rezervace/page.tsx
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { useToast } from '@/components/ui/Toaster'
import { formatPrice, generateTimeSlots, BOOKING_STATUS_LABELS } from '@/lib/utils'
import { cn } from '@/lib/utils'

const SERVICES = [
  { id:'s1', nameCs:'Klasické řasy',   priceKc:1490, durationMin:105, category:'CLASSIC'     },
  { id:'s2', nameCs:'Objemové řasy',   priceKc:1890, durationMin:135, category:'VOLUME'      },
  { id:'s3', nameCs:'Mega Volume',     priceKc:2490, durationMin:165, category:'MEGA_VOLUME' },
  { id:'s4', nameCs:'Wet Look',        priceKc:2190, durationMin:135, category:'WET_LOOK'    },
  { id:'s5', nameCs:'Hybridní řasy',   priceKc:1690, durationMin:125, category:'HYBRID'      },
  { id:'s6', nameCs:'Doplnění řas',    priceKc:890,  durationMin:75,  category:'INFILL'      },
  { id:'s7', nameCs:'Lash Lifting',    priceKc:990,  durationMin:70,  category:'LIFTING'     },
  { id:'s8', nameCs:'Odstranění řas',  priceKc:390,  durationMin:25,  category:'REMOVAL'     },
]

const ARTISTS = [
  { id:'a1', name:'Viktoria Semenova',  titleCs:'Master Stylistka',        initial:'V' },
  { id:'a2', name:'Aneta Dvořáčková',   titleCs:'Senior Lash Stylistka',   initial:'A' },
  { id:'a3', name:'Kristýna Malá',      titleCs:'Lash & Brow Specialistka',initial:'K' },
]

const STEPS = ['Služba', 'Stylistka', 'Termín', 'Kontakt', 'Shrnutí']

type FormData = {
  serviceId: string
  artistId: string
  date: string
  time: string
  name: string
  email: string
  phone: string
  notes: string
}

function BookingContent() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [loading, setLoading] = useState(false)
  const [takenSlots, setTakenSlots] = useState<string[]>(['10:00', '14:00', '16:00'])

  const [form, setForm] = useState<FormData>({
    serviceId: searchParams.get('service') ?? '',
    artistId: '', date: '', time: '',
    name: '', email: '', phone: '', notes: '',
  })

  const service = SERVICES.find(s => s.id === form.serviceId)
  const artist  = ARTISTS.find(a => a.id === form.artistId)

  // Min date = tomorrow
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  const allSlots = generateTimeSlots('09:00', '20:00', 30)

  const getSlotAvailability = (time: string) => {
    if (takenSlots.includes(time)) return 'taken'
    // Block slots needed for the service duration
    if (service) {
      const base = new Date(2000, 0, 1, parseInt(time.split(':')[0]), parseInt(time.split(':')[1]))
      const needed = Math.ceil(service.durationMin / 30)
      for (let i = 1; i < needed; i++) {
        const next = new Date(base.getTime() + i * 30 * 60000)
        const nextStr = `${String(next.getHours()).padStart(2,'0')}:${String(next.getMinutes()).padStart(2,'0')}`
        if (takenSlots.includes(nextStr)) return 'taken'
      }
    }
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
        toast('Rezervace úspěšně vytvořena!', 'success')
      } else {
        toast(data.error ?? 'Chyba při vytváření rezervace.', 'error')
      }
    } catch {
      toast('Nepodařilo se odeslat rezervaci. Zkuste to znovu.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-16 text-center max-w-lg w-full relative"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-neon to-transparent" />
          <motion.div
            animate={{ boxShadow: ['0 0 0 0 rgba(255,107,168,0.25)', '0 0 0 20px rgba(255,107,168,0)', '0 0 0 0 rgba(255,107,168,0)'] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-20 h-20 rounded-full border border-pink-neon flex items-center justify-center mx-auto mb-8 text-3xl text-pink-neon"
          >
            ✓
          </motion.div>
          <h2 className="font-serif text-4xl font-light mb-3">Rezervace potvrzena!</h2>
          <p className="text-text-muted font-light mb-8 text-sm">
            Potvrzení jsme odeslali na <span className="text-pink-soft">{form.email}</span>
          </p>
          <div className="glass-card p-6 text-left space-y-3 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-text-dim font-light uppercase tracking-wider text-[11px]">Č. rezervace</span>
              <span className="font-medium">#{bookingRef.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-dim font-light uppercase tracking-wider text-[11px]">Služba</span>
              <span>{service?.nameCs}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-dim font-light uppercase tracking-wider text-[11px]">Stylistka</span>
              <span>{artist?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-dim font-light uppercase tracking-wider text-[11px]">Termín</span>
              <span>{new Date(form.date).toLocaleDateString('cs-CZ', { weekday:'long', day:'numeric', month:'long' })} v {form.time}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-glass-border pt-3">
              <span className="text-text-dim font-light uppercase tracking-wider text-[11px]">Celkem</span>
              <span className="font-serif text-xl text-pink-neon">{formatPrice(service?.priceKc ?? 0)}</span>
            </div>
          </div>
          <a href="/" className="btn-primary w-full block text-center">
            Zpět na hlavní stránku
          </a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-8 md:px-16 py-32">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} className="mb-16">
          <div className="section-label mb-5">Rezervační systém</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light mb-4">
            Rezervujte <em className="text-pink-soft not-italic">svůj termín</em>
          </h1>
          <p className="text-text-muted font-light">
            Vyberte si službu, stylistku a termín — potvrzení obdržíte okamžitě na e-mail.
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-16">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <button
                onClick={() => i < step && setStep(i)}
                className={cn(
                  'flex items-center gap-2 font-sans font-light tracking-[2px] uppercase cursor-none transition-all duration-300',
                  step === i ? 'text-text-primary' : i < step ? 'text-pink-neon' : 'text-text-dim',
                )}
                style={{ fontSize: 10 }}
              >
                <span className={cn(
                  'w-6 h-6 flex items-center justify-center border text-[10px] transition-all duration-300 flex-shrink-0',
                  step === i ? 'border-pink-neon text-pink-neon' : i < step ? 'border-pink-neon bg-pink-neon text-black' : 'border-glass-border',
                )}>
                  {i < step ? '✓' : i + 1}
                </span>
                <span className="hidden md:block">{s}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={cn('flex-1 h-px mx-3 transition-colors duration-500', i < step ? 'bg-pink-neon/50' : 'bg-glass-border')} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* STEP 0: Service */}
              {step === 0 && (
                <motion.div key="step0" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}>
                  <h2 className="font-serif text-2xl font-light mb-8">Vyberte službu</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-glass-border border border-glass-border">
                    {SERVICES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setForm(f => ({ ...f, serviceId: s.id, time: '' }))}
                        className={cn(
                          'p-6 text-left transition-all duration-300 cursor-none group',
                          form.serviceId === s.id
                            ? 'bg-pink-muted border-l-2 border-pink-neon'
                            : 'bg-black hover:bg-white/[0.02]',
                        )}
                      >
                        <div className="font-serif text-lg font-light mb-1 group-hover:text-pink-soft transition-colors">
                          {s.nameCs}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-serif text-2xl text-pink-neon">{formatPrice(s.priceKc)}</span>
                          <span className="text-text-dim font-light tracking-wider text-[11px] uppercase">
                            {s.durationMin} min
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 1: Artist */}
              {step === 1 && (
                <motion.div key="step1" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}>
                  <h2 className="font-serif text-2xl font-light mb-8">Vyberte stylistku</h2>
                  <div className="space-y-4">
                    {ARTISTS.map(a => (
                      <button
                        key={a.id}
                        onClick={() => setForm(f => ({ ...f, artistId: a.id }))}
                        className={cn(
                          'w-full p-6 text-left glass-card flex items-center gap-5 transition-all duration-300 cursor-none',
                          form.artistId === a.id
                            ? 'border-pink-deep/70 bg-pink-muted'
                            : 'hover:border-glass-hover',
                        )}
                      >
                        <div className={cn(
                          'w-14 h-14 rounded-full flex items-center justify-center font-serif text-2xl flex-shrink-0 transition-all duration-300',
                          form.artistId === a.id
                            ? 'bg-gradient-to-br from-pink-deep to-pink-neon text-white'
                            : 'border border-glass-border text-pink-soft',
                        )}>
                          {a.initial}
                        </div>
                        <div>
                          <div className="font-serif text-xl font-light">{a.name}</div>
                          <div className="text-text-dim font-light tracking-[2px] uppercase mt-1" style={{ fontSize: 11 }}>
                            {a.titleCs}
                          </div>
                        </div>
                        {form.artistId === a.id && (
                          <span className="ml-auto text-pink-neon text-xl">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Date & Time */}
              {step === 2 && (
                <motion.div key="step2" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}>
                  <h2 className="font-serif text-2xl font-light mb-8">Vyberte termín</h2>
                  <div className="mb-6">
                    <label className="block font-light tracking-[3px] uppercase text-text-muted mb-3" style={{ fontSize: 11 }}>
                      Datum
                    </label>
                    <input
                      type="date"
                      min={minDateStr}
                      value={form.date}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value, time: '' }))}
                      className="form-control max-w-xs"
                    />
                  </div>
                  {form.date && (
                    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
                      <label className="block font-light tracking-[3px] uppercase text-text-muted mb-3" style={{ fontSize: 11 }}>
                        Dostupné termíny
                      </label>
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {allSlots.map(slot => {
                          const status = getSlotAvailability(slot)
                          return (
                            <button
                              key={slot}
                              disabled={status === 'taken'}
                              onClick={() => setForm(f => ({ ...f, time: slot }))}
                              className={cn(
                                'py-3 border text-sm font-light transition-all duration-200 cursor-none',
                                status === 'selected'  && 'bg-pink-neon border-pink-neon text-black font-medium',
                                status === 'available' && 'border-glass-border text-text-muted hover:border-pink-deep hover:text-text-primary',
                                status === 'taken'     && 'border-glass-border/30 text-text-dim opacity-30 line-through cursor-not-allowed',
                              )}
                            >
                              {slot}
                            </button>
                          )
                        })}
                      </div>
                      <p className="text-text-dim font-light mt-4 flex items-center gap-4" style={{ fontSize: 12 }}>
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-px bg-pink-neon inline-block" /> Volno
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-px bg-glass-border inline-block" /> Obsazeno
                        </span>
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* STEP 3: Contact */}
              {step === 3 && (
                <motion.div key="step3" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}>
                  <h2 className="font-serif text-2xl font-light mb-8">Vaše kontaktní údaje</h2>
                  <div className="space-y-5">
                    {[
                      { key:'name',  label:'Jméno a příjmení', type:'text',  placeholder:'Jana Nováková' },
                      { key:'email', label:'E-mailová adresa',  type:'email', placeholder:'jana@email.cz' },
                      { key:'phone', label:'Telefonní číslo',   type:'tel',   placeholder:'+420 000 000 000' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{ fontSize: 11 }}>
                          {f.label}
                        </label>
                        <input
                          type={f.type}
                          placeholder={f.placeholder}
                          value={(form as any)[f.key]}
                          onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                          className="form-control"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{ fontSize: 11 }}>
                        Poznámka (nepovinné)
                      </label>
                      <textarea
                        className="form-control resize-none"
                        rows={3}
                        placeholder="Zvláštní přání, alergie, informace pro stylistku..."
                        value={form.notes}
                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Summary */}
              {step === 4 && (
                <motion.div key="step4" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}>
                  <h2 className="font-serif text-2xl font-light mb-8">Shrnutí rezervace</h2>
                  <div className="glass-card p-8 space-y-4 mb-6">
                    {[
                      ['Služba', service?.nameCs ?? '—'],
                      ['Stylistka', artist?.name ?? '—'],
                      ['Datum', form.date ? new Date(form.date).toLocaleDateString('cs-CZ', { weekday:'long', day:'numeric', month:'long', year:'numeric' }) : '—'],
                      ['Čas', form.time || '—'],
                      ['Jméno', form.name],
                      ['E-mail', form.email],
                      ['Telefon', form.phone],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between text-sm py-2 border-b border-glass-border/50 last:border-none">
                        <span className="text-text-dim font-light uppercase tracking-wider" style={{ fontSize: 10 }}>{label}</span>
                        <span className="text-text-muted font-light">{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-4 border-t border-glass-border">
                      <span className="text-text-dim font-light uppercase tracking-wider" style={{ fontSize: 10 }}>Celková cena</span>
                      <span className="font-serif text-3xl text-pink-neon">{formatPrice(service?.priceKc ?? 0)}</span>
                    </div>
                    {service && service.priceKc > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-text-dim font-light uppercase tracking-wider" style={{ fontSize: 10 }}>Záloha (30%)</span>
                        <span className="text-gold font-light">{formatPrice(Math.round(service.priceKc * 0.3))}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-text-dim font-light text-xs mb-6">
                    Záloha 30% je vyžadována pro potvrzení termínu. Zrušení do 24h před termínem je zdarma.
                    Platba: hotovost, karta nebo bankovní převod.
                  </p>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary w-full border-none font-sans text-sm"
                  >
                    {loading ? 'Vytvářím rezervaci...' : 'Potvrdit rezervaci →'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-10 pt-8 border-t border-glass-border">
              {step > 0 ? (
                <button onClick={() => setStep(s => s - 1)} className="btn-ghost py-3 px-8">
                  ← Zpět
                </button>
              ) : <div />}
              {step < 4 && (
                <button
                  onClick={() => canGoNext() && setStep(s => s + 1)}
                  disabled={!canGoNext()}
                  className={cn('btn-primary border-none font-sans', !canGoNext() && 'opacity-40 cursor-not-allowed')}
                >
                  Pokračovat →
                </button>
              )}
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-8 sticky top-28">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-neon to-transparent" />
              <h3 className="font-serif text-xl font-light mb-6">Vaše rezervace</h3>
              <div className="space-y-4">
                {[
                  { label: 'Služba',    value: service?.nameCs, icon: '✦' },
                  { label: 'Stylistka', value: artist?.name,    icon: '◉' },
                  { label: 'Datum',     value: form.date ? new Date(form.date).toLocaleDateString('cs-CZ', {day:'numeric',month:'long'}) : undefined, icon: '◈' },
                  { label: 'Čas',       value: form.time,       icon: '⌁' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3 py-3 border-b border-glass-border/50 last:border-none">
                    <span className="text-pink-neon text-xs mt-0.5">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-light tracking-[2px] uppercase text-text-dim mb-0.5" style={{ fontSize: 10 }}>
                        {item.label}
                      </div>
                      <div className="text-sm text-text-muted font-light truncate">
                        {item.value || <span className="text-text-dim italic">nevybráno</span>}
                      </div>
                    </div>
                  </div>
                ))}
                {service && (
                  <div className="pt-4">
                    <div className="font-light tracking-[2px] uppercase text-text-dim mb-2" style={{ fontSize: 10 }}>
                      Cena celkem
                    </div>
                    <div className="font-serif text-3xl text-pink-neon">{formatPrice(service.priceKc)}</div>
                    <div className="text-text-dim font-light text-xs mt-1">
                      Záloha: {formatPrice(Math.round(service.priceKc * 0.3))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-glass-border space-y-2">
                <h4 className="font-light tracking-[2px] uppercase text-text-dim mb-3" style={{ fontSize: 10 }}>
                  Pravidla studia
                </h4>
                {[
                  'Příchod 5 min předem',
                  'Čisté řasy bez řasenky',
                  'Zrušení do 24h zdarma',
                  'Platba: hotovost / karta',
                ].map(r => (
                  <div key={r} className="flex items-center gap-2 text-text-dim font-light" style={{ fontSize: 12 }}>
                    <span className="w-1 h-1 rounded-full bg-pink-neon flex-shrink-0" />
                    {r}
                  </div>
                ))}
              </div>
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
      <CustomCursor />
      <Navbar />
      <main className="page-enter bg-black min-h-screen">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
          <div className="text-text-dim font-light tracking-widest">Načítám...</div>
        </div>}>
          <BookingContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
