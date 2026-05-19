'use client'
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/ui/Toaster'
import { CustomCursor } from '@/components/ui/CustomCursor'

interface Particle { id:number; x:number; y:number; size:number; color:string; delay:number; dur:number }

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [form, setForm] = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(Array.from({length:35},(_,i)=>({
      id:i, x:Math.random()*100, y:Math.random()*100,
      size:1+Math.random()*2,
      color: i%3===0 ? '#D4AA70' : i%3===1 ? '#FF6BA8' : '#E8A4BE',
      delay:-Math.random()*8, dur:4+Math.random()*6,
    })))
  },[])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      const result = await signIn('credentials', { email:form.email, password:form.password, redirect:false })
      if (result?.error) toast('Nesprávný e-mail nebo heslo.','error')
      else { toast('Vítejte zpět! ✨','success'); router.push('/dashboard') }
    } finally { setLoading(false) }
  }

  return (
    <>
      <CustomCursor />
      <div className="min-h-screen relative flex items-center justify-center px-8 overflow-hidden"
        style={{background:'radial-gradient(ellipse 80% 80% at 50% 50%,rgba(196,105,138,0.12) 0%,transparent 70%),#080608'}}>

        {/* Grid */}
        <div className="absolute inset-0 hero-grid-bg opacity-50"/>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map(p=>(
            <motion.div key={p.id} className="absolute rounded-full"
              style={{width:p.size,height:p.size,left:`${p.x}%`,bottom:'-10px',background:p.color,boxShadow:`0 0 ${p.size*4}px ${p.color}`}}
              animate={{y:['0px','-110vh'],opacity:[0,0.8,0.4,0]}}
              transition={{duration:p.dur,delay:p.delay,repeat:Infinity,ease:'linear'}}
            />
          ))}
        </div>

        {/* Orbit decorations */}
        <motion.div animate={{rotate:360}} transition={{duration:18,repeat:Infinity,ease:'linear'}}
          className="absolute rounded-full border border-pink-glow opacity-20 pointer-events-none"
          style={{width:600,height:600,left:'50%',top:'50%',marginLeft:-300,marginTop:-300}}/>
        <motion.div animate={{rotate:-360}} transition={{duration:25,repeat:Infinity,ease:'linear'}}
          className="absolute rounded-full pointer-events-none opacity-15"
          style={{width:850,height:850,left:'50%',top:'50%',marginLeft:-425,marginTop:-425,border:'1px dashed rgba(212,170,112,0.3)'}}/>

        {/* Lash decoration */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-25 hidden lg:block">
          <svg width="180" height="300" viewBox="0 0 180 300">
            {Array.from({length:10},(_,i)=>{
              const angle=-30+i*7; const rad=angle*Math.PI/180
              const len=60+i*12
              return <motion.path key={i}
                d={`M 90 280 C ${90+Math.sin(rad)*20} ${280-len*0.4} ${90+Math.sin(rad)*len*0.5} ${280-len*0.8} ${90+Math.sin(rad)*len} ${280-len}`}
                stroke={i%2===0?'#FF6BA8':'#D4AA70'} strokeWidth={1} strokeLinecap="round" fill="none"
                style={{filter:`drop-shadow(0 0 4px ${i%2===0?'#FF6BA8':'#D4AA70'})`}}
                initial={{pathLength:0,opacity:0}} animate={{pathLength:[0,1,1,0],opacity:[0,0.7,0.5,0]}}
                transition={{duration:2.5,delay:i*0.18,repeat:Infinity,repeatDelay:1,ease:'easeInOut'}}
              />
            })}
          </svg>
        </div>

        {/* Card */}
        <motion.div initial={{opacity:0,y:30,scale:0.95}} animate={{opacity:1,y:0,scale:1}}
          transition={{duration:0.9,ease:[0.16,1,0.3,1]}}
          className="relative w-full max-w-md z-10">

          {/* Glow behind card */}
          <div className="absolute inset-0 -m-6 rounded-full opacity-20 pointer-events-none"
            style={{background:'radial-gradient(ellipse,rgba(255,107,168,0.4) 0%,transparent 70%)',filter:'blur(30px)'}}/>

          <div className="relative overflow-hidden" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',backdropFilter:'blur(20px)'}}>
            {/* Border glow top */}
            <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,#FF6BA8,#D4AA70,transparent)'}}/>

            <div className="p-10">
              {/* Logo — glow version */}
              <Link href="/" className="block text-center mb-10">
                <motion.div
                  animate={{textShadow:['0 0 20px rgba(255,107,168,0.4)','0 0 50px rgba(255,107,168,0.8)','0 0 20px rgba(255,107,168,0.4)']}}
                  transition={{duration:2,repeat:Infinity,ease:'easeInOut'}}
                  className="font-serif text-2xl font-light tracking-[6px] uppercase">
                  Viktória <span style={{color:'#FF6BA8',textShadow:'0 0 30px rgba(255,107,168,0.8)'}}>Lashes</span>
                </motion.div>
                <div className="font-sans font-light tracking-[4px] uppercase mt-1" style={{fontSize:9,color:'rgba(245,238,242,0.25)'}}>
                  Luxury Beauty Experience
                </div>
              </Link>

              <h1 className="font-serif text-3xl font-light mb-2" style={{textShadow:'0 0 20px rgba(255,107,168,0.15)'}}>Přihlášení</h1>
              <p className="text-text-muted font-light text-sm mb-8">Přihlaste se ke svému účtu</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {[{key:'email',label:'E-mailová adresa',type:'email',ph:'jana@email.cz'},{key:'password',label:'Heslo',type:'password',ph:'••••••••'}].map(f=>(
                  <div key={f.key}>
                    <label className="block font-light tracking-[3px] uppercase text-text-muted mb-2" style={{fontSize:11}}>{f.label}</label>
                    <input type={f.type} required className="form-control" placeholder={f.ph}
                      value={(form as any)[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}/>
                  </div>
                ))}
                <motion.button type="submit" disabled={loading}
                  whileHover={{scale:1.01,boxShadow:'0 20px 60px rgba(255,107,168,0.5)'}}
                  whileTap={{scale:0.99}}
                  className="btn-primary w-full border-none font-sans" style={{position:'relative',overflow:'hidden'}}>
                  <span>{loading?'Přihlašuji...':'Přihlásit se →'}</span>
                  {!loading && <motion.div className="absolute inset-0 pointer-events-none"
                    animate={{x:['-100%','200%']}} transition={{duration:1.5,repeat:Infinity,repeatDelay:2,ease:'easeInOut'}}
                    style={{background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)',width:'40%'}}/>}
                </motion.button>
              </form>

              <div className="relative my-7">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-glass-border"/></div>
                <div className="relative flex justify-center">
                  <span className="px-4 font-light text-xs tracking-wider" style={{background:'rgba(15,10,13,1)',color:'rgba(245,238,242,0.25)'}}>nebo</span>
                </div>
              </div>

              <motion.button whileHover={{scale:1.01}} onClick={()=>signIn('google',{callbackUrl:'/dashboard'})}
                className="btn-ghost w-full flex items-center justify-center gap-3 py-4">
                <span>G</span> Přihlásit přes Google
              </motion.button>

              <p className="text-center font-light text-sm mt-8" style={{color:'rgba(245,238,242,0.35)'}}>
                Nemáte účet?{' '}
                <Link href="/register" className="cursor-none transition-colors duration-300"
                  style={{color:'#E8A4BE',textShadow:'0 0 10px rgba(232,164,190,0.4)'}}>
                  Registrovat se
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
