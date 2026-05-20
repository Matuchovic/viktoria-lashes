'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { CustomCursor } from '@/components/ui/CustomCursor'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
      const data = await res.json()
      if (res.ok) setSuccess(true)
      else setError(data.error ?? 'Chyba při registraci.')
    } finally { setLoading(false) }
  }

  return (
    <>
      <CustomCursor />
      <main className="min-h-screen bg-black flex items-center justify-center px-5 py-12">
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 50% at 50% 30%,rgba(196,105,138,0.1) 0%,transparent 70%)'}}/>

        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}} className="w-full max-w-md relative">

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="success" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0}} className="text-center py-10">
                {/* Lash burst */}
                <div className="relative w-28 h-28 mx-auto mb-6">
                  {[...Array(12)].map((_,i)=>(
                    <motion.div key={i} initial={{opacity:0,scaleY:0}} animate={{opacity:1,scaleY:1}}
                      transition={{delay:i*0.05,duration:0.4,ease:[0.16,1,0.3,1]}}
                      style={{position:'absolute',left:'50%',bottom:'50%',width:2,height:38,
                        background:`linear-gradient(to top,#FF6BA8,${i%3===0?'#D4AA70':'#E8A4BE'})`,
                        transformOrigin:'bottom center',borderRadius:2,
                        transform:`translateX(-50%) rotate(${i*30}deg)`,opacity:0.8}}/>
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.6,type:'spring',stiffness:300}}
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{background:'linear-gradient(135deg,#C4698A,#FF6BA8)',boxShadow:'0 0 30px rgba(255,107,168,0.5)'}}>
                      <span className="text-2xl">💕</span>
                    </motion.div>
                  </div>
                </div>
                <h2 className="font-serif text-2xl font-light mb-2">Vítejte, {form.name.split(' ')[0]}!</h2>
                <p className="text-text-muted text-sm font-light mb-2">Účet byl úspěšně vytvořen.</p>
                <p className="text-sm mb-1" style={{color:'#D4AA70'}}>🎁 Získali jste +250 Lash Body bodů!</p>
                <p className="text-text-dim text-xs font-light italic mb-8">PS: Viktória ❤️</p>
                <button onClick={()=>router.push('/login')} className="btn-primary border-none">
                  Přihlásit se →
                </button>
              </motion.div>
            ) : (
              <motion.div key="form">
                <div className="text-center mb-8">
                  <Link href="/" className="font-serif text-xl font-light tracking-[6px] uppercase">
                    Viktória <span className="text-pink-neon">Lashes</span>
                  </Link>
                  <div className="mt-3 font-light tracking-[4px] uppercase text-text-dim text-xs">Registrace</div>
                </div>

                {/* 250 points teaser */}
                <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
                  className="mb-5 p-4 rounded-xl flex items-center gap-3"
                  style={{background:'rgba(212,170,112,0.07)',border:'1px solid rgba(212,170,112,0.2)'}}>
                  <span className="text-2xl">👑</span>
                  <div>
                    <div className="font-serif text-sm" style={{color:'#D4AA70'}}>+250 Lash Body bodů zdarma</div>
                    <div className="text-text-dim text-xs font-light">Uvítací bonus ihned po registraci</div>
                  </div>
                </motion.div>

                <div className="relative rounded-2xl p-6 md:p-8" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,107,168,0.12)'}}>
                  <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl" style={{background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.5),rgba(212,170,112,0.3),transparent)'}}/>

                  {error && (
                    <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
                      className="mb-5 p-3 rounded-xl text-sm font-light text-center"
                      style={{background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.3)',color:'#f87171'}}>
                      {error}
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                      {key:'name',  label:'Celé jméno',  type:'text',     ph:'Jana Nováková'},
                      {key:'email', label:'E-mail',       type:'email',    ph:'jana@email.cz'},
                      {key:'phone', label:'Telefon',      type:'tel',      ph:'+420 123 456 789'},
                      {key:'password',label:'Heslo',      type:'password', ph:'Minimálně 8 znaků'},
                    ].map(f=>(
                      <div key={f.key}>
                        <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{fontSize:10}}>{f.label}</label>
                        <input type={f.type} className="form-control w-full" placeholder={f.ph}
                          value={(form as any)[f.key]} onChange={e=>setForm(prev=>({...prev,[f.key]:e.target.value}))} required={f.key!=='phone'}/>
                      </div>
                    ))}
                    <button type="submit" disabled={loading} className="btn-primary w-full border-none font-sans py-4 mt-2">
                      {loading ? 'Registruji...' : 'Zaregistrovat se →'}
                    </button>
                  </form>

                  <div className="mt-6 text-center space-y-3">
                    <p className="text-text-muted font-light text-sm">
                      Již máte účet?{' '}
                      <Link href="/login" className="text-pink-neon hover:text-pink-soft transition-colors">Přihlásit se</Link>
                    </p>
                    <Link href="/" className="block text-text-dim font-light text-xs tracking-wider hover:text-text-muted transition-colors">
                      ← Zpět na hlavní stránku
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </>
  )
}
