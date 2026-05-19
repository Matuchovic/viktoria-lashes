'use client'
// src/components/sections/ContactSection.tsx
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useToast } from '@/components/ui/Toaster'

const INFO = [
  { icon: '📍', label: 'Adresa', value: 'Pařížská 18, 110 00 Praha 1\n2. patro, výtah k dispozici' },
  { icon: '📞', label: 'Telefon & WhatsApp', value: '+420 777 888 999\nPo–Ne, 9:00 – 20:00' },
  { icon: '✉',  label: 'E-mail', value: 'info@viktoralashes.cz\nOdpovídáme do 2 hodin' },
  {
    icon: '🕐',
    label: 'Otevírací doba',
    value: 'Pondělí – Pátek: 9:00 – 20:00\nSobota: 9:00 – 18:00\nNeděle: 10:00 – 16:00',
  },
]

export function ContactSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast('Vyplňte prosím všechna pole.', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast('Zpráva odeslána! Ozveme se vám brzy.', 'success')
        setForm({ name: '', email: '', message: '' })
      } else {
        toast('Chyba při odesílání. Zkuste to znovu.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="kontakt" className="bg-black px-8 md:px-16 py-32">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <div className="section-label mb-5">Kontakt</div>
        <h2 className="section-title">
          Najdete nás<br /><em>v srdci Prahy</em>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          {INFO.map(item => (
            <div key={item.label} className="flex gap-6 items-start pb-8 border-b border-glass-border last:border-none">
              <div className="w-12 h-12 border border-glass-border flex items-center justify-center text-xl flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <div className="font-light tracking-[3px] uppercase text-pink-neon mb-2" style={{ fontSize: 11 }}>
                  {item.label}
                </div>
                <div className="text-text-muted font-light leading-relaxed text-sm whitespace-pre-line">
                  {item.value}
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-4 pt-2">
            <a href="https://wa.me/420777888999" className="btn-primary py-3 px-6 text-[10px]">
              WhatsApp
            </a>
            <a href="https://instagram.com/viktoralashes" className="btn-ghost py-3 px-6 text-[10px]">
              Instagram
            </a>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative glass-card p-12"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          <h3 className="font-serif text-3xl font-light mb-2">Napište nám</h3>
          <p className="text-text-muted text-sm font-light mb-8">
            Máte dotaz? Ozveme se vám co nejdříve.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{ fontSize: 11 }}>
                Vaše jméno
              </label>
              <input
                className="form-control"
                placeholder="Jana Nováková"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{ fontSize: 11 }}>
                E-mail
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="jana@email.cz"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{ fontSize: 11 }}>
                Zpráva
              </label>
              <textarea
                className="form-control resize-none"
                rows={5}
                placeholder="Váš dotaz nebo zpráva..."
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full border-none font-sans">
              {loading ? 'Odesílám...' : 'Odeslat zprávu →'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
