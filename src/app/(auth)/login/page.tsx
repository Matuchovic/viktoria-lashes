'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LoginSuccessScreen } from '@/components/ui/LoginSuccessScreen'
import { CustomCursor } from '@/components/ui/CustomCursor'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await signIn('credentials', { ...form, redirect: false })
      if (res?.ok) { setSuccess(true); setTimeout(() => router.push('/dashboard'), 1800) }
      else setError('Nesprávný e-mail nebo heslo.')
    } finally { setLoading(false) }
  }

  if (success) return <LoginSuccessScreen show={true} />

  return (
    <>
      <CustomCursor />
      <main className="min-h-screen bg-black flex items-center justify-center px-5 py-12">
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 50% at 50% 30%,rgba(196,105,138,0.1) 0%,transparent 70%)'}}/>

        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}}
          className="w-full max-w-md relative">

          {/* Logo */}
          <div className="text-center mb-8 md:mb-10">
            <Link href="/" className="font-serif text-xl md:text-2xl font-light tracking-[6px] uppercase">
              Viktória <span className="text-pink-neon">Lashes</span>
            </Link>
            <div className="mt-3 font-light tracking-[4px] uppercase text-text-dim text-xs">Přihlásit se</div>
          </div>

          <div className="relative rounded-2xl p-6 md:p-10" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,107,168,0.12)'}}>
            <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl" style={{background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.5),rgba(212,170,112,0.3),transparent)'}}/>

            <h1 className="font-serif text-2xl md:text-3xl font-light mb-2 text-center">Vítejte zpět</h1>
            <p className="text-text-muted text-sm font-light mb-8 text-center">Přihlaste se ke svému účtu</p>

            {error && (
              <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
                className="mb-5 p-3 rounded-xl text-sm font-light text-center"
                style={{background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.3)',color:'#f87171'}}>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{fontSize:10}}>E-mail</label>
                <input type="email" className="form-control w-full" placeholder="jana@email.cz"
                  value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required/>
              </div>
              <div>
                <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{fontSize:10}}>Heslo</label>
                <input type="password" className="form-control w-full" placeholder="••••••••"
                  value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required/>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full border-none font-sans py-4 mt-2">
                {loading ? 'Přihlašuji...' : 'Přihlásit se →'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-text-muted font-light text-sm">
                Nemáte účet?{' '}
                <Link href="/register" className="text-pink-neon hover:text-pink-soft transition-colors">Zaregistrujte se</Link>
              </p>
              <Link href="/" className="block text-text-dim font-light text-xs tracking-wider hover:text-text-muted transition-colors">
                ← Zpět na hlavní stránku
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  )
}
