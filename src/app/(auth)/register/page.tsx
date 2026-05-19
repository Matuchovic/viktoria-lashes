'use client'
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/ui/Toaster'
import { CustomCursor } from '@/components/ui/CustomCursor'

interface Particle { id:number; x:number; y:number; size:number; color:string; delay:number; dur:number }

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirm:'' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(Array.from({length:35},(_,i)=>({
      id:i, x:Math.random()*100, y:Math.random()*100,
      size:1+Math.random()*2.5,
      color: i%3===0?'#D4AA70':i%3===1?'#FF6BA8':'#E8A4BE',
      delay:-Math.random()*8, dur:4+Math.random()*6,
    })))
  },[])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast('Hesla se neshodují.','error'); return }
    if (form.password.length < 8) { toast('Heslo musí mít alespoň 8 znaků.','error'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ name:form.name, email:form.email, phone:form.phone, password:form.password }),
      })
      if (res.ok) {
        await signIn('credentials', { email:form.email, password:form.password, redirect:false })
        setSuccess(true)
        setTimeout(() => router.push('/dashboard'), 3500)
      } else {
        const d = await res.json(); toast(d.error ?? 'Registrace selhala.', 'error')
      }
    } finally { setLoading(false) }
  }

  return (
    <>
      <CustomCursor />
      <div className="min-h-screen relative flex items-center justify-center px-8 py-16 overflow-hidden"
        style={{background:'radial-gradient(ellipse 80% 80% at 50% 50%,rgba(196,105,138,0.12) 0%,transparent 70%),#080608'}}>

        <div className="absolute inset-0 hero-grid-bg opacity-50"/>

        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map(p=>(
            <motion.div key={p.id} className="absolute rounded-full"
              style={{width:p.size,height:p.size,left:`${p.x}%`,bottom:'-10px',background:p.color,boxShadow:`0 0 ${p.size*4}px ${p.color}`}}
              animate={{y:['0px','-110vh'],opacity:[0,0.8,0.4,0]}}
              transition={{duration:p.dur,delay:p.delay,repeat:Infinity,ease:'linear'}}
            />
          ))}
        </div>

        {/* Orbit */}
        <motion.div animate={{rotate:360}} transition={{duration:20,repeat:Infinity,ease:'linear'}}
          className="absolute rounded-full border border-pink-glow opacity-15 pointer-events-none"
          style={{width:650,height:650,left:'50%',top:'50%',marginLeft:-325,marginTop:-325}}/>
        <motion.div animate={{rotate:-360}} transition={{duration:28,repeat:Infinity,ease:'linear'}}
          className="absolute rounded-full pointer-events-none opacity-10"
          style={{width:900,height:900,left:'50%',top:'50%',marginLeft:-450,marginTop:-450,border:'1px dashed rgba(212,170,112,0.3)'}}/>

        {/* Success screen */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{opacity:0,scale:0.9}}
              animate={{opacity:1,scale:1}}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center"
              style={{background:'rgba(8,6,8,0.97)'}}
            >
              <div className="absolute inset-0 pointer-events-none"
                style={{background:'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(196,105,138,0.18) 0%,transparent 70%)'}}/>

              {/* Lash burst */}
              <svg width="300" height="200" viewBox="0 0 300 200" className="mb-8">
                <defs>
                  <filter id="suc-glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                {Array.from({length:16},(_,i)=>{
                  const angle=-42+i*5.6; const rad=angle*Math.PI/180; const len=55+i*3.5
                  const bx=150; const by=185
                  const ex=bx+Math.sin(rad)*len; const ey=by-len*Math.cos(rad)
                  return (
                    <motion.path key={i}
                      d={`M ${bx} ${by} C ${bx+Math.sin(rad)*len*0.25} ${by-len*0.35} ${bx+Math.sin(rad)*len*0.6} ${by-len*0.7} ${ex} ${ey}`}
                      stroke={i%3===0?'#D4AA70':i%3===1?'#FF6BA8':'#E8A4BE'}
                      strokeWidth={1.3} strokeLinecap="round" fill="none"
                      filter="url(#suc-glow)"
                      initial={{pathLength:0,opacity:0}}
                      animate={{pathLength:1,opacity:[0,1,0.9]}}
                      transition={{duration:1,delay:i*0.05,ease:[0.16,1,0.3,1]}}
                    />
                  )
                })}
                {/* Sparkles */}
                {[{x:100,y:70},{x:150,y:30},{x:200,y:65},{x:125,y:120},{x:175,y:115}].map((s,i)=>(
                  <motion.circle key={`s-${i}`} cx={s.x} cy={s.y} r={2}
                    fill={i%2===0?'#FF6BA8':'#D4AA70'}
                    style={{filter:`drop-shadow(0 0 8px ${i%2===0?'#FF6BA8':'#D4AA70'})`}}
                    animate={{opacity:[0,1,0],scale:[0,2.5,0]}}
                    transition={{duration:1.2,delay:0.6+i*0.15,repeat:2}}
                  />
                ))}
              </svg>

              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.8,duration:0.8}}
                className="text-center px-8">
                <div className="font-serif font-light tracking-[8px] uppercase mb-4"
                  style={{fontSize:'clamp(22px,4vw,36px)',
                    background:'linear-gradient(90deg,#E8A4BE,#FF6BA8,#D4AA70,#FF6BA8,#E8A4BE)',
                    backgroundSize:'300% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                    backgroundClip:'text',animation:'shimmer 3s linear infinite',
                    filter:'drop-shadow(0 0 25px rgba(255,107,168,0.6))',display:'inline-block'}}>
                  Registrace úspěšná!
                </div>
                <div className="font-serif text-2xl font-light mb-3 text-text-muted">
                  Vítejte v Viktória Lashes
                </div>
                <div className="font-sans font-light leading-relaxed text-text-muted mb-2" style={{fontSize:14}}>
                  Děkujeme za registraci. Těšíme se na Vás!
                </div>
                <div className="font-serif text-lg font-light" style={{color:'rgba(245,238,242,0.5)'}}>
                  PS: Viktória ❤️
                </div>
              </motion.div>

              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.5}}
                className="mt-10 font-sans font-light tracking-[3px]"
                style={{fontSize:10,color:'rgba(245,238,242,0.2)'}}>
                Přesměrovávám na dashboard...
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form card */}
        <motion.div initial={{opacity:0,y:30,scale:0.95}} animate={{opacity:1,y:0,scale:1}}
          transition={{duration:0.9,ease:[0.16,1,0.3,1]}}
          className="relative w-full max-w-md z-10">

          <div className="absolute inset-0 -m-6 rounded-full opacity-15 pointer-events-none"
            style={{background:'radial-gradient(ellipse,rgba(255,107,168,0.4) 0%,transparent 70%)',filter:'blur(30px)'}}/>

          <div className="relative overflow-hidden"
            style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',backdropFilter:'blur(20px)'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,#D4AA70,#FF6BA8,transparent)'}}/>

            <div className="p-10">
              <Link href="/" className="block text-center mb-10">
                <motion.div
                  animate={{textShadow:['0 0 20px rgba(255,107,168,0.4)','0 0 50px rgba(255,107,168,0.8)','0 0 20px rgba(255,107,168,0.4)']}}
                  transition={{duration:2,repeat:Infinity}}
                  className="font-serif text-2xl font-light tracking-[6px] uppercase">
                  Viktória <span style={{color:'#FF6BA8',textShadow:'0 0 30px rgba(255,107,168,0.8)'}}>Lashes</span>
                </motion.div>
                <div className="font-sans font-light tracking-[4px] uppercase mt-1" style={{fontSize:9,color:'rgba(245,238,242,0.25)'}}>
                  Luxury Beauty Experience
                </div>
              </Link>

              <h1 className="font-serif text-3xl font-light mb-2">Registrace</h1>
              <p className="text-text-muted font-light text-sm mb-8">Vytvořte si zákaznický účet</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  {key:'name',    label:'Jméno a příjmení', type:'text',     ph:'Jana Nováková'},
                  {key:'email',   label:'E-mailová adresa',  type:'email',    ph:'jana@email.cz'},
                  {key:'phone',   label:'Telefonní číslo',   type:'tel',      ph:'+420 000 000 000'},
                  {key:'password',label:'Heslo',             type:'password', ph:'••••••••'},
                  {key:'confirm', label:'Potvrdit heslo',    type:'password', ph:'••••••••'},
                ].map(f=>(
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
                  {loading ? 'Registruji...' : 'Vytvořit účet →'}
                  {!loading && <motion.div className="absolute inset-0 pointer-events-none"
                    animate={{x:['-100%','200%']}} transition={{duration:1.5,repeat:Infinity,repeatDelay:2,ease:'easeInOut'}}
                    style={{background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)',width:'40%'}}/>}
                </motion.button>
              </form>

              <p className="text-center font-light text-sm mt-8" style={{color:'rgba(245,238,242,0.35)'}}>
                Máte účet?{' '}
                <Link href="/login" className="cursor-none" style={{color:'#E8A4BE',textShadow:'0 0 10px rgba(232,164,190,0.4)'}}>
                  Přihlásit se
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
