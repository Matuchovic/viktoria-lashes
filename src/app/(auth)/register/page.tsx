'use client'
// src/app/(auth)/register/page.tsx
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useToast } from '@/components/ui/Toaster'
import { CustomCursor } from '@/components/ui/CustomCursor'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirm:'' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast('Hesla se neshodují.', 'error')
      return
    }
    if (form.password.length < 8) {
      toast('Heslo musí mít alespoň 8 znaků.', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      })
      if (res.ok) {
        await signIn('credentials', { email: form.email, password: form.password, redirect: false })
        toast('Registrace proběhla úspěšně!', 'success')
        router.push('/dashboard')
      } else {
        const d = await res.json()
        toast(d.error ?? 'Registrace selhala.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CustomCursor />
      <div className="min-h-screen bg-black flex items-center justify-center px-8 py-20">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(196,105,138,0.08) 0%, transparent 70%)' }} />

        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }} className="w-full max-w-md">
          <Link href="/" className="block text-center font-serif text-2xl font-light tracking-[6px] uppercase mb-12">
            Viktoria <span className="text-pink-neon">Lashes</span>
          </Link>

          <div className="glass-card p-10 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <h1 className="font-serif text-3xl font-light mb-2">Registrace</h1>
            <p className="text-text-muted font-light text-sm mb-8">Vytvořte si zákaznický účet</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { key:'name',     label:'Jméno a příjmení',  type:'text',     ph:'Jana Nováková' },
                { key:'email',    label:'E-mailová adresa',   type:'email',    ph:'jana@email.cz' },
                { key:'phone',    label:'Telefonní číslo',    type:'tel',      ph:'+420 000 000 000' },
                { key:'password', label:'Heslo',              type:'password', ph:'••••••••' },
                { key:'confirm',  label:'Potvrdit heslo',     type:'password', ph:'••••••••' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{ fontSize:11 }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type} required
                    className="form-control"
                    placeholder={f.ph}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
              <button type="submit" disabled={loading} className="btn-primary w-full border-none font-sans mt-2">
                {loading ? 'Registruji...' : 'Vytvořit účet →'}
              </button>
            </form>

            <p className="text-center text-text-dim font-light text-sm mt-8">
              Máte již účet?{' '}
              <Link href="/login" className="text-pink-soft hover:text-pink-neon transition-colors cursor-none">
                Přihlásit se
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}
