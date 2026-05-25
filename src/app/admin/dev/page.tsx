'use client'
import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CustomCursor } from '@/components/ui/CustomCursor'

type Section = 'overview' | 'users' | 'security' | 'diagnostics' | 'database' | 'logs' | 'backup'

const SECTIONS: { id: Section; label: string; icon: string }[] = [
  { id: 'overview', label: 'Command Center', icon: '◈' },
  { id: 'users', label: 'Users', icon: '◎' },
  { id: 'security', label: 'Threat Intel', icon: '⬡' },
  { id: 'diagnostics', label: 'Diagnostics', icon: '◇' },
  { id: 'database', label: 'Database', icon: '▣' },
  { id: 'logs', label: 'Activity Log', icon: '▤' },
  { id: 'backup', label: 'Backup', icon: '⊕' },
]

function Spinner() {
  return <span style={{ display:'inline-block', width:12, height:12, border:'1.5px solid rgba(124,58,255,0.3)', borderTopColor:'#7c3aff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
}

function PingDot({ ok, ms }: { ok: boolean | null; ms: number }) {
  if (ok === null) return <span style={{ width:8, height:8, borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'inline-block' }} />
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
      <span style={{ width:8, height:8, borderRadius:'50%', background: ok ? '#00ffaa' : '#ff2d78', boxShadow: ok ? '0 0 8px #00ffaa' : '0 0 8px #ff2d78', display:'inline-block' }} />
      <span style={{ fontFamily:'monospace', fontSize:11, color: ok ? '#00ffaa' : '#ff2d78' }}>{ms > 0 ? `${ms}ms` : 'ERR'}</span>
    </span>
  )
}

export default function DevPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [section, setSection] = useState<Section>('overview')
  const [stats, setStats] = useState<any>(null)
  const [online, setOnline] = useState<any>(null)
  const [security, setSecurity] = useState<any>(null)
  const [ping, setPing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [pingLoading, setPingLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [backupLoading, setBackupLoading] = useState(false)
  const [backupResult, setBackupResult] = useState('')
  const [ipLookups, setIpLookups] = useState<Record<string, any>>({})
  const [emailTo, setEmailTo] = useState('matuchovic@gmail.com')
  const [emailResult, setEmailResult] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [pointsUserId, setPointsUserId] = useState('')
  const [pointsAmount, setPointsAmount] = useState('')
  const [pointsResult, setPointsResult] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(false)

  const addLog = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString('cs-CZ')
    setLogs(l => [`[${time}] ${msg}`, ...l].slice(0, 100))
  }, [])

  const loadData = useCallback(async () => {
    if (status !== 'authenticated') return
    try {
      const [s, o, sec] = await Promise.all([
        fetch('/api/dev/stats').then(r => r.json()).catch(() => ({})),
        fetch('/api/analytics/online').then(r => r.json()).catch(() => ({})),
        fetch('/api/dev/security').then(r => r.json()).catch(() => ({})),
      ])
      setStats(s)
      setOnline(o)
      setSecurity(sec)
      setLastRefresh(new Date())
      addLog('Data refreshed')
    } catch(e) {
      addLog('ERROR: Data refresh failed')
    } finally {
      setLoading(false)
    }
  }, [status, addLog])

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return }
    if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') { router.push('/dashboard') }
  }, [status, session, router])

  useEffect(() => { loadData() }, [loadData])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(loadData, 15000)
    return () => clearInterval(interval)
  }, [autoRefresh, loadData])

  const runPing = async () => {
    setPingLoading(true)
    addLog('Running diagnostics...')
    const res = await fetch('/api/dev/ping').then(r => r.json()).catch(() => ({}))
    setPing(res)
    addLog(`DB: ${res.db?.ok ? 'OK' : 'FAIL'} | SMTP: ${res.smtp?.ok ? 'OK' : 'FAIL'} | Groq: ${res.groq?.ok ? 'OK' : 'FAIL'}`)
    setPingLoading(false)
  }

  const lookupIp = async (ip: string) => {
    if (ipLookups[ip]) return
    setIpLookups(prev => ({ ...prev, [ip]: 'loading' }))
    addLog(`IP lookup: ${ip}`)
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=country,countryCode,city,isp,org,mobile,proxy`).then(r => r.json()).catch(() => null)
    setIpLookups(prev => ({ ...prev, [ip]: res }))
    if (res) addLog(`${ip} => ${res.city}, ${res.country} (${res.isp})`)
  }

  const downloadBackup = async () => {
    setBackupLoading(true)
    setBackupResult('')
    addLog('Creating backup...')
    try {
      const res = await fetch('/api/dev/backup').then(r => r.json())
      const blob = new Blob([JSON.stringify(res, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `vl-backup-${new Date().toISOString().slice(0,10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      const c = res.counts
      setBackupResult(`Backup created: ${c.users} users, ${c.bookings} bookings, ${c.reviews} reviews`)
      addLog(`Backup downloaded: ${JSON.stringify(res.counts)}`)
    } catch(e) {
      setBackupResult('ERROR: Backup failed')
      addLog('ERROR: Backup failed')
    }
    setBackupLoading(false)
  }

  const testEmail = async () => {
    setEmailLoading(true)
    setEmailResult('')
    addLog(`Sending test email to ${emailTo}`)
    const res = await fetch('/api/dev/email-test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: emailTo, subject: 'DEV Test', text: 'System test from DEV panel' }) }).then(r => r.json()).catch(() => ({ error: 'Network error' }))
    setEmailResult(res.ok ? 'Email sent!' : `Error: ${res.error}`)
    addLog(res.ok ? `Email sent to ${emailTo}` : `Email FAILED: ${res.error}`)
    setEmailLoading(false)
  }

  const addPoints = async (userId: string, email: string) => {
    if (!pointsAmount) return
    addLog(`Adding ${pointsAmount} points to ${email}`)
    const res = await fetch('/api/loyalty/add-points', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, points: Number(pointsAmount), reason: 'DEV panel - manual' }) }).then(r => r.json()).catch(() => ({ error: 'Failed' }))
    if (res.ok) {
      setPointsResult(`Added ${pointsAmount} pts to ${email}`)
      addLog(`Points added: ${pointsAmount} -> ${email}`)
      loadData()
    } else {
      setPointsResult(`Error: ${res.error}`)
    }
    setPointsAmount('')
    setPointsUserId('')
  }

  const changeRole = async (userId: string, name: string, newRole: string) => {
    if (!confirm(`Change ${name} to ${newRole}?`)) return
    addLog(`Changing role: ${name} -> ${newRole}`)
    await fetch('/api/dev/user-role', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, role: newRole }) })
    loadData()
  }

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight:'100vh', background:'#000005', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
        <div style={{ width:40, height:40, border:'2px solid rgba(124,58,255,0.2)', borderTopColor:'#7c3aff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
        <div style={{ fontFamily:'monospace', fontSize:11, letterSpacing:3, color:'rgba(124,58,255,0.5)', textTransform:'uppercase' }}>Initializing DEV Panel</div>
      </div>
    )
  }

  const G = { fontFamily:'monospace' }
  const card = { background:'rgba(124,58,255,0.05)', border:'1px solid rgba(124,58,255,0.12)', borderRadius:14, padding:'14px 16px' }
  const panelBg = { background:'rgba(5,2,15,0.7)', border:'1px solid rgba(124,58,255,0.1)', borderRadius:16, padding:18, marginBottom:12 }

  return (
    <div style={{ minHeight:'100vh', background:'#000005', color:'rgba(220,210,255,0.9)', display:'flex', fontFamily:'Inter,sans-serif', position:'relative', overflow:'hidden' }}>
      <CustomCursor />
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.2;transform:scale(.5)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(124,58,255,0.3);border-radius:10px}
        input{outline:none}
        input:focus{border-color:rgba(124,58,255,0.5)!important;background:rgba(124,58,255,0.06)!important;}
      `}</style>

      {/* Ambient orbs */}
      <div style={{ position:'fixed', top:-150, left:-100, width:500, height:500, background:'radial-gradient(circle,rgba(124,58,255,0.12),transparent 65%)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', bottom:-100, right:-80, width:400, height:400, background:'radial-gradient(circle,rgba(255,32,112,0.08),transparent 65%)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, backgroundImage:'linear-gradient(rgba(124,58,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,255,0.03) 1px,transparent 1px)', backgroundSize:'40px 40px', pointerEvents:'none', zIndex:0 }} />

      {/* Sidebar */}
      <div style={{ width:210, flexShrink:0, background:'rgba(5,2,15,0.85)', borderRight:'1px solid rgba(124,58,255,0.12)', display:'flex', flexDirection:'column', position:'relative', zIndex:2, backdropFilter:'blur(40px)' }}>
        <div style={{ padding:'22px 18px 18px', borderBottom:'1px solid rgba(124,58,255,0.1)', marginBottom:10 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:5, background:'rgba(124,58,255,0.1)', border:'1px solid rgba(124,58,255,0.2)', fontFamily:'monospace', fontSize:8, letterSpacing:2, color:'rgba(160,100,255,0.9)', textTransform:'uppercase', marginBottom:12 }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:'#7c3aff', boxShadow:'0 0 8px #7c3aff', display:'inline-block', animation:'pulse 2s ease-in-out infinite' }} />
            sys/dev v3.0
          </div>
          <div style={{ fontSize:14, fontWeight:500, color:'rgba(220,210,255,0.95)', letterSpacing:-.2 }}>Viktória Lashes</div>
          <div style={{ fontFamily:'monospace', fontSize:8, color:'rgba(200,185,255,0.2)', marginTop:4, letterSpacing:.5 }}>admin.viktoria-lashes.cz</div>
        </div>

        <div style={{ flex:1, padding:'0 8px' }}>
          {SECTIONS.map(s => (
            <div key={s.id} onClick={() => setSection(s.id)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:8, fontSize:12, cursor:'pointer', marginBottom:2, position:'relative', borderLeft:`2px solid ${section === s.id ? '#7c3aff' : 'transparent'}`, background: section === s.id ? 'rgba(124,58,255,0.08)' : 'transparent', color: section === s.id ? 'rgba(220,210,255,0.95)' : 'rgba(200,185,255,0.3)', transition:'all .2s ease' }}>
              <span style={{ fontSize:14, color: section === s.id ? '#7c3aff' : 'inherit' }}>{s.icon}</span>
              {s.label}
            </div>
          ))}
        </div>

        <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(124,58,255,0.1)', display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#7c3aff,#ff2070)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:500, color:'white' }}>O</div>
          <div>
            <div style={{ fontSize:11, color:'rgba(220,210,255,0.8)' }}>Ondrej</div>
            <div style={{ fontFamily:'monospace', fontSize:8, color:'rgba(200,185,255,0.25)', marginTop:1 }}>root · admin</div>
          </div>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#00ffaa', marginLeft:'auto', boxShadow:'0 0 8px #00ffaa' }} />
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflowY:'auto', padding:26, position:'relative', zIndex:2 }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:24 }}>
          <div>
            <div style={{ fontFamily:'monospace', fontSize:8, letterSpacing:4, color:'rgba(124,58,255,0.5)', textTransform:'uppercase', marginBottom:6 }}>{SECTIONS.find(s=>s.id===section)?.label}</div>
            <h1 style={{ fontSize:22, fontWeight:300, letterSpacing:-.5, background:'linear-gradient(135deg,rgba(220,210,255,0.95),rgba(160,110,255,0.7))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', margin:0 }}>
              {section === 'overview' ? 'Command Center' : section === 'users' ? 'User Management' : section === 'security' ? 'Threat Intelligence' : section === 'diagnostics' ? 'System Diagnostics' : section === 'database' ? 'Database Explorer' : section === 'logs' ? 'Activity Log' : 'Backup & Recovery'}
            </h1>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {lastRefresh && <div style={{ fontFamily:'monospace', fontSize:9, color:'rgba(200,185,255,0.2)' }}>Updated {lastRefresh.toLocaleTimeString('cs-CZ')}</div>}
            <button onClick={() => setAutoRefresh(a => !a)} style={{ padding:'5px 12px', borderRadius:20, border:`1px solid ${autoRefresh ? 'rgba(0,255,170,0.3)' : 'rgba(124,58,255,0.2)'}`, background: autoRefresh ? 'rgba(0,255,170,0.06)' : 'transparent', color: autoRefresh ? '#00ffaa' : 'rgba(200,185,255,0.4)', fontFamily:'monospace', fontSize:9, cursor:'pointer', letterSpacing:1 }}>
              {autoRefresh ? 'AUTO ON' : 'AUTO OFF'}
            </button>
            <button onClick={loadData} style={{ padding:'5px 12px', borderRadius:20, border:'1px solid rgba(124,58,255,0.25)', background:'rgba(124,58,255,0.08)', color:'rgba(180,130,255,0.9)', fontFamily:'monospace', fontSize:9, cursor:'pointer', letterSpacing:1 }}>REFRESH</button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={section} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }} transition={{ duration:.2 }}>

            {/* OVERVIEW */}
            {section === 'overview' && (
              <div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:14 }}>
                  {[
                    { label:'Users', value:stats?.totalUsers??'...', color:'#a064ff', sub:'registered' },
                    { label:'Bookings', value:stats?.totalBookings??'...', color:'#ffb800', sub:'total in DB' },
                    { label:'Revenue', value:stats?.totalRevenue?`${Math.round(stats.totalRevenue/1000)}k Kc`:'...', color:'#00ffaa', sub:'non-cancelled' },
                    { label:'Online', value:online?.count??0, color:'#00d4ff', sub:'right now' },
                    { label:'Push Subs', value:stats?.pushSubs??'...', color:'#7c3aff', sub:'subscribed' },
                    { label:'Reviews', value:stats?.totalReviews??'...', color:'#ff2d78', sub:'total' },
                    { label:'Pending', value:stats?.pendingReviews??'...', color:'#fbbf24', sub:'awaiting review' },
                    { label:'Points', value:stats?.usersList?.reduce((a:number,u:any)=>a+(u.loyaltyPoints||0),0)??'...', color:'#e8b84b', sub:'total issued' },
                  ].map((m,i) => (
                    <motion.div key={m.label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                      style={{ ...card, position:'relative', overflow:'hidden', cursor:'default', transition:'all .22s ease' }}
                      whileHover={{ y:-3, borderColor:'rgba(124,58,255,0.3)' }}>
                      <div style={{ position:'absolute', bottom:-15, right:-10, width:60, height:60, borderRadius:'50%', background:`radial-gradient(circle,${m.color},transparent 70%)`, opacity:.1 }} />
                      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${m.color},transparent)`, opacity:0 }} className="shine" />
                      <div style={{ fontFamily:'monospace', fontSize:8, letterSpacing:1.5, color:'rgba(200,185,255,0.3)', textTransform:'uppercase', marginBottom:8 }}>{m.label}</div>
                      <div style={{ fontSize:24, fontWeight:300, color:m.color, lineHeight:1 }}>{m.value}</div>
                      <div style={{ fontFamily:'monospace', fontSize:8, color:'rgba(200,185,255,0.2)', marginTop:5 }}>{m.sub}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Bar chart */}
                <div style={panelBg}>
                  <div style={{ fontFamily:'monospace', fontSize:8, letterSpacing:3, color:'rgba(200,185,255,0.25)', textTransform:'uppercase', marginBottom:16 }}>Bookings — last 7 days</div>
                  <div style={{ display:'flex', gap:6, alignItems:'flex-end', height:60 }}>
                    {(stats?.dailyStats??[{date:'...', bookings:0}]).map((d:any, i:number) => {
                      const max = Math.max(...(stats?.dailyStats??[]).map((x:any)=>x.bookings), 1)
                      const h = Math.max((d.bookings/max)*100, 4)
                      const isPeak = d.bookings === max && d.bookings > 0
                      return (
                        <div key={d.date} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, height:'100%', justifyContent:'flex-end' }}>
                          <div style={{ fontFamily:'monospace', fontSize:9, color:isPeak?'rgba(124,58,255,0.8)':'transparent' }}>{d.bookings||''}</div>
                          <motion.div whileHover={{ background:isPeak?'rgba(124,58,255,0.8)':'rgba(124,58,255,0.5)' }}
                            style={{ width:'100%', height:`${h}%`, borderRadius:'3px 3px 0 0', background:isPeak?'rgba(124,58,255,0.5)':'rgba(124,58,255,0.2)', borderTop:`1px solid ${isPeak?'rgba(124,58,255,0.8)':'transparent'}`, boxShadow:isPeak?'0 -6px 20px rgba(124,58,255,0.3)':'none', cursor:'pointer' }} />
                          <div style={{ fontFamily:'monospace', fontSize:8, color:'rgba(200,185,255,0.2)' }}>{d.date}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Online visitors */}
                {online?.users?.length > 0 && (
                  <div style={panelBg}>
                    <div style={{ fontFamily:'monospace', fontSize:8, letterSpacing:3, color:'rgba(200,185,255,0.25)', textTransform:'uppercase', marginBottom:14, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      Live Sessions
                      <span style={{ display:'flex', alignItems:'center', gap:5, color:'#00ffaa', fontSize:9 }}>
                        <span style={{ width:5, height:5, borderRadius:'50%', background:'#00ffaa', boxShadow:'0 0 6px #00ffaa', display:'inline-block', animation:'pulse 1.5s ease-in-out infinite' }} />
                        {online.count} active
                      </span>
                    </div>
                    {online.users.map((u:any) => (
                      <div key={u.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                        <span style={{ fontSize:14 }}>{u.device==='mobile'?'[M]':'[D]'}</span>
                        <span style={{ fontFamily:'monospace', fontSize:11, color:'rgba(200,185,255,0.5)', flex:1 }}>{u.page}</span>
                        {u.userName && <span style={{ fontFamily:'monospace', fontSize:10, color:'rgba(124,58,255,0.7)' }}>{u.userName}</span>}
                        <span style={{ fontFamily:'monospace', fontSize:10, color:'rgba(200,185,255,0.25)' }}>{Math.round((Date.now()-u.lastSeen)/1000)}s</span>
                        <button onClick={() => lookupIp(u.id)} style={{ padding:'2px 8px', borderRadius:4, border:'1px solid rgba(124,58,255,0.2)', background:'rgba(124,58,255,0.05)', color:'rgba(160,100,255,0.7)', fontFamily:'monospace', fontSize:8, cursor:'pointer' }}>IP</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* USERS */}
            {section === 'users' && (
              <div style={panelBg}>
                <div style={{ fontFamily:'monospace', fontSize:8, letterSpacing:3, color:'rgba(200,185,255,0.25)', textTransform:'uppercase', marginBottom:16 }}>
                  All Users ({stats?.usersList?.length ?? 0})
                </div>
                {pointsResult && <div style={{ marginBottom:12, padding:'8px 12px', borderRadius:8, background:'rgba(0,255,170,0.06)', border:'1px solid rgba(0,255,170,0.15)', fontFamily:'monospace', fontSize:11, color:'#00ffaa' }}>{pointsResult}</div>}
                {stats?.usersList?.map((u:any) => (
                  <motion.div key={u.id} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.03)', flexWrap:'wrap' }}>
                    <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg,rgba(124,58,255,0.5),rgba(255,32,112,0.4))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:500, color:'white', flexShrink:0 }}>
                      {u.name?.[0]?.toUpperCase()??'?'}
                    </div>
                    <div style={{ flex:1, minWidth:120 }}>
                      <div style={{ fontSize:12, color:'rgba(220,210,255,0.88)' }}>{u.name}</div>
                      <div style={{ fontFamily:'monospace', fontSize:9, color:'rgba(200,185,255,0.3)', marginTop:2 }}>{u.email}</div>
                    </div>
                    <span style={{ fontFamily:'monospace', fontSize:11, color:'#ffb800', marginRight:4 }}>{u.loyaltyPoints} pts</span>
                    <span style={{ fontFamily:'monospace', fontSize:8, padding:'2px 8px', borderRadius:20, background: u.role==='ADMIN'?'rgba(124,58,255,0.12)':'rgba(255,255,255,0.04)', color: u.role==='ADMIN'?'rgba(170,120,255,0.9)':'rgba(200,185,255,0.3)', border:`1px solid ${u.role==='ADMIN'?'rgba(124,58,255,0.25)':'rgba(255,255,255,0.06)'}` }}>{u.role}</span>
                    {/* Add points inline */}
                    {pointsUserId === u.id ? (
                      <div style={{ display:'flex', gap:6 }}>
                        <input type="number" placeholder="pts" value={pointsAmount} onChange={e=>setPointsAmount(e.target.value)}
                          style={{ width:60, background:'rgba(124,58,255,0.06)', border:'1px solid rgba(124,58,255,0.2)', borderRadius:6, padding:'4px 8px', color:'rgba(220,210,255,0.8)', fontFamily:'monospace', fontSize:11 }} />
                        <button onClick={() => addPoints(u.id, u.email)} style={{ padding:'4px 10px', borderRadius:6, background:'rgba(0,255,170,0.1)', border:'1px solid rgba(0,255,170,0.2)', color:'#00ffaa', fontFamily:'monospace', fontSize:10, cursor:'pointer' }}>OK</button>
                        <button onClick={() => setPointsUserId('')} style={{ padding:'4px 8px', borderRadius:6, background:'none', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(200,185,255,0.3)', fontFamily:'monospace', fontSize:10, cursor:'pointer' }}>X</button>
                      </div>
                    ) : (
                      <button onClick={() => setPointsUserId(u.id)} style={{ padding:'3px 8px', borderRadius:6, border:'1px solid rgba(124,58,255,0.15)', background:'rgba(124,58,255,0.05)', color:'rgba(160,100,255,0.6)', fontFamily:'monospace', fontSize:9, cursor:'pointer' }}>+pts</button>
                    )}
                    {u.role !== 'ADMIN' && (
                      <button onClick={() => changeRole(u.id, u.name, 'ADMIN')} style={{ padding:'3px 8px', borderRadius:6, border:'1px solid rgba(255,255,255,0.06)', background:'none', color:'rgba(200,185,255,0.2)', fontFamily:'monospace', fontSize:9, cursor:'pointer' }}>admin</button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* SECURITY */}
            {section === 'security' && (
              <div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:12 }}>
                  {[
                    { label:'Total Events', value:security?.total??0, color:'#fbbf24' },
                    { label:'Last 24h', value:security?.last24h??0, color:'#ff2d78' },
                    { label:'Suspicious IPs', value:security?.suspiciousIps?.length??0, color:'#ff2d78' },
                    { label:'Status', value:(security?.suspiciousIps?.length??0)===0?'NOMINAL':'ALERT', color:(security?.suspiciousIps?.length??0)===0?'#00ffaa':'#ff2d78' },
                  ].map(s => (
                    <div key={s.label} style={{ ...card }}>
                      <div style={{ fontFamily:'monospace', fontSize:8, letterSpacing:1.5, color:'rgba(200,185,255,0.3)', textTransform:'uppercase', marginBottom:8 }}>{s.label}</div>
                      <div style={{ fontSize:22, fontWeight:300, color:s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {security?.suspiciousIps?.length > 0 && (
                  <div style={{ ...panelBg, border:'1px solid rgba(255,32,112,0.2)' }}>
                    <div style={{ fontFamily:'monospace', fontSize:8, letterSpacing:3, color:'#ff2d78', textTransform:'uppercase', marginBottom:14 }}>Suspicious IPs</div>
                    {security.suspiciousIps.map(([ip, count]: [string, number]) => (
                      <div key={ip} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid rgba(255,32,112,0.06)' }}>
                        <span style={{ fontFamily:'monospace', fontSize:11, color:'#ff2d78', flex:1 }}>{ip}</span>
                        <span style={{ fontFamily:'monospace', fontSize:10, color:'rgba(200,185,255,0.3)' }}>{count} req</span>
                        <button onClick={() => lookupIp(ip)} style={{ padding:'3px 10px', borderRadius:6, border:'1px solid rgba(255,32,112,0.2)', background:'rgba(255,32,112,0.05)', color:'rgba(255,100,150,0.8)', fontFamily:'monospace', fontSize:9, cursor:'pointer' }}>
                          {ipLookups[ip] === 'loading' ? '...' : 'Lookup IP'}
                        </button>
                        {ipLookups[ip] && ipLookups[ip] !== 'loading' && (
                          <span style={{ fontFamily:'monospace', fontSize:10, color:'rgba(200,185,255,0.5)' }}>
                            {ipLookups[ip].city}, {ipLookups[ip].countryCode} / {ipLookups[ip].isp?.slice(0,20)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div style={panelBg}>
                  <div style={{ fontFamily:'monospace', fontSize:8, letterSpacing:3, color:'rgba(200,185,255,0.25)', textTransform:'uppercase', marginBottom:14 }}>Security Log</div>
                  {!security?.recentEvents?.length ? (
                    <div style={{ padding:'32px', textAlign:'center', fontFamily:'monospace', fontSize:11, color:'rgba(200,185,255,0.15)' }}>No security events detected</div>
                  ) : security.recentEvents.slice(0,20).map((e:any, i:number) => (
                    <div key={i} style={{ display:'flex', gap:10, padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.03)', fontFamily:'monospace', fontSize:10 }}>
                      <span style={{ color:'rgba(200,185,255,0.2)', minWidth:65 }}>{new Date(e.time).toLocaleTimeString('cs-CZ')}</span>
                      <span style={{ color:'#ff2d78', minWidth:90 }}>{e.type}</span>
                      <span style={{ color:'rgba(200,185,255,0.4)', minWidth:100 }}>{e.ip}</span>
                      <span style={{ color:'rgba(200,185,255,0.25)', flex:1 }}>{e.path}</span>
                      <button onClick={() => lookupIp(e.ip)} style={{ padding:'1px 6px', borderRadius:4, border:'1px solid rgba(124,58,255,0.15)', background:'none', color:'rgba(160,100,255,0.5)', fontFamily:'monospace', fontSize:8, cursor:'pointer' }}>GEO</button>
                      {ipLookups[e.ip] && ipLookups[e.ip] !== 'loading' && (
                        <span style={{ color:'rgba(200,185,255,0.3)', fontSize:9 }}>{ipLookups[e.ip].city}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DIAGNOSTICS */}
            {section === 'diagnostics' && (
              <div>
                <div style={{ marginBottom:14, display:'flex', gap:10 }}>
                  <button onClick={runPing} disabled={pingLoading}
                    style={{ padding:'10px 24px', borderRadius:10, background:'rgba(124,58,255,0.1)', border:'1px solid rgba(124,58,255,0.25)', color:'rgba(180,130,255,0.9)', fontFamily:'monospace', fontSize:11, cursor:'pointer', display:'flex', alignItems:'center', gap:8, transition:'all .2s' }}>
                    {pingLoading ? <Spinner /> : null}
                    {pingLoading ? 'Running...' : 'RUN DIAGNOSTICS'}
                  </button>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:14 }}>
                  {[
                    { label:'Database', key:'db' },
                    { label:'SMTP Relay', key:'smtp' },
                    { label:'Groq API', key:'groq' },
                  ].map(s => (
                    <div key={s.key} style={{ ...card }}>
                      <div style={{ fontFamily:'monospace', fontSize:8, letterSpacing:1.5, color:'rgba(200,185,255,0.3)', textTransform:'uppercase', marginBottom:10 }}>{s.label}</div>
                      {ping ? <PingDot ok={ping[s.key]?.ok} ms={ping[s.key]?.ms} /> : <span style={{ fontFamily:'monospace', fontSize:10, color:'rgba(200,185,255,0.2)' }}>—</span>}
                    </div>
                  ))}
                </div>

                {/* Env vars */}
                {ping?.env && (
                  <div style={panelBg}>
                    <div style={{ fontFamily:'monospace', fontSize:8, letterSpacing:3, color:'rgba(200,185,255,0.25)', textTransform:'uppercase', marginBottom:14 }}>Environment Variables</div>
                    {Object.entries(ping.env).map(([k, v]: [string, any]) => (
                      <div key={k} style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.03)', fontFamily:'monospace', fontSize:10 }}>
                        <span style={{ flex:1, color:'rgba(200,185,255,0.5)' }}>{k}</span>
                        <span style={{ color: v ? '#00ffaa' : '#ff2d78', fontSize:9 }}>{v ? 'SET' : 'MISSING'}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Email test */}
                <div style={panelBg}>
                  <div style={{ fontFamily:'monospace', fontSize:8, letterSpacing:3, color:'rgba(200,185,255,0.25)', textTransform:'uppercase', marginBottom:14 }}>SMTP Test</div>
                  <div style={{ display:'flex', gap:10, marginBottom:10 }}>
                    <input value={emailTo} onChange={e=>setEmailTo(e.target.value)} placeholder="recipient"
                      style={{ flex:1, background:'rgba(124,58,255,0.04)', border:'1px solid rgba(124,58,255,0.12)', borderRadius:8, padding:'8px 12px', color:'rgba(220,210,255,0.8)', fontFamily:'monospace', fontSize:11 }} />
                    <button onClick={testEmail} disabled={emailLoading}
                      style={{ padding:'8px 18px', borderRadius:8, background:'rgba(124,58,255,0.1)', border:'1px solid rgba(124,58,255,0.25)', color:'rgba(180,130,255,0.9)', fontFamily:'monospace', fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                      {emailLoading ? <Spinner /> : null} SEND
                    </button>
                  </div>
                  {emailResult && <div style={{ fontFamily:'monospace', fontSize:11, color: emailResult.includes('Error') ? '#ff2d78' : '#00ffaa', padding:'8px 12px', borderRadius:8, background: emailResult.includes('Error') ? 'rgba(255,32,112,0.06)' : 'rgba(0,255,170,0.06)', border:`1px solid ${emailResult.includes('Error') ? 'rgba(255,32,112,0.15)' : 'rgba(0,255,170,0.15)'}` }}>{emailResult}</div>}
                </div>
              </div>
            )}

            {/* DATABASE */}
            {section === 'database' && (
              <div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:14 }}>
                  {[
                    { label:'users', value:stats?.totalUsers??'...', color:'#a064ff' },
                    { label:'bookings', value:stats?.totalBookings??'...', color:'#ffb800' },
                    { label:'reviews', value:stats?.totalReviews??'...', color:'#ff2d78' },
                    { label:'push_subscriptions', value:stats?.pushSubs??'...', color:'#00d4ff' },
                    { label:'lash_points_history', value:'...', color:'#00ffaa' },
                    { label:'safety_checkins', value:'...', color:'#fbbf24' },
                  ].map(t => (
                    <div key={t.label} style={{ ...card }}>
                      <div style={{ fontFamily:'monospace', fontSize:8, color:'rgba(200,185,255,0.25)', marginBottom:8 }}>{t.label}</div>
                      <div style={{ fontSize:22, fontWeight:300, color:t.color }}>{t.value}</div>
                      <div style={{ fontFamily:'monospace', fontSize:8, color:'rgba(200,185,255,0.2)', marginTop:4 }}>rows</div>
                    </div>
                  ))}
                </div>

                {/* Top users by points */}
                {stats?.usersList && (
                  <div style={panelBg}>
                    <div style={{ fontFamily:'monospace', fontSize:8, letterSpacing:3, color:'rgba(200,185,255,0.25)', textTransform:'uppercase', marginBottom:14 }}>Top Users by Points</div>
                    {[...stats.usersList].sort((a:any,b:any)=>(b.loyaltyPoints||0)-(a.loyaltyPoints||0)).slice(0,10).map((u:any,i:number) => (
                      <div key={u.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.03)', fontFamily:'monospace', fontSize:11 }}>
                        <span style={{ color:'rgba(200,185,255,0.2)', minWidth:20 }}>#{i+1}</span>
                        <span style={{ flex:1, color:'rgba(200,185,255,0.6)' }}>{u.name}</span>
                        <span style={{ color:'rgba(200,185,255,0.35)' }}>{u.email}</span>
                        <span style={{ color:'#ffb800', fontWeight:700 }}>{u.loyaltyPoints} pts</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* LOGS */}
            {section === 'logs' && (
              <div>
                <div style={{ display:'flex', gap:10, marginBottom:14, alignItems:'center' }}>
                  <div style={{ flex:1, fontFamily:'monospace', fontSize:9, color:'rgba(200,185,255,0.25)' }}>{logs.length} entries</div>
                  <button onClick={() => { navigator.clipboard.writeText(logs.join('\n')); addLog('Logs copied to clipboard') }}
                    style={{ padding:'6px 14px', borderRadius:8, border:'1px solid rgba(124,58,255,0.2)', background:'rgba(124,58,255,0.06)', color:'rgba(180,130,255,0.7)', fontFamily:'monospace', fontSize:9, cursor:'pointer' }}>COPY ALL</button>
                  <button onClick={() => setLogs([])}
                    style={{ padding:'6px 14px', borderRadius:8, border:'1px solid rgba(255,32,112,0.2)', background:'rgba(255,32,112,0.04)', color:'rgba(255,100,150,0.7)', fontFamily:'monospace', fontSize:9, cursor:'pointer' }}>CLEAR</button>
                </div>
                <div style={{ ...panelBg, background:'rgba(0,0,0,0.5)', maxHeight:460, overflowY:'auto' }}>
                  {logs.length === 0 ? (
                    <div style={{ padding:40, textAlign:'center', fontFamily:'monospace', fontSize:11, color:'rgba(200,185,255,0.15)' }}>No activity logged yet</div>
                  ) : logs.map((l,i) => (
                    <motion.div key={i} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                      style={{ fontFamily:'monospace', fontSize:11, padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.025)', color: l.includes('ERROR') ? '#ff2d78' : 'rgba(200,185,255,0.55)' }}>
                      {l}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* BACKUP */}
            {section === 'backup' && (
              <div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                  {/* DB Backup */}
                  <div style={panelBg}>
                    <div style={{ fontFamily:'monospace', fontSize:8, letterSpacing:3, color:'rgba(200,185,255,0.25)', textTransform:'uppercase', marginBottom:16 }}>Database Backup</div>
                    <div style={{ fontSize:13, color:'rgba(200,185,255,0.5)', marginBottom:16, lineHeight:1.7 }}>
                      Downloads complete DB snapshot as JSON — all users, bookings, reviews, points, checkins and push subscriptions.
                    </div>
                    <div style={{ fontFamily:'monospace', fontSize:10, color:'rgba(200,185,255,0.3)', marginBottom:16 }}>
                      <div>Format: JSON</div>
                      <div>Filename: vl-backup-{new Date().toISOString().slice(0,10)}.json</div>
                    </div>
                    <button onClick={downloadBackup} disabled={backupLoading}
                      style={{ width:'100%', padding:'12px', borderRadius:10, background:'linear-gradient(135deg,rgba(124,58,255,0.15),rgba(255,32,112,0.08))', border:'1px solid rgba(124,58,255,0.25)', color:'rgba(180,130,255,0.9)', fontFamily:'monospace', fontSize:11, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all .2s', letterSpacing:1 }}>
                      {backupLoading ? <Spinner /> : null}
                      {backupLoading ? 'CREATING BACKUP...' : 'CREATE DB BACKUP'}
                    </button>
                    {backupResult && <div style={{ marginTop:12, fontFamily:'monospace', fontSize:10, color: backupResult.includes('ERROR') ? '#ff2d78' : '#00ffaa', padding:'8px 12px', borderRadius:8, background: backupResult.includes('ERROR') ? 'rgba(255,32,112,0.06)' : 'rgba(0,255,170,0.06)', border:`1px solid ${backupResult.includes('ERROR') ? 'rgba(255,32,112,0.15)' : 'rgba(0,255,170,0.15)'}` }}>{backupResult}</div>}
                  </div>

                  {/* Source code */}
                  <div style={panelBg}>
                    <div style={{ fontFamily:'monospace', fontSize:8, letterSpacing:3, color:'rgba(200,185,255,0.25)', textTransform:'uppercase', marginBottom:16 }}>Source Code Backup</div>
                    <div style={{ fontSize:13, color:'rgba(200,185,255,0.5)', marginBottom:16, lineHeight:1.7 }}>
                      Downloads complete source code from GitHub as ZIP — all pages, components, API routes, config files.
                    </div>
                    <div style={{ fontFamily:'monospace', fontSize:10, color:'rgba(200,185,255,0.3)', marginBottom:16 }}>
                      <div>Repo: Matuchovic/viktoria-lashes</div>
                      <div>Branch: main</div>
                      <div>Format: ZIP</div>
                    </div>
                    <a href="https://github.com/Matuchovic/viktoria-lashes/archive/refs/heads/main.zip" target="_blank"
                      style={{ width:'100%', padding:'12px', borderRadius:10, background:'linear-gradient(135deg,rgba(0,212,255,0.1),rgba(0,255,170,0.06))', border:'1px solid rgba(0,212,255,0.2)', color:'rgba(0,212,255,0.9)', fontFamily:'monospace', fontSize:11, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, textDecoration:'none', letterSpacing:1, boxSizing:'border-box' as const }}>
                      DOWNLOAD FROM GITHUB
                    </a>
                    <div style={{ marginTop:10, fontFamily:'monospace', fontSize:9, color:'rgba(200,185,255,0.2)', textAlign:'center' }}>Opens GitHub ZIP download</div>
                  </div>
                </div>

                {/* Stack info */}
                <div style={panelBg}>
                  <div style={{ fontFamily:'monospace', fontSize:8, letterSpacing:3, color:'rgba(200,185,255,0.25)', textTransform:'uppercase', marginBottom:14 }}>System Info</div>
                  {[
                    ['Framework', 'Next.js 15.3.6 App Router'],
                    ['Database', 'Supabase PostgreSQL eu-west-1 / nqhyrkoexrlcdeeraxst'],
                    ['Hosting', 'Vercel Production / viktoria-lashes'],
                    ['Repo', 'github.com/Matuchovic/viktoria-lashes'],
                    ['Domain', 'www.viktoria-lashes.cz'],
                    ['Admin emails', 'matuchovic@gmail.com, viktorialadikova23@gmail.com'],
                    ['SMTP', 'viktorialashes1@gmail.com / smtp.gmail.com:587'],
                  ].map(([k,v]) => (
                    <div key={k} style={{ display:'flex', gap:12, padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                      <span style={{ fontFamily:'monospace', fontSize:10, color:'rgba(200,185,255,0.25)', minWidth:120, flexShrink:0 }}>{k}</span>
                      <span style={{ fontFamily:'monospace', fontSize:10, color:'rgba(200,185,255,0.55)', wordBreak:'break-all' as const }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
