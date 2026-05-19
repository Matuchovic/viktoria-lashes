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
  { id:'overview',  label:'Přehled',    icon:'◈' },
  { id:'bookings',  label:'Rezervace',  icon:'📅' },
  { id:'customers', label:'Klientky',   icon:'💕' },
  { id:'services',  label:'Služby',     icon:'✦' },
]

function GCard({ children, style, glow }: any) {
  return (
    <div style={{
      background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,107,168,0.12)',
      borderRadius:16, position:'relative', overflow:'hidden',
      boxShadow: glow ? `0 0 40px ${glow}` : 'none',
      backdropFilter:'blur(10px)',
      ...style,
    }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.4),rgba(212,170,112,0.2),transparent)' }}/>
      {children}
    </div>
  )
}

function StatCard({ label, value, sub, color, icon, delay }: any) {
  return (
    <motion.div initial={{ opacity:0, y:20, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }}
      transition={{ delay, duration:0.5, ease:[0.16,1,0.3,1] }}
      style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${color}25`, borderRadius:16,
        padding:'24px 20px', position:'relative', overflow:'hidden',
        boxShadow:`0 0 30px ${color}12, inset 0 1px 0 rgba(255,255,255,0.05)` }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${color}60,transparent)` }}/>
      <div style={{ position:'absolute', top:14, right:16, fontSize:26, opacity:0.12 }}>{icon}</div>
      <div style={{ fontFamily:'Georgia,serif', fontSize:11, letterSpacing:3, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:10 }}>{label}</div>
      <div style={{ fontFamily:'Georgia,serif', fontSize:40, fontWeight:300, color, lineHeight:1, marginBottom:6, textShadow:`0 0 20px ${color}` }}>{value}</div>
      {sub && <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.3)' }}>{sub}</div>}
    </motion.div>
  )
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tab, setTab] = useState('overview')
  const [bookings, setBookings] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBooking, setEditingBooking] = useState<string|null>(null)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return }
    if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') { router.push('/dashboard') }
  }, [status, session, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    Promise.all([
      fetch('/api/bookings').then(r => r.json()),
      fetch('/api/admin/stats').then(r => r.json()).catch(() => ({})),
    ]).then(([bData]) => {
      setBookings(Array.isArray(bData) ? bData : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [status])

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/bookings/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ status:newStatus }) })
      setBookings(b => b.map(x => x.id===id ? {...x, status:newStatus} : x))
    } catch {}
    setEditingBooking(null)
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

  // Stats
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
  const confirmed = bookings.filter(b=>b.status==='CONFIRMED').length
  const pending = bookings.filter(b=>b.status==='PENDING').length

  const filteredBookings = bookings.filter(b => {
    const matchStatus = filterStatus==='ALL' || b.status===filterStatus
    const matchSearch = !search || b.customerName?.toLowerCase().includes(search.toLowerCase()) || b.customerEmail?.toLowerCase().includes(search.toLowerCase()) || b.service?.nameCs?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const revenueGrowth = revenueLastMonth > 0 ? Math.round(((revenueThisMonth-revenueLastMonth)/revenueLastMonth)*100) : 0

  return (
    <>
      <CustomCursor />
      <div style={{ minHeight:'100vh', background:'#080608', display:'flex' }}>
        {/* Sidebar */}
        <div style={{ width:220, flexShrink:0, borderRight:'1px solid rgba(255,107,168,0.1)', display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', background:'rgba(255,255,255,0.02)', backdropFilter:'blur(10px)' }}>
          {/* Logo */}
          <div style={{ padding:'28px 24px 20px', borderBottom:'1px solid rgba(255,107,168,0.1)' }}>
            <Link href="/" style={{ textDecoration:'none' }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:13, letterSpacing:4, textTransform:'uppercase', fontWeight:300 }}>
                Viktória <span style={{ color:'#FF6BA8', textShadow:'0 0 15px rgba(255,107,168,0.6)' }}>Lashes</span>
              </div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(255,107,168,0.5)', textTransform:'uppercase', marginTop:4 }}>Admin Panel</div>
            </Link>
          </div>

          {/* Nav */}
          <nav style={{ flex:1, padding:'16px 12px', display:'flex', flexDirection:'column', gap:4 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
                  borderRadius:10, border:'none', cursor:'pointer', textAlign:'left',
                  background: tab===t.id ? 'rgba(255,107,168,0.12)' : 'transparent',
                  borderLeft: tab===t.id ? '2px solid #FF6BA8' : '2px solid transparent',
                  fontFamily:'Georgia,serif', fontSize:12, letterSpacing:1,
                  color: tab===t.id ? '#FF6BA8' : 'rgba(245,238,242,0.4)',
                  transition:'all 0.2s',
                }}>
                <span style={{ fontSize:14 }}>{t.icon}</span>
                {t.label}
                {t.id==='bookings' && pending > 0 && (
                  <span style={{ marginLeft:'auto', background:'#FF6BA8', color:'white', borderRadius:20, padding:'1px 7px', fontSize:9 }}>{pending}</span>
                )}
              </button>
            ))}
          </nav>

          {/* User + logout */}
          <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(255,107,168,0.1)' }}>
            <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.5)', marginBottom:4 }}>{session?.user?.name}</div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'#FF6BA8', textTransform:'uppercase', marginBottom:12 }}>Admin</div>
            <button onClick={() => signOut({ callbackUrl:'/' })}
              style={{ background:'none', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'7px 14px', color:'rgba(245,238,242,0.35)', fontFamily:'Georgia,serif', fontSize:10, cursor:'pointer', width:'100%', letterSpacing:1 }}>
              Odhlásit
            </button>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex:1, overflowY:'auto', padding:'32px 32px 60px' }}>
          {/* Background */}
          <div style={{ position:'fixed', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse 50% 40% at 60% 20%,rgba(196,105,138,0.07) 0%,transparent 70%)' }}/>

          <AnimatePresence mode="wait">

            {/* ═══ OVERVIEW ═══ */}
            {tab === 'overview' && (
              <motion.div key="ov" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
                <div style={{ marginBottom:28 }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:8, textShadow:'0 0 12px rgba(255,107,168,0.5)' }}>✦ Dashboard</div>
                  <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:36, margin:0 }}>Přehled studia</h1>
                </div>

                {/* Stats grid */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
                  <StatCard label="Tržby tento měsíc" value={formatPrice(revenueThisMonth)} sub={revenueGrowth>=0?`+${revenueGrowth}% vs minulý`:`${revenueGrowth}% vs minulý`} color="#FF6BA8" icon="💰" delay={0.05}/>
                  <StatCard label="Nadcházející" value={upcoming.length} sub="rezervací" color="#D4AA70" icon="📅" delay={0.1}/>
                  <StatCard label="Klientek celkem" value={uniqueEmails.length} sub="unikátních emailů" color="#E8A4BE" icon="💕" delay={0.15}/>
                  <StatCard label="Čeká na potvrzení" value={pending} sub="nových rezervací" color="#f87171" icon="⏳" delay={0.2}/>
                </div>

                {/* Second row */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:24 }}>
                  <StatCard label="Potvrzeno" value={confirmed} color="#4ade80" icon="✓" delay={0.25}/>
                  <StatCard label="Tržby min. měsíc" value={formatPrice(revenueLastMonth)} color="#D4AA70" icon="◈" delay={0.3}/>
                  <StatCard label="Celkem rezervací" value={bookings.length} color="#FF6BA8" icon="✦" delay={0.35}/>
                </div>

                {/* Upcoming bookings table */}
                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
                  <GCard>
                    <div style={{ padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <h2 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:18, margin:0 }}>Nadcházející rezervace</h2>
                      <button onClick={() => setTab('bookings')} style={{ background:'none', border:'1px solid rgba(255,107,168,0.3)', padding:'6px 14px', borderRadius:8, color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:10, letterSpacing:2, cursor:'pointer', textTransform:'uppercase' }}>
                        Zobrazit vše →
                      </button>
                    </div>
                    <div style={{ overflowX:'auto' }}>
                      <table style={{ width:'100%', borderCollapse:'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                            {['Klientka','Služba','Datum','Čas','Status','Cena'].map(h=>(
                              <th key={h} style={{ padding:'12px 20px', textAlign:'left', fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', fontWeight:300 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {upcoming.slice(0,8).map((b,i) => {
                            const cfg = STATUS_CFG[b.status] ?? STATUS_CFG.PENDING
                            return (
                              <motion.tr key={b.id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                                transition={{ delay:0.5+i*0.04 }}
                                style={{ borderBottom:'1px solid rgba(255,255,255,0.03)', cursor:'pointer', transition:'background 0.2s' }}
                                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,107,168,0.03)')}
                                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                                <td style={{ padding:'14px 20px' }}>
                                  <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.85)' }}>{b.customerName}</div>
                                  <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.3)' }}>{b.customerEmail}</div>
                                </td>
                                <td style={{ padding:'14px 20px', fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.6)' }}>{b.service?.nameCs}</td>
                                <td style={{ padding:'14px 20px', fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.6)' }}>
                                  {new Date(b.date).toLocaleDateString('cs-CZ',{day:'numeric',month:'short'})}
                                </td>
                                <td style={{ padding:'14px 20px', fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.6)' }}>{b.time}</td>
                                <td style={{ padding:'14px 20px' }}>
                                  <span style={{ padding:'3px 10px', borderRadius:20, fontSize:10, fontFamily:'Georgia,serif', background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`, letterSpacing:1 }}>
                                    {cfg.label}
                                  </span>
                                </td>
                                <td style={{ padding:'14px 20px', fontFamily:'Georgia,serif', fontSize:16, color:'#FF6BA8', textShadow:'0 0 10px rgba(255,107,168,0.4)' }}>{formatPrice(b.totalKc)}</td>
                              </motion.tr>
                            )
                          })}
                          {upcoming.length === 0 && (
                            <tr><td colSpan={6} style={{ padding:'48px', textAlign:'center', fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.2)' }}>Žádné nadcházející rezervace</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </GCard>
                </motion.div>
              </motion.div>
            )}

            {/* ═══ BOOKINGS ═══ */}
            {tab === 'bookings' && (
              <motion.div key="bk" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
                <div style={{ marginBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>✦ Správa</div>
                    <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:32, margin:0 }}>Všechny rezervace</h1>
                  </div>
                  {/* Filters */}
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Hledat..."
                      style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,107,168,0.2)', borderRadius:10, padding:'8px 14px', color:'rgba(245,238,242,0.8)', fontFamily:'Georgia,serif', fontSize:12, outline:'none', width:180 }}/>
                    <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
                      style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,107,168,0.2)', borderRadius:10, padding:'8px 14px', color:'rgba(245,238,242,0.8)', fontFamily:'Georgia,serif', fontSize:12, outline:'none', cursor:'pointer' }}>
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
                        {filteredBookings.map((b,i) => {
                          const cfg = STATUS_CFG[b.status] ?? STATUS_CFG.PENDING
                          const isPast = new Date(b.date) < today
                          return (
                            <motion.tr key={b.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.03 }}
                              style={{ borderBottom:'1px solid rgba(255,255,255,0.03)', opacity:isPast?0.65:1, transition:'background 0.2s' }}
                              onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,107,168,0.02)')}
                              onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                              <td style={{ padding:'14px 18px' }}>
                                <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.85)', marginBottom:2 }}>{b.customerName}</div>
                                <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.25)', textTransform:'uppercase' }}>#{b.bookingRef?.slice(-6).toUpperCase()}</div>
                              </td>
                              <td style={{ padding:'14px 18px' }}>
                                <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.5)' }}>{b.customerEmail}</div>
                                <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.4)' }}>{b.customerPhone}</div>
                              </td>
                              <td style={{ padding:'14px 18px', fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.6)' }}>{b.service?.nameCs}</td>
                              <td style={{ padding:'14px 18px' }}>
                                <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.7)' }}>
                                  {new Date(b.date).toLocaleDateString('cs-CZ',{day:'numeric',month:'short',year:'numeric'})}
                                </div>
                                <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.4)' }}>{b.time}</div>
                              </td>
                              <td style={{ padding:'14px 18px' }}>
                                {editingBooking === b.id ? (
                                  <select autoFocus defaultValue={b.status}
                                    onChange={e=>updateStatus(b.id, e.target.value)}
                                    onBlur={()=>setEditingBooking(null)}
                                    style={{ background:'#0d0508', border:`1px solid ${cfg.color}`, borderRadius:8, padding:'4px 8px', color:cfg.color, fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer', outline:'none' }}>
                                    {Object.entries(STATUS_CFG).map(([k,v])=>(
                                      <option key={k} value={k}>{v.label}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <span onClick={()=>setEditingBooking(b.id)}
                                    title="Klikni pro změnu"
                                    style={{ padding:'4px 10px', borderRadius:20, fontSize:10, fontFamily:'Georgia,serif', background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`, cursor:'pointer', letterSpacing:1, transition:'all 0.2s', display:'inline-block' }}>
                                    {cfg.label}
                                  </span>
                                )}
                              </td>
                              <td style={{ padding:'14px 18px', fontFamily:'Georgia,serif', fontSize:16, color:'#FF6BA8' }}>{formatPrice(b.totalKc)}</td>
                              <td style={{ padding:'14px 18px' }}>
                                <button onClick={()=>setEditingBooking(b.id)}
                                  style={{ background:'rgba(255,107,168,0.1)', border:'1px solid rgba(255,107,168,0.3)', borderRadius:8, padding:'5px 12px', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:10, cursor:'pointer', letterSpacing:1 }}>
                                  Editovat
                                </button>
                              </td>
                            </motion.tr>
                          )
                        })}
                        {filteredBookings.length === 0 && (
                          <tr><td colSpan={7} style={{ padding:'48px', textAlign:'center', fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.2)' }}>Žádné výsledky</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </GCard>
              </motion.div>
            )}

            {/* ═══ CUSTOMERS ═══ */}
            {tab === 'customers' && (
              <motion.div key="cu" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
                <div style={{ marginBottom:24 }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>✦ CRM</div>
                  <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:32, margin:0 }}>Databáze klientek</h1>
                </div>

                {/* Customer cards */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
                  {uniqueEmails.map((email, i) => {
                    const cBookings = bookings.filter(b=>b.customerEmail===email)
                    const total = cBookings.reduce((s,b)=>s+(b.totalKc||0),0)
                    const last = cBookings.sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime())[0]
                    return (
                      <motion.div key={email} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}
                        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,107,168,0.12)', borderRadius:14, padding:'20px', position:'relative', overflow:'hidden' }}>
                        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.3),transparent)' }}/>
                        {/* Avatar */}
                        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                          <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#C4698A,#FF6BA8)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Georgia,serif', fontSize:18, color:'white', flexShrink:0 }}>
                            {last?.customerName?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <div>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:14, color:'rgba(245,238,242,0.85)' }}>{last?.customerName ?? 'Neznámá'}</div>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)' }}>{email}</div>
                          </div>
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                          <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'10px 12px' }}>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:4 }}>Návštěvy</div>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:22, color:'#FF6BA8' }}>{cBookings.length}</div>
                          </div>
                          <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'10px 12px' }}>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:4 }}>Celkem</div>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:18, color:'#D4AA70' }}>{formatPrice(total)}</div>
                          </div>
                        </div>
                        {last && (
                          <div style={{ marginTop:10, fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.3)' }}>
                            Poslední: {new Date(last.date).toLocaleDateString('cs-CZ',{day:'numeric',month:'long'})}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                  {uniqueEmails.length === 0 && (
                    <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'60px', fontFamily:'Georgia,serif', fontSize:14, color:'rgba(245,238,242,0.2)' }}>Žádné klientky</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ═══ SERVICES ═══ */}
            {tab === 'services' && (
              <motion.div key="sv" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
                <div style={{ marginBottom:24 }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>✦ Ceník</div>
                  <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:32, margin:0 }}>Správa služeb</h1>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
                  {[
                    { name:'Klasické řasy (50D–60D)', price:499, duration:45, bookings:bookings.filter(b=>b.service?.nameCs?.includes('Klasické')).length },
                    { name:'Objemové řasy (80D)', price:599, duration:60, bookings:bookings.filter(b=>b.service?.nameCs?.includes('Objemové')).length },
                    { name:'Mega Volume (100D)', price:799, duration:60, bookings:bookings.filter(b=>b.service?.nameCs?.includes('Mega')).length },
                    { name:'Wet Look (60D)', price:999, duration:60, bookings:bookings.filter(b=>b.service?.nameCs?.includes('Wet')).length },
                    { name:'Doplnění řas', price:199, duration:20, bookings:bookings.filter(b=>b.service?.nameCs?.includes('Doplnění')).length },
                    { name:'Odstranění řas', price:99, duration:25, bookings:bookings.filter(b=>b.service?.nameCs?.includes('Odstranění')).length },
                  ].map((s,i) => (
                    <motion.div key={s.name} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
                      style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,107,168,0.12)', borderRadius:14, padding:'24px', position:'relative', overflow:'hidden' }}>
                      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.4),transparent)' }}/>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:15, color:'rgba(245,238,242,0.85)', marginBottom:6 }}>{s.name}</div>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:32, color:'#FF6BA8', textShadow:'0 0 15px rgba(255,107,168,0.4)', marginBottom:4 }}>{formatPrice(s.price)}</div>
                      <div style={{ display:'flex', gap:16, fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)', marginBottom:12 }}>
                        <span>⏱ {s.duration} min</span>
                        <span>📊 {s.bookings}× objednáno</span>
                      </div>
                      <div style={{ background:'rgba(255,107,168,0.06)', borderRadius:8, padding:'8px 14px', fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.4)' }}>
                        Záloha: {formatPrice(Math.round(s.price*0.3))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
