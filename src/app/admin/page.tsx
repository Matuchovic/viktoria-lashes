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
  CONFIRMED: { label:'Potvrzeno',  color:'#4ade80', bg:'rgba(74,222,128,0.1)',  border:'rgba(74,222,128,0.3)'  },
  COMPLETED: { label:'Dokončeno',  color:'#FF6BA8', bg:'rgba(255,107,168,0.1)', border:'rgba(255,107,168,0.3)' },
  CANCELLED: { label:'Zrušeno',    color:'#f87171', bg:'rgba(248,113,113,0.1)', border:'rgba(248,113,113,0.3)' },
  NO_SHOW:   { label:'Nedostavil', color:'#6b7280', bg:'rgba(107,114,128,0.1)', border:'rgba(107,114,128,0.2)' },
}

const TABS = [
  { id:'overview',  label:'Přehled',    icon:'◈' },
  { id:'bookings',  label:'Rezervace',  icon:'📅' },
  { id:'customers', label:'Klientky',   icon:'💕' },
  { id:'services',  label:'Služby',     icon:'✦' },
  { id:'safety',    label:'Bezpečnost', icon:'🛡️' },
  { id:'notifs',    label:'Notifikace', icon:'🔔' },
  { id:'reviews',   label:'Recenze',    icon:'⭐' },
]

const MONTHS = ['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince']

function GCard({ children, style }: any) {
  return (
    <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,107,168,0.12)', borderRadius:16, position:'relative', overflow:'hidden', ...style }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.4),rgba(212,170,112,0.2),transparent)' }}/>
      {children}
    </div>
  )
}

function StatCard({ label, value, sub, color, icon, delay=0 }: any) {
  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay}}
      style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${color}25`, borderRadius:14, padding:'14px 12px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${color}60,transparent)` }}/>
      <div style={{ fontSize:20, marginBottom:6, opacity:0.15, position:'absolute', top:10, right:12 }}>{icon}</div>
      <div style={{ fontFamily:'Georgia,serif', fontSize:8, letterSpacing:2, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:6, lineHeight:1.4, paddingRight:24 }}>{label}</div>
      <div style={{ fontFamily:'Georgia,serif', fontSize:'clamp(18px,4vw,28px)', color, lineHeight:1, marginBottom:3 }}>{value}</div>
      {sub && <div style={{ fontFamily:'Georgia,serif', fontSize:9, color:'rgba(245,238,242,0.3)', lineHeight:1.3 }}>{sub}</div>}
    </motion.div>
  )
}

function BookingModal({ booking, onClose, onStatusChange }: { booking:any; onClose:()=>void; onStatusChange:(id:string,s:string)=>void }) {
  const cfg = STATUS_CFG[booking.status] ?? STATUS_CFG.PENDING
  const date = new Date(booking.date)
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:10000, display:'flex', alignItems:'center', justifyContent:'center', padding:16, backdropFilter:'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{opacity:0,scale:0.9,y:30}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95}}
        style={{ background:'#0d0508', border:'1px solid rgba(255,107,168,0.35)', borderRadius:20, width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto', position:'relative', boxShadow:'0 0 60px rgba(255,107,168,0.2)' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#FF6BA8,#D4AA70,transparent)' }}/>
        <div style={{ padding:'20px 20px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'#FF6BA8', textTransform:'uppercase', marginBottom:4 }}>✦ Detail rezervace</div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:18, fontWeight:300 }}>{booking.customerName}</div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, width:34, height:34, color:'rgba(245,238,242,0.4)', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>×</button>
        </div>
        <div style={{ padding:'20px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
            <div style={{ background:`${cfg.color}10`, border:`1px solid ${cfg.color}30`, borderRadius:12, padding:'14px' }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:4 }}>Služba</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.85)', marginBottom:6 }}>{booking.service?.nameCs ?? 'Neznámá'}</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:22, color:'#FF6BA8' }}>{formatPrice(booking.totalKc)}</div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'14px' }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:4 }}>Termín</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:24, color:'rgba(245,238,242,0.85)', lineHeight:1 }}>{date.getDate()}.</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.5)' }}>{MONTHS[date.getMonth()]}</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:18, color:'#D4AA70', marginTop:4 }}>{booking.time}</div>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
            {[
              ['Č. rezervace', `#${booking.bookingRef?.slice(-8).toUpperCase()}`],
              ['Stylistka', booking.artist?.name ?? 'Viktória Ladiková'],
              ['E-mail', booking.customerEmail],
              ['Telefon', booking.customerPhone],
            ].map(([l,v]) => (
              <div key={l} style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'10px 12px', border:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontFamily:'Georgia,serif', fontSize:8, letterSpacing:2, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:3 }}>{l}</div>
                <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.75)' }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:8 }}>Změnit status</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {Object.entries(STATUS_CFG).map(([key, s]) => (
                <button key={key} onClick={() => { onStatusChange(booking.id, key); onClose() }}
                  style={{ padding:'7px 14px', borderRadius:20, border:`1px solid ${s.border}`, background:booking.status===key?s.bg:'transparent', color:s.color, fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                  {booking.status===key && '✓ '}{s.label}
                </button>
              ))}
            </div>
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
  const [notifForm, setNotifForm] = useState({ title:'', body:'', url:'/' })
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewsLoaded, setReviewsLoaded] = useState(false)
  const [editingReview, setEditingReview] = useState<any>(null)
  const [replyText, setReplyText] = useState('')
  const [notifLoading, setNotifLoading] = useState(false)
  const [notifResult, setNotifResult] = useState<any>(null)
  const [subCount, setSubCount] = useState<number | null>(null)
  const [customers, setCustomers] = useState<any[]>([])
  const [addingPoints, setAddingPoints] = useState<string | null>(null)
  const [pointsAmount, setPointsAmount] = useState('')
  const [onlineData, setOnlineData] = useState<any>(null)

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return }
    if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') { router.push('/dashboard') }
    document.body.classList.add('admin-page')
    return () => document.body.classList.remove('admin-page')
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
      setActiveCheckin(cArr.find((c: any) => !c.returnedAt) || null)
      setLoading(false)
      fetch('/api/push/send').then(r => r.json()).then(d => setSubCount(d.count)).catch(() => {})
      fetch('/api/customers').then(r => r.json()).then(d => { if(Array.isArray(d)) setCustomers(d) }).catch(() => {})
      // Fetch online users
      const fetchOnline = () => fetch('/api/analytics/online').then(r => r.json()).then(setOnlineData).catch(() => {})
      fetchOnline()
      const onlineInterval = setInterval(fetchOnline, 15000)
      return () => clearInterval(onlineInterval)
    }).catch(() => setLoading(false))
  }, [status])

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/bookings/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ status:newStatus }) })
      setBookings(b => b.map(x => x.id===id ? {...x, status:newStatus} : x))
    } catch {}
  }

  const startGPS = (checkinId: string, shareToken: string) => {
    if (!navigator.geolocation) { alert('GPS není dostupné.'); return }
    const token = shareToken || checkinId
    const link = `${window.location.origin}/sledovani?id=${checkinId}&token=${token}`
    setShareLink(link)
    setGpsTracking(true)
    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        try {
          await fetch('/api/safety/location', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ checkinId, lat:pos.coords.latitude, lng:pos.coords.longitude }) })
        } catch(e) {}
      },
      (err) => console.error('GPS:', err),
      { enableHighAccuracy:true, maximumAge:15000, timeout:15000 }
    )
    setGpsWatchId(watchId as unknown as number)
  }

  const stopGPS = () => {
    if (gpsWatchId !== null) navigator.geolocation.clearWatch(gpsWatchId)
    setGpsTracking(false); setGpsWatchId(null); setShareLink('')
  }

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight:'100vh', background:'#080608', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <motion.div animate={{opacity:[0.3,1,0.3]}} transition={{duration:2,repeat:Infinity}}
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
  const revenueThisMonth = bookings.filter(b=>new Date(b.date)>=thisMonth&&b.status!=='CANCELLED').reduce((s,b)=>s+(b.totalKc||0),0)
  const revenueLastMonth = bookings.filter(b=>new Date(b.date)>=lastMonth&&new Date(b.date)<=lastMonthEnd&&b.status!=='CANCELLED').reduce((s,b)=>s+(b.totalKc||0),0)
  const uniqueEmails = [...new Set(bookings.map(b=>b.customerEmail))]
  const pending = bookings.filter(b=>b.status==='PENDING').length
  const confirmed = bookings.filter(b=>b.status==='CONFIRMED').length
  const revenueGrowth = revenueLastMonth > 0 ? Math.round(((revenueThisMonth-revenueLastMonth)/revenueLastMonth)*100) : 0
  const filteredBookings = bookings.filter(b => {
    const matchStatus = filterStatus==='ALL' || b.status===filterStatus
    const matchSearch = !search || b.customerName?.toLowerCase().includes(search.toLowerCase()) || b.customerEmail?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <>
      <CustomCursor />
      {/* Hide chatbot on admin */}
      <style>{`.viktoria-chatbot { display: none !important; }`}</style>
      <AnimatePresence>
        {selectedBooking && <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} onStatusChange={updateStatus}/>}
      </AnimatePresence>

      {/* MOBILE TOP BAR */}
      <div className="md:hidden" style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, background:'rgba(8,6,8,0.97)', borderBottom:'1px solid rgba(255,107,168,0.15)', padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', backdropFilter:'blur(20px)' }}>
        <div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:11, letterSpacing:3, textTransform:'uppercase' }}>Viktória <span style={{color:'#FF6BA8'}}>Lashes</span></div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:7, letterSpacing:2, color:'rgba(255,107,168,0.5)', textTransform:'uppercase' }}>Admin Panel</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {activeCheckin && <div style={{ width:8, height:8, borderRadius:'50%', background:'#f87171', boxShadow:'0 0 8px #f87171' }}/>}
          {pending > 0 && <div style={{ background:'#FF6BA8', color:'white', borderRadius:20, padding:'2px 8px', fontFamily:'Georgia,serif', fontSize:10 }}>{pending}</div>}
          <button onClick={() => signOut({callbackUrl:'/'})} style={{ background:'none', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'5px 10px', color:'rgba(245,238,242,0.3)', fontFamily:'Georgia,serif', fontSize:9, cursor:'pointer' }}>Odhlásit</button>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden" style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:200, background:'rgba(8,6,8,0.97)', borderTop:'1px solid rgba(255,107,168,0.15)', display:'flex', backdropFilter:'blur(20px)' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'8px 2px 12px', border:'none', background:'transparent', position:'relative', cursor:'pointer' }}>
            {tab===t.id && <div style={{ position:'absolute', top:0, left:'15%', right:'15%', height:2, background:'#FF6BA8', borderRadius:'0 0 3px 3px' }}/>}
            <span style={{ fontSize:16 }}>{t.icon}</span>
            <span style={{ fontFamily:'Georgia,serif', fontSize:7, letterSpacing:1, textTransform:'uppercase', marginTop:2, color:tab===t.id?'#FF6BA8':'rgba(245,238,242,0.3)' }}>{t.label}</span>
            {t.id==='bookings' && pending>0 && <div style={{ position:'absolute', top:4, right:'10%', width:14, height:14, borderRadius:'50%', background:'#FF6BA8', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Georgia,serif', fontSize:8, color:'white' }}>{pending}</div>}
            {t.id==='safety' && activeCheckin && <div style={{ position:'absolute', top:4, right:'10%', width:8, height:8, borderRadius:'50%', background:'#f87171', boxShadow:'0 0 6px #f87171' }}/>}
          </button>
        ))}
      </div>

      {/* LAYOUT */}
      <div style={{ minHeight:'100vh', background:'#080608', display:'flex' }}>

        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:flex" style={{ width:220, flexShrink:0, borderRight:'1px solid rgba(255,107,168,0.1)', flexDirection:'column', position:'sticky', top:0, height:'100vh', background:'rgba(255,255,255,0.02)' }}>
          <div style={{ padding:'28px 24px 20px', borderBottom:'1px solid rgba(255,107,168,0.1)' }}>
            <Link href="/" style={{ textDecoration:'none' }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:13, letterSpacing:4, textTransform:'uppercase', fontWeight:300 }}>
                Viktória <span style={{ color:'#FF6BA8' }}>Lashes</span>
              </div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(255,107,168,0.5)', textTransform:'uppercase', marginTop:4 }}>Admin Panel</div>
            </Link>
          </div>
          <nav style={{ flex:1, padding:'16px 12px', display:'flex', flexDirection:'column', gap:4 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:10, border:'none', background:tab===t.id?'rgba(255,107,168,0.12)':'transparent', borderLeft:tab===t.id?'2px solid #FF6BA8':'2px solid transparent', fontFamily:'Georgia,serif', fontSize:12, letterSpacing:1, color:tab===t.id?'#FF6BA8':'rgba(245,238,242,0.4)', transition:'all 0.2s', cursor:'pointer' }}>
                <span style={{ fontSize:14 }}>{t.icon}</span>
                {t.label}
                {t.id==='bookings' && pending>0 && <span style={{ marginLeft:'auto', background:'#FF6BA8', color:'white', borderRadius:20, padding:'1px 7px', fontSize:9 }}>{pending}</span>}
                {t.id==='safety' && activeCheckin && <span style={{ marginLeft:'auto', background:'#f87171', color:'white', borderRadius:20, padding:'1px 7px', fontSize:9 }}>!</span>}
              </button>
            ))}
          </nav>
          <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(255,107,168,0.1)' }}>
            <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.5)', marginBottom:4 }}>{session?.user?.name}</div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'#FF6BA8', textTransform:'uppercase', marginBottom:12 }}>Admin</div>
            <button onClick={() => signOut({callbackUrl:'/'})} style={{ background:'none', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'7px 14px', color:'rgba(245,238,242,0.35)', fontFamily:'Georgia,serif', fontSize:10, width:'100%', letterSpacing:1, cursor:'pointer' }}>
              Odhlásit
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex:1, overflowY:'auto', minWidth:0 }}
          className="px-3 pt-16 pb-24 md:px-8 md:pt-8 md:pb-12">
          <div style={{ position:'fixed', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse 50% 40% at 60% 20%,rgba(196,105,138,0.07) 0%,transparent 70%)' }}/>

          <AnimatePresence mode="wait">

            {/* OVERVIEW */}
            {tab==='overview' && (
              <motion.div key="ov" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>✦ Dashboard</div>
                  <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:'clamp(22px,5vw,36px)', margin:0 }}>Přehled studia</h1>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <StatCard label="Tržby tento měsíc" value={formatPrice(revenueThisMonth)} sub={`${revenueGrowth>=0?'+':''}${revenueGrowth}% vs minulý`} color="#FF6BA8" icon="💰" delay={0.05}/>
                  <StatCard label="Nadcházející" value={upcoming.length} sub="rezervací" color="#D4AA70" icon="📅" delay={0.1}/>
                  <StatCard label="Klientek" value={uniqueEmails.length} color="#E8A4BE" icon="💕" delay={0.15}/>
                  <StatCard label="Čeká na potvrzení" value={pending} color="#f87171" icon="⏳" delay={0.2}/>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                  <StatCard label="Potvrzeno" value={confirmed} color="#4ade80" icon="✓" delay={0.25}/>
                  <StatCard label="Tržby min. měsíc" value={formatPrice(revenueLastMonth)} color="#D4AA70" icon="◈" delay={0.3}/>
                  <StatCard label="Celkem rezervací" value={bookings.length} color="#FF6BA8" icon="✦" delay={0.35}/>
                </div>
                {/* Online users widget */}
                {onlineData && (
                  <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
                    style={{ marginBottom:16, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:16, padding:'16px 20px', position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(74,222,128,0.4),transparent)' }}/>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom: onlineData.count > 0 ? 14 : 0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <motion.div animate={{ scale:[1,1.3,1], opacity:[1,0.5,1] }} transition={{ duration:2, repeat:Infinity }}
                          style={{ width:8, height:8, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 8px #4ade80' }}/>
                        <span style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'#4ade80', textTransform:'uppercase' }}>Právě online</span>
                      </div>
                      <span style={{ fontFamily:'Georgia,serif', fontSize:24, color:'#4ade80', marginLeft:'auto' }}>{onlineData.count}</span>
                      <span style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)' }}>návštěvníků</span>
                    </div>
                    {onlineData.count > 0 && (
                      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                        {onlineData.users.slice(0,5).map((u: any) => (
                          <div key={u.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 10px', borderRadius:8, background:'rgba(74,222,128,0.05)' }}>
                            <span style={{ fontSize:14 }}>{u.device==='mobile' ? '📱' : '💻'}</span>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.7)' }}>
                                {u.userName ? u.userName : 'Návštěvník'}
                                {u.isLoggedIn && <span style={{ marginLeft:6, fontSize:9, color:'#FF6BA8' }}>přihlášen</span>}
                              </div>
                              <div style={{ fontFamily:'Georgia,serif', fontSize:10, color:'rgba(245,238,242,0.3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.page}</div>
                            </div>
                            <span style={{ fontFamily:'Georgia,serif', fontSize:10, color:'rgba(74,222,128,0.5)' }}>
                              {Math.round((Date.now() - u.lastSeen) / 1000)}s
                            </span>
                          </div>
                        ))}
                        {Object.keys(onlineData.pageStats).length > 0 && (
                          <div style={{ marginTop:6, paddingTop:8, borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:6, flexWrap:'wrap' }}>
                            {Object.entries(onlineData.pageStats).map(([page, count]: [string, any]) => (
                              <span key={page} style={{ fontFamily:'Georgia,serif', fontSize:9, padding:'2px 8px', borderRadius:20, background:'rgba(74,222,128,0.08)', color:'rgba(74,222,128,0.6)', border:'1px solid rgba(74,222,128,0.15)' }}>
                                {page} ({count})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Upcoming list — mobile friendly cards */}
                <GCard>
                  <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <h2 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:'clamp(14px,4vw,18px)', margin:0 }}>Nadcházející rezervace</h2>
                    <button onClick={()=>setTab('bookings')} style={{ background:'none', border:'1px solid rgba(255,107,168,0.3)', padding:'5px 12px', borderRadius:8, color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, textTransform:'uppercase', cursor:'pointer' }}>Vše →</button>
                  </div>
                  <div style={{ padding:'8px' }}>
                    {upcoming.slice(0,5).map((b,i) => {
                      const cfg = STATUS_CFG[b.status] ?? STATUS_CFG.PENDING
                      return (
                        <motion.div key={b.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.4+i*0.05}}
                          onClick={() => setSelectedBooking(b)}
                          style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 8px', borderRadius:10, cursor:'pointer', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                          <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#C4698A,#FF6BA8)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Georgia,serif', fontSize:14, color:'white', flexShrink:0 }}>
                            {b.customerName?.[0]?.toUpperCase()}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.85)', marginBottom:1 }}>{b.customerName}</div>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:10, color:'rgba(245,238,242,0.35)' }}>{b.service?.nameCs} · {new Date(b.date).toLocaleDateString('cs-CZ',{day:'numeric',month:'short'})} {b.time}</div>
                          </div>
                          <span style={{ padding:'3px 8px', borderRadius:20, fontSize:9, fontFamily:'Georgia,serif', background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`, flexShrink:0 }}>{cfg.label}</span>
                        </motion.div>
                      )
                    })}
                    {upcoming.length===0 && <div style={{ padding:'32px', textAlign:'center', fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.2)' }}>Žádné nadcházející rezervace</div>}
                  </div>
                </GCard>
              </motion.div>
            )}

            {/* BOOKINGS */}
            {tab==='bookings' && (
              <motion.div key="bk" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>✦ Správa</div>
                  <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:'clamp(22px,5vw,32px)', margin:0, marginBottom:12 }}>Všechny rezervace</h1>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Hledat klientku..."
                      style={{ flex:1, minWidth:160, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,107,168,0.2)', borderRadius:10, padding:'8px 12px', color:'rgba(245,238,242,0.8)', fontFamily:'Georgia,serif', fontSize:12, outline:'none' }}/>
                    <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
                      style={{ background:'#0d0508', border:'1px solid rgba(255,107,168,0.2)', borderRadius:10, padding:'8px 12px', color:'rgba(245,238,242,0.8)', fontFamily:'Georgia,serif', fontSize:12, outline:'none' }}>
                      <option value="ALL">Vše ({bookings.length})</option>
                      {Object.entries(STATUS_CFG).map(([k,v])=>(
                        <option key={k} value={k}>{v.label} ({bookings.filter(b=>b.status===k).length})</option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Mobile: cards | Desktop: table */}
                <div className="md:hidden" style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {filteredBookings.map((b,i) => {
                    const cfg = STATUS_CFG[b.status] ?? STATUS_CFG.PENDING
                    return (
                      <motion.div key={b.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.03}}
                        onClick={() => setSelectedBooking(b)}
                        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,107,168,0.1)', borderRadius:14, padding:'14px', position:'relative', overflow:'hidden', cursor:'pointer' }}>
                        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.3),transparent)' }}/>
                        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                          <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#C4698A,#FF6BA8)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Georgia,serif', fontSize:16, color:'white', flexShrink:0 }}>
                            {b.customerName?.[0]?.toUpperCase()}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:14, color:'rgba(245,238,242,0.9)' }}>{b.customerName}</div>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:10, color:'rgba(245,238,242,0.3)' }}>#{b.bookingRef?.slice(-6).toUpperCase()}</div>
                          </div>
                          <span style={{ padding:'4px 10px', borderRadius:20, fontSize:9, fontFamily:'Georgia,serif', background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}` }}>{cfg.label}</span>
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.5)' }}>📅 {new Date(b.date).toLocaleDateString('cs-CZ',{day:'numeric',month:'short'})} {b.time}</div>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.5)' }}>{b.service?.nameCs}</div>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'#FF6BA8' }}>{formatPrice(b.totalKc)}</div>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)' }}>{b.customerPhone}</div>
                        </div>
                      </motion.div>
                    )
                  })}
                  {filteredBookings.length===0 && <div style={{ padding:'48px', textAlign:'center', fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.2)' }}>Žádné výsledky</div>}
                </div>
                <div className="hidden md:block">
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
                          {filteredBookings.map((b,i) => {
                            const cfg = STATUS_CFG[b.status] ?? STATUS_CFG.PENDING
                            return (
                              <motion.tr key={b.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}
                                style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                                <td style={{ padding:'14px 18px' }}>
                                  <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.85)' }}>{b.customerName}</div>
                                  <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.25)', textTransform:'uppercase' }}>#{b.bookingRef?.slice(-6).toUpperCase()}</div>
                                </td>
                                <td style={{ padding:'14px 18px' }}>
                                  <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.5)' }}>{b.customerEmail}</div>
                                  <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)' }}>{b.customerPhone}</div>
                                </td>
                                <td style={{ padding:'14px 18px', fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.6)' }}>{b.service?.nameCs}</td>
                                <td style={{ padding:'14px 18px' }}>
                                  <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.7)' }}>{new Date(b.date).toLocaleDateString('cs-CZ',{day:'numeric',month:'short'})}</div>
                                  <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)' }}>{b.time}</div>
                                </td>
                                <td style={{ padding:'14px 18px' }}>
                                  <span style={{ padding:'4px 10px', borderRadius:20, fontSize:10, fontFamily:'Georgia,serif', background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}` }}>{cfg.label}</span>
                                </td>
                                <td style={{ padding:'14px 18px', fontFamily:'Georgia,serif', fontSize:16, color:'#FF6BA8' }}>{formatPrice(b.totalKc)}</td>
                                <td style={{ padding:'14px 18px' }}>
                                  <button onClick={()=>setSelectedBooking(b)}
                                    style={{ background:'rgba(255,107,168,0.1)', border:'1px solid rgba(255,107,168,0.35)', borderRadius:8, padding:'6px 14px', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:10, cursor:'pointer' }}>
                                    Detail →
                                  </button>
                                </td>
                              </motion.tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </GCard>
                </div>
              </motion.div>
            )}

            {/* CUSTOMERS */}
            {tab==='customers' && (
              <motion.div key="cu" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>✦ CRM</div>
                  <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:'clamp(22px,5vw,32px)', margin:0 }}>Databáze klientek</h1>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,280px),1fr))', gap:12 }}>
                  {uniqueEmails.map((email,i) => {
                    // Get customer DB data for points
                    const cb = bookings.filter(b=>b.customerEmail===email)
                    const total = cb.reduce((s,b)=>s+(b.totalKc||0),0)
                    const last = [...cb].sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime())[0]
                    return (
                      <motion.div key={email as string} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,107,168,0.12)', borderRadius:14, padding:'16px', position:'relative', overflow:'hidden' }}>
                        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.3),transparent)' }}/>
                        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                          <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#C4698A,#FF6BA8)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Georgia,serif', fontSize:16, color:'white', flexShrink:0 }}>
                            {last?.customerName?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <div style={{ minWidth:0 }}>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.85)' }}>{last?.customerName ?? 'Neznámá'}</div>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:10, color:'rgba(245,238,242,0.35)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{email as string}</div>
                          </div>
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                          <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'10px 12px' }}>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:8, letterSpacing:2, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:3 }}>Návštěvy</div>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:22, color:'#FF6BA8' }}>{cb.length}</div>
                          </div>
                          <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'10px 12px' }}>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:8, letterSpacing:2, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:3 }}>Celkem</div>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:16, color:'#D4AA70' }}>{formatPrice(total)}</div>
                          </div>
                          <div style={{ background:'rgba(212,170,112,0.06)', border:'1px solid rgba(212,170,112,0.2)', borderRadius:10, padding:'10px 12px', gridColumn:'1/-1' }}>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:8, letterSpacing:2, color:'rgba(212,170,112,0.5)', textTransform:'uppercase', marginBottom:3 }}>✦ Lash Body body</div>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:20, color:'#D4AA70' }}>
                              {(last as any)?.user?.loyaltyPoints ?? cb[0]?.user?.loyaltyPoints ?? '—'} bodů
                            </div>
                          </div>
                        </div>
                        {last && <div style={{ fontFamily:'Georgia,serif', fontSize:10, color:'rgba(245,238,242,0.3)' }}>Poslední: {new Date(last.date).toLocaleDateString('cs-CZ',{day:'numeric',month:'long'})}</div>}
                        <button onClick={()=>setSelectedBooking(last)}
                          style={{ marginTop:10, width:'100%', background:'rgba(255,107,168,0.08)', border:'1px solid rgba(255,107,168,0.25)', borderRadius:8, padding:'7px', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:10, cursor:'pointer' }}>
                          Poslední rezervace →
                        </button>

                        {/* Add points manually */}
                        {addingPoints === (email as string) ? (
                          <div style={{ marginTop:8, display:'flex', gap:6 }}>
                            <input
                              type="number"
                              placeholder="Počet bodů"
                              value={pointsAmount}
                              onChange={e => setPointsAmount(e.target.value)}
                              style={{ flex:1, background:'rgba(212,170,112,0.08)', border:'1px solid rgba(212,170,112,0.3)', borderRadius:8, padding:'7px 10px', color:'rgba(245,238,242,0.85)', fontFamily:'Georgia,serif', fontSize:12, outline:'none' }}
                            />
                            <button onClick={async () => {
                              if (!pointsAmount || !last?.customerEmail) return
                              const res = await fetch('/api/loyalty/add-points', {
                                method: 'POST',
                                headers: {'Content-Type':'application/json'},
                                body: JSON.stringify({ email: last.customerEmail, points: Number(pointsAmount), reason: 'Body přidány Viktórií 💕' })
                              })
                              if (res.ok) {
                                alert(`✓ Přidáno ${pointsAmount} bodů`)
                                setAddingPoints(null)
                                setPointsAmount('')
                              } else alert('Chyba — klientka nemá registraci')
                            }}
                              style={{ background:'rgba(212,170,112,0.15)', border:'1px solid rgba(212,170,112,0.4)', borderRadius:8, padding:'7px 12px', color:'#D4AA70', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                              ✓
                            </button>
                            <button onClick={() => { setAddingPoints(null); setPointsAmount('') }}
                              style={{ background:'none', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'7px 10px', color:'rgba(245,238,242,0.3)', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                              ✗
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => { setAddingPoints(email as string); setPointsAmount('') }}
                            style={{ marginTop:6, width:'100%', background:'rgba(212,170,112,0.06)', border:'1px solid rgba(212,170,112,0.2)', borderRadius:8, padding:'7px', color:'#D4AA70', fontFamily:'Georgia,serif', fontSize:10, cursor:'pointer' }}>
                            ✦ Přidat Lash Body body
                          </button>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* SERVICES */}
            {tab==='services' && (
              <motion.div key="sv" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>✦ Ceník</div>
                  <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:'clamp(22px,5vw,32px)', margin:0 }}>Správa služeb</h1>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,260px),1fr))', gap:12 }}>
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
                        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,107,168,0.12)', borderRadius:14, padding:'18px', position:'relative', overflow:'hidden' }}>
                        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.4),transparent)' }}/>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:14, color:'rgba(245,238,242,0.85)', marginBottom:6 }}>{s.name}</div>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:28, color:'#FF6BA8', marginBottom:4 }}>{formatPrice(s.price)}</div>
                        <div style={{ display:'flex', gap:14, fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)', marginBottom:10 }}>
                          <span>⏱ {s.duration} min</span>
                          <span>📊 {count}× objednáno</span>
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
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:5, color:'#f87171', textTransform:'uppercase', marginBottom:6 }}>🛡️ Bezpečnostní systém</div>
                  <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:'clamp(20px,5vw,32px)', margin:0 }}>Ochrana při výjezdech</h1>
                </div>

                {/* Active checkin */}
                {activeCheckin && (
                  <motion.div initial={{opacity:0,scale:0.98}} animate={{opacity:1,scale:1}}
                    style={{ marginBottom:16, borderRadius:16, border:'1px solid rgba(248,113,113,0.4)', overflow:'hidden', position:'relative' }}>
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#f87171,transparent)' }}/>
                    <div style={{ padding:'14px 16px', background:'rgba(248,113,113,0.1)' }}>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'#f87171', textTransform:'uppercase', marginBottom:4 }}>⚠️ Aktivní výjezd</div>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:16, color:'rgba(245,238,242,0.9)', marginBottom:2 }}>{activeCheckin.clientName}</div>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.5)' }}>
                        📍 {activeCheckin.address} · Návrat: {new Date(activeCheckin.expectedBack).toLocaleTimeString('cs-CZ',{hour:'2-digit',minute:'2-digit'})}
                        {new Date(activeCheckin.expectedBack) < new Date() && <span style={{ marginLeft:8, color:'#f87171', fontWeight:700 }}>⚠️ PO TERMÍNU!</span>}
                      </div>
                    </div>
                    {/* 3 action buttons */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', borderTop:'1px solid rgba(248,113,113,0.2)' }}>
                      <a href={'https://wa.me/420720307007?text=' + encodeURIComponent('🚨 SOS! Potřebuji pomoc!\nAdresa: ' + activeCheckin.address + '\nKlientka: ' + activeCheckin.clientName + ' ' + activeCheckin.clientPhone + (shareLink ? '\nPoloha: ' + shareLink : ''))}
                        target="_blank" rel="noopener noreferrer"
                        onClick={() => { try { navigator.vibrate([200,100,200,100,200]) } catch(e){} }}
                        style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'14px 8px', background:'rgba(239,68,68,0.2)', borderRight:'1px solid rgba(248,113,113,0.2)', textDecoration:'none', gap:4 }}>
                        <span style={{ fontSize:22 }}>🚨</span>
                        <span style={{ fontFamily:'Georgia,serif', fontSize:9, color:'#f87171', textTransform:'uppercase', textAlign:'center', letterSpacing:1 }}>SOS Alert</span>
                      </a>
                      <a href={'tel:' + activeCheckin.clientPhone}
                        style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'14px 8px', background:'rgba(251,191,36,0.08)', borderRight:'1px solid rgba(248,113,113,0.2)', textDecoration:'none', gap:4 }}>
                        <span style={{ fontSize:22 }}>📞</span>
                        <span style={{ fontFamily:'Georgia,serif', fontSize:9, color:'#fbbf24', textTransform:'uppercase', textAlign:'center', letterSpacing:1 }}>Volat</span>
                      </a>
                      <button
                        onClick={() => setActiveCheckin((c: any) => ({...c, arrivedAt: c.arrivedAt ? null : new Date().toISOString()}))}
                        style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'14px 8px', background: activeCheckin.arrivedAt ? 'rgba(74,222,128,0.15)' : 'rgba(74,222,128,0.05)', border:'none', gap:4, cursor:'pointer' }}>
                        <span style={{ fontSize:22 }}>{activeCheckin.arrivedAt ? '✅' : '🏠'}</span>
                        <span style={{ fontFamily:'Georgia,serif', fontSize:9, color: activeCheckin.arrivedAt ? '#4ade80' : 'rgba(74,222,128,0.4)', textTransform:'uppercase', textAlign:'center', letterSpacing:1 }}>
                          {activeCheckin.arrivedAt ? 'Dorazila' : 'Příjezd OK'}
                        </span>
                      </button>
                    </div>
                    <div style={{ padding:'10px 16px', background:'rgba(0,0,0,0.2)', borderTop:'1px solid rgba(248,113,113,0.1)' }}>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:9, color:'rgba(245,238,242,0.2)' }}>🚨 SOS = WhatsApp manželovi · 📞 Volat klientce · 🏠 Potvrzení příjezdu</div>
                    </div>
                    {/* GPS */}
                    <div style={{ padding:'14px 16px', background:'rgba(248,113,113,0.05)', borderTop:'1px solid rgba(248,113,113,0.15)', display:'flex', gap:8, flexWrap:'wrap', alignItems:'flex-start', flexDirection:'column' }}>
                      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                        {!gpsTracking ? (
                          <button onClick={() => startGPS(activeCheckin.id, activeCheckin.shareToken || activeCheckin.id)}
                            style={{ background:'linear-gradient(135deg,rgba(255,107,168,0.2),rgba(196,105,138,0.15))', border:'1.5px solid rgba(255,107,168,0.5)', borderRadius:10, padding:'10px 16px', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:12, cursor:'pointer' }}>
                            📍 Spustit GPS + link pro manžela
                          </button>
                        ) : (
                          <button onClick={stopGPS}
                            style={{ background:'rgba(248,113,113,0.15)', border:'1px solid rgba(248,113,113,0.4)', borderRadius:10, padding:'10px 16px', color:'#f87171', fontFamily:'Georgia,serif', fontSize:12, cursor:'pointer' }}>
                            ⏹ Zastavit GPS
                          </button>
                        )}
                        <button onClick={async () => {
                          stopGPS()
                          await fetch('/api/safety/checkin', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id: activeCheckin.id }) })
                          setActiveCheckin(null)
                          setCheckins((c: any[]) => c.map(x => x.id===activeCheckin.id ? {...x, returnedAt: new Date()} : x))
                        }} style={{ background:'#4ade80', border:'none', borderRadius:10, padding:'10px 20px', color:'#0a1a0a', fontFamily:'Georgia,serif', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                          ✓ Jsem bezpečně zpět
                        </button>
                      </div>
                      {gpsTracking && shareLink && (
                        <div style={{ width:'100%', marginTop:8, padding:'12px', borderRadius:10, background:'rgba(255,107,168,0.06)', border:'1px solid rgba(255,107,168,0.2)' }}>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>📍 GPS aktivní — odkaz pro manžela</div>
                          <div style={{ display:'flex', gap:6, marginBottom:8 }}>
                            <input readOnly value={shareLink} style={{ flex:1, minWidth:0, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'6px 10px', color:'rgba(245,238,242,0.6)', fontFamily:'Georgia,serif', fontSize:10, outline:'none' }}/>
                            <button onClick={() => navigator.clipboard.writeText(shareLink)} style={{ background:'rgba(255,107,168,0.15)', border:'1px solid rgba(255,107,168,0.3)', borderRadius:8, padding:'6px 12px', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:10, cursor:'pointer', whiteSpace:'nowrap' }}>Kopírovat</button>
                          </div>
                          <a href={'https://wa.me/?text=' + encodeURIComponent('Sleduj mou polohu živě: ' + shareLink)} target="_blank"
                            style={{ display:'inline-block', padding:'8px 16px', borderRadius:8, background:'rgba(37,211,102,0.15)', border:'1px solid rgba(37,211,102,0.4)', color:'#25d166', fontFamily:'Georgia,serif', fontSize:11, textDecoration:'none' }}>
                            📲 Sdílet přes WhatsApp
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* New checkin form */}
                {!activeCheckin && (
                  <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:16, padding:'20px', marginBottom:16, position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(248,113,113,0.5),transparent)' }}/>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'rgba(248,113,113,0.7)', textTransform:'uppercase', marginBottom:14 }}>Nový výjezd — check-in</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:12 }}>
                      {[
                        {label:'Adresa klientky', key:'address', ph:'Nádražní 12, Mladá Boleslav'},
                        {label:'Jméno klientky',  key:'clientName', ph:'Jana Nováková'},
                        {label:'Telefon klientky', key:'clientPhone', ph:'+420 123 456 789'},
                        {label:'Doba (minuty)', key:'expectedMinutes', ph:'90'},
                      ].map(f => (
                        <div key={f.key}>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:8, letterSpacing:2, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:5 }}>{f.label}</div>
                          <input value={(safetyForm as any)[f.key]} onChange={e => setSafetyForm(s => ({...s,[f.key]:e.target.value}))}
                            placeholder={f.ph}
                            style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:10, padding:'10px 12px', color:'rgba(245,238,242,0.85)', fontFamily:'Georgia,serif', fontSize:13, outline:'none', boxSizing:'border-box' }}/>
                        </div>
                      ))}
                    </div>
                    <button disabled={safetyLoading || !safetyForm.address || !safetyForm.clientName}
                      onClick={async () => {
                        setSafetyLoading(true)
                        const res = await fetch('/api/safety/checkin', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(safetyForm) })
                        const data = await res.json()
                        setActiveCheckin(data)
                        setCheckins((c: any[]) => [data, ...c])
                        setSafetyForm({ address:'', clientName:'', clientPhone:'', expectedMinutes:'90', notes:'' })
                        setSafetyLoading(false)
                      }}
                      style={{ background:'linear-gradient(135deg,#dc2626,#f87171)', border:'none', borderRadius:10, padding:'12px 24px', color:'white', fontFamily:'Georgia,serif', fontSize:12, letterSpacing:2, cursor:'pointer', width:'100%', opacity:safetyLoading||!safetyForm.address?0.6:1 }}>
                      {safetyLoading ? 'Odesílám...' : '🛡️ Odjíždím — spustit check-in'}
                    </button>
                  </div>
                )}

                {/* History */}
                <GCard>
                  <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontFamily:'Georgia,serif', fontSize:14, fontWeight:300 }}>Historie výjezdů</div>
                  <div style={{ display:'flex', flexDirection:'column' }}>
                    {checkins.length===0 && <div style={{ padding:'32px', textAlign:'center', fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.2)' }}>Žádné záznamy</div>}
                    {checkins.map(c => (
                      <div key={c.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.85)' }}>{c.clientName}</div>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.address}</div>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:10, color:'rgba(245,238,242,0.25)' }}>{new Date(c.departedAt).toLocaleString('cs-CZ',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</div>
                        </div>
                        <span style={{ padding:'3px 10px', borderRadius:20, fontSize:9, flexShrink:0,
                          background: c.returnedAt ? 'rgba(74,222,128,0.1)' : new Date(c.expectedBack)<new Date() ? 'rgba(248,113,113,0.1)' : 'rgba(251,191,36,0.1)',
                          color: c.returnedAt ? '#4ade80' : new Date(c.expectedBack)<new Date() ? '#f87171' : '#fbbf24',
                          border: `1px solid ${c.returnedAt ? 'rgba(74,222,128,0.3)' : new Date(c.expectedBack)<new Date() ? 'rgba(248,113,113,0.3)' : 'rgba(251,191,36,0.3)'}` }}>
                          {c.returnedAt ? '✓ Zpět' : new Date(c.expectedBack)<new Date() ? '⚠️ Po termínu' : 'Na cestě'}
                        </span>
                      </div>
                    ))}
                  </div>
                </GCard>
              </motion.div>
            )}

            {/* NOTIFICATIONS */}
            {tab==='notifs' && (
              <motion.div key="nf" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>🔔 Push notifikace</div>
                  <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:'clamp(20px,5vw,32px)', margin:0 }}>Odeslat oznámení</h1>
                </div>

                {/* Subscriber count */}
                <div style={{ marginBottom:16, padding:'16px 20px', borderRadius:14, background:'rgba(255,107,168,0.06)', border:'1px solid rgba(255,107,168,0.2)', display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:24 }}>📱</span>
                  <div>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:22, color:'#FF6BA8' }}>{subCount ?? '...'}</div>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.4)' }}>klientek má zapnutá oznámení</div>
                  </div>
                </div>

                {/* Notification form */}
                <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,107,168,0.15)', borderRadius:16, padding:20, marginBottom:16, position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.4),transparent)' }}/>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'rgba(255,107,168,0.6)', textTransform:'uppercase', marginBottom:16 }}>Nové oznámení</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    {[
                      { key:'title', label:'Nadpis oznámení', ph:'Nový termín k dispozici! 💕' },
                      { key:'body',  label:'Text oznámení',   ph:'Viktória má volné termíny tento týden. Rezervujte hned!' },
                      { key:'url',   label:'Odkaz (kam kliknout)', ph:'/rezervace' },
                    ].map(f => (
                      <div key={f.key}>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:8, letterSpacing:2, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:5 }}>{f.label}</div>
                        {f.key === 'body' ? (
                          <textarea value={(notifForm as any)[f.key]} onChange={e => setNotifForm(s => ({...s,[f.key]:e.target.value}))}
                            placeholder={f.ph} rows={3}
                            style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,107,168,0.2)', borderRadius:10, padding:'10px 12px', color:'rgba(245,238,242,0.85)', fontFamily:'Georgia,serif', fontSize:13, outline:'none', resize:'none', boxSizing:'border-box' as const }}/>
                        ) : (
                          <input value={(notifForm as any)[f.key]} onChange={e => setNotifForm(s => ({...s,[f.key]:e.target.value}))}
                            placeholder={f.ph}
                            style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,107,168,0.2)', borderRadius:10, padding:'10px 12px', color:'rgba(245,238,242,0.85)', fontFamily:'Georgia,serif', fontSize:13, outline:'none', boxSizing:'border-box' as const }}/>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Preview */}
                  {(notifForm.title || notifForm.body) && (
                    <div style={{ marginTop:16, padding:'12px 14px', borderRadius:12, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:6 }}>Náhled notifikace</div>
                      <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                        <img src="/apple-touch-icon.png" style={{ width:32, height:32, borderRadius:8, flexShrink:0 }}/>
                        <div>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.85)', marginBottom:2 }}>{notifForm.title || 'Nadpis'}</div>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.5)' }}>{notifForm.body || 'Text zprávy'}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    disabled={notifLoading || !notifForm.title || !notifForm.body}
                    onClick={async () => {
                      setNotifLoading(true)
                      setNotifResult(null)
                      const res = await fetch('/api/push/send', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(notifForm) })
                      const data = await res.json()
                      setNotifResult(data)
                      setNotifLoading(false)
                      if (data.sent > 0) setNotifForm({ title:'', body:'', url:'/' })
                    }}
                    style={{ marginTop:16, width:'100%', padding:'14px', borderRadius:12, background: notifLoading||!notifForm.title ? 'rgba(255,107,168,0.3)' : 'linear-gradient(135deg,#C4698A,#FF6BA8)', border:'none', color:'white', fontFamily:'Georgia,serif', fontSize:13, cursor: notifLoading ? 'wait' : 'pointer', boxShadow: notifForm.title ? '0 0 20px rgba(255,107,168,0.3)' : 'none' }}>
                    {notifLoading ? '⏳ Odesílám...' : '🔔 Odeslat všem klientkám'}
                  </button>

                  {notifResult && (
                    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                      style={{ marginTop:12, padding:'12px 14px', borderRadius:12, background: notifResult.sent > 0 ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', border: `1px solid ${notifResult.sent > 0 ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}` }}>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:13, color: notifResult.sent > 0 ? '#4ade80' : '#f87171' }}>
                        {notifResult.sent > 0 ? `✓ Odesláno ${notifResult.sent} klientkám` : '⚠️ ' + (notifResult.message || 'Nepodařilo se odeslat')}
                      </div>
                      {notifResult.failed > 0 && <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.3)', marginTop:4 }}>{notifResult.failed} neúspěšných (expirované odběry odstraněny)</div>}
                    </motion.div>
                  )}
                </div>

                {/* Quick templates */}
                <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:16 }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:12 }}>Rychlé šablony</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {[
                      { title:'Volné termíny 💕', body:'Mám volné termíny tento týden! Rezervujte si rychle.', url:'/rezervace' },
                      { title:'Připomínka doplnění ✨', body:'Je čas na doplnění řas? Mám pro vás volné termíny.', url:'/rezervace' },
                      { title:'Akce — sleva 💝', body:'Speciální nabídka jen tento týden. Podívejte se!', url:'/' },
                    ].map(t => (
                      <button key={t.title} onClick={() => setNotifForm(t)}
                        style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:10, background:'rgba(255,107,168,0.05)', border:'1px solid rgba(255,107,168,0.15)', cursor:'pointer', textAlign:'left' as const }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.8)', marginBottom:2 }}>{t.title}</div>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:10, color:'rgba(245,238,242,0.35)' }}>{t.body}</div>
                        </div>
                        <span style={{ color:'rgba(255,107,168,0.5)', fontSize:12 }}>→</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* REVIEWS */}
            {tab==='reviews' && (
              <motion.div key="rv" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                ref={el => { if(el && !reviewsLoaded) { setReviewsLoaded(true); fetch('/api/reviews/admin').then(r=>r.json()).then(setReviews) } }}>
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>⭐ Správa recenzí</div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
                    <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:'clamp(20px,5vw,32px)', margin:0 }}>Recenze klientek</h1>
                    <a href="/napsat-recenzi" target="_blank" style={{ padding:'8px 16px', borderRadius:10, background:'rgba(255,107,168,0.1)', border:'1px solid rgba(255,107,168,0.3)', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:11, textDecoration:'none' }}>
                      + Odkaz na formulář →
                    </a>
                  </div>
                </div>

                {/* Status filter tabs */}
                <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
                  {[
                    { key:'ALL', label:`Vše (${reviews.length})` },
                    { key:'PENDING', label:`Čeká (${reviews.filter(r=>r.status==='PENDING').length})`, color:'#D4AA70' },
                    { key:'APPROVED', label:`Schváleno (${reviews.filter(r=>r.status==='APPROVED').length})`, color:'#4ade80' },
                    { key:'REJECTED', label:`Zamítnuto (${reviews.filter(r=>r.status==='REJECTED').length})`, color:'#f87171' },
                  ].map(f => (
                    <button key={f.key} onClick={() => setSearch(f.key==='ALL' ? '' : f.key)}
                      style={{ padding:'6px 14px', borderRadius:20, border:`1px solid ${f.color||'rgba(255,255,255,0.15)'}`, background:'transparent', color:f.color||'rgba(245,238,242,0.5)', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                      {f.label}
                    </button>
                  ))}
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {reviews.filter(r => !search || r.status===search).map(r => (
                    <motion.div key={r.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                      style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${r.status==='APPROVED'?'rgba(74,222,128,0.2)':r.status==='REJECTED'?'rgba(248,113,113,0.2)':'rgba(212,170,112,0.2)'}`, borderRadius:16, padding:18, position:'relative', overflow:'hidden' }}>
                      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${r.status==='APPROVED'?'rgba(74,222,128,0.4)':r.status==='REJECTED'?'rgba(248,113,113,0.4)':'rgba(212,170,112,0.4)'},transparent)` }}/>

                      {/* Header */}
                      <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:10 }}>
                        <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#C4698A,#FF6BA8)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Georgia,serif', fontSize:15, color:'white', flexShrink:0 }}>
                          {r.authorName?.[0]?.toUpperCase()}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:2 }}>
                            <span style={{ fontFamily:'Georgia,serif', fontSize:14, color:'rgba(245,238,242,0.9)' }}>{r.authorName}</span>
                            {r.location && <span style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)' }}>📍 {r.location}</span>}
                            {r.service && <span style={{ fontFamily:'Georgia,serif', fontSize:10, padding:'2px 8px', borderRadius:20, background:'rgba(255,107,168,0.1)', color:'rgba(255,107,168,0.7)', border:'1px solid rgba(255,107,168,0.2)' }}>{r.service}</span>}
                          </div>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <span style={{ color:'#D4AA70', fontSize:12 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                            <span style={{ fontFamily:'Georgia,serif', fontSize:10, color:'rgba(245,238,242,0.25)' }}>{new Date(r.createdAt).toLocaleDateString('cs-CZ')}</span>
                            <span style={{ padding:'2px 8px', borderRadius:20, fontSize:9, fontFamily:'Georgia,serif',
                              background:r.status==='APPROVED'?'rgba(74,222,128,0.1)':r.status==='REJECTED'?'rgba(248,113,113,0.1)':'rgba(212,170,112,0.1)',
                              color:r.status==='APPROVED'?'#4ade80':r.status==='REJECTED'?'#f87171':'#D4AA70',
                              border:`1px solid ${r.status==='APPROVED'?'rgba(74,222,128,0.3)':r.status==='REJECTED'?'rgba(248,113,113,0.3)':'rgba(212,170,112,0.3)'}` }}>
                              {r.status==='APPROVED'?'✓ Schváleno':r.status==='REJECTED'?'✗ Zamítnuto':'⏳ Čeká'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Text */}
                      <p style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.7)', lineHeight:1.7, marginBottom:10, fontStyle:'italic' }}>"{r.text}"</p>

                      {/* Admin reply */}
                      {r.adminReply && (
                        <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(255,107,168,0.06)', border:'1px solid rgba(255,107,168,0.2)', marginBottom:10 }}>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'#FF6BA8', textTransform:'uppercase', marginBottom:4 }}>💕 Odpověď Viktórie</div>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.65)' }}>{r.adminReply}</div>
                        </div>
                      )}

                      {/* Reply input */}
                      {editingReview===r.id && (
                        <div style={{ marginBottom:10 }}>
                          <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Napište odpověď klientce..." rows={3}
                            style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,107,168,0.25)', borderRadius:10, padding:'10px 12px', color:'rgba(245,238,242,0.85)', fontFamily:'Georgia,serif', fontSize:13, outline:'none', resize:'none', boxSizing:'border-box' as const }}/>
                          <div style={{ display:'flex', gap:6, marginTop:6 }}>
                            <button onClick={async () => {
                              await fetch('/api/reviews/admin', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id:r.id, adminReply:replyText }) })
                              setReviews(rv => rv.map(x => x.id===r.id ? {...x, adminReply:replyText} : x))
                              setEditingReview(null); setReplyText('')
                            }} style={{ padding:'7px 16px', borderRadius:8, background:'rgba(255,107,168,0.15)', border:'1px solid rgba(255,107,168,0.3)', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                              Uložit odpověď
                            </button>
                            <button onClick={() => { setEditingReview(null); setReplyText('') }}
                              style={{ padding:'7px 14px', borderRadius:8, background:'none', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(245,238,242,0.35)', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                              Zrušit
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                        {r.status !== 'APPROVED' && (
                          <button onClick={async () => {
                            await fetch('/api/reviews/admin', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id:r.id, status:'APPROVED' }) })
                            setReviews(rv => rv.map(x => x.id===r.id ? {...x, status:'APPROVED'} : x))
                          }} style={{ padding:'6px 14px', borderRadius:8, background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.3)', color:'#4ade80', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                            ✓ Schválit
                          </button>
                        )}
                        {r.status !== 'REJECTED' && (
                          <button onClick={async () => {
                            await fetch('/api/reviews/admin', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id:r.id, status:'REJECTED' }) })
                            setReviews(rv => rv.map(x => x.id===r.id ? {...x, status:'REJECTED'} : x))
                          }} style={{ padding:'6px 14px', borderRadius:8, background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                            ✗ Zamítnout
                          </button>
                        )}
                        <button onClick={() => { setEditingReview(r.id); setReplyText(r.adminReply || '') }}
                          style={{ padding:'6px 14px', borderRadius:8, background:'rgba(255,107,168,0.08)', border:'1px solid rgba(255,107,168,0.25)', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                          💕 {r.adminReply ? 'Upravit odpověď' : 'Odpovědět'}
                        </button>
                        <button onClick={async () => {
                          if (!confirm('Opravdu smazat?')) return
                          await fetch('/api/reviews/admin', { method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id:r.id }) })
                          setReviews(rv => rv.filter(x => x.id !== r.id))
                        }} style={{ padding:'6px 14px', borderRadius:8, background:'none', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(245,238,242,0.3)', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                          🗑 Smazat
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {reviews.length === 0 && (
                    <div style={{ padding:48, textAlign:'center', fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.2)' }}>
                      Zatím žádné recenze. Sdílejte odkaz na formulář s klientkami!
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
