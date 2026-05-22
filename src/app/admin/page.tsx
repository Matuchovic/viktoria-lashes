'use client'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { formatPrice } from '@/lib/utils'

const STATUS_CFG: Record<string, { label:string; color:string; bg:string; border:string }> = {
  PENDING:   { label:'Čeká',       color:'#D4AA70', bg:'rgba(212,170,112,0.1)', border:'rgba(212,170,112,0.3)' },
  CONFIRMED: { label:'Potvrzeno',  color:'#4ade80', bg:'rgba(74,222,128,0.1)', border:'rgba(74,222,128,0.3)' },
  COMPLETED: { label:'Dokončeno',  color:'#FF6BA8', bg:'rgba(255,107,168,0.1)', border:'rgba(255,107,168,0.3)' },
  CANCELLED: { label:'Zrušeno',    color:'#f87171', bg:'rgba(248,113,113,0.1)', border:'rgba(248,113,113,0.3)' },
  NO_SHOW:   { label:'Nedostavil', color:'#6b7280', bg:'rgba(107,114,128,0.1)', border:'rgba(107,114,128,0.2)' },
}

const TABS = [
  { id:'overview',  label:'Přehled',   icon:'◈' },
  { id:'bookings',  label:'Rezervace', icon:'📅' },
  { id:'customers', label:'Klientky',  icon:'💕' },
  { id:'services',  label:'Služby',    icon:'✦' },
  { id:'safety',    label:'Bezpečnost',icon:'🛡️' },
]

const MONTHS = ['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince']
const MONTHS_SHORT = ['led','úno','bře','dub','kvě','čer','čvc','srp','zář','říj','lis','pro']

function GCard({ children, style }: any) {
  return (
    <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,107,168,0.12)', borderRadius:16, position:'relative', overflow:'hidden', backdropFilter:'blur(10px)', ...style }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.4),rgba(212,170,112,0.2),transparent)' }}/>
      {children}
    </div>
  )
}

function StatCard({ label, value, sub, color, icon, delay }: any) {
  return (
    <motion.div initial={{ opacity:0, y:20, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }}
      transition={{ delay, duration:0.5, ease:[0.16,1,0.3,1] }}
      style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${color}25`, borderRadius:16, padding:'24px 20px', position:'relative', overflow:'hidden', boxShadow:`0 0 30px ${color}12` }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${color}60,transparent)` }}/>
      <div style={{ position:'absolute', top:14, right:16, fontSize:26, opacity:0.12 }}>{icon}</div>
      <div style={{ fontFamily:'Georgia,serif', fontSize:11, letterSpacing:3, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:10 }}>{label}</div>
      <div style={{ fontFamily:'Georgia,serif', fontSize:40, fontWeight:300, color, lineHeight:1, marginBottom:6, textShadow:`0 0 20px ${color}` }}>{value}</div>
      {sub && <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.3)' }}>{sub}</div>}
    </motion.div>
  )
}

// Booking detail modal
function BookingModal({ booking, onClose, onStatusChange }: { booking:any; onClose:()=>void; onStatusChange:(id:string,status:string)=>void }) {
  const cfg = STATUS_CFG[booking.status] ?? STATUS_CFG.PENDING
  const date = new Date(booking.date)

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:10000, display:'flex', alignItems:'center', justifyContent:'center', padding:24, backdropFilter:'blur(8px)', cursor:'none' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity:0, scale:0.9, y:30 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95, y:10 }}
        transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
        style={{ background:'#0d0508', border:'1px solid rgba(255,107,168,0.35)', borderRadius:20, width:'100%', maxWidth:560, position:'relative', overflow:'hidden', boxShadow:'0 0 60px rgba(255,107,168,0.2), 0 20px 60px rgba(0,0,0,0.8)' }}
      >
        {/* Top accent */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#FF6BA8,#D4AA70,transparent)' }}/>

        {/* Header */}
        <div style={{ padding:'24px 28px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6, textShadow:'0 0 10px rgba(255,107,168,0.6)' }}>✦ Detail rezervace</div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:20, fontWeight:300, color:'rgba(245,238,242,0.9)' }}>
              {booking.customerName}
            </div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, width:36, height:36, color:'rgba(245,238,242,0.4)', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>×</button>
        </div>

        <div style={{ padding:'24px 28px' }}>
          {/* Service + date highlight */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
            <div style={{ background:`${cfg.color}10`, border:`1px solid ${cfg.color}30`, borderRadius:14, padding:'16px 18px' }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:6 }}>Služba</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:14, color:'rgba(245,238,242,0.85)' }}>{booking.service?.nameCs ?? 'Neznámá'}</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:24, color:'#FF6BA8', marginTop:8, textShadow:'0 0 15px rgba(255,107,168,0.4)' }}>{formatPrice(booking.totalKc)}</div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'16px 18px' }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:6 }}>Termín</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:28, color:'rgba(245,238,242,0.85)', lineHeight:1 }}>{date.getDate()}.</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.5)', marginTop:2 }}>{MONTHS[date.getMonth()]} {date.getFullYear()}</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:18, color:'#D4AA70', marginTop:4 }}>{booking.time}</div>
            </div>
          </div>

          {/* Details grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
            {[
              { label:'Č. rezervace', value:`#${booking.bookingRef?.slice(-8).toUpperCase()}` },
              { label:'Stylistka', value:booking.artist?.name ?? 'Viktória Ladiková' },
              { label:'E-mail', value:booking.customerEmail },
              { label:'Telefon', value:booking.customerPhone },
              { label:'Záloha', value:formatPrice(booking.depositKc ?? 0) },
              { label:'Vytvořeno', value:new Date(booking.createdAt ?? Date.now()).toLocaleDateString('cs-CZ') },
            ].map(item => (
              <div key={item.label} style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'12px 14px', border:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:4 }}>{item.label}</div>
                <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.75)' }}>{item.value}</div>
              </div>
            ))}
          </div>

          {booking.notes && (
            <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'12px 14px', border:'1px solid rgba(255,255,255,0.05)', marginBottom:20 }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:4 }}>Poznámka</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.7)' }}>{booking.notes}</div>
            </div>
          )}

          {/* Current status */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:8 }}>Aktuální status</div>
            <span style={{ padding:'6px 14px', borderRadius:20, fontSize:11, fontFamily:'Georgia,serif', background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`, letterSpacing:1 }}>
              {cfg.label}
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:10 }}>Změnit status</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {Object.entries(STATUS_CFG).map(([key, s]) => (
              <button key={key}
                onClick={() => { onStatusChange(booking.id, key); onClose() }}
                style={{
                  padding:'8px 16px', borderRadius:20, border:`1px solid ${s.border}`,
                  background: booking.status===key ? s.bg : 'transparent',
                  color: s.color, fontFamily:'Georgia,serif', fontSize:11, letterSpacing:1,
                  fontWeight: booking.status===key ? 600 : 300,
                  boxShadow: booking.status===key ? `0 0 12px ${s.color}40` : 'none',
                  transition:'all 0.2s',
                }}>
                {booking.status===key && '✓ '}{s.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tab, setTab] = useState('overview')
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [search, setSearch] = useState('')
  const [checkins, setCheckins] = useState<any[]>([])
  const [safetyForm, setSafetyForm] = useState({ address:'', clientName:'', clientPhone:'', expectedMinutes:'90', notes:'' })
  const [safetyLoading, setSafetyLoading] = useState(false)
  const [activeCheckin, setActiveCheckin] = useState<any>(null)
  const [gpsTracking, setGpsTracking] = useState(false)
  const [gpsWatchId, setGpsWatchId] = useState<number | null>(null)
  const [shareLink, setShareLink] = useState('')

  const startGPS = (checkinId: string, shareToken: string) => {
    if (!navigator.geolocation) { alert('GPS není dostupné v tomto prohlížeči.'); return }
    // Use shareToken from checkin object, fallback to checkinId
    const token = shareToken || checkinId
    const link = `${window.location.origin}/sledovani?id=${checkinId}&token=${token}`
    setShareLink(link)
    setGpsTracking(true)
    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        try {
          await fetch('/api/safety/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ checkinId, lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
          })
        } catch(e) { console.error('GPS send error:', e) }
      },
      (err) => console.error('GPS error:', err),
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 15000 }
    )
    setGpsWatchId(watchId as unknown as number)
  }

  const stopGPS = () => {
    if (gpsWatchId !== null) navigator.geolocation.clearWatch(gpsWatchId)
    setGpsTracking(false)
    setGpsWatchId(null)
    setShareLink('')
  }

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return }
    if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') { router.push('/dashboard') }
  }, [status, session, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    Promise.all([
      fetch('/api/bookings').then(r => r.json()),
      fetch('/api/safety/checkin').then(r => r.json()).catch(() => []),
    ]).then(([bData, cData]) => {
      setBookings(Array.isArray(bData) ? bData : [])
      const cArr = Array.isArray(cData) ? cData : []
      setCheckins(cArr)
      const active = cArr.find((c: any) => !c.returnedAt)
      setActiveCheckin(active || null)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [status])

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/bookings/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ status:newStatus }) })
      setBookings(b => b.map(x => x.id===id ? {...x, status:newStatus} : x))
    } catch {}
  }

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight:'100vh', background:'#080608', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <motion.div animate={{ opacity:[0.3,1,0.3] }} transition={{ duration:2, repeat:Infinity }}
          style={{ fontFamily:'Georgia,serif', fontSize:11, letterSpacing:4, color:'#FF6BA8', textTransform:'uppercase' }}>
          Načítám admin panel...
        </motion.div>
      </div>
    )
  }

  const today = new Date(); today.setHours(0,0,0,0)
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastMonth = new Date(today.getFullYear(), today.getMonth()-1, 1)
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)

  const upcoming = bookings.filter(b => new Date(b.date) >= today && b.status !== 'CANCELLED')
  const thisMonthB = bookings.filter(b => new Date(b.date) >= thisMonth)
  const lastMonthB = bookings.filter(b => new Date(b.date) >= lastMonth && new Date(b.date) <= lastMonthEnd)
  const revenueThisMonth = thisMonthB.filter(b=>b.status!=='CANCELLED').reduce((s,b)=>s+(b.totalKc||0),0)
  const revenueLastMonth = lastMonthB.filter(b=>b.status!=='CANCELLED').reduce((s,b)=>s+(b.totalKc||0),0)
  const uniqueEmails = [...new Set(bookings.map(b=>b.customerEmail))]
  const pending = bookings.filter(b=>b.status==='PENDING').length
  const confirmed = bookings.filter(b=>b.status==='CONFIRMED').length
  const revenueGrowth = revenueLastMonth > 0 ? Math.round(((revenueThisMonth-revenueLastMonth)/revenueLastMonth)*100) : 0

  const filteredBookings = bookings.filter(b => {
    const matchStatus = filterStatus==='ALL' || b.status===filterStatus
    const matchSearch = !search || b.customerName?.toLowerCase().includes(search.toLowerCase()) || b.customerEmail?.toLowerCase().includes(search.toLowerCase()) || b.service?.nameCs?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const ROW_STYLE = { borderBottom:'1px solid rgba(255,255,255,0.03)', transition:'background 0.15s' }

  const BookingRow = ({ b, i }: { b:any; i:number }) => {
    const cfg = STATUS_CFG[b.status] ?? STATUS_CFG.PENDING
    const isPast = new Date(b.date) < today
    return (
      <motion.tr key={b.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.03 }}
        style={{ ...ROW_STYLE, opacity:isPast?0.7:1 }}
        onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,107,168,0.04)')}
        onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
        <td style={{ padding:'14px 18px' }}>
          <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.85)', marginBottom:2 }}>{b.customerName}</div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.25)', textTransform:'uppercase' }}>#{b.bookingRef?.slice(-6).toUpperCase()}</div>
        </td>
        <td style={{ padding:'14px 18px' }}>
          <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.5)' }}>{b.customerEmail}</div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)' }}>{b.customerPhone}</div>
        </td>
        <td style={{ padding:'14px 18px', fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.6)' }}>{b.service?.nameCs}</td>
        <td style={{ padding:'14px 18px' }}>
          <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.7)' }}>
            {new Date(b.date).toLocaleDateString('cs-CZ',{day:'numeric',month:'short'})}
          </div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)' }}>{b.time}</div>
        </td>
        <td style={{ padding:'14px 18px' }}>
          <span style={{ padding:'4px 10px', borderRadius:20, fontSize:10, fontFamily:'Georgia,serif', background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`, letterSpacing:1, whiteSpace:'nowrap' }}>
            {cfg.label}
          </span>
        </td>
        <td style={{ padding:'14px 18px', fontFamily:'Georgia,serif', fontSize:16, color:'#FF6BA8' }}>{formatPrice(b.totalKc)}</td>
        <td style={{ padding:'14px 18px' }}>
          <button onClick={() => setSelectedBooking(b)}
            style={{ background:'rgba(255,107,168,0.1)', border:'1px solid rgba(255,107,168,0.35)', borderRadius:8, padding:'6px 14px', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:10, letterSpacing:1, whiteSpace:'nowrap', transition:'all 0.2s' }}
            onMouseEnter={e=>{ (e.target as HTMLButtonElement).style.background='rgba(255,107,168,0.2)' }}
            onMouseLeave={e=>{ (e.target as HTMLButtonElement).style.background='rgba(255,107,168,0.1)' }}>
            Detail →
          </button>
        </td>
      </motion.tr>
    )
  }

  return (
    <>
      <CustomCursor />
      <AnimatePresence>
        {selectedBooking && (
          <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} onStatusChange={updateStatus}/>
        )}
      </AnimatePresence>

      <div style={{ minHeight:'100vh', background:'#080608', display:'flex' }}>
        {/* Sidebar — hidden on mobile, visible on desktop */}
        <div style={{ width:220, flexShrink:0, borderRight:'1px solid rgba(255,107,168,0.1)', display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', background:'rgba(255,255,255,0.02)' }} className="hidden md:flex">
          <div style={{ padding:'28px 24px 20px', borderBottom:'1px solid rgba(255,107,168,0.1)' }}>
            <Link href="/" style={{ textDecoration:'none' }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:13, letterSpacing:4, textTransform:'uppercase', fontWeight:300 }}>
                Viktória <span style={{ color:'#FF6BA8', textShadow:'0 0 15px rgba(255,107,168,0.6)' }}>Lashes</span>
              </div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(255,107,168,0.5)', textTransform:'uppercase', marginTop:4 }}>Admin Panel</div>
            </Link>
          </div>
          <nav style={{ flex:1, padding:'16px 12px', display:'flex', flexDirection:'column', gap:4 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:10, border:'none', background:tab===t.id?'rgba(255,107,168,0.12)':'transparent', borderLeft:tab===t.id?'2px solid #FF6BA8':'2px solid transparent', fontFamily:'Georgia,serif', fontSize:12, letterSpacing:1, color:tab===t.id?'#FF6BA8':'rgba(245,238,242,0.4)', transition:'all 0.2s' }}>
                <span style={{ fontSize:14 }}>{t.icon}</span>
                {t.label}
                {t.id==='bookings' && pending>0 && (
                  <span style={{ marginLeft:'auto', background:'#FF6BA8', color:'white', borderRadius:20, padding:'1px 7px', fontSize:9 }}>{pending}</span>
                )}
                {t.id==='safety' && activeCheckin && (
                  <span style={{ marginLeft:'auto', background:'#f87171', color:'white', borderRadius:20, padding:'1px 7px', fontSize:9 }}>!</span>
                )}
              </button>
            ))}
          </nav>
          <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(255,107,168,0.1)' }}>
            <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.5)', marginBottom:4 }}>{session?.user?.name}</div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'#FF6BA8', textTransform:'uppercase', marginBottom:12 }}>Admin</div>
            <button onClick={() => signOut({ callbackUrl:'/' })}
              style={{ background:'none', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'7px 14px', color:'rgba(245,238,242,0.35)', fontFamily:'Georgia,serif', fontSize:10, width:'100%', letterSpacing:1 }}>
              Odhlásit
            </button>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 16px 60px', position:'relative' }} className="md:p-8">
          <div style={{ position:'fixed', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse 50% 40% at 60% 20%,rgba(196,105,138,0.07) 0%,transparent 70%)' }}/>

          <AnimatePresence mode="wait">
            {/* OVERVIEW */}
            {tab==='overview' && (
              <motion.div key="ov" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                <div style={{ marginBottom:28 }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:8 }}>✦ Dashboard</div>
                  <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:36, margin:0 }}>Přehled studia</h1>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
                  <StatCard label="Tržby tento měsíc" value={formatPrice(revenueThisMonth)} sub={`${revenueGrowth>=0?'+':''}${revenueGrowth}% vs minulý`} color="#FF6BA8" icon="💰" delay={0.05}/>
                  <StatCard label="Nadcházející" value={upcoming.length} sub="rezervací" color="#D4AA70" icon="📅" delay={0.1}/>
                  <StatCard label="Klientek" value={uniqueEmails.length} color="#E8A4BE" icon="💕" delay={0.15}/>
                  <StatCard label="Čeká na potvrzení" value={pending} color="#f87171" icon="⏳" delay={0.2}/>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:24 }}>
                  <StatCard label="Potvrzeno" value={confirmed} color="#4ade80" icon="✓" delay={0.25}/>
                  <StatCard label="Tržby min. měsíc" value={formatPrice(revenueLastMonth)} color="#D4AA70" icon="◈" delay={0.3}/>
                  <StatCard label="Celkem rezervací" value={bookings.length} color="#FF6BA8" icon="✦" delay={0.35}/>
                </div>
                <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4}}>
                  <GCard>
                    <div style={{ padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <h2 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:18, margin:0 }}>Nadcházející rezervace</h2>
                      <button onClick={()=>setTab('bookings')} style={{ background:'none', border:'1px solid rgba(255,107,168,0.3)', padding:'6px 14px', borderRadius:8, color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:10, letterSpacing:2, textTransform:'uppercase' }}>
                        Zobrazit vše →
                      </button>
                    </div>
                    <div style={{ overflowX:'auto' }}>
                      <table style={{ width:'100%', borderCollapse:'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                            {['Klientka','Služba','Datum','Čas','Status','Cena',''].map(h=>(
                              <th key={h} style={{ padding:'12px 18px', textAlign:'left', fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', fontWeight:300 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {upcoming.slice(0,8).map((b,i) => {
                            const cfg = STATUS_CFG[b.status] ?? STATUS_CFG.PENDING
                            return (
                              <motion.tr key={b.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.5+i*0.04}}
                                style={ROW_STYLE}
                                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,107,168,0.03)')}
                                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                                <td style={{ padding:'14px 18px' }}>
                                  <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.85)' }}>{b.customerName}</div>
                                  <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.3)' }}>{b.customerEmail}</div>
                                </td>
                                <td style={{ padding:'14px 18px', fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.6)' }}>{b.service?.nameCs}</td>
                                <td style={{ padding:'14px 18px', fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.6)' }}>{new Date(b.date).toLocaleDateString('cs-CZ',{day:'numeric',month:'short'})}</td>
                                <td style={{ padding:'14px 18px', fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.6)' }}>{b.time}</td>
                                <td style={{ padding:'14px 18px' }}>
                                  <span style={{ padding:'3px 10px', borderRadius:20, fontSize:10, fontFamily:'Georgia,serif', background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`, letterSpacing:1 }}>{cfg.label}</span>
                                </td>
                                <td style={{ padding:'14px 18px', fontFamily:'Georgia,serif', fontSize:16, color:'#FF6BA8' }}>{formatPrice(b.totalKc)}</td>
                                <td style={{ padding:'14px 18px' }}>
                                  <button onClick={()=>setSelectedBooking(b)}
                                    style={{ background:'rgba(255,107,168,0.1)', border:'1px solid rgba(255,107,168,0.3)', borderRadius:8, padding:'5px 12px', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:10, letterSpacing:1 }}>
                                    Detail →
                                  </button>
                                </td>
                              </motion.tr>
                            )
                          })}
                          {upcoming.length===0 && <tr><td colSpan={7} style={{ padding:'48px', textAlign:'center', fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.2)' }}>Žádné nadcházející rezervace</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </GCard>
                </motion.div>
              </motion.div>
            )}

            {/* BOOKINGS */}
            {tab==='bookings' && (
              <motion.div key="bk" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                <div style={{ marginBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>✦ Správa</div>
                    <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:32, margin:0 }}>Všechny rezervace</h1>
                  </div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Hledat klientku..."
                      style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,107,168,0.2)', borderRadius:10, padding:'8px 14px', color:'rgba(245,238,242,0.8)', fontFamily:'Georgia,serif', fontSize:12, outline:'none', width:200 }}/>
                    <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
                      style={{ background:'#0d0508', border:'1px solid rgba(255,107,168,0.2)', borderRadius:10, padding:'8px 14px', color:'rgba(245,238,242,0.8)', fontFamily:'Georgia,serif', fontSize:12, outline:'none' }}>
                      <option value="ALL">Vše ({bookings.length})</option>
                      {Object.entries(STATUS_CFG).map(([k,v])=>(
                        <option key={k} value={k}>{v.label} ({bookings.filter(b=>b.status===k).length})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <GCard>
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                          {['Klientka','Kontakt','Služba','Termín','Status','Cena','Akce'].map(h=>(
                            <th key={h} style={{ padding:'14px 18px', textAlign:'left', fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', fontWeight:300 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((b,i) => <BookingRow key={b.id} b={b} i={i}/>)}
                        {filteredBookings.length===0 && <tr><td colSpan={7} style={{ padding:'48px', textAlign:'center', fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.2)' }}>Žádné výsledky</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </GCard>
              </motion.div>
            )}

            {/* CUSTOMERS */}
            {tab==='customers' && (
              <motion.div key="cu" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                <div style={{ marginBottom:24 }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>✦ CRM</div>
                  <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:32, margin:0 }}>Databáze klientek</h1>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
                  {uniqueEmails.map((email,i) => {
                    const cb = bookings.filter(b=>b.customerEmail===email)
                    const total = cb.reduce((s,b)=>s+(b.totalKc||0),0)
                    const last = cb.sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime())[0]
                    return (
                      <motion.div key={email as string} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,107,168,0.12)', borderRadius:14, padding:'20px', position:'relative', overflow:'hidden' }}>
                        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.3),transparent)' }}/>
                        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                          <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#C4698A,#FF6BA8)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Georgia,serif', fontSize:18, color:'white', flexShrink:0 }}>
                            {last?.customerName?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <div>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:14, color:'rgba(245,238,242,0.85)' }}>{last?.customerName ?? 'Neznámá'}</div>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)' }}>{email as string}</div>
                          </div>
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                          <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'10px 12px' }}>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:4 }}>Návštěvy</div>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:22, color:'#FF6BA8' }}>{cb.length}</div>
                          </div>
                          <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'10px 12px' }}>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:4 }}>Celkem</div>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:18, color:'#D4AA70' }}>{formatPrice(total)}</div>
                          </div>
                        </div>
                        {last && <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.3)' }}>Poslední: {new Date(last.date).toLocaleDateString('cs-CZ',{day:'numeric',month:'long'})}</div>}
                        <button onClick={()=>setSelectedBooking(last)}
                          style={{ marginTop:12, width:'100%', background:'rgba(255,107,168,0.08)', border:'1px solid rgba(255,107,168,0.25)', borderRadius:8, padding:'7px', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:10, letterSpacing:1 }}>
                          Poslední rezervace →
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* SERVICES */}
            {tab==='services' && (
              <motion.div key="sv" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                <div style={{ marginBottom:24 }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>✦ Ceník</div>
                  <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:32, margin:0 }}>Správa služeb</h1>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
                  {[
                    {name:'Klasické řasy (50D–60D)',price:499,duration:45,key:'Klasické'},
                    {name:'Objemové řasy (80D)',price:599,duration:60,key:'Objemové'},
                    {name:'Mega Volume (100D)',price:799,duration:60,key:'Mega'},
                    {name:'Wet Look (60D)',price:999,duration:60,key:'Wet'},
                    {name:'Doplnění řas',price:199,duration:20,key:'Doplnění'},
                    {name:'Odstranění řas',price:99,duration:25,key:'Odstranění'},
                  ].map((s,i) => {
                    const count = bookings.filter(b=>b.service?.nameCs?.includes(s.key)).length
                    return (
                      <motion.div key={s.name} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,107,168,0.12)', borderRadius:14, padding:'24px', position:'relative', overflow:'hidden' }}>
                        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.4),transparent)' }}/>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:15, color:'rgba(245,238,242,0.85)', marginBottom:6 }}>{s.name}</div>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:32, color:'#FF6BA8', textShadow:'0 0 15px rgba(255,107,168,0.4)', marginBottom:4 }}>{formatPrice(s.price)}</div>
                        <div style={{ display:'flex', gap:16, fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)', marginBottom:12 }}>
                          <span>⏱ {s.duration} min</span>
                          <span>📊 {count}× objednáno</span>
                        </div>
                        <div style={{ background:'rgba(255,107,168,0.06)', borderRadius:8, padding:'8px 14px', fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.4)' }}>
                          Záloha: {formatPrice(Math.round(s.price*0.3))}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}
            {/* SAFETY */}
            {tab==='safety' && (
              <motion.div key="sf" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                <div style={{ marginBottom:24 }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:5, color:'#f87171', textTransform:'uppercase', marginBottom:6 }}>🛡️ Bezpečnostní systém</div>
                  <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:32, margin:0 }}>Ochrana při výjezdech</h1>
                </div>

                {/* Active checkin alert */}
                {activeCheckin && (
                  <motion.div initial={{opacity:0,scale:0.98}} animate={{opacity:1,scale:1}}
                    style={{ marginBottom:20, padding:'20px 24px', borderRadius:16, background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.4)', position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#f87171,transparent)' }}/>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'#f87171', textTransform:'uppercase', marginBottom:8 }}>⚠️ Aktivní výjezd</div>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:16, color:'rgba(245,238,242,0.9)', marginBottom:4 }}>{activeCheckin.clientName} — {activeCheckin.address}</div>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.5)', marginBottom:16 }}>
                      Tel: {activeCheckin.clientPhone} · Očekávaný návrat: {new Date(activeCheckin.expectedBack).toLocaleTimeString('cs-CZ', {hour:'2-digit',minute:'2-digit'})}
                      {new Date(activeCheckin.expectedBack) < new Date() && (
                        <span style={{ marginLeft:10, color:'#f87171', fontWeight:600 }}>⚠️ PO TERMÍNU!</span>
                      )}
                    </div>
                    <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                      {!gpsTracking ? (
                        <button
                          onClick={() => startGPS(activeCheckin.id, activeCheckin.shareToken || activeCheckin.id)}
                          style={{ background:'linear-gradient(135deg,rgba(255,107,168,0.2),rgba(196,105,138,0.15))', border:'1.5px solid rgba(255,107,168,0.5)', borderRadius:10, padding:'12px 22px', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:13, cursor:'pointer', boxShadow:'0 0 20px rgba(255,107,168,0.2)' }}>
                          📍 Spustit GPS + vygenerovat link pro manžela
                        </button>
                      ) : (
                        <button onClick={stopGPS}
                          style={{ background:'rgba(248,113,113,0.15)', border:'1px solid rgba(248,113,113,0.4)', borderRadius:10, padding:'10px 20px', color:'#f87171', fontFamily:'Georgia,serif', fontSize:12, cursor:'pointer' }}>
                          ⏹ Zastavit GPS
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          stopGPS()
                          await fetch('/api/safety/checkin', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id: activeCheckin.id }) })
                          setActiveCheckin(null)
                          setCheckins(c => c.map(x => x.id===activeCheckin.id ? {...x, returnedAt: new Date()} : x))
                        }}
                        style={{ background:'#4ade80', border:'none', borderRadius:10, padding:'10px 24px', color:'#0a1a0a', fontFamily:'Georgia,serif', fontSize:12, fontWeight:600, cursor:'pointer', boxShadow:'0 0 20px rgba(74,222,128,0.3)' }}>
                        ✓ Jsem bezpečně zpět
                      </button>
                    </div>
                    {gpsTracking && (
                      <div style={{ marginTop:12, padding:'12px 16px', borderRadius:10, background:'rgba(255,107,168,0.06)', border:'1px solid rgba(255,107,168,0.2)' }}>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>📍 GPS aktivní — sdílejte odkaz</div>
                        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                          <input readOnly value={shareLink}
                            style={{ flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'6px 12px', color:'rgba(245,238,242,0.6)', fontFamily:'Georgia,serif', fontSize:11, outline:'none' }}/>
                          <button onClick={() => { navigator.clipboard.writeText(shareLink) }}
                            style={{ background:'rgba(255,107,168,0.15)', border:'1px solid rgba(255,107,168,0.3)', borderRadius:8, padding:'6px 14px', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer', whiteSpace:'nowrap' }}>
                            Kopírovat
                          </button>
                        </div>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(255,107,168,0.6)', marginTop:6 }}>
                          💬 Zkopírujte a pošlete manželovi přes WhatsApp — uvidí Vaši polohu živě
                        </div>
                        <a href={`https://wa.me/?text=${encodeURIComponent('Sleduj mou polohu živě: ' + shareLink)}`} target="_blank"
                          style={{ display:'inline-block', marginTop:8, padding:'8px 16px', borderRadius:8, background:'rgba(37,211,102,0.15)', border:'1px solid rgba(37,211,102,0.4)', color:'#25d166', fontFamily:'Georgia,serif', fontSize:11, textDecoration:'none' }}>
                          📲 Sdílet přes WhatsApp
                        </a>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* New checkin form */}
                {!activeCheckin && (
                  <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:16, padding:'24px', marginBottom:20, position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(248,113,113,0.5),transparent)' }}/>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'rgba(248,113,113,0.7)', textTransform:'uppercase', marginBottom:16 }}>Nový výjezd — check-in</div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                      {[
                        { label:'Adresa klientky', key:'address', ph:'Např. Nádražní 12, Mladá Boleslav', full:true },
                        { label:'Jméno klientky',  key:'clientName', ph:'Jana Nováková' },
                        { label:'Telefon klientky', key:'clientPhone', ph:'+420 123 456 789' },
                        { label:'Očekávaná doba (min)', key:'expectedMinutes', ph:'90' },
                      ].map(f => (
                        <div key={f.key} style={{ gridColumn: f.full ? '1/-1' : 'auto' }}>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:6 }}>{f.label}</div>
                          <input value={(safetyForm as any)[f.key]} onChange={e => setSafetyForm(s => ({...s, [f.key]: e.target.value}))}
                            placeholder={f.ph}
                            style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:10, padding:'10px 14px', color:'rgba(245,238,242,0.85)', fontFamily:'Georgia,serif', fontSize:13, outline:'none' }}/>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom:16 }}>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:6 }}>Poznámka (nepovinné)</div>
                      <input value={safetyForm.notes} onChange={e => setSafetyForm(s => ({...s, notes: e.target.value}))}
                        placeholder="Např. nová klientka, sdílím polohu s partnerem..."
                        style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:10, padding:'10px 14px', color:'rgba(245,238,242,0.85)', fontFamily:'Georgia,serif', fontSize:13, outline:'none' }}/>
                    </div>
                    <button
                      disabled={safetyLoading || !safetyForm.address || !safetyForm.clientName}
                      onClick={async () => {
                        setSafetyLoading(true)
                        const res = await fetch('/api/safety/checkin', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(safetyForm) })
                        const data = await res.json()
                        setActiveCheckin(data)
                        setCheckins(c => [data, ...c])
                        setSafetyForm({ address:'', clientName:'', clientPhone:'', expectedMinutes:'90', notes:'' })
                        setSafetyLoading(false)
                      }}
                      style={{ background:'linear-gradient(135deg,#dc2626,#f87171)', border:'none', borderRadius:10, padding:'12px 28px', color:'white', fontFamily:'Georgia,serif', fontSize:12, letterSpacing:2, cursor:'pointer', boxShadow:'0 0 20px rgba(248,113,113,0.3)', opacity: safetyLoading||!safetyForm.address ? 0.6 : 1 }}>
                      {safetyLoading ? 'Odesílám...' : '🛡️ Odjíždím — spustit check-in'}
                    </button>
                  </div>
                )}

                {/* Checkin history */}
                <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
                  <div style={{ padding:'16px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontFamily:'Georgia,serif', fontSize:14, fontWeight:300 }}>Historie výjezdů</div>
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                        {['Klientka', 'Adresa', 'Odjezd', 'Návrat', 'Stav'].map(h => (
                          <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', fontWeight:300 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {checkins.length===0 && (
                        <tr><td colSpan={5} style={{ padding:'32px', textAlign:'center', fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.2)' }}>Žádné záznamy</td></tr>
                      )}
                      {checkins.map(c => (
                        <tr key={c.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding:'12px 16px' }}>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.85)' }}>{c.clientName}</div>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.3)' }}>{c.clientPhone}</div>
                          </td>
                          <td style={{ padding:'12px 16px', fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.55)' }}>{c.address}</td>
                          <td style={{ padding:'12px 16px', fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.5)' }}>{new Date(c.departedAt).toLocaleString('cs-CZ', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</td>
                          <td style={{ padding:'12px 16px', fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.5)' }}>{c.returnedAt ? new Date(c.returnedAt).toLocaleTimeString('cs-CZ',{hour:'2-digit',minute:'2-digit'}) : '—'}</td>
                          <td style={{ padding:'12px 16px' }}>
                            {c.returnedAt
                              ? <span style={{ padding:'3px 10px', borderRadius:20, fontSize:10, background:'rgba(74,222,128,0.1)', color:'#4ade80', border:'1px solid rgba(74,222,128,0.3)' }}>Bezpečně zpět</span>
                              : new Date(c.expectedBack) < new Date()
                                ? <span style={{ padding:'3px 10px', borderRadius:20, fontSize:10, background:'rgba(248,113,113,0.1)', color:'#f87171', border:'1px solid rgba(248,113,113,0.3)' }}>⚠️ Po termínu</span>
                                : <span style={{ padding:'3px 10px', borderRadius:20, fontSize:10, background:'rgba(251,191,36,0.1)', color:'#fbbf24', border:'1px solid rgba(251,191,36,0.3)' }}>Na cestě</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Client verification section */}
                <div style={{ marginTop:20, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,170,112,0.2)', borderRadius:16, padding:'24px', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(212,170,112,0.5),transparent)' }}/>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'#D4AA70', textTransform:'uppercase', marginBottom:8 }}>Ověření klientek</div>
                  <p style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.5)', marginBottom:16, lineHeight:1.7 }}>
                    V sekci <strong style={{color:'rgba(245,238,242,0.7)'}}>Klientky</strong> můžete každou klientku označit jako ověřenou ✓ nebo přidat rizikovou poznámku. Při rezervaci neověřené klientky se zobrazí upozornění.
                  </p>
                  <button onClick={() => setTab('customers')}
                    style={{ background:'rgba(212,170,112,0.1)', border:'1px solid rgba(212,170,112,0.3)', borderRadius:10, padding:'10px 20px', color:'#D4AA70', fontFamily:'Georgia,serif', fontSize:11, letterSpacing:2, cursor:'pointer' }}>
                    Správa klientek →
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
