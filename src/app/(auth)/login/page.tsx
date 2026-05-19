'use client'
// src/app/(auth)/login/page.tsx
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useToast } from '@/components/ui/Toaster'
import { CustomCursor } from '@/components/ui/CustomCursor'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })
      if (result?.error) {
        toast('Nesprávný e-mail nebo heslo.', 'error')
      } else {
        toast('Přihlášení proběhlo úspěšně!', 'success')
        router.push('/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CustomCursor />
      <div className="min-h-screen bg-black flex items-center justify-center px-8">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(196,105,138,0.08) 0%, transparent 70%)' }}
        />
        <motion.div
          initial={{ opacity:0, y:30 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
          className="w-full max-w-md"
        >
          <Link href="/" className="block text-center font-serif text-2xl font-light tracking-[6px] uppercase mb-12">
            Viktoria <span className="text-pink-neon">Lashes</span>
          </Link>

          <div className="glass-card p-10 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-neon to-transparent" />

            <h1 className="font-serif text-3xl font-light mb-2">Přihlášení</h1>
            <p className="text-text-muted font-light text-sm mb-8">Přihlaste se ke svému účtu</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{ fontSize:11 }}>
                  E-mailová adresa
                </label>
                <input
                  type="email" required
                  className="form-control"
                  placeholder="jana@email.cz"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{ fontSize:11 }}>
                  Heslo
                </label>
                <input
                  type="password" required
                  className="form-control"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full border-none font-sans mt-2">
                {loading ? 'Přihlašuji...' : 'Přihlásit se →'}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-glass-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-black-2 px-4 text-text-dim font-light text-xs tracking-wider">nebo</span>
              </div>
            </div>

            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="btn-ghost w-full flex items-center justify-center gap-3 py-4"
            >
              <span>G</span> Přihlásit přes Google
            </button>

            <p className="text-center text-text-dim font-light text-sm mt-8">
              Nemáte účet?{' '}
              <Link href="/register" className="text-pink-soft hover:text-pink-neon transition-colors cursor-none">
                Registrovat se
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}
