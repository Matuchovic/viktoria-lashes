'use client'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { Navbar } from '@/components/layout/Navbar'
import { formatPrice } from '@/lib/utils'
import { TIER_INFO, REWARDS, LASH_PASS_CHALLENGES, getTier, TIER_THRESHOLDS } from '@/lib/loyalty'

const STATUS_CFG: Record<string, {label:string;color:string;bg:string;border:string}> = {
  PENDING:          {label:'Čeká',           color:'#D4AA70',bg:'rgba(212,170,112,0.12)',border:'rgba(212,170,112,0.4)'},
  CONFIRMED:        {label:'Potvrzeno',       color:'#4ade80',bg:'rgba(74,222,128,0.12)', border:'rgba(74,222,128,0.4)'},
  CANCELLED:        {label:'Zrušeno',         color:'#f87171',bg:'rgba(248,113,113,0.12)',border:'rgba(248,113,113,0.4)'},
  COMPLETED:        {label:'Dokončeno',       color:'#FF6BA8',bg:'rgba(255,107,168,0.12)',border:'rgba(255,107,168,0.4)'},
  NO_SHOW:          {label:'Nedostavil',      color:'#6b7280',bg:'rgba(107,114,128,0.12)',border:'rgba(107,114,128,0.3)'},
  CHANGE_REQUESTED: {label:'Žádost o změnu', color:'#fbbf24',bg:'rgba(251,191,36,0.12)', border:'rgba(251,191,36,0.4)'},
}

function BookingCard({booking,index}:{booking:any;index:number}) {
  const [exp,setExp] = useState(false)
  const [hov,setHov] = useState(false)
  const cfg = STATUS_CFG[booking.status] ?? STATUS_CFG.PENDING
  const date = new Date(booking.date)
  const isUpcoming = date >= new Date() && booking.status !== 'CANCELLED'

  return (
    <motion.div
      initial={{opacity:0,x:-20,scale:0.98}}
      animate={{opacity:1,x:0,scale:1}}
      transition={{delay:index*0.08,duration:0.5,ease:[0.16,1,0.3,1]}}
      onClick={()=>setExp(e=>!e)}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        background: hov||exp ? 'rgba(255,107,168,0.07)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hov||exp ? 'rgba(255,107,168,0.35)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius:16, padding:'20px 22px',
        cursor:'pointer', position:'relative', overflow:'hidden',
        boxShadow: hov ? '0 8px 40px rgba(255,107,168,0.12)' : 'none',
        transition:'all 0.3s ease',
      }}
    >
      {/* Left accent for upcoming */}
      {isUpcoming && (
        <div style={{position:'absolute',top:0,left:0,bottom:0,width:3,background:'linear-gradient(180deg,#FF6BA8,#D4AA70)',borderRadius:'16px 0 0 16px',boxShadow:'2px 0 12px rgba(255,107,168,0.4)'}}/>
      )}
      {/* Top glow line on hover */}
      <motion.div
        animate={{opacity: hov ? 1 : 0}}
        style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.6),rgba(212,170,112,0.3),transparent)'}}
      />

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          {/* Date badge */}
          <motion.div
            animate={{boxShadow: hov && isUpcoming ? '0 0 25px rgba(255,107,168,0.35)' : isUpcoming ? '0 0 15px rgba(255,107,168,0.2)' : 'none'}}
            style={{width:56,height:56,borderRadius:14,flexShrink:0,
              background:isUpcoming?'rgba(255,107,168,0.15)':'rgba(255,255,255,0.05)',
              border:`1px solid ${isUpcoming?'rgba(255,107,168,0.45)':'rgba(255,255,255,0.08)'}`,
              display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transition:'all 0.3s'}}>
            <div style={{fontFamily:'Georgia,serif',fontSize:22,fontWeight:300,color:isUpcoming?'#FF6BA8':'rgba(245,238,242,0.5)',lineHeight:1,textShadow:isUpcoming?'0 0 12px rgba(255,107,168,0.6)':'none'}}>
              {date.getDate()}
            </div>
            <div style={{fontFamily:'Georgia,serif',fontSize:9,letterSpacing:1,color:'rgba(245,238,242,0.3)',textTransform:'uppercase'}}>
              {['led','úno','bře','dub','kvě','čer','čvc','srp','zář','říj','lis','pro'][date.getMonth()]}
            </div>
          </motion.div>
          <div>
            <div style={{fontFamily:'Georgia,serif',fontSize:16,color:'rgba(245,238,242,0.9)',marginBottom:4,transition:'color 0.2s',textShadow:hov?'0 0 20px rgba(255,107,168,0.2)':'none'}}>
              {booking.service?.nameCs}
            </div>
            <div style={{fontFamily:'Georgia,serif',fontSize:12,color:'rgba(245,238,242,0.35)'}}>{booking.artist?.name} · {booking.time}</div>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
          <motion.div animate={{textShadow: hov ? '0 0 25px rgba(255,107,168,0.7)' : '0 0 15px rgba(255,107,168,0.4)'}}
            style={{fontFamily:'Georgia,serif',fontSize:22,fontWeight:300,color:'#FF6BA8'}}>
            {formatPrice(booking.totalKc)}
          </motion.div>
          <div style={{padding:'4px 12px',borderRadius:20,fontSize:10,fontFamily:'Georgia,serif',textTransform:'uppercase',
            background:cfg.bg,color:cfg.color,border:`1px solid ${cfg.border}`,letterSpacing:1,
            boxShadow:`0 0 12px ${cfg.bg}`}}>
            {cfg.label}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {/* Reschedule button */}
        {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && isUpcoming && (
          <div style={{marginTop:8}}>
            {rescheduling === booking.id ? (
              <div style={{background:'rgba(251,191,36,0.05)',border:'1px solid rgba(251,191,36,0.2)',borderRadius:12,padding:14}}>
                <div style={{fontFamily:'Georgia,serif',fontSize:9,letterSpacing:3,color:'rgba(251,191,36,0.6)',textTransform:'uppercase',marginBottom:10}}>Nový termín</div>
                <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:10}}>
                  <input type="date" value={rescheduleForm.date} onChange={e=>setRescheduleForm(f=>({...f,date:e.target.value}))}
                    style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(251,191,36,0.2)',borderRadius:8,padding:'8px 12px',color:'rgba(245,238,242,0.8)',fontFamily:'Georgia,serif',fontSize:12,outline:'none'}}/>
                  <input type="time" value={rescheduleForm.time} onChange={e=>setRescheduleForm(f=>({...f,time:e.target.value}))}
                    style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(251,191,36,0.2)',borderRadius:8,padding:'8px 12px',color:'rgba(245,238,242,0.8)',fontFamily:'Georgia,serif',fontSize:12,outline:'none'}}/>
                  <input placeholder="Důvod změny (nepovinné)" value={rescheduleForm.note} onChange={e=>setRescheduleForm(f=>({...f,note:e.target.value}))}
                    style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(251,191,36,0.2)',borderRadius:8,padding:'8px 12px',color:'rgba(245,238,242,0.8)',fontFamily:'Georgia,serif',fontSize:12,outline:'none'}}/>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button onClick={async()=>{
                    if(!rescheduleForm.date||!rescheduleForm.time)return
                    setRescheduleLoading(true)
                    const res = await fetch('/api/bookings/reschedule',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({bookingId:booking.id,newDate:rescheduleForm.date,newTime:rescheduleForm.time,note:rescheduleForm.note})})
                    if(res.ok){alert('Žádost o změnu odeslána! Viktória ji potvrdí.');setRescheduling(null)}
                    else alert('Chyba při odesílání')
                    setRescheduleLoading(false)
                  }} style={{flex:1,padding:'8px',borderRadius:8,background:'rgba(251,191,36,0.15)',border:'1px solid rgba(251,191,36,0.3)',color:'#fbbf24',fontFamily:'Georgia,serif',fontSize:11,cursor:'pointer'}}>
                    {rescheduleLoading?'Odesílám...':'Odeslat žádost'}
                  </button>
                  <button onClick={()=>setRescheduling(null)} style={{padding:'8px 12px',borderRadius:8,background:'none',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(245,238,242,0.3)',fontFamily:'Georgia,serif',fontSize:11,cursor:'pointer'}}>✗</button>
                </div>
              </div>
            ) : (
              <button onClick={()=>{setRescheduling(booking.id);setRescheduleForm({date:'',time:'',note:''})}}
                style={{width:'100%',padding:'8px',borderRadius:8,background:'rgba(251,191,36,0.06)',border:'1px solid rgba(251,191,36,0.2)',color:'#fbbf24',fontFamily:'Georgia,serif',fontSize:11,cursor:'pointer'}}>
                📅 Požádat o změnu termínu
              </button>
            )}
          </div>
        )}
        {booking.status === 'CHANGE_REQUESTED' && (
          <div style={{marginTop:8,padding:'10px 14px',borderRadius:10,background:'rgba(251,191,36,0.08)',border:'1px solid rgba(251,191,36,0.25)'}}>
            <div style={{fontFamily:'Georgia,serif',fontSize:11,color:'#fbbf24'}}>⏳ Žádost o změnu čeká na potvrzení od Viktórie</div>
            {booking.rescheduleDate && <div style={{fontFamily:'Georgia,serif',fontSize:10,color:'rgba(251,191,36,0.6)',marginTop:4}}>Požadovaný termín: {new Date(booking.rescheduleDate).toLocaleDateString('cs-CZ')} v {booking.rescheduleTime}</div>}
          </div>
        )}

        {exp && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
            transition={{duration:0.3,ease:[0.16,1,0.3,1]}} style={{overflow:'hidden'}}>
            <div style={{marginTop:16,paddingTop:16,borderTop:'1px solid rgba(255,255,255,0.07)'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                {[['Č. rezervace',`#${booking.bookingRef?.slice(-8).toUpperCase()}`],
                  ['Záloha',formatPrice(booking.depositKc)],
                  ['Telefon',booking.customerPhone],
                  ['E-mail',booking.customerEmail]].map(([l,v])=>(
                  <motion.div key={l} whileHover={{borderColor:'rgba(255,107,168,0.25)',background:'rgba(255,107,168,0.05)'}}
                    style={{background:'rgba(255,255,255,0.03)',borderRadius:10,padding:'12px 14px',border:'1px solid rgba(255,255,255,0.06)',transition:'all 0.2s'}}>
                    <div style={{fontFamily:'Georgia,serif',fontSize:9,letterSpacing:2,color:'rgba(245,238,242,0.25)',textTransform:'uppercase',marginBottom:5}}>{l}</div>
                    <div style={{fontFamily:'Georgia,serif',fontSize:13,color:'rgba(245,238,242,0.8)'}}>{v}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{position:'absolute',bottom:18,right:20,fontSize:10,color:'rgba(245,238,242,0.2)',transition:'transform 0.2s',transform:exp?'rotate(180deg)':'none'}}>▼</div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const {data:session,status} = useSession()
  const router = useRouter()
  const [bookings,setBookings] = useState<any[]>([])
  const [userData,setUserData] = useState<any>(null)
  const [rescheduling, setRescheduling] = useState<string | null>(null)
  const [rescheduleForm, setRescheduleForm] = useState({ date:'', time:'', note:'' })
  const [rescheduleLoading, setRescheduleLoading] = useState(false)
  const [loading,setLoading] = useState(true)
  const [tab,setTab] = useState<'upcoming'|'history'|'loyalty'>('upcoming')

  useEffect(()=>{ if(status==='unauthenticated') router.push('/login') },[status,router])

  useEffect(()=>{
    if(status!=='authenticated') return
    Promise.all([
      fetch(`/api/bookings?email=${session?.user?.email}`).then(r=>r.json()),
      fetch('/api/user/me').then(r=>r.json()).catch(()=>null),
    ]).then(([bData,uData])=>{
      setBookings(Array.isArray(bData)?bData:[])
      setUserData(uData)
      setLoading(false)
    }).catch(()=>setLoading(false))
  },[status,session])

  if(status==='loading'||loading) return (
    <div style={{minHeight:'100vh',background:'#080608',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <motion.div animate={{opacity:[0.3,1,0.3]}} transition={{duration:2,repeat:Infinity}}
        style={{fontFamily:'Georgia,serif',fontSize:11,letterSpacing:4,color:'#FF6BA8',textTransform:'uppercase'}}>Načítám...</motion.div>
    </div>
  )

  const upcoming = bookings.filter(b=>new Date(b.date)>=new Date()&&b.status!=='CANCELLED')
  const history  = bookings.filter(b=>new Date(b.date)<new Date()||b.status==='COMPLETED'||b.status==='CANCELLED')
  const firstName = session?.user?.name?.split(' ')[0]??'Vítejte'
  const points = userData?.loyaltyPoints ?? 0
  const tier = getTier(points)
  const tierInfo = TIER_INFO[tier as keyof typeof TIER_INFO]
  const tierKeys = ['BEGINNER','LOVER','QUEEN','ELITE']
  const nextTier = tierKeys[tierKeys.indexOf(tier)+1]
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier as keyof typeof TIER_THRESHOLDS] : null
  const currentMin = TIER_THRESHOLDS[tier as keyof typeof TIER_THRESHOLDS]
  const progress = nextThreshold ? Math.min(((points-currentMin)/(nextThreshold-currentMin))*100,100) : 100

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main style={{minHeight:'100vh',background:'#080608',paddingTop:100,paddingBottom:60}}>
        <div style={{position:'fixed',inset:0,pointerEvents:'none',background:'radial-gradient(ellipse 60% 50% at 50% 20%,rgba(196,105,138,0.08) 0%,transparent 70%)'}}/>
        <div style={{maxWidth:900,margin:'0 auto',padding:'0 24px',position:'relative'}}>

          {/* Header */}
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}}
            style={{marginBottom:36,display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
            <div>
              <motion.div animate={{opacity:[0.6,1,0.6]}} transition={{duration:3,repeat:Infinity}}
                style={{fontFamily:'Georgia,serif',fontSize:10,letterSpacing:5,color:'#FF6BA8',textTransform:'uppercase',marginBottom:8,textShadow:'0 0 15px rgba(255,107,168,0.6)'}}>
                ✦ Zákaznický portál
              </motion.div>
              <h1 style={{fontFamily:'Georgia,serif',fontWeight:300,fontSize:'clamp(32px,6vw,56px)',lineHeight:1.1,margin:0}}>
                Dobrý den,{' '}
                <span style={{background:'linear-gradient(135deg,#E8A4BE,#FF6BA8)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',filter:'drop-shadow(0 0 20px rgba(255,107,168,0.4))'}}>
                  {firstName}
                </span>
              </h1>
            </div>
            <motion.button whileHover={{borderColor:'rgba(255,107,168,0.4)',color:'rgba(245,238,242,0.7)'}} whileTap={{scale:0.97}}
              onClick={()=>signOut({callbackUrl:'/'})}
              style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'10px 20px',color:'rgba(245,238,242,0.4)',fontFamily:'Georgia,serif',fontSize:11,letterSpacing:2,cursor:'pointer',textTransform:'uppercase',transition:'all 0.2s'}}>
              Odhlásit
            </motion.button>
          </motion.div>

          {/* Stats grid */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:28}}>
            {[
              {label:'Nadcházející',value:upcoming.length,color:'#FF6BA8',icon:'📅',delay:0.1},
              {label:'Dokončeno',value:history.filter(b=>b.status==='COMPLETED').length,color:'#D4AA70',icon:'✦',delay:0.2},
              {label:'Lash Body',value:points.toLocaleString('cs-CZ'),color:tierInfo.color,icon:tierInfo.icon,delay:0.3},
            ].map(s=>(
              <motion.div key={s.label}
                initial={{opacity:0,y:20,scale:0.95}} animate={{opacity:1,y:0,scale:1}}
                transition={{delay:s.delay,duration:0.6,ease:[0.16,1,0.3,1]}}
                whileHover={{y:-3,boxShadow:`0 16px 50px ${s.color}20`}}
                style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${s.color}20`,borderRadius:18,padding:'24px 22px',position:'relative',overflow:'hidden',transition:'all 0.3s',cursor:'none'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${s.color}70,transparent)`}}/>
                <div style={{position:'absolute',top:14,right:16,fontSize:28,opacity:0.1}}>{s.icon}</div>
                <div style={{fontFamily:'Georgia,serif',fontSize:42,fontWeight:300,color:s.color,lineHeight:1,marginBottom:6,textShadow:`0 0 25px ${s.color}80`}}>{s.value}</div>
                <div style={{fontFamily:'Georgia,serif',fontSize:11,letterSpacing:3,color:'rgba(245,238,242,0.3)',textTransform:'uppercase'}}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* New booking CTA */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4}} style={{marginBottom:28}}>
            <Link href="/rezervace">
              <motion.div whileHover={{scale:1.02,boxShadow:'0 20px 60px rgba(255,107,168,0.5)'}} whileTap={{scale:0.98}}
                style={{display:'inline-flex',alignItems:'center',gap:8,background:'linear-gradient(135deg,#C4698A,#FF6BA8)',color:'white',fontFamily:'Georgia,serif',fontSize:11,letterSpacing:3,textTransform:'uppercase',padding:'14px 28px',borderRadius:12,boxShadow:'0 0 40px rgba(255,107,168,0.35)',position:'relative',overflow:'hidden',cursor:'none'}}>
                <motion.div animate={{x:['-100%','200%']}} transition={{duration:2,repeat:Infinity,repeatDelay:3,ease:'easeInOut'}}
                  style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)',width:'40%'}}/>
                + Nová rezervace →
              </motion.div>
            </Link>
          </motion.div>

          {/* Tabs */}
          <div style={{display:'flex',gap:0,marginBottom:22,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
            {[
              {id:'upcoming',label:'Nadcházející',count:upcoming.length},
              {id:'history', label:'Historie',    count:history.length},
              {id:'loyalty', label:`${tierInfo.icon} Moje body`,count:null},
            ].map(t=>(
              <motion.button key={t.id} onClick={()=>setTab(t.id as any)}
                whileHover={{color:tab===t.id?'#FF6BA8':'rgba(245,238,242,0.6)'}}
                style={{padding:'12px 22px',background:'none',border:'none',fontFamily:'Georgia,serif',fontSize:11,letterSpacing:2,textTransform:'uppercase',
                  color:tab===t.id?'#FF6BA8':'rgba(245,238,242,0.3)',
                  borderBottom:tab===t.id?'2px solid #FF6BA8':'2px solid transparent',
                  marginBottom:-1,textShadow:tab===t.id?'0 0 15px rgba(255,107,168,0.6)':'none',transition:'all 0.2s',cursor:'pointer'}}>
                {t.label}
                {t.count!=null&&t.count>0&&(
                  <span style={{marginLeft:8,background:'rgba(255,107,168,0.2)',color:'#FF6BA8',padding:'2px 7px',borderRadius:20,fontSize:9}}>{t.count}</span>
                )}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* UPCOMING */}
            {tab==='upcoming'&&(
              <motion.div key="up" initial={{opacity:0,x:15}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-15}} transition={{duration:0.3}}>
                {upcoming.length===0?(
                  <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                    style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,107,168,0.1)',borderRadius:18,padding:'52px 24px',textAlign:'center',position:'relative',overflow:'hidden'}}>
                    <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.3),transparent)'}}/>
                    <div style={{fontFamily:'Georgia,serif',fontSize:38,marginBottom:14,opacity:0.15}}>✦</div>
                    <div style={{fontFamily:'Georgia,serif',fontSize:15,color:'rgba(245,238,242,0.4)',marginBottom:22}}>Žádné nadcházející rezervace</div>
                    <Link href="/rezervace" style={{fontFamily:'Georgia,serif',fontSize:10,letterSpacing:3,color:'#FF6BA8',textDecoration:'none',textTransform:'uppercase',borderBottom:'1px solid rgba(255,107,168,0.4)',paddingBottom:2}}>
                      Rezervovat termín →
                    </Link>
                  </motion.div>
                ):(
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    {upcoming.map((b,i)=><BookingCard key={b.id} booking={b} index={i}/>)}
                  </div>
                )}
              </motion.div>
            )}

            {/* HISTORY */}
            {tab==='history'&&(
              <motion.div key="hi" initial={{opacity:0,x:15}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-15}} transition={{duration:0.3}}>
                {history.length===0?(
                  <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:'48px',textAlign:'center'}}>
                    <div style={{fontFamily:'Georgia,serif',fontSize:14,color:'rgba(245,238,242,0.3)'}}>Žádná historie</div>
                  </div>
                ):(
                  <div style={{display:'flex',flexDirection:'column',gap:10,opacity:0.8}}>
                    {history.map((b,i)=><BookingCard key={b.id} booking={b} index={i}/>)}
                  </div>
                )}
              </motion.div>
            )}

            {/* LOYALTY */}
            {tab==='loyalty'&&(
              <motion.div key="lo" initial={{opacity:0,x:15}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-15}} transition={{duration:0.3}}
                style={{display:'flex',flexDirection:'column',gap:14}}>

                {/* Tier card */}
                <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.05}}
                  style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${tierInfo.color}20`,borderRadius:18,padding:'28px',position:'relative',overflow:'hidden',boxShadow:`0 0 40px ${tierInfo.color}10`}}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${tierInfo.color},#D4AA70,transparent)`}}/>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:22}}>
                    <div>
                      <div style={{fontFamily:'Georgia,serif',fontSize:9,letterSpacing:4,color:'#FF6BA8',textTransform:'uppercase',marginBottom:10,textShadow:'0 0 10px rgba(255,107,168,0.5)'}}>Vaše úroveň</div>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <motion.span animate={{scale:[1,1.1,1]}} transition={{duration:2,repeat:Infinity,ease:'easeInOut'}} style={{fontSize:32}}>{tierInfo.icon}</motion.span>
                        <div style={{fontFamily:'Georgia,serif',fontSize:24,fontWeight:300,color:'rgba(245,238,242,0.9)',textShadow:`0 0 20px ${tierInfo.color}50`}}>{tierInfo.label}</div>
                      </div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <motion.div animate={{textShadow:[`0 0 20px ${tierInfo.color}`,`0 0 40px ${tierInfo.color}`,`0 0 20px ${tierInfo.color}`]}} transition={{duration:2,repeat:Infinity}}
                        style={{fontFamily:'Georgia,serif',fontSize:44,fontWeight:300,color:tierInfo.color,lineHeight:1}}>
                        {points.toLocaleString('cs-CZ')}
                      </motion.div>
                      <div style={{fontFamily:'Georgia,serif',fontSize:10,letterSpacing:3,color:'rgba(245,238,242,0.3)',textTransform:'uppercase',marginTop:4}}>Lash Body</div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={{height:10,background:'rgba(255,255,255,0.06)',borderRadius:10,marginBottom:10,position:'relative',overflow:'hidden'}}>
                    <motion.div initial={{width:0}} animate={{width:`${progress}%`}} transition={{duration:1.2,ease:[0.16,1,0.3,1],delay:0.3}}
                      style={{height:'100%',borderRadius:10,background:`linear-gradient(90deg,#C4698A,${tierInfo.color})`,boxShadow:`0 0 15px ${tierInfo.color}80`,position:'relative'}}>
                      <motion.div animate={{x:['-100%','200%']}} transition={{duration:1.5,repeat:Infinity,repeatDelay:2,ease:'easeInOut'}}
                        style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)',width:'40%'}}/>
                    </motion.div>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',fontFamily:'Georgia,serif',fontSize:10,color:'rgba(245,238,242,0.25)',marginBottom: nextTier ? 14 : 0}}>
                    <span>0</span>
                    {['LOVER','QUEEN','ELITE'].map(k=>(
                      <span key={k}>{TIER_THRESHOLDS[k as keyof typeof TIER_THRESHOLDS].toLocaleString('cs-CZ')} {TIER_INFO[k as keyof typeof TIER_INFO].icon}</span>
                    ))}
                  </div>
                  {nextTier && nextThreshold && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8}}
                      style={{padding:'10px 16px',background:`rgba(${tierInfo.color === '#D4AA70' ? '212,170,112' : '255,107,168'},0.08)`,borderRadius:10,fontFamily:'Georgia,serif',fontSize:12,color:'rgba(245,238,242,0.5)',border:`1px solid ${tierInfo.color}20`}}>
                      Do {TIER_INFO[nextTier as keyof typeof TIER_INFO].label} chybí{' '}
                      <span style={{color:tierInfo.color,fontWeight:500,textShadow:`0 0 10px ${tierInfo.color}`}}>
                        {(nextThreshold-points).toLocaleString('cs-CZ')} bodů
                      </span>
                    </motion.div>
                  )}
                </motion.div>

                {/* Rewards */}
                <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
                  style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,107,168,0.1)',borderRadius:18,padding:'24px',position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.5),rgba(212,170,112,0.3),transparent)'}}/>
                  <div style={{fontFamily:'Georgia,serif',fontSize:9,letterSpacing:4,color:'#FF6BA8',textTransform:'uppercase',marginBottom:18,textShadow:'0 0 10px rgba(255,107,168,0.5)'}}>Dostupné odměny</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10}}>
                    {REWARDS.map((r,i)=>{
                      const canUse = points >= r.points
                      return (
                        <motion.div key={r.id}
                          initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:0.15+i*0.06}}
                          whileHover={canUse?{y:-4,boxShadow:'0 12px 35px rgba(255,107,168,0.2)',borderColor:'rgba(255,107,168,0.5)'}:{}}
                          style={{background:canUse?'rgba(255,107,168,0.08)':'rgba(255,255,255,0.03)',
                            border:`1px solid ${canUse?'rgba(255,107,168,0.3)':'rgba(255,255,255,0.06)'}`,
                            borderRadius:14,padding:'14px 10px',textAlign:'center',
                            opacity:canUse?1:0.45,transition:'all 0.25s',position:'relative',overflow:'hidden',cursor:'none'}}>
                          {canUse && <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.5),transparent)'}}/>}
                          <div style={{fontFamily:'Georgia,serif',fontSize:9,letterSpacing:1,color:canUse?'#FF6BA8':'rgba(245,238,242,0.25)',textTransform:'uppercase',marginBottom:8}}>{r.points.toLocaleString('cs-CZ')} Lb</div>
                          <div style={{fontSize:22,marginBottom:7}}>🎁</div>
                          <div style={{fontFamily:'Georgia,serif',fontSize:11,color:canUse?'rgba(245,238,242,0.85)':'rgba(245,238,242,0.35)',lineHeight:1.4}}>{r.label}</div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>

                {/* Lash Pass */}
                <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
                  style={{background:'#0d0508',border:'1px solid #7a4060',borderRadius:20,overflow:'hidden',position:'relative'}}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,#FF6BA8,#D4AA70,#FF6BA8,transparent)'}}/>
                  <div style={{padding:'22px 26px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <div>
                      <div style={{fontFamily:'Georgia,serif',fontSize:9,letterSpacing:4,color:'#D4AA70',textTransform:'uppercase',marginBottom:5}}>✦ Aktivní sezóna</div>
                      <div style={{fontFamily:'Georgia,serif',fontSize:20,fontWeight:300,color:'white'}}>Jarní Lash Pass</div>
                    </div>
                    <div style={{background:'rgba(212,170,112,0.1)',border:'1px solid rgba(212,170,112,0.3)',color:'#D4AA70',fontSize:9,letterSpacing:2,textTransform:'uppercase',padding:'7px 16px',borderRadius:20}}>Jaro 2026</div>
                  </div>
                  <div style={{padding:'22px 26px'}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:18}}>
                      {LASH_PASS_CHALLENGES.map((c,i)=>(
                        <motion.div key={c.id}
                          initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.2+i*0.06}}
                          whileHover={{background:'rgba(196,105,138,0.12)',borderColor:'rgba(196,105,138,0.35)'}}
                          style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:'13px 15px',display:'flex',alignItems:'center',gap:12,cursor:'none',transition:'all 0.2s'}}>
                          <div style={{width:28,height:28,borderRadius:'50%',border:'1.5px solid rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'#C4698A',flexShrink:0}}>✓</div>
                          <div>
                            <div style={{fontFamily:'Georgia,serif',fontSize:12,color:'rgba(245,235,240,0.85)'}}>{c.label}</div>
                            <div style={{fontFamily:'Georgia,serif',fontSize:10,color:'#D4AA70',marginTop:3,fontWeight:500}}>+{c.points} Lb</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div whileHover={{boxShadow:'0 0 30px rgba(212,170,112,0.15)'}}
                      style={{background:'rgba(212,170,112,0.07)',border:'1px solid rgba(212,170,112,0.22)',borderRadius:14,padding:'18px 20px',display:'flex',alignItems:'center',gap:16,transition:'all 0.3s',cursor:'none'}}>
                      <motion.span animate={{rotate:[0,5,-5,0]}} transition={{duration:2,repeat:Infinity,repeatDelay:3}} style={{fontSize:28,flexShrink:0}}>🏆</motion.span>
                      <div>
                        <div style={{fontFamily:'Georgia,serif',fontSize:9,letterSpacing:3,color:'#D4AA70',textTransform:'uppercase',marginBottom:5}}>Sezónní odměna</div>
                        <div style={{fontFamily:'Georgia,serif',fontSize:15,color:'white',fontWeight:300}}>Exkluzivní sleva 25 % + dáreček od Viktórie</div>
                        <div style={{fontFamily:'Georgia,serif',fontSize:11,color:'rgba(255,255,255,0.35)',marginTop:3}}>Splňte všechny výzvy do 30. 6. 2026</div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Link to full page */}
                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}} style={{textAlign:'center',paddingTop:4}}>
                  <Link href="/vernostni-program" style={{fontFamily:'Georgia,serif',fontSize:10,letterSpacing:3,color:'rgba(245,238,242,0.3)',textDecoration:'none',textTransform:'uppercase',transition:'color 0.2s'}}>
                    Zobrazit celý věrnostní program →
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  )
}
