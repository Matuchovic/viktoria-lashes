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

const STATUS_CFG: Record<string, {label:string;color:string;bg:string;glow:string}> = {
  PENDING:   {label:'Čeká',      color:'#D4AA70',bg:'rgba(212,170,112,0.1)',glow:'rgba(212,170,112,0.3)'},
  CONFIRMED: {label:'Potvrzeno', color:'#4ade80',bg:'rgba(74,222,128,0.1)', glow:'rgba(74,222,128,0.3)'},
  CANCELLED: {label:'Zrušeno',   color:'#f87171',bg:'rgba(248,113,113,0.1)',glow:'rgba(248,113,113,0.3)'},
  COMPLETED: {label:'Dokončeno', color:'#FF6BA8',bg:'rgba(255,107,168,0.1)',glow:'rgba(255,107,168,0.3)'},
  NO_SHOW:   {label:'Nedostavil',color:'#6b7280',bg:'rgba(107,114,128,0.1)',glow:'rgba(107,114,128,0.2)'},
}

function GCard({children,style}:any) {
  return (
    <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,107,168,0.12)',borderRadius:16,position:'relative',overflow:'hidden',...style}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.4),rgba(212,170,112,0.2),transparent)'}}/>
      {children}
    </div>
  )
}

function BookingCard({booking,index}:{booking:any;index:number}) {
  const [exp,setExp] = useState(false)
  const cfg = STATUS_CFG[booking.status] ?? STATUS_CFG.PENDING
  const date = new Date(booking.date)
  const isUpcoming = date >= new Date() && booking.status !== 'CANCELLED'
  return (
    <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:index*0.08}}
      onClick={()=>setExp(e=>!e)} style={{background:exp?'rgba(255,107,168,0.05)':'rgba(255,255,255,0.03)',border:`1px solid ${exp?'rgba(255,107,168,0.3)':'rgba(255,255,255,0.07)'}`,borderRadius:14,padding:'18px 20px',cursor:'pointer',transition:'all 0.3s',position:'relative',overflow:'hidden'}}>
      {isUpcoming && <div style={{position:'absolute',top:0,left:0,bottom:0,width:3,background:'linear-gradient(180deg,#FF6BA8,#D4AA70)',borderRadius:'14px 0 0 14px'}}/>}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{width:52,height:52,borderRadius:12,flexShrink:0,background:isUpcoming?'rgba(255,107,168,0.15)':'rgba(255,255,255,0.05)',border:`1px solid ${isUpcoming?'rgba(255,107,168,0.4)':'rgba(255,255,255,0.08)'}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:isUpcoming?'0 0 15px rgba(255,107,168,0.2)':'none'}}>
            <div style={{fontFamily:'Georgia,serif',fontSize:20,fontWeight:300,color:isUpcoming?'#FF6BA8':'rgba(245,238,242,0.5)',lineHeight:1}}>{date.getDate()}</div>
            <div style={{fontFamily:'Georgia,serif',fontSize:9,letterSpacing:1,color:'rgba(245,238,242,0.3)',textTransform:'uppercase'}}>
              {['led','úno','bře','dub','kvě','čer','čvc','srp','zář','říj','lis','pro'][date.getMonth()]}
            </div>
          </div>
          <div>
            <div style={{fontFamily:'Georgia,serif',fontSize:15,color:'rgba(245,238,242,0.9)',marginBottom:3}}>{booking.service?.nameCs}</div>
            <div style={{fontFamily:'Georgia,serif',fontSize:11,color:'rgba(245,238,242,0.35)'}}>{booking.artist?.name} · {booking.time}</div>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
          <div style={{fontFamily:'Georgia,serif',fontSize:20,fontWeight:300,color:'#FF6BA8',textShadow:'0 0 15px rgba(255,107,168,0.5)'}}>{formatPrice(booking.totalKc)}</div>
          <div style={{padding:'3px 10px',borderRadius:20,fontSize:10,fontFamily:'Georgia,serif',textTransform:'uppercase',background:cfg.bg,color:cfg.color,border:`1px solid ${cfg.color}40`,boxShadow:`0 0 10px ${cfg.glow}`,letterSpacing:1}}>{cfg.label}</div>
        </div>
      </div>
      <AnimatePresence>
        {exp && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} style={{overflow:'hidden'}}>
            <div style={{marginTop:16,paddingTop:16,borderTop:'1px solid rgba(255,255,255,0.06)'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                {[['Č. rezervace',`#${booking.bookingRef?.slice(-8).toUpperCase()}`],['Záloha',formatPrice(booking.depositKc)],['Telefon',booking.customerPhone],['E-mail',booking.customerEmail]].map(([l,v])=>(
                  <div key={l} style={{background:'rgba(255,255,255,0.03)',borderRadius:10,padding:'10px 14px',border:'1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{fontFamily:'Georgia,serif',fontSize:9,letterSpacing:2,color:'rgba(245,238,242,0.25)',textTransform:'uppercase',marginBottom:4}}>{l}</div>
                    <div style={{fontFamily:'Georgia,serif',fontSize:13,color:'rgba(245,238,242,0.8)'}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function DashboardPage() {
  const {data:session,status} = useSession()
  const router = useRouter()
  const [bookings,setBookings] = useState<any[]>([])
  const [userData,setUserData] = useState<any>(null)
  const [loading,setLoading] = useState(true)
  const [tab,setTab] = useState<'upcoming'|'history'|'loyalty'>('upcoming')

  useEffect(()=>{
    if (status==='unauthenticated') router.push('/login')
  },[status,router])

  useEffect(()=>{
    if (status!=='authenticated') return
    Promise.all([
      fetch(`/api/bookings?email=${session?.user?.email}`).then(r=>r.json()),
      fetch('/api/user/me').then(r=>r.json()).catch(()=>null),
    ]).then(([bData,uData])=>{
      setBookings(Array.isArray(bData)?bData:[])
      setUserData(uData)
      setLoading(false)
    }).catch(()=>setLoading(false))
  },[status,session])

  if (status==='loading'||loading) {
    return (
      <div style={{minHeight:'100vh',background:'#080608',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <motion.div animate={{opacity:[0.3,1,0.3]}} transition={{duration:2,repeat:Infinity}}
          style={{fontFamily:'Georgia,serif',fontSize:11,letterSpacing:4,color:'#FF6BA8',textTransform:'uppercase'}}>Načítám...</motion.div>
      </div>
    )
  }

  const upcoming = bookings.filter(b=>new Date(b.date)>=new Date()&&b.status!=='CANCELLED')
  const history  = bookings.filter(b=>new Date(b.date)<new Date()||b.status==='COMPLETED'||b.status==='CANCELLED')
  const firstName = session?.user?.name?.split(' ')[0]??'Vítejte'
  const points = userData?.loyaltyPoints ?? 0
  const tier = getTier(points)
  const tierInfo = TIER_INFO[tier as keyof typeof TIER_INFO]
  const tierKeys = ['BEGINNER','LOVER','QUEEN','ELITE']
  const nextTier = tierKeys[tierKeys.indexOf(tier)+1]
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier as keyof typeof TIER_THRESHOLDS] : null
  const progress = nextThreshold ? Math.min((points / nextThreshold)*100, 100) : 100

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main style={{minHeight:'100vh',background:'#080608',paddingTop:100,paddingBottom:60}}>
        <div style={{position:'fixed',inset:0,pointerEvents:'none',background:'radial-gradient(ellipse 60% 50% at 50% 20%,rgba(196,105,138,0.08) 0%,transparent 70%)'}}/>
        <div style={{maxWidth:900,margin:'0 auto',padding:'0 24px',position:'relative'}}>

          {/* Header */}
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}}
            style={{marginBottom:32,display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
            <div>
              <div style={{fontFamily:'Georgia,serif',fontSize:10,letterSpacing:5,color:'#FF6BA8',textTransform:'uppercase',marginBottom:8,textShadow:'0 0 15px rgba(255,107,168,0.6)'}}>✦ Zákaznický portál</div>
              <h1 style={{fontFamily:'Georgia,serif',fontWeight:300,fontSize:'clamp(32px,6vw,56px)',lineHeight:1.1,margin:0}}>
                Dobrý den, <span style={{background:'linear-gradient(135deg,#E8A4BE,#FF6BA8)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',filter:'drop-shadow(0 0 20px rgba(255,107,168,0.4))'}}>{firstName}</span>
              </h1>
            </div>
            <button onClick={()=>signOut({callbackUrl:'/'})} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'10px 20px',color:'rgba(245,238,242,0.4)',fontFamily:'Georgia,serif',fontSize:11,letterSpacing:2,cursor:'pointer',textTransform:'uppercase'}}>Odhlásit</button>
          </motion.div>

          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:24}}>
            {[
              {label:'Nadcházející',value:upcoming.length,color:'#FF6BA8',icon:'📅',delay:0.1},
              {label:'Dokončeno',value:history.filter(b=>b.status==='COMPLETED').length,color:'#D4AA70',icon:'✦',delay:0.2},
              {label:'Lash Body',value:points.toLocaleString('cs-CZ'),color:'#E8A4BE',icon:tierInfo.icon,delay:0.3},
            ].map(s=>(
              <motion.div key={s.label} initial={{opacity:0,y:20,scale:0.96}} animate={{opacity:1,y:0,scale:1}} transition={{delay:s.delay,duration:0.6,ease:[0.16,1,0.3,1]}}
                style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${s.color}25`,borderRadius:16,padding:'24px 20px',position:'relative',overflow:'hidden',boxShadow:`0 0 30px ${s.color}12`}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${s.color}60,transparent)`}}/>
                <div style={{position:'absolute',top:14,right:16,fontSize:26,opacity:0.12}}>{s.icon}</div>
                <div style={{fontFamily:'Georgia,serif',fontSize:40,fontWeight:300,color:s.color,lineHeight:1,marginBottom:6,textShadow:`0 0 20px ${s.color}`}}>{s.value}</div>
                <div style={{fontFamily:'Georgia,serif',fontSize:11,letterSpacing:3,color:'rgba(245,238,242,0.3)',textTransform:'uppercase'}}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4}} style={{marginBottom:24}}>
            <Link href="/rezervace" style={{display:'inline-flex',alignItems:'center',gap:8,background:'linear-gradient(135deg,#C4698A,#FF6BA8)',color:'white',textDecoration:'none',fontFamily:'Georgia,serif',fontSize:11,letterSpacing:3,textTransform:'uppercase',padding:'14px 28px',borderRadius:10,boxShadow:'0 0 40px rgba(255,107,168,0.4)'}}>
              + Nová rezervace →
            </Link>
          </motion.div>

          {/* Tabs */}
          <div style={{display:'flex',gap:0,marginBottom:20,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
            {[
              {id:'upcoming',label:'Nadcházející',count:upcoming.length},
              {id:'history', label:'Historie',    count:history.length},
              {id:'loyalty', label:`${tierInfo.icon} Moje body`, count:null},
            ].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id as any)}
                style={{padding:'12px 20px',background:'none',border:'none',fontFamily:'Georgia,serif',fontSize:11,letterSpacing:2,textTransform:'uppercase',color:tab===t.id?'#FF6BA8':'rgba(245,238,242,0.3)',borderBottom:tab===t.id?'2px solid #FF6BA8':'2px solid transparent',marginBottom:-1,textShadow:tab===t.id?'0 0 15px rgba(255,107,168,0.6)':'none',transition:'all 0.2s',cursor:'pointer'}}>
                {t.label}
                {t.count!=null&&t.count>0&&<span style={{marginLeft:8,background:'rgba(255,107,168,0.2)',color:'#FF6BA8',padding:'2px 7px',borderRadius:20,fontSize:9}}>{t.count}</span>}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab==='upcoming'&&(
              <motion.div key="up" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}}>
                {upcoming.length===0?(
                  <GCard style={{padding:'48px 24px',textAlign:'center'}}>
                    <div style={{fontFamily:'Georgia,serif',fontSize:32,marginBottom:12,opacity:0.2}}>✦</div>
                    <div style={{fontFamily:'Georgia,serif',fontSize:14,color:'rgba(245,238,242,0.4)',marginBottom:20}}>Žádné nadcházející rezervace</div>
                    <Link href="/rezervace" style={{fontFamily:'Georgia,serif',fontSize:10,letterSpacing:3,color:'#FF6BA8',textDecoration:'none',textTransform:'uppercase',borderBottom:'1px solid rgba(255,107,168,0.4)',paddingBottom:2}}>Rezervovat termín →</Link>
                  </GCard>
                ):(
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    {upcoming.map((b,i)=><BookingCard key={b.id} booking={b} index={i}/>)}
                  </div>
                )}
              </motion.div>
            )}
            {tab==='history'&&(
              <motion.div key="hi" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}}>
                {history.length===0?(
                  <GCard style={{padding:'48px 24px',textAlign:'center'}}>
                    <div style={{fontFamily:'Georgia,serif',fontSize:14,color:'rgba(245,238,242,0.4)'}}>Žádná historie</div>
                  </GCard>
                ):(
                  <div style={{display:'flex',flexDirection:'column',gap:10,opacity:0.75}}>
                    {history.map((b,i)=><BookingCard key={b.id} booking={b} index={i}/>)}
                  </div>
                )}
              </motion.div>
            )}
            {tab==='loyalty'&&(
              <motion.div key="lo" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}}>
                {/* Tier + progress */}
                <GCard style={{padding:'28px',marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
                    <div>
                      <div style={{fontFamily:'Georgia,serif',fontSize:9,letterSpacing:4,color:'#FF6BA8',textTransform:'uppercase',marginBottom:8}}>Vaše úroveň</div>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <span style={{fontSize:28}}>{tierInfo.icon}</span>
                        <div style={{fontFamily:'Georgia,serif',fontSize:22,fontWeight:300,color:'rgba(245,238,242,0.9)'}}>{tierInfo.label}</div>
                      </div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontFamily:'Georgia,serif',fontSize:40,fontWeight:300,color:tierInfo.color,textShadow:`0 0 20px ${tierInfo.color}`}}>{points.toLocaleString('cs-CZ')}</div>
                      <div style={{fontFamily:'Georgia,serif',fontSize:10,letterSpacing:3,color:'rgba(245,238,242,0.3)',textTransform:'uppercase'}}>Lash Body</div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={{height:8,background:'rgba(255,255,255,0.06)',borderRadius:8,marginBottom:8,position:'relative'}}>
                    <motion.div initial={{width:0}} animate={{width:`${progress}%`}} transition={{duration:1,ease:'easeOut'}}
                      style={{height:'100%',borderRadius:8,background:`linear-gradient(90deg,#C4698A,${tierInfo.color})`,boxShadow:`0 0 12px ${tierInfo.color}60`,position:'relative'}}>
                      <div style={{position:'absolute',right:-1,top:-4,width:16,height:16,borderRadius:'50%',background:tierInfo.color,border:'2px solid rgba(8,6,8,0.9)',boxShadow:`0 0 10px ${tierInfo.color}`}}/>
                    </motion.div>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',fontFamily:'Georgia,serif',fontSize:10,color:'rgba(245,238,242,0.25)'}}>
                    <span>0</span>
                    {['LOVER','QUEEN','ELITE'].map(k=>(
                      <span key={k}>{TIER_THRESHOLDS[k as keyof typeof TIER_THRESHOLDS].toLocaleString('cs-CZ')} {TIER_INFO[k as keyof typeof TIER_INFO].label}</span>
                    ))}
                  </div>
                  {nextTier && nextThreshold && (
                    <div style={{marginTop:16,padding:'10px 14px',background:'rgba(255,107,168,0.06)',borderRadius:10,fontFamily:'Georgia,serif',fontSize:12,color:'rgba(245,238,242,0.5)'}}>
                      Do {TIER_INFO[nextTier as keyof typeof TIER_INFO].label} chybí ještě <span style={{color:'#FF6BA8',fontWeight:500}}>{(nextThreshold-points).toLocaleString('cs-CZ')} bodů</span>
                    </div>
                  )}
                </GCard>

                {/* Available rewards */}
                <GCard style={{padding:'24px',marginBottom:16}}>
                  <div style={{fontFamily:'Georgia,serif',fontSize:9,letterSpacing:4,color:'#FF6BA8',textTransform:'uppercase',marginBottom:16}}>Dostupné odměny</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8}}>
                    {REWARDS.map(r=>{
                      const canUse = points >= r.points
                      return (
                        <div key={r.id} style={{background:canUse?'rgba(255,107,168,0.08)':'rgba(255,255,255,0.03)',border:`1px solid ${canUse?'rgba(255,107,168,0.35)':'rgba(255,255,255,0.06)'}`,borderRadius:12,padding:'14px 10px',textAlign:'center',opacity:canUse?1:0.5,transition:'all 0.3s'}}>
                          <div style={{fontFamily:'Georgia,serif',fontSize:9,letterSpacing:1,color:canUse?'#FF6BA8':'rgba(245,238,242,0.3)',textTransform:'uppercase',marginBottom:8}}>{r.points.toLocaleString('cs-CZ')} Lb</div>
                          <div style={{fontSize:22,marginBottom:6}}>🎁</div>
                          <div style={{fontFamily:'Georgia,serif',fontSize:11,color:canUse?'rgba(245,238,242,0.85)':'rgba(245,238,242,0.4)',lineHeight:1.4}}>{r.label}</div>
                        </div>
                      )
                    })}
                  </div>
                </GCard>

                {/* Lash Pass */}
                <div style={{background:'#0d0608',border:'1px solid #7a4060',borderRadius:20,overflow:'hidden',position:'relative'}}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,#FF6BA8,#D4AA70,transparent)'}}/>
                  <div style={{padding:'20px 24px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <div>
                      <div style={{fontFamily:'Georgia,serif',fontSize:9,letterSpacing:4,color:'#D4AA70',textTransform:'uppercase',marginBottom:4}}>✦ Aktivní sezóna</div>
                      <div style={{fontFamily:'Georgia,serif',fontSize:18,fontWeight:300,color:'white'}}>Jarní Lash Pass</div>
                    </div>
                    <div style={{background:'rgba(212,170,112,0.1)',border:'1px solid rgba(212,170,112,0.3)',color:'#D4AA70',fontSize:9,letterSpacing:2,textTransform:'uppercase',padding:'6px 14px',borderRadius:20}}>Jaro 2026</div>
                  </div>
                  <div style={{padding:'20px 24px'}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
                      {LASH_PASS_CHALLENGES.map(c=>(
                        <div key={c.id} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:'12px 14px',display:'flex',alignItems:'center',gap:10}}>
                          <div style={{width:26,height:26,borderRadius:'50%',border:'1.5px solid rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:'#C4698A',flexShrink:0}}>✓</div>
                          <div>
                            <div style={{fontFamily:'Georgia,serif',fontSize:12,color:'rgba(245,235,240,0.8)'}}>{c.label}</div>
                            <div style={{fontFamily:'Georgia,serif',fontSize:10,color:'#D4AA70',marginTop:2}}>+{c.points} Lb</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{background:'rgba(212,170,112,0.07)',border:'1px solid rgba(212,170,112,0.2)',borderRadius:12,padding:'16px 18px',display:'flex',alignItems:'center',gap:14}}>
                      <span style={{fontSize:26}}>🏆</span>
                      <div>
                        <div style={{fontFamily:'Georgia,serif',fontSize:9,letterSpacing:3,color:'#D4AA70',textTransform:'uppercase',marginBottom:3}}>Sezónní odměna</div>
                        <div style={{fontFamily:'Georgia,serif',fontSize:14,color:'white',fontWeight:300}}>Exkluzivní sleva 25 % + dáreček od Viktórie</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  )
}
