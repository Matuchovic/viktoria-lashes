'use client'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { Navbar } from '@/components/layout/Navbar'
import { formatPrice } from '@/lib/utils'

const STATUS_CONFIG: Record<string, { label:string; color:string; bg:string; glow:string }> = {
  PENDING:   { label:'Čeká na potvrzení', color:'#D4AA70', bg:'rgba(212,170,112,0.1)', glow:'rgba(212,170,112,0.3)' },
  CONFIRMED: { label:'Potvrzeno',          color:'#4ade80', bg:'rgba(74,222,128,0.1)', glow:'rgba(74,222,128,0.3)' },
  CANCELLED: { label:'Zrušeno',           color:'#f87171', bg:'rgba(248,113,113,0.1)', glow:'rgba(248,113,113,0.3)' },
  COMPLETED: { label:'Dokončeno',         color:'#FF6BA8', bg:'rgba(255,107,168,0.1)', glow:'rgba(255,107,168,0.3)' },
  NO_SHOW:   { label:'Nedostavil/a se',   color:'#6b7280', bg:'rgba(107,114,128,0.1)', glow:'rgba(107,114,128,0.2)' },
}

function GlassCard({ children, style, glow }: { children: React.ReactNode; style?: React.CSSProperties; glow?: string }) {
  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      style={{
        background:'rgba(255,255,255,0.04)',
        border:'1px solid rgba(255,107,168,0.15)',
        backdropFilter:'blur(20px)',
        borderRadius:16,
        position:'relative',
        overflow:'hidden',
        boxShadow: glow ? `0 0 40px ${glow}, inset 0 1px 0 rgba(255,255,255,0.06)` : 'inset 0 1px 0 rgba(255,255,255,0.06)',
        ...style,
      }}
    >
      {/* Top accent */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.5),rgba(212,170,112,0.3),transparent)' }}/>
      {children}
    </motion.div>
  )
}

function StatCard({ label, value, icon, color, delay }: { label:string; value:string|number; icon:string; color:string; delay:number }) {
  return (
    <motion.div
      initial={{ opacity:0, y:30, scale:0.95 }}
      animate={{ opacity:1, y:0, scale:1 }}
      transition={{ delay, duration:0.6, ease:[0.16,1,0.3,1] }}
      style={{
        background:'rgba(255,255,255,0.04)',
        border:`1px solid ${color}30`,
        borderRadius:16,
        padding:'24px 20px',
        position:'relative',
        overflow:'hidden',
        boxShadow:`0 0 30px ${color}15, inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${color}60,transparent)` }}/>
      <div style={{ position:'absolute', top:12, right:16, fontSize:28, opacity:0.15 }}>{icon}</div>
      <div style={{ fontFamily:'Georgia,serif', fontSize:36, fontWeight:300, color, lineHeight:1, marginBottom:6, textShadow:`0 0 20px ${color}` }}>
        {value}
      </div>
      <div style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:3, color:'rgba(245,238,242,0.35)', textTransform:'uppercase' }}>
        {label}
      </div>
    </motion.div>
  )
}

function BookingCard({ booking, index }: { booking: any; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.PENDING
  const date = new Date(booking.date)
  const isUpcoming = date >= new Date() && booking.status !== 'CANCELLED'

  return (
    <motion.div
      initial={{ opacity:0, x:-20 }}
      animate={{ opacity:1, x:0 }}
      transition={{ delay: index * 0.08, duration:0.5, ease:[0.16,1,0.3,1] }}
      onClick={() => setExpanded(e => !e)}
      style={{
        background: expanded ? 'rgba(255,107,168,0.06)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${expanded ? 'rgba(255,107,168,0.35)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius:14,
        padding:'18px 20px',
        cursor:'pointer',
        transition:'all 0.3s',
        position:'relative',
        overflow:'hidden',
      }}
    >
      {isUpcoming && (
        <div style={{ position:'absolute', top:0, left:0, bottom:0, width:3, background:'linear-gradient(180deg,#FF6BA8,#D4AA70)', borderRadius:'14px 0 0 14px' }}/>
      )}

      {/* Main row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          {/* Date badge */}
          <div style={{
            width:52, height:52, borderRadius:12, flexShrink:0,
            background: isUpcoming ? 'rgba(255,107,168,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${isUpcoming ? 'rgba(255,107,168,0.4)' : 'rgba(255,255,255,0.08)'}`,
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            boxShadow: isUpcoming ? '0 0 15px rgba(255,107,168,0.2)' : 'none',
          }}>
            <div style={{ fontFamily:'Georgia,serif', fontSize:20, fontWeight:300, color: isUpcoming ? '#FF6BA8' : 'rgba(245,238,242,0.5)', lineHeight:1, textShadow: isUpcoming ? '0 0 10px rgba(255,107,168,0.6)' : 'none' }}>
              {date.getDate()}
            </div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:1, color:'rgba(245,238,242,0.3)', textTransform:'uppercase' }}>
              {['led','úno','bře','dub','kvě','čer','čvc','srp','zář','říj','lis','pro'][date.getMonth()]}
            </div>
          </div>

          <div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:15, color:'rgba(245,238,242,0.9)', marginBottom:3 }}>
              {booking.service?.nameCs ?? 'Neznámá služba'}
            </div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)' }}>
              {booking.artist?.name ?? 'Viktória Ladiková'} · {booking.time}
            </div>
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
          <div style={{ fontFamily:'Georgia,serif', fontSize:20, fontWeight:300, color:'#FF6BA8', textShadow:'0 0 15px rgba(255,107,168,0.5)' }}>
            {formatPrice(booking.totalKc)}
          </div>
          <div style={{
            padding:'3px 10px', borderRadius:20, fontSize:10, letterSpacing:1,
            fontFamily:'Georgia,serif', textTransform:'uppercase',
            background: cfg.bg, color: cfg.color,
            border: `1px solid ${cfg.color}40`,
            boxShadow: `0 0 10px ${cfg.glow}`,
          }}>
            {cfg.label}
          </div>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height:0, opacity:0 }}
            animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }}
            transition={{ duration:0.3 }}
            style={{ overflow:'hidden' }}
          >
            <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[
                  { label:'Číslo rezervace', value:`#${booking.bookingRef?.slice(-8).toUpperCase()}` },
                  { label:'Datum', value:`${date.getDate()}. ${['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince'][date.getMonth()]} ${date.getFullYear()}` },
                  { label:'Čas', value:booking.time },
                  { label:'Záloha', value:formatPrice(booking.depositKc) },
                  { label:'Telefon', value:booking.customerPhone },
                  { label:'E-mail', value:booking.customerEmail },
                ].map(item => (
                  <div key={item.label} style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'10px 14px', border:'1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:4 }}>{item.label}</div>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.8)' }}>{item.value}</div>
                  </div>
                ))}
              </div>
              {booking.notes && (
                <div style={{ marginTop:10, background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'10px 14px', border:'1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:4 }}>Poznámka</div>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.8)' }}>{booking.notes}</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position:'absolute', bottom:18, right:20, fontSize:10, color:'rgba(245,238,242,0.2)' }}>
        {expanded ? '▲' : '▼'}
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming'|'history'>('upcoming')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch(`/api/bookings?email=${session?.user?.email}`)
      .then(r => r.json())
      .then(data => { setBookings(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [status, session])

  const upcoming = bookings.filter(b => new Date(b.date) >= new Date() && b.status !== 'CANCELLED')
  const history  = bookings.filter(b => new Date(b.date) < new Date() || b.status === 'COMPLETED' || b.status === 'CANCELLED')

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight:'100vh', background:'#080608', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <motion.div animate={{ opacity:[0.3,1,0.3] }} transition={{ duration:2, repeat:Infinity }}
          style={{ fontFamily:'Georgia,serif', fontSize:11, letterSpacing:4, color:'#FF6BA8', textTransform:'uppercase' }}>
          Načítám...
        </motion.div>
      </div>
    )
  }

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Vítejte'

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main style={{ minHeight:'100vh', background:'#080608', paddingTop:100, paddingBottom:60 }}>
        {/* Background glow */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse 60% 50% at 50% 20%,rgba(196,105,138,0.08) 0%,transparent 70%)' }}/>

        <div style={{ maxWidth:900, margin:'0 auto', padding:'0 24px', position:'relative' }}>

          {/* Header */}
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }}
            style={{ marginBottom:40, display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
            <div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:8, textShadow:'0 0 15px rgba(255,107,168,0.6)' }}>
                ✦ Zákaznický portál
              </div>
              <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:'clamp(32px,6vw,56px)', lineHeight:1.1, margin:0 }}>
                Dobrý den,{' '}
                <span style={{ background:'linear-gradient(135deg,#E8A4BE,#FF6BA8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', filter:'drop-shadow(0 0 20px rgba(255,107,168,0.4))' }}>
                  {firstName}
                </span>
              </h1>
            </div>
            <button onClick={() => signOut({ callbackUrl:'/' })}
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'10px 20px', color:'rgba(245,238,242,0.4)', fontFamily:'Georgia,serif', fontSize:11, letterSpacing:2, cursor:'pointer', textTransform:'uppercase', transition:'all 0.2s' }}>
              Odhlásit
            </button>
          </motion.div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:32 }}>
            <StatCard label="Nadcházející" value={upcoming.length} icon="📅" color="#FF6BA8" delay={0.1}/>
            <StatCard label="Dokončeno" value={history.filter(b=>b.status==='COMPLETED').length} icon="✦" color="#D4AA70" delay={0.2}/>
            <StatCard label="Věrn. body" value="—" icon="◈" color="#E8A4BE" delay={0.3}/>
          </div>

          {/* New booking CTA */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
            style={{ marginBottom:32 }}>
            <Link href="/rezervace" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:'linear-gradient(135deg,#C4698A,#FF6BA8)',
              color:'white', textDecoration:'none',
              fontFamily:'Georgia,serif', fontSize:11, letterSpacing:3, textTransform:'uppercase',
              padding:'14px 28px', borderRadius:10,
              boxShadow:'0 0 40px rgba(255,107,168,0.4)',
              transition:'all 0.3s',
            }}>
              + Nová rezervace →
            </Link>
          </motion.div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:0, marginBottom:20, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            {[
              { id:'upcoming', label:'Nadcházející', count:upcoming.length },
              { id:'history',  label:'Historie',     count:history.length },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id as any)}
                style={{
                  padding:'12px 20px', background:'none', border:'none', cursor:'pointer',
                  fontFamily:'Georgia,serif', fontSize:11, letterSpacing:2, textTransform:'uppercase',
                  color: activeTab===t.id ? '#FF6BA8' : 'rgba(245,238,242,0.3)',
                  borderBottom: activeTab===t.id ? '2px solid #FF6BA8' : '2px solid transparent',
                  marginBottom:-1, textShadow: activeTab===t.id ? '0 0 15px rgba(255,107,168,0.6)' : 'none',
                  transition:'all 0.2s',
                }}>
                {t.label}
                {t.count > 0 && (
                  <span style={{ marginLeft:8, background:'rgba(255,107,168,0.2)', color:'#FF6BA8', padding:'2px 7px', borderRadius:20, fontSize:9 }}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Bookings list */}
          <AnimatePresence mode="wait">
            {activeTab === 'upcoming' ? (
              <motion.div key="upcoming" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}}>
                {upcoming.length === 0 ? (
                  <GlassCard style={{ padding:'48px 24px', textAlign:'center' }}>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:32, marginBottom:12, opacity:0.2 }}>✦</div>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:14, color:'rgba(245,238,242,0.4)', marginBottom:20 }}>
                      Žádné nadcházející rezervace
                    </div>
                    <Link href="/rezervace" style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:3, color:'#FF6BA8', textDecoration:'none', textTransform:'uppercase', borderBottom:'1px solid rgba(255,107,168,0.4)', paddingBottom:2 }}>
                      Rezervovat termín →
                    </Link>
                  </GlassCard>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {upcoming.map((b, i) => <BookingCard key={b.id} booking={b} index={i}/>)}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="history" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}}>
                {history.length === 0 ? (
                  <GlassCard style={{ padding:'48px 24px', textAlign:'center' }}>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:14, color:'rgba(245,238,242,0.4)' }}>Žádná historie</div>
                  </GlassCard>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:10, opacity:0.75 }}>
                    {history.map((b, i) => <BookingCard key={b.id} booking={b} index={i}/>)}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  )
}
