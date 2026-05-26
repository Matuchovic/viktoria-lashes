'use client'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { formatPrice } from '@/lib/utils'

const STATUS_CFG: Record<string, { label:string; color:string; bg:string; border:string }> = {
  PENDING:          { label:'Čeká',           color:'#D4AA70', bg:'rgba(212,170,112,0.1)', border:'rgba(212,170,112,0.3)' },
  CONFIRMED:        { label:'Potvrzeno',       color:'#4ade80', bg:'rgba(74,222,128,0.1)',  border:'rgba(74,222,128,0.3)'  },
  COMPLETED:        { label:'Dokončeno',       color:'#FF6BA8', bg:'rgba(255,107,168,0.1)', border:'rgba(255,107,168,0.3)' },
  CANCELLED:        { label:'Zrušeno',         color:'#f87171', bg:'rgba(248,113,113,0.1)', border:'rgba(248,113,113,0.3)' },
  NO_SHOW:          { label:'Nedostavil',      color:'#6b7280', bg:'rgba(107,114,128,0.1)', border:'rgba(107,114,128,0.2)' },
  CHANGE_REQUESTED: { label:'Žádost o změnu', color:'#fbbf24', bg:'rgba(251,191,36,0.1)',  border:'rgba(251,191,36,0.3)'  },
}

const TABS = [
  { id:'overview',  label:'Přehled',    icon:'◈' },
  { id:'bookings',  label:'Rezervace',  icon:'📅' },
  { id:'customers', label:'Klientky',   icon:'💕' },
  { id:'services',  label:'Služby',     icon:'*' },
  { id:'safety',    label:'Bezpečnost', icon:'🛡️' },
  { id:'notifs',    label:'Notifikace', icon:'🔔' },
  { id:'reviews',   label:'Recenze',    icon:'⭐' },
  { id:'logs',      label:'Logy',       icon:'📋' },
  { id:'dev',       label:'DEV',        icon:'⚡' },
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
  const [editingAddr, setEditingAddr] = useState(false)
  const [addrVal, setAddrVal] = useState('')
  const [addrSaving, setAddrSaving] = useState(false)

  const saveAddress = async () => {
    setAddrSaving(true)
    try {
      await fetch('/api/bookings/address?id=' + booking.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addrVal }),
      })
      booking.address = addrVal
      setEditingAddr(false)
    } catch(e) { console.error(e) }
    setAddrSaving(false)
  }

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
            <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'#FF6BA8', textTransform:'uppercase', marginBottom:4 }}>* Detail rezervace</div>
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

          {/* Adresa - vzdy zobrazit, editovatelna */}
          {(() => {
            const addr = booking.address || (booking.notes && (booking.notes.match(/Adresa:\s*([^|\n]+)/) || [])[1]) || ''
            return (
              <div style={{ marginBottom:12, padding:'14px 16px', borderRadius:12, background:'rgba(255,107,168,0.07)', border:'1px solid rgba(255,107,168,0.3)' }}>
                <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'#FF6BA8', textTransform:'uppercase', marginBottom:8 }}>Adresa kam prijet</div>
                {editingAddr ? (
                  <div style={{ marginBottom:12 }}>
                    <input autoFocus value={addrVal} onChange={e => setAddrVal(e.target.value)}
                      style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,107,168,0.4)', borderRadius:8, padding:'10px 12px', color:'rgba(245,238,242,0.9)', fontFamily:'Georgia,serif', fontSize:14, outline:'none', marginBottom:8 }}
                      placeholder="Ul. Příklad 12, Mladá Boleslav"/>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={saveAddress} disabled={addrSaving}
                        style={{ flex:1, padding:'8px', borderRadius:8, background:'rgba(255,107,168,0.2)', border:'1px solid rgba(255,107,168,0.5)', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                        {addrSaving ? 'Ukládám...' : 'Uložit'}
                      </button>
                      <button onClick={() => setEditingAddr(false)}
                        style={{ padding:'8px 14px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(245,238,242,0.4)', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                        Zrušit
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:addr ? 12 : 4 }}>
                    <div style={{ flex:1, fontFamily:'Georgia,serif', fontSize:15, color:'rgba(245,238,242,0.95)', lineHeight:1.4 }}>
                {editingAddr ? (
                  <div style={{ marginBottom:12 }}>
                    <input autoFocus value={addrVal} onChange={e => setAddrVal(e.target.value)}
                      style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,107,168,0.4)', borderRadius:8, padding:'10px 12px', color:'rgba(245,238,242,0.9)', fontFamily:'Georgia,serif', fontSize:14, outline:'none', marginBottom:8 }}
                      placeholder="Ul. Priklad 12, Mlada Boleslav"/>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={saveAddress} disabled={addrSaving}
                        style={{ flex:1, padding:'8px', borderRadius:8, background:'rgba(255,107,168,0.2)', border:'1px solid rgba(255,107,168,0.5)', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                        {addrSaving ? 'Ukladam...' : 'Ulozit'}
                      </button>
                      <button onClick={() => setEditingAddr(false)}
                        style={{ padding:'8px 14px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(245,238,242,0.4)', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                        Zrusit
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:addr ? 12 : 4 }}>
                    <div style={{ flex:1, fontFamily:'Georgia,serif', fontSize:15, color:'rgba(245,238,242,0.95)', lineHeight:1.4 }}>
                      {addr || <span style={{color:'rgba(245,238,242,0.3)',fontStyle:'italic'}}>Adresa nevyplnena</span>}
                    </div>
                    <button onClick={() => { setAddrVal(addr); setEditingAddr(true) }}
                      style={{ flexShrink:0, padding:'5px 10px', borderRadius:6, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(245,238,242,0.4)', fontFamily:'Georgia,serif', fontSize:10, cursor:'pointer' }}>
                      Upravit
                    </button>
                  </div>
                )}
                    </div>
                    <button onClick={() => { setAddrVal(addr); setEditingAddr(true) }}
                      style={{ flexShrink:0, padding:'5px 10px', borderRadius:6, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(245,238,242,0.4)', fontFamily:'Georgia,serif', fontSize:10, cursor:'pointer' }}>
                      ✏️ Upravit
                    </button>
                  </div>
                )}
                {addr && (
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    <a href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(addr)} target='_blank' rel='noopener noreferrer'
                      style={{ flex:'1 1 auto', textAlign:'center', padding:'8px 14px', borderRadius:8, background:'rgba(74,222,128,0.12)', border:'1px solid rgba(74,222,128,0.35)', color:'#4ade80', fontFamily:'Georgia,serif', fontSize:11, textTransform:'uppercase', textDecoration:'none' }}>
                      Google Maps
                    </a>
                    <a href={'https://waze.com/ul?q=' + encodeURIComponent(addr)} target='_blank' rel='noopener noreferrer'
                      style={{ flex:'1 1 auto', textAlign:'center', padding:'8px 14px', borderRadius:8, background:'rgba(99,179,255,0.12)', border:'1px solid rgba(99,179,255,0.35)', color:'#63b3ff', fontFamily:'Georgia,serif', fontSize:11, textTransform:'uppercase', textDecoration:'none' }}>
                      Waze
                    </a>
                  </div>
                )}
              </div>
            )
          })()}

          {(booking.address || (booking.notes && booking.notes.includes('Adresa'))) && (
            <div style={{ marginBottom:12, padding:'14px 16px', borderRadius:12, background:'rgba(255,107,168,0.07)', border:'1px solid rgba(255,107,168,0.3)' }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'#FF6BA8', textTransform:'uppercase', marginBottom:8 }}>Adresa kam prijet</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:15, color:'rgba(245,238,242,0.95)', marginBottom:12, lineHeight:1.4 }}>{booking.address || (booking.notes && booking.notes.match(/Adresa:\s*([^|\n]+)/) || [])[1] || ''}</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <a href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(booking.address)} target='_blank' rel='noopener noreferrer'
                  style={{ flex:'1 1 auto', textAlign:'center', padding:'8px 14px', borderRadius:8, background:'rgba(74,222,128,0.12)', border:'1px solid rgba(74,222,128,0.35)', color:'#4ade80', fontFamily:'Georgia,serif', fontSize:11, textTransform:'uppercase', textDecoration:'none' }}>
                  Google Maps
                </a>
                <a href={'https://waze.com/ul?q=' + encodeURIComponent(booking.address)} target='_blank' rel='noopener noreferrer'
                  style={{ flex:'1 1 auto', textAlign:'center', padding:'8px 14px', borderRadius:8, background:'rgba(99,179,255,0.12)', border:'1px solid rgba(99,179,255,0.35)', color:'#63b3ff', fontFamily:'Georgia,serif', fontSize:11, textTransform:'uppercase', textDecoration:'none' }}>
                  Waze
                </a>
              </div>
            </div>
          )}

          {/* Reschedule approval */}
          {booking.status === 'CHANGE_REQUESTED' && booking.rescheduleDate && (
            <div style={{ marginBottom:12, padding:'14px 16px', borderRadius:12, background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.3)' }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'#fbbf24', textTransform:'uppercase', marginBottom:8 }}>📅 Žádost o změnu termínu</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.6)', marginBottom:4 }}>
                Původní: {new Date(booking.date).toLocaleDateString('cs-CZ')} v {booking.time}
              </div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'#fbbf24', marginBottom:booking.rescheduleNote?8:12 }}>
                Nový: {new Date(booking.rescheduleDate).toLocaleDateString('cs-CZ')} v {booking.rescheduleTime}
              </div>
              {booking.rescheduleNote && <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.4)', marginBottom:12 }}>Důvod: {booking.rescheduleNote}</div>}
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={async()=>{
                  await fetch('/api/bookings/reschedule',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({bookingId:booking.id,action:'approve'})})
                  onStatusChange(booking.id,'CONFIRMED'); onClose()
                }} style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(74,222,128,0.15)', border:'1px solid rgba(74,222,128,0.4)', color:'#4ade80', fontFamily:'Georgia,serif', fontSize:12, cursor:'pointer' }}>
                  v Schválit změnu
                </button>
                <button onClick={async()=>{
                  await fetch('/api/bookings/reschedule',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({bookingId:booking.id,action:'reject'})})
                  onStatusChange(booking.id,'CONFIRMED'); onClose()
                }} style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', fontFamily:'Georgia,serif', fontSize:12, cursor:'pointer' }}>
                  ✗ Zamítnout
                </button>
              </div>
            </div>
          )}
          <div style={{ marginBottom:12 }}>
            <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:3, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:8 }}>Změnit status</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {Object.entries(STATUS_CFG).filter(([key])=>key!=='CHANGE_REQUESTED').map(([key, s]) => (
                <button key={key} onClick={() => { onStatusChange(booking.id, key); onClose() }}
                  style={{ padding:'7px 14px', borderRadius:20, border:`1px solid ${s.border}`, background:booking.status===key?s.bg:'transparent', color:s.color, fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                  {booking.status===key && 'v '}{s.label}
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
  const [logs, setLogs] = useState<{time:string;type:string;msg:string;color:string}[]>([])
  const [devData, setDevData] = useState<any>(null)
  const [devLoading, setDevLoading] = useState(false)
  const [devStats, setDevStats] = useState<any>(null)
  const [securityData, setSecurityData] = useState<any>(null)
  const [emailTestForm, setEmailTestForm] = useState({ to:'matuchovic@gmail.com', subject:'', text:'' })
  const [emailTestResult, setEmailTestResult] = useState('')
  const [emailTestLoading, setEmailTestLoading] = useState(false)
  const [devActiveSection, setDevActiveSection] = useState('stats')

  const addLog = (type: string, msg: string, color = '#FF6BA8') => {
    const time = new Date().toLocaleTimeString('cs-CZ', {hour:'2-digit',minute:'2-digit',second:'2-digit'})
    setLogs(l => [{time, type, msg, color}, ...l].slice(0, 50))
  }

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
      setInterval(fetchOnline, 15000)
    }).catch(() => setLoading(false))
  }, [status])

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/bookings/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ status:newStatus }) })
      setBookings(b => b.map(x => x.id===id ? {...x, status:newStatus} : x))
      const booking = bookings.find(b => b.id === id)
      const statusLabels: Record<string,string> = { CONFIRMED:'Potvrzeno', CANCELLED:'Zrušeno', COMPLETED:'Dokončeno', PENDING:'Čeká', NO_SHOW:'Nedostavil' }
      addLog('REZERVACE', `${booking?.customerName ?? 'Klientka'} - ${statusLabels[newStatus] ?? newStatus}`, newStatus==='CONFIRMED'?'#4ade80':newStatus==='CANCELLED'?'#f87171':'#FF6BA8')
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
      <div className="md:hidden" style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, background:'rgba(8,6,8,0.97)', borderBottom:'1px solid rgba(255,107,168,0.15)', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', backdropFilter:'blur(20px)', minHeight:56 }}>
        <div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:11, letterSpacing:3, textTransform:'uppercase' }}>Viktória <span style={{color:'#FF6BA8'}}>Lashes</span></div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:7, letterSpacing:2, color:'rgba(255,107,168,0.5)', textTransform:'uppercase' }}>Admin Panel</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {activeCheckin && <div style={{ width:8, height:8, borderRadius:'50%', background:'#f87171', boxShadow:'0 0 8px #f87171' }}/>}
          {pending > 0 && <div style={{ background:'#FF6BA8', color:'white', borderRadius:20, padding:'2px 8px', fontFamily:'Georgia,serif', fontSize:10 }}>{pending}</div>}
          <button onClick={() => setMobileMenuOpen(o => !o)}
            style={{ background:'rgba(255,107,168,0.1)', border:'1px solid rgba(255,107,168,0.3)', borderRadius:10, padding:'10px 14px', cursor:'pointer', display:'flex', flexDirection:'column', gap:5, alignItems:'center', justifyContent:'center' }}
            aria-label="Menu">
            <motion.span animate={mobileMenuOpen ? {rotate:45,y:6} : {rotate:0,y:0}} style={{ display:'block', width:20, height:2, background:'#FF6BA8', transformOrigin:'center', borderRadius:2 }}/>
            <motion.span animate={mobileMenuOpen ? {opacity:0,scaleX:0} : {opacity:1,scaleX:1}} style={{ display:'block', width:20, height:2, background:'#FF6BA8', borderRadius:2 }}/>
            <motion.span animate={mobileMenuOpen ? {rotate:-45,y:-6} : {rotate:0,y:0}} style={{ display:'block', width:20, height:2, background:'#FF6BA8', transformOrigin:'center', borderRadius:2 }}/>
          </button>
        </div>
      </div>

      {/* MOBILE HAMBURGER MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}}
            style={{ position:'fixed', inset:0, zIndex:190, background:'rgba(8,6,8,0.98)', backdropFilter:'blur(20px)', overflowY:'auto', paddingTop:70, paddingBottom:24 }}>
            <div style={{ padding:'0 20px', display:'flex', flexDirection:'column', gap:6 }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:8, letterSpacing:4, color:'rgba(255,107,168,0.4)', textTransform:'uppercase', marginBottom:10, marginTop:8 }}>Navigace</div>
              {TABS.map((t, i) => (
                <motion.button key={t.id} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                  onClick={() => { setTab(t.id); setMobileMenuOpen(false) }}
                  style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', borderRadius:12, border:'none', background: tab===t.id ? 'rgba(255,107,168,0.1)' : 'rgba(255,255,255,0.03)', borderLeft: tab===t.id ? '2px solid #FF6BA8' : '2px solid transparent', fontFamily:'Georgia,serif', fontSize:14, color: tab===t.id ? '#FF6BA8' : 'rgba(245,238,242,0.6)', cursor:'pointer', textAlign:'left', position:'relative' }}>
                  <span style={{fontSize:18}}>{t.icon}</span>
                  {t.label}
                  {t.id==='bookings' && pending>0 && <span style={{ marginLeft:'auto', background:'#FF6BA8', color:'white', borderRadius:20, padding:'2px 9px', fontSize:10 }}>{pending}</span>}
                  {t.id==='safety' && activeCheckin && <span style={{ marginLeft:'auto', background:'#f87171', color:'white', borderRadius:20, padding:'2px 8px', fontSize:10 }}>!</span>}
                </motion.button>
              ))}
              <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid rgba(255,107,168,0.1)' }}>
                <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.4)', marginBottom:4 }}>{session?.user?.name}</div>
                <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'#FF6BA8', textTransform:'uppercase', marginBottom:14 }}>Admin</div>
                <button onClick={() => signOut({callbackUrl:'/'})}
                  style={{ background:'none', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'10px 20px', color:'rgba(245,238,242,0.4)', fontFamily:'Georgia,serif', fontSize:11, width:'100%', cursor:'pointer' }}>
                  Odhlásit
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          className="px-3 pt-16 pb-6 md:px-8 md:pt-8 md:pb-12">
          <div style={{ position:'fixed', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse 50% 40% at 60% 20%,rgba(196,105,138,0.07) 0%,transparent 70%)' }}/>

          <AnimatePresence mode="wait">

            {/* OVERVIEW */}
            {tab==='overview' && (
              <motion.div key="ov" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>* Dashboard</div>
                  <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:'clamp(22px,5vw,36px)', margin:0 }}>Přehled studia</h1>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <StatCard label="Tržby tento měsíc" value={formatPrice(revenueThisMonth)} sub={`${revenueGrowth>=0?'+':''}${revenueGrowth}% vs minulý`} color="#FF6BA8" icon="💰" delay={0.05}/>
                  <StatCard label="Nadcházející" value={upcoming.length} sub="rezervací" color="#D4AA70" icon="📅" delay={0.1}/>
                  <StatCard label="Klientek" value={uniqueEmails.length} color="#E8A4BE" icon="💕" delay={0.15}/>
                  <StatCard label="Čeká na potvrzení" value={pending} color="#f87171" icon="⏳" delay={0.2}/>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                  <StatCard label="Potvrzeno" value={confirmed} color="#4ade80" icon="v" delay={0.25}/>
                  <StatCard label="Tržby min. měsíc" value={formatPrice(revenueLastMonth)} color="#D4AA70" icon="◈" delay={0.3}/>
                  <StatCard label="Celkem rezervací" value={bookings.length} color="#FF6BA8" icon="*" delay={0.35}/>
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

                {/* Upcoming list -- mobile friendly cards */}
                <GCard>
                  <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <h2 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:'clamp(14px,4vw,18px)', margin:0 }}>Nadcházející rezervace</h2>
                    <button onClick={()=>setTab('bookings')} style={{ background:'none', border:'1px solid rgba(255,107,168,0.3)', padding:'5px 12px', borderRadius:8, color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, textTransform:'uppercase', cursor:'pointer' }}>Vše &gt;</button>
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
                            <div style={{ fontFamily:'Georgia,serif', fontSize:10, color:'rgba(245,238,242,0.35)' }}>{b.service?.nameCs} . {new Date(b.date).toLocaleDateString('cs-CZ',{day:'numeric',month:'short'})} {b.time}</div>
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
                  <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>* Správa</div>
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
                        style={{ background: b.status==='CHANGE_REQUESTED' ? 'rgba(251,191,36,0.06)' : 'rgba(255,255,255,0.04)', border: b.status==='CHANGE_REQUESTED' ? '1px solid rgba(251,191,36,0.4)' : '1px solid rgba(255,107,168,0.1)', borderRadius:14, padding:'14px', position:'relative', overflow:'hidden', cursor:'pointer' }}>
                        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background: b.status==='CHANGE_REQUESTED' ? 'linear-gradient(90deg,transparent,rgba(251,191,36,0.5),transparent)' : 'linear-gradient(90deg,transparent,rgba(255,107,168,0.3),transparent)' }}/>
                        {b.status==='CHANGE_REQUESTED' && (
                          <div style={{ position:'absolute', top:10, right:10, background:'#fbbf24', color:'#080608', borderRadius:20, padding:'2px 8px', fontSize:9, fontFamily:'Georgia,serif', fontWeight:600 }}>! Žádost o změnu</div>
                        )}
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
                        {b.status==='CHANGE_REQUESTED' && b.rescheduleDate && (
                          <div style={{ marginTop:8, padding:'8px 10px', borderRadius:8, background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.2)', fontFamily:'Georgia,serif', fontSize:11, color:'#fbbf24' }}>
                            Požadovaný termín: {new Date(b.rescheduleDate).toLocaleDateString('cs-CZ',{day:'numeric',month:'short'})} v {b.rescheduleTime}
                          </div>
                        )}
                        <div style={{ marginTop:8, textAlign:'right', fontFamily:'Georgia,serif', fontSize:10, color:'rgba(255,107,168,0.5)' }}>Klepnutím otevřít detail</div>
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
                                    Detail
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
                  <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>* CRM</div>
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
                            <div style={{ fontFamily:'Georgia,serif', fontSize:8, letterSpacing:2, color:'rgba(212,170,112,0.5)', textTransform:'uppercase', marginBottom:3 }}>* Lash Body body</div>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:20, color:'#D4AA70' }}>
                              {(last as any)?.user?.loyaltyPoints ?? cb[0]?.user?.loyaltyPoints ?? '--'} bodů
                            </div>
                          </div>
                        </div>
                        {last && <div style={{ fontFamily:'Georgia,serif', fontSize:10, color:'rgba(245,238,242,0.3)' }}>Poslední: {new Date(last.date).toLocaleDateString('cs-CZ',{day:'numeric',month:'long'})}</div>}
                        <button onClick={()=>setSelectedBooking(last)}
                          style={{ marginTop:10, width:'100%', background:'rgba(255,107,168,0.08)', border:'1px solid rgba(255,107,168,0.25)', borderRadius:8, padding:'7px', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:10, cursor:'pointer' }}>
                          Poslední rezervace
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
                                alert(`v Přidáno ${pointsAmount} bodů`)
                                setAddingPoints(null)
                                setPointsAmount('')
                              } else alert('Chyba -- klientka nemá registraci')
                            }}
                              style={{ background:'rgba(212,170,112,0.15)', border:'1px solid rgba(212,170,112,0.4)', borderRadius:8, padding:'7px 12px', color:'#D4AA70', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                              v
                            </button>
                            <button onClick={() => { setAddingPoints(null); setPointsAmount('') }}
                              style={{ background:'none', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'7px 10px', color:'rgba(245,238,242,0.3)', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                              ✗
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => { setAddingPoints(email as string); setPointsAmount('') }}
                            style={{ marginTop:6, width:'100%', background:'rgba(212,170,112,0.06)', border:'1px solid rgba(212,170,112,0.2)', borderRadius:8, padding:'7px', color:'#D4AA70', fontFamily:'Georgia,serif', fontSize:10, cursor:'pointer' }}>
                            * Přidat Lash Body body
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
                  <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>* Ceník</div>
                  <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:'clamp(22px,5vw,32px)', margin:0 }}>Správa služeb</h1>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,260px),1fr))', gap:12 }}>
                  {[
                    {name:'Klasické řasy (50D-60D)',price:499,duration:45,key:'Klasické'},
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
                        📍 {activeCheckin.address} . Návrat: {new Date(activeCheckin.expectedBack).toLocaleTimeString('cs-CZ',{hour:'2-digit',minute:'2-digit'})}
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
                      <div style={{ fontFamily:'Georgia,serif', fontSize:9, color:'rgba(245,238,242,0.2)' }}>🚨 SOS = WhatsApp manželovi . 📞 Volat klientce . 🏠 Potvrzení příjezdu</div>
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
                          v Jsem bezpečně zpět
                        </button>
                      </div>
                      {gpsTracking && shareLink && (
                        <div style={{ width:'100%', marginTop:8, padding:'12px', borderRadius:10, background:'rgba(255,107,168,0.06)', border:'1px solid rgba(255,107,168,0.2)' }}>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>📍 GPS aktivní -- odkaz pro manžela</div>
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
                    <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'rgba(248,113,113,0.7)', textTransform:'uppercase', marginBottom:14 }}>Nový výjezd -- check-in</div>
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
                      {safetyLoading ? 'Odesílám...' : '🛡️ Odjíždím -- spustit check-in'}
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
                          {c.returnedAt ? 'v Zpět' : new Date(c.expectedBack)<new Date() ? '⚠️ Po termínu' : 'Na cestě'}
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
                        {notifResult.sent > 0 ? `v Odesláno ${notifResult.sent} klientkám` : '⚠️ ' + (notifResult.message || 'Nepodařilo se odeslat')}
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
                      { title:'Akce -- sleva 💝', body:'Speciální nabídka jen tento týden. Podívejte se!', url:'/' },
                      { title:'Přiveďte kamarádku 👯', body:'Přiveďte kamarádku na návštěvu a obě dostanete 500 Lash Body bodů! Sdílejte odkaz a začněte sbírat.', url:'/vernostni-program' },
                      { title:'Narozeninový bonus 🎂', body:'V narozeninový měsíc sbíráte dvojité body! Nezapomeňte si rezervovat termín.', url:'/rezervace' },
                      { title:'Nová služba 🌟', body:'Přidala jsem do nabídky Wet Look řasy! Podívejte se na nový styl.', url:'/#sluzby' },
                      { title:'Sezónní akce 🌸', body:'Jarní akce -- rezervujte do konce měsíce a získejte bonus 200 Lash Body bodů!', url:'/rezervace' },
                    ].map(t => (
                      <button key={t.title} onClick={() => setNotifForm(t)}
                        style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:10, background:'rgba(255,107,168,0.05)', border:'1px solid rgba(255,107,168,0.15)', cursor:'pointer', textAlign:'left' as const }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.8)', marginBottom:2 }}>{t.title}</div>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:10, color:'rgba(245,238,242,0.35)' }}>{t.body}</div>
                        </div>
                        <span style={{ color:'rgba(255,107,168,0.5)', fontSize:12 }}></span>
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
                      + Odkaz na formulář
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
                              {r.status==='APPROVED'?'v Schváleno':r.status==='REJECTED'?'✗ Zamítnuto':'⏳ Čeká'}
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
                            v Schválit
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

            {/* LOGS */}
            {tab==='logs' && (
              <motion.div key="lg" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                <div style={{ marginBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>📋 Activity Log</div>
                    <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:'clamp(20px,5vw,32px)', margin:0 }}>Záznamy aktivit</h1>
                  </div>
                  <button onClick={() => setLogs([])}
                    style={{ background:'none', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'6px 14px', color:'rgba(245,238,242,0.3)', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                    Vymazat
                  </button>
                </div>

                {/* Live indicator */}
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16, padding:'10px 16px', borderRadius:12, background:'rgba(74,222,128,0.06)', border:'1px solid rgba(74,222,128,0.2)' }}>
                  <motion.div animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.5, repeat:Infinity }}
                    style={{ width:8, height:8, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 8px #4ade80', flexShrink:0 }}/>
                  <span style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(74,222,128,0.8)' }}>Live -- záznamy se zobrazují v reálném čase</span>
                </div>

                {/* Log entries */}
                <div style={{ background:'rgba(0,0,0,0.4)', borderRadius:16, border:'1px solid rgba(255,255,255,0.06)', overflow:'hidden', fontFamily:'monospace' }}>
                  <div style={{ padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:16 }}>
                    <span style={{ fontSize:10, color:'rgba(245,238,242,0.2)', letterSpacing:2 }}>ČAS</span>
                    <span style={{ fontSize:10, color:'rgba(245,238,242,0.2)', letterSpacing:2 }}>TYP</span>
                    <span style={{ fontSize:10, color:'rgba(245,238,242,0.2)', letterSpacing:2 }}>ZPRÁVA</span>
                  </div>
                  <div style={{ maxHeight:500, overflowY:'auto' }}>
                    {logs.length === 0 ? (
                      <div style={{ padding:'48px', textAlign:'center', fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.2)' }}>
                        Žádné záznamy -- aktivity se zobrazí zde v reálném čase
                      </div>
                    ) : (
                      logs.map((log, i) => (
                        <motion.div key={i} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                          style={{ display:'flex', gap:16, padding:'8px 16px', borderBottom:'1px solid rgba(255,255,255,0.03)', alignItems:'flex-start' }}>
                          <span style={{ fontSize:11, color:'rgba(245,238,242,0.25)', flexShrink:0, minWidth:70 }}>{log.time}</span>
                          <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20, background:`${log.color}15`, color:log.color, flexShrink:0, letterSpacing:1 }}>{log.type}</span>
                          <span style={{ fontSize:12, color:'rgba(245,238,242,0.7)', lineHeight:1.5 }}>{log.msg}</span>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* DEV */}
            {tab==='dev' && (
              <motion.div key="dv" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                ref={el => { if(el && !devData && !devLoading) {
                  setDevLoading(true)
                  Promise.all([
                    fetch('/api/push/send').then(r=>r.json()).catch(()=>({})),
                    fetch('/api/analytics/online').then(r=>r.json()).catch(()=>({})),
                    fetch('/api/reviews/admin').then(r=>r.json()).catch(()=>[]),
                    fetch('/api/safety/checkin').then(r=>r.json()).catch(()=>[]),
                    fetch('/api/dev/stats').then(r=>r.json()).catch(()=>({})),
                    fetch('/api/dev/security').then(r=>r.json()).catch(()=>({})),
                  ]).then(([push, online, reviews, checkins, stats, security]) => {
                    setDevData({ push, online, reviews, checkins })
                    setDevStats(stats)
                    setSecurityData(security)
                    setDevLoading(false)
                  })
                }}}>
                <div style={{ marginBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
                  <div>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:6 }}>⚡ Developer</div>
                    <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:'clamp(20px,5vw,32px)', margin:0 }}>DEV Panel</h1>
                  </div>
                  <button onClick={() => { setDevData(null); setDevStats(null); setSecurityData(null); setDevLoading(false) }}
                    style={{ background:'none', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'6px 14px', color:'rgba(245,238,242,0.3)', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                    ↺ Refresh
                  </button>
                </div>

                {/* Section nav */}
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:16 }}>
                  {[
                    { id:'stats', label:'📊 Statistiky' },
                    { id:'users', label:'👥 Uživatelé' },
                    { id:'security', label:'🔐 Bezpečnost' },
                    { id:'email', label:'📧 Email test' },
                    { id:'system', label:'⚙️ Systém' },
                  ].map(s => (
                    <button key={s.id} onClick={() => setDevActiveSection(s.id)}
                      style={{ padding:'6px 14px', borderRadius:20, border:`1px solid ${devActiveSection===s.id ? 'rgba(255,107,168,0.5)' : 'rgba(255,255,255,0.1)'}`, background: devActiveSection===s.id ? 'rgba(255,107,168,0.1)' : 'transparent', color: devActiveSection===s.id ? '#FF6BA8' : 'rgba(245,238,242,0.4)', fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer' }}>
                      {s.label}
                    </button>
                  ))}
                </div>

                {devLoading && <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.3)', padding:32, textAlign:'center' }}>Načítám data...</div>}

                {devData && (<>

                  {/* STATS SECTION */}
                  {devActiveSection==='stats' && (<>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:16 }} className="md:grid-cols-4">
                    {[
                      { label:'Uživatelů', value: devStats?.totalUsers ?? '...', color:'#FF6BA8', icon:'👤' },
                      { label:'Rezervací', value: devStats?.totalBookings ?? '...', color:'#D4AA70', icon:'📅' },
                      { label:'Tržby celkem', value: devStats?.totalRevenue ? `${(devStats.totalRevenue/1000).toFixed(1)}k Kč` : '...', color:'#4ade80', icon:'💰' },
                      { label:'Push odběratelů', value: devStats?.pushSubs ?? '...', color:'#7F77DD', icon:'🔔' },
                      { label:'Online teď', value: devData?.online?.count ?? 0, color:'#4ade80', icon:'🟢' },
                      { label:'Recenzí čeká', value: devStats?.pendingReviews ?? '...', color:'#fbbf24', icon:'⭐' },
                      { label:'Recenzí celkem', value: devStats?.totalReviews ?? '...', color:'#E8A4BE', icon:'💬' },
                      { label:'Aktivní výjezdy', value: devData?.checkins?.filter((c:any)=>!c.returnedAt).length ?? 0, color:'#f87171', icon:'🛡️' },
                    ].map(s => (
                      <div key={s.label} style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${s.color}25`, borderRadius:14, padding:'14px 12px', position:'relative', overflow:'hidden' }}>
                        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${s.color}60,transparent)` }}/>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:8, letterSpacing:2, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:6 }}>{s.icon} {s.label}</div>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:28, color:s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Daily chart */}
                  {devStats?.dailyStats && (
                    <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'16px 20px', marginBottom:16 }}>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:16 }}>Posledních 7 dní</div>
                      <div style={{ display:'flex', gap:8, alignItems:'flex-end', height:80 }}>
                        {devStats.dailyStats.map((d:any) => {
                          const maxB = Math.max(...devStats.dailyStats.map((x:any) => x.bookings), 1)
                          return (
                            <div key={d.date} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                              <div style={{ fontFamily:'Georgia,serif', fontSize:10, color:'#FF6BA8' }}>{d.bookings||''}</div>
                              <div style={{ width:'100%', background:'rgba(255,107,168,0.3)', borderRadius:4, height: `${Math.max((d.bookings/maxB)*60, 4)}px`, minHeight:4 }}/>
                              <div style={{ fontFamily:'Georgia,serif', fontSize:8, color:'rgba(245,238,242,0.3)', textAlign:'center' }}>{d.date}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Online users */}
                  {devData?.online?.users?.length > 0 && (
                    <div style={{ background:'rgba(74,222,128,0.04)', border:'1px solid rgba(74,222,128,0.15)', borderRadius:16, padding:'16px 20px', marginBottom:16 }}>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'rgba(74,222,128,0.5)', textTransform:'uppercase', marginBottom:12 }}>Online teď -- detail</div>
                      {devData.online.users.map((u:any) => (
                        <div key={u.id} style={{ display:'flex', gap:10, padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:12 }}>
                          <span style={{ minWidth:30 }}>{u.device==='mobile'?'📱':'💻'}</span>
                          <span style={{ color:'rgba(74,222,128,0.7)', minWidth:80, fontFamily:'Georgia,serif' }}>{u.userName??'anon'}</span>
                          <span style={{ color:'rgba(245,238,242,0.5)', fontFamily:'monospace', flex:1 }}>{u.page}</span>
                          <span style={{ color:'rgba(245,238,242,0.25)', fontFamily:'monospace' }}>{Math.round((Date.now()-u.lastSeen)/1000)}s</span>
                        </div>
                      ))}
                    </div>
                  )}
                  </>)}

                  {/* USERS SECTION */}
                  {devActiveSection==='users' && devStats?.usersList && (<>
                  <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, overflow:'hidden', marginBottom:16 }}>
                    <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:13 }}>Všichni uživatelé ({devStats.usersList.length})</div>
                    </div>
                    <div style={{ overflowX:'auto' }}>
                      {devStats.usersList.map((u:any) => (
                        <div key={u.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', flexWrap:'wrap' }}>
                          <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#C4698A,#FF6BA8)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Georgia,serif', fontSize:13, color:'white', flexShrink:0 }}>
                            {u.name?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <div style={{ flex:1, minWidth:120 }}>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.85)' }}>{u.name}</div>
                            <div style={{ fontFamily:'Georgia,serif', fontSize:10, color:'rgba(245,238,242,0.35)' }}>{u.email}</div>
                          </div>
                          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                            <span style={{ fontFamily:'Georgia,serif', fontSize:11, color:'#D4AA70' }}>{u.loyaltyPoints} bodů</span>
                            <span style={{ padding:'3px 8px', borderRadius:20, fontSize:9, background: u.role==='ADMIN' ? 'rgba(255,107,168,0.15)' : 'rgba(255,255,255,0.05)', color: u.role==='ADMIN' ? '#FF6BA8' : 'rgba(245,238,242,0.4)', border:`1px solid ${u.role==='ADMIN'?'rgba(255,107,168,0.3)':'rgba(255,255,255,0.1)'}` }}>{u.role}</span>
                            {u.role !== 'ADMIN' && (
                              <button onClick={async () => {
                                if(!confirm(`Změnit ${u.name} na ADMIN?`)) return
                                await fetch('/api/dev/user-role', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ userId:u.id, role:'ADMIN' }) })
                                setDevStats((s:any) => ({...s, usersList: s.usersList.map((x:any) => x.id===u.id ? {...x, role:'ADMIN'} : x)}))
                              }} style={{ padding:'3px 8px', borderRadius:8, background:'none', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(245,238,242,0.25)', fontFamily:'Georgia,serif', fontSize:9, cursor:'pointer' }}>
                                Admin
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  </>)}

                  {/* SECURITY SECTION */}
                  {devActiveSection==='security' && (<>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
                    {[
                      { label:'Celkem událostí', value: securityData?.total ?? 0, color:'#fbbf24' },
                      { label:'Posledních 24h', value: securityData?.last24h ?? 0, color:'#f87171' },
                      { label:'Podezřelých IP', value: securityData?.suspiciousIps?.length ?? 0, color:'#f87171' },
                      { label:'Status', value: (securityData?.suspiciousIps?.length ?? 0) === 0 ? 'v OK' : '⚠️ Pozor', color: (securityData?.suspiciousIps?.length ?? 0) === 0 ? '#4ade80' : '#f87171' },
                    ].map(s => (
                      <div key={s.label} style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${s.color}20`, borderRadius:12, padding:'12px' }}>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:8, letterSpacing:2, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:4 }}>{s.label}</div>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:22, color:s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {securityData?.suspiciousIps?.length > 0 && (
                    <div style={{ background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.3)', borderRadius:16, padding:'16px 20px', marginBottom:16 }}>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'#f87171', textTransform:'uppercase', marginBottom:10 }}>⚠️ Podezřelé IP adresy</div>
                      {securityData.suspiciousIps.map(([ip, count]: [string, number]) => (
                        <div key={ip} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid rgba(248,113,113,0.1)', fontFamily:'monospace', fontSize:12 }}>
                          <span style={{ color:'#f87171' }}>{ip}</span>
                          <span style={{ color:'rgba(245,238,242,0.4)' }}>{count} požadavků</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, overflow:'hidden' }}>
                    <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontFamily:'Georgia,serif', fontSize:13 }}>Bezpečnostní záznamy</div>
                    <div style={{ maxHeight:300, overflowY:'auto' }}>
                      {(!securityData?.recentEvents?.length) ? (
                        <div style={{ padding:32, textAlign:'center', fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.2)' }}>v Žádné bezpečnostní události</div>
                      ) : securityData.recentEvents.map((e:any, i:number) => (
                        <div key={i} style={{ display:'flex', gap:10, padding:'8px 16px', borderBottom:'1px solid rgba(255,255,255,0.03)', fontFamily:'monospace', fontSize:11, flexWrap:'wrap' }}>
                          <span style={{ color:'rgba(245,238,242,0.25)', minWidth:80 }}>{new Date(e.time).toLocaleTimeString('cs-CZ')}</span>
                          <span style={{ color:'#f87171', minWidth:100 }}>{e.type}</span>
                          <span style={{ color:'rgba(245,238,242,0.5)' }}>{e.ip}</span>
                          <span style={{ color:'rgba(245,238,242,0.3)', flex:1 }}>{e.path}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  </>)}

                  {/* EMAIL TEST */}
                  {devActiveSection==='email' && (<>
                  <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'20px', marginBottom:16 }}>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:16 }}>Email tester</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:14 }}>
                      {[
                        { key:'to', label:'Příjemce', ph:'matuchovic@gmail.com' },
                        { key:'subject', label:'Předmět', ph:'Test email z DEV panelu' },
                        { key:'text', label:'Text', ph:'Testovací zpráva...' },
                      ].map(f => (
                        <div key={f.key}>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:5 }}>{f.label}</div>
                          <input value={(emailTestForm as any)[f.key]} onChange={e => setEmailTestForm(x => ({...x, [f.key]: e.target.value}))}
                            placeholder={f.ph} style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'rgba(245,238,242,0.8)', fontFamily:'Georgia,serif', fontSize:12, outline:'none', boxSizing:'border-box' as const }}/>
                        </div>
                      ))}
                    </div>
                    <button disabled={emailTestLoading} onClick={async () => {
                      setEmailTestLoading(true); setEmailTestResult('')
                      const res = await fetch('/api/dev/email-test', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(emailTestForm) })
                      const d = await res.json()
                      setEmailTestResult(d.ok ? 'v Email odeslán!' : `✗ Chyba: ${d.error}`)
                      setEmailTestLoading(false)
                    }} style={{ width:'100%', padding:'12px', borderRadius:10, background:'rgba(255,107,168,0.15)', border:'1px solid rgba(255,107,168,0.3)', color:'#FF6BA8', fontFamily:'Georgia,serif', fontSize:13, cursor:'pointer' }}>
                      {emailTestLoading ? 'Odesílám...' : '📧 Odeslat testovací email'}
                    </button>
                    {emailTestResult && (
                      <div style={{ marginTop:10, padding:'10px 14px', borderRadius:10, background: emailTestResult.startsWith('v') ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', border:`1px solid ${emailTestResult.startsWith('v')?'rgba(74,222,128,0.3)':'rgba(248,113,113,0.3)'}`, fontFamily:'Georgia,serif', fontSize:13, color: emailTestResult.startsWith('v') ? '#4ade80' : '#f87171' }}>
                        {emailTestResult}
                      </div>
                    )}
                  </div>
                  </>)}

                  {/* SYSTEM */}
                  {devActiveSection==='system' && (<>
                  <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'16px 20px', marginBottom:16 }}>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:12 }}>Stack & verze</div>
                    {[
                      ['Framework', 'Next.js 15.3.6 App Router'],
                      ['Language', 'TypeScript + Tailwind CSS'],
                      ['ORM', 'Prisma v5.22 + PostgreSQL'],
                      ['Auth', 'NextAuth.js credentials'],
                      ['AI', 'Groq API (llama-3)'],
                      ['Email', 'Nodemailer via Gmail SMTP'],
                      ['Push', 'web-push (VAPID)'],
                      ['Hosting', 'Vercel Production'],
                      ['Database', 'Supabase (eu-west-1 / Ireland)'],
                    ].map(([k,v]) => (
                      <div key={k} style={{ display:'flex', gap:12, padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)', minWidth:120 }}>{k}</span>
                        <span style={{ fontFamily:'monospace', fontSize:11, color:'rgba(245,238,242,0.7)' }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'16px 20px', marginBottom:16, fontFamily:'monospace' }}>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:12 }}>Env Variables</div>
                    {[
                      ['NEXTAUTH_URL', 'https://www.viktoria-lashes.cz'],
                      ['NEXT_PUBLIC_APP_URL', 'https://www.viktoria-lashes.cz'],
                      ['EMAIL_FROM', 'Viktória Lashes <viktorialashes1@gmail.com>'],
                      ['EMAIL_SERVER_HOST', 'smtp.gmail.com:587'],
                      ['DATABASE', 'nqhyrkoexrlcdeeraxst @ Supabase'],
                      ['VAPID_PUBLIC', 'BOLsmR96uui... (87 chars)'],
                      ['GROQ_API_KEY', 'gsk_yD3p8MX... (configured)'],
                    ].map(([k,v]) => (
                      <div key={k} style={{ display:'flex', gap:10, padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', flexWrap:'wrap' }}>
                        <span style={{ fontSize:11, color:'#4ade80', minWidth:180, flexShrink:0 }}>{k}</span>
                        <span style={{ fontSize:11, color:'rgba(245,238,242,0.4)' }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'16px 20px' }}>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:12 }}>Deploy info</div>
                    {[
                      ['GitHub', 'Matuchovic/viktoria-lashes (branch: main)'],
                      ['Auto deploy', 'každý git push spousti Vercel build'],
                      ['Admin emails', 'matuchovic@gmail.com, viktorialadikova23@gmail.com'],
                      ['Supabase project', 'nqhyrkoexrlcdeeraxst'],
                      ['DB heslo', 'kebqAh-joxvys-7gakfu'],
                      ['Lokální projekt', '~/Downloads/viktoria-lashes'],
                    ].map(([k,v]) => (
                      <div key={k} style={{ display:'flex', gap:12, padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)', minWidth:130, flexShrink:0 }}>{k}</span>
                        <span style={{ fontFamily:'monospace', fontSize:11, color:'rgba(245,238,242,0.65)', wordBreak:'break-all' }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stack info */}
                  <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'16px 20px', marginBottom:16 }}>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:12 }}>Stack</div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                      {[
                        ['Framework', 'Next.js 15.3.6 App Router'],
                        ['Database', 'Supabase PostgreSQL (eu-west-1)'],
                        ['ORM', 'Prisma v5.22'],
                        ['Auth', 'NextAuth.js credentials'],
                        ['AI', 'Groq API (llama-3)'],
                        ['Email', 'Nodemailer via Gmail SMTP'],
                        ['Push', 'web-push (VAPID)'],
                        ['Hosting', 'Vercel Production'],
                      ].map(([k,v]) => (
                        <div key={k} style={{ padding:'8px 10px', borderRadius:8, background:'rgba(255,255,255,0.03)' }}>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:3 }}>{k}</div>
                          <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.7)' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Env variables */}
                  <div style={{ background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'16px 20px', marginBottom:16, fontFamily:'monospace' }}>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:12 }}>Env Variables</div>
                    {[
                      ['DATABASE_URL', 'postgresql://postgres.nqhyrkoexrlcdeeraxst:***@aws-0-eu-west-1.pooler.supabase.com:6543/postgres'],
                      ['NEXTAUTH_URL', 'https://www.viktoria-lashes.cz'],
                      ['GROQ_API_KEY', 'gsk_yD3p8MXj3Zo95Dcnzfc5W***'],
                      ['VAPID_PUBLIC', 'BOLsmR96uuiEqS9_Q-DQsmtGb***'],
                      ['EMAIL_FROM', 'Viktória Lashes <viktorialashes1@gmail.com>'],
                      ['NEXT_PUBLIC_APP_URL', 'https://www.viktoria-lashes.cz'],
                    ].map(([k,v]) => (
                      <div key={k} style={{ display:'flex', gap:10, padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', flexWrap:'wrap' }}>
                        <span style={{ fontSize:11, color:'#4ade80', minWidth:200, flexShrink:0 }}>{k}</span>
                        <span style={{ fontSize:11, color:'rgba(245,238,242,0.4)', wordBreak:'break-all' }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* API routes */}
                  <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'16px 20px', marginBottom:16 }}>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:12 }}>API Routes</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                      {[
                        ['POST', '/api/auth/register', 'Registrace + 250 bodů + email', '#4ade80'],
                        ['GET/POST', '/api/bookings', 'Seznam / nová rezervace + email', '#FF6BA8'],
                        ['PATCH', '/api/bookings/[id]', 'Změna statusu - emaily + body', '#FF6BA8'],
                        ['POST/PATCH', '/api/bookings/reschedule', 'Žádost / schválení změny termínu', '#fbbf24'],
                        ['GET/POST', '/api/reviews', 'Veřejné recenze', '#E8A4BE'],
                        ['GET/PATCH/DELETE', '/api/reviews/admin', 'Admin moderace recenzí', '#E8A4BE'],
                        ['GET/POST/PATCH', '/api/safety/checkin', 'Bezpečnostní check-in', '#f87171'],
                        ['GET/POST', '/api/safety/location', 'GPS tracking', '#f87171'],
                        ['POST/DELETE', '/api/push/subscribe', 'Push subscription', '#D4AA70'],
                        ['GET/POST', '/api/push/send', 'Odesílání notifikací', '#D4AA70'],
                        ['POST', '/api/loyalty/add-points', 'Ruční přidání bodů', '#D4AA70'],
                        ['GET/POST', '/api/analytics/online', 'Online návštěvníci', '#4ade80'],
                        ['POST', '/api/chat', 'Groq AI chatbot', '#7F77DD'],
                      ].map(([method, route, desc, color]) => (
                        <div key={route as string} style={{ display:'flex', gap:8, padding:'6px 8px', borderRadius:8, background:'rgba(255,255,255,0.02)', alignItems:'flex-start', flexWrap:'wrap' }}>
                          <span style={{ fontSize:9, padding:'2px 6px', borderRadius:4, background:`${color}15`, color:color as string, flexShrink:0, fontFamily:'monospace', letterSpacing:1 }}>{method}</span>
                          <span style={{ fontSize:11, color:'rgba(245,238,242,0.7)', fontFamily:'monospace', minWidth:200, flexShrink:0 }}>{route}</span>
                          <span style={{ fontSize:11, color:'rgba(245,238,242,0.35)' }}>{desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Online users detail */}
                  {devData.online?.users?.length > 0 && (
                    <div style={{ background:'rgba(74,222,128,0.04)', border:'1px solid rgba(74,222,128,0.15)', borderRadius:16, padding:'16px 20px', marginBottom:16 }}>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'rgba(74,222,128,0.5)', textTransform:'uppercase', marginBottom:12 }}>Online návštěvníci -- detail</div>
                      {devData.online.users.map((u:any) => (
                        <div key={u.id} style={{ display:'flex', gap:10, padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontFamily:'monospace', fontSize:11 }}>
                          <span style={{ color:'rgba(245,238,242,0.3)', minWidth:30 }}>{u.device==='mobile'?'📱':'💻'}</span>
                          <span style={{ color:'rgba(74,222,128,0.7)', minWidth:80 }}>{u.userName??'anon'}</span>
                          <span style={{ color:'rgba(245,238,242,0.5)' }}>{u.page}</span>
                          <span style={{ color:'rgba(245,238,242,0.25)', marginLeft:'auto' }}>{Math.round((Date.now()-u.lastSeen)/1000)}s</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Repo & deploy info */}
                  <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'16px 20px' }}>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'rgba(245,238,242,0.25)', textTransform:'uppercase', marginBottom:12 }}>Deploy</div>
                    {[
                      ['GitHub', 'Matuchovic/viktoria-lashes'],
                      ['Branch', 'main (auto deploy)'],
                      ['Vercel projekt', 'viktoria-lashes'],
                      ['Supabase projekt', 'nqhyrkoexrlcdeeraxst (eu-west-1)'],
                      ['Domain', 'www.viktoria-lashes.cz'],
                      ['Admin emails', 'matuchovic@gmail.com, viktorialadikova23@gmail.com'],
                    ].map(([k,v]) => (
                      <div key={k} style={{ display:'flex', gap:12, padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)', minWidth:140 }}>{k}</span>
                        <span style={{ fontFamily:'monospace', fontSize:11, color:'rgba(245,238,242,0.65)' }}>{v}</span>
                      </div>
                    ))}
                  </div>

                </>)}

                </>)}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
