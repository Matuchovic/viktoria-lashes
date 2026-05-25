'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CustomCursor } from '@/components/ui/CustomCursor'

type Section = 'stats' | 'users' | 'security' | 'email' | 'system'

export default function DevPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [section, setSection] = useState<Section>('stats')
  const [stats, setStats] = useState<any>(null)
  const [online, setOnline] = useState<any>(null)
  const [security, setSecurity] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [emailTo, setEmailTo] = useState('matuchovic@gmail.com')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailText, setEmailText] = useState('')
  const [emailResult, setEmailResult] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return }
    if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    Promise.all([
      fetch('/api/dev/stats').then(r => r.json()).catch(() => ({})),
      fetch('/api/analytics/online').then(r => r.json()).catch(() => ({})),
      fetch('/api/dev/security').then(r => r.json()).catch(() => ({})),
    ]).then(([s, o, sec]) => {
      setStats(s)
      setOnline(o)
      setSecurity(sec)
      setLoading(false)
    })
  }, [status])

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#080608', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'Georgia,serif', fontSize: 11, letterSpacing: 4, color: '#FF6BA8', textTransform: 'uppercase' }}>
          Načítám DEV panel...
        </div>
      </div>
    )
  }

  const sections: { id: Section; label: string }[] = [
    { id: 'stats', label: 'Statistiky' },
    { id: 'users', label: 'Uzivatele' },
    { id: 'security', label: 'Bezpecnost' },
    { id: 'email', label: 'Email test' },
    { id: 'system', label: 'System' },
  ]

  const metricCards = [
    { label: 'Uzivatelu', value: stats?.totalUsers ?? '...', color: '#FF6BA8' },
    { label: 'Rezervaci', value: stats?.totalBookings ?? '...', color: '#D4AA70' },
    { label: 'Trzby celkem', value: stats?.totalRevenue ? `${Math.round(stats.totalRevenue / 1000)}k Kc` : '...', color: '#4ade80' },
    { label: 'Push odberu', value: stats?.pushSubs ?? '...', color: '#7F77DD' },
    { label: 'Online ted', value: online?.count ?? 0, color: '#4ade80' },
    { label: 'Recenzi ceka', value: stats?.pendingReviews ?? '...', color: '#fbbf24' },
    { label: 'Recenzi celkem', value: stats?.totalReviews ?? '...', color: '#E8A4BE' },
    { label: 'Aktivni vyjezdy', value: 0, color: '#f87171' },
  ]

  const stackItems = [
    ['Framework', 'Next.js 15.3.6 App Router'],
    ['Language', 'TypeScript + Tailwind CSS'],
    ['ORM', 'Prisma v5.22 + PostgreSQL'],
    ['Auth', 'NextAuth.js credentials'],
    ['AI', 'Groq API llama-3'],
    ['Email', 'Nodemailer via Gmail SMTP'],
    ['Push', 'web-push VAPID'],
    ['Hosting', 'Vercel Production'],
    ['Database', 'Supabase eu-west-1 Ireland'],
  ]

  const envItems = [
    ['NEXTAUTH_URL', 'https://www.viktoria-lashes.cz'],
    ['EMAIL_FROM', 'Viktoria Lashes <viktorialashes1@gmail.com>'],
    ['EMAIL_HOST', 'smtp.gmail.com:587'],
    ['DATABASE', 'nqhyrkoexrlcdeeraxst @ Supabase'],
    ['VAPID_PUBLIC', 'BOLsmR96uui... (87 chars)'],
    ['GROQ_API_KEY', 'gsk_yD3p8MX... (configured)'],
  ]

  const deployItems = [
    ['GitHub', 'Matuchovic/viktoria-lashes'],
    ['Branch', 'main (auto deploy)'],
    ['Admin emails', 'matuchovic@gmail.com, viktorialadikova23@gmail.com'],
    ['Supabase project', 'nqhyrkoexrlcdeeraxst'],
    ['DB heslo', 'kebqAh-joxvys-7gakfu'],
    ['Lokalni projekt', '~/Downloads/viktoria-lashes'],
  ]

  const apiRoutes = [
    ['POST', '/api/auth/register', 'Registrace + 250 bodu + email'],
    ['GET/POST', '/api/bookings', 'Seznam / nova rezervace + email'],
    ['PATCH', '/api/bookings/[id]', 'Zmena statusu + emaily + body'],
    ['POST/PATCH', '/api/bookings/reschedule', 'Zadost / schvaleni zmeny terminu'],
    ['GET/POST', '/api/reviews', 'Verejna recenze'],
    ['GET/PATCH/DELETE', '/api/reviews/admin', 'Admin moderace recenzi'],
    ['GET/POST/PATCH', '/api/safety/checkin', 'Bezpecnostni check-in'],
    ['GET/POST', '/api/safety/location', 'GPS tracking'],
    ['POST/DELETE', '/api/push/subscribe', 'Push subscription'],
    ['GET/POST', '/api/push/send', 'Odesilani notifikaci'],
    ['POST', '/api/loyalty/add-points', 'Rucni pridani bodu'],
    ['GET/POST', '/api/analytics/online', 'Online navstevnici'],
    ['POST', '/api/chat', 'Groq AI chatbot'],
    ['GET', '/api/dev/stats', 'DEV statistiky'],
    ['GET/POST', '/api/dev/security', 'DEV bezpecnostni log'],
    ['POST', '/api/dev/email-test', 'DEV email tester'],
    ['PATCH', '/api/dev/user-role', 'DEV zmena role'],
  ]

  const box: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: '16px 20px',
    marginBottom: 16,
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    gap: 12,
    padding: '7px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    fontFamily: 'Georgia,serif',
    fontSize: 12,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080608', color: '#f5eef2', padding: '24px 16px', maxWidth: 900, margin: '0 auto' }}>
      <CustomCursor />

      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 5, color: '#FF6BA8', textTransform: 'uppercase', marginBottom: 6 }}>Developer</div>
          <h1 style={{ fontFamily: 'Georgia,serif', fontWeight: 300, fontSize: 'clamp(24px,5vw,36px)', margin: 0 }}>DEV Panel</h1>
        </div>
        <a href="/admin" style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(245,238,242,0.4)', fontFamily: 'Georgia,serif', fontSize: 11, textDecoration: 'none' }}>
          Zpet do adminu
        </a>
      </div>

      {/* Section nav */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            style={{ padding: '7px 16px', borderRadius: 20, border: `1px solid ${section === s.id ? 'rgba(255,107,168,0.5)' : 'rgba(255,255,255,0.1)'}`, background: section === s.id ? 'rgba(255,107,168,0.1)' : 'transparent', color: section === s.id ? '#FF6BA8' : 'rgba(245,238,242,0.4)', fontFamily: 'Georgia,serif', fontSize: 12, cursor: 'pointer' }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* STATS */}
      {section === 'stats' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 16 }}>
            {metricCards.map(m => (
              <div key={m.label} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${m.color}25`, borderRadius: 14, padding: '14px 12px' }}>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 2, color: 'rgba(245,238,242,0.3)', textTransform: 'uppercase', marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>

          {stats?.dailyStats && (
            <div style={box}>
              <div style={{ fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 4, color: 'rgba(245,238,242,0.25)', textTransform: 'uppercase', marginBottom: 16 }}>Poslednich 7 dni</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 80 }}>
                {stats.dailyStats.map((d: any) => {
                  const maxB = Math.max(...stats.dailyStats.map((x: any) => x.bookings), 1)
                  return (
                    <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontFamily: 'Georgia,serif', fontSize: 10, color: '#FF6BA8' }}>{d.bookings || ''}</div>
                      <div style={{ width: '100%', background: 'rgba(255,107,168,0.3)', borderRadius: 4, height: `${Math.max((d.bookings / maxB) * 60, 4)}px` }}></div>
                      <div style={{ fontFamily: 'Georgia,serif', fontSize: 8, color: 'rgba(245,238,242,0.3)', textAlign: 'center' }}>{d.date}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {online?.users?.length > 0 && (
            <div style={{ ...box, border: '1px solid rgba(74,222,128,0.15)' }}>
              <div style={{ fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 4, color: 'rgba(74,222,128,0.5)', textTransform: 'uppercase', marginBottom: 12 }}>Online ted -- detail</div>
              {online.users.map((u: any) => (
                <div key={u.id} style={{ display: 'flex', gap: 10, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontFamily: 'monospace', fontSize: 12 }}>
                  <span style={{ minWidth: 30 }}>{u.device === 'mobile' ? '[M]' : '[D]'}</span>
                  <span style={{ color: 'rgba(74,222,128,0.7)', minWidth: 80 }}>{u.userName ?? 'anon'}</span>
                  <span style={{ color: 'rgba(245,238,242,0.5)', flex: 1 }}>{u.page}</span>
                  <span style={{ color: 'rgba(245,238,242,0.25)' }}>{Math.round((Date.now() - u.lastSeen) / 1000)}s</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* USERS */}
      {section === 'users' && (
        <div style={box}>
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 4, color: 'rgba(245,238,242,0.25)', textTransform: 'uppercase', marginBottom: 16 }}>Vsichni uzivatele ({stats?.usersList?.length ?? 0})</div>
          {stats?.usersList?.map((u: any) => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', flexWrap: 'wrap' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#C4698A,#FF6BA8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia,serif', fontSize: 13, color: 'white', flexShrink: 0 }}>
                {u.name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 13, color: 'rgba(245,238,242,0.85)' }}>{u.name}</div>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 10, color: 'rgba(245,238,242,0.35)' }}>{u.email}</div>
              </div>
              <span style={{ fontFamily: 'Georgia,serif', fontSize: 12, color: '#D4AA70' }}>{u.loyaltyPoints} bodu</span>
              <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 10, background: u.role === 'ADMIN' ? 'rgba(255,107,168,0.15)' : 'rgba(255,255,255,0.05)', color: u.role === 'ADMIN' ? '#FF6BA8' : 'rgba(245,238,242,0.4)', border: `1px solid ${u.role === 'ADMIN' ? 'rgba(255,107,168,0.3)' : 'rgba(255,255,255,0.1)'}`, fontFamily: 'Georgia,serif' }}>
                {u.role}
              </span>
              {u.role !== 'ADMIN' && (
                <button onClick={async () => {
                  if (!confirm(`Zmenit ${u.name} na ADMIN?`)) return
                  await fetch('/api/dev/user-role', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: u.id, role: 'ADMIN' }) })
                  setStats((s: any) => ({ ...s, usersList: s.usersList.map((x: any) => x.id === u.id ? { ...x, role: 'ADMIN' } : x) }))
                }} style={{ padding: '3px 8px', borderRadius: 8, background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(245,238,242,0.25)', fontFamily: 'Georgia,serif', fontSize: 10, cursor: 'pointer' }}>
                  Admin
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SECURITY */}
      {section === 'security' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Celkem udalosti', value: security?.total ?? 0, color: '#fbbf24' },
              { label: 'Poslednich 24h', value: security?.last24h ?? 0, color: '#f87171' },
              { label: 'Podezrelych IP', value: security?.suspiciousIps?.length ?? 0, color: '#f87171' },
              { label: 'Status', value: (security?.suspiciousIps?.length ?? 0) === 0 ? 'OK' : 'Pozor', color: (security?.suspiciousIps?.length ?? 0) === 0 ? '#4ade80' : '#f87171' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${s.color}20`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 2, color: 'rgba(245,238,242,0.3)', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 24, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {security?.suspiciousIps?.length > 0 && (
            <div style={{ ...box, border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.06)' }}>
              <div style={{ fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 4, color: '#f87171', textTransform: 'uppercase', marginBottom: 12 }}>Podezrele IP adresy</div>
              {security.suspiciousIps.map(([ip, count]: [string, number]) => (
                <div key={ip} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(248,113,113,0.1)', fontFamily: 'monospace', fontSize: 13 }}>
                  <span style={{ color: '#f87171' }}>{ip}</span>
                  <span style={{ color: 'rgba(245,238,242,0.4)' }}>{count} pozadavku</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ ...box, background: 'rgba(0,0,0,0.4)', maxHeight: 400, overflowY: 'auto' }}>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 4, color: 'rgba(245,238,242,0.25)', textTransform: 'uppercase', marginBottom: 12 }}>Bezpecnostni zaznamy</div>
            {!security?.recentEvents?.length ? (
              <div style={{ padding: 32, textAlign: 'center', fontFamily: 'Georgia,serif', fontSize: 13, color: 'rgba(245,238,242,0.2)' }}>Zadne bezpecnostni udalosti</div>
            ) : security.recentEvents.map((e: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontFamily: 'monospace', fontSize: 11, flexWrap: 'wrap' }}>
                <span style={{ color: 'rgba(245,238,242,0.25)', minWidth: 70 }}>{new Date(e.time).toLocaleTimeString('cs-CZ')}</span>
                <span style={{ color: '#f87171', minWidth: 100 }}>{e.type}</span>
                <span style={{ color: 'rgba(245,238,242,0.5)' }}>{e.ip}</span>
                <span style={{ color: 'rgba(245,238,242,0.3)', flex: 1 }}>{e.path}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EMAIL TEST */}
      {section === 'email' && (
        <div style={box}>
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 4, color: 'rgba(245,238,242,0.25)', textTransform: 'uppercase', marginBottom: 20 }}>Email tester</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {[
              { key: 'to', label: 'Prijemce', val: emailTo, set: setEmailTo, ph: 'matuchovic@gmail.com' },
              { key: 'subject', label: 'Predmet', val: emailSubject, set: setEmailSubject, ph: 'Test email z DEV panelu' },
              { key: 'text', label: 'Text', val: emailText, set: setEmailText, ph: 'Testovaci zprava...' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 10, letterSpacing: 2, color: 'rgba(245,238,242,0.3)', textTransform: 'uppercase', marginBottom: 6 }}>{f.label}</div>
                <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 12px', color: 'rgba(245,238,242,0.8)', fontFamily: 'Georgia,serif', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
          <button disabled={emailLoading} onClick={async () => {
            setEmailLoading(true)
            setEmailResult('')
            const res = await fetch('/api/dev/email-test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: emailTo, subject: emailSubject, text: emailText }) })
            const d = await res.json()
            setEmailResult(d.ok ? 'Email odeslan!' : `Chyba: ${d.error}`)
            setEmailLoading(false)
          }} style={{ width: '100%', padding: 14, borderRadius: 10, background: 'rgba(255,107,168,0.15)', border: '1px solid rgba(255,107,168,0.3)', color: '#FF6BA8', fontFamily: 'Georgia,serif', fontSize: 14, cursor: 'pointer' }}>
            {emailLoading ? 'Odesilam...' : 'Odeslat testovaci email'}
          </button>
          {emailResult && (
            <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 10, background: emailResult.startsWith('Email') ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', border: `1px solid ${emailResult.startsWith('Email') ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`, fontFamily: 'Georgia,serif', fontSize: 13, color: emailResult.startsWith('Email') ? '#4ade80' : '#f87171' }}>
              {emailResult}
            </div>
          )}
        </div>
      )}

      {/* SYSTEM */}
      {section === 'system' && (
        <div>
          <div style={box}>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 4, color: 'rgba(245,238,242,0.25)', textTransform: 'uppercase', marginBottom: 14 }}>Stack</div>
            {stackItems.map(([k, v]) => (
              <div key={k} style={rowStyle}>
                <span style={{ color: 'rgba(245,238,242,0.35)', minWidth: 120 }}>{k}</span>
                <span style={{ fontFamily: 'monospace', color: 'rgba(245,238,242,0.7)' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ ...box, background: 'rgba(0,0,0,0.4)' }}>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 4, color: 'rgba(245,238,242,0.25)', textTransform: 'uppercase', marginBottom: 14 }}>Env Variables</div>
            {envItems.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 10, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#4ade80', minWidth: 160, flexShrink: 0 }}>{k}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(245,238,242,0.4)' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={box}>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 4, color: 'rgba(245,238,242,0.25)', textTransform: 'uppercase', marginBottom: 14 }}>Deploy info</div>
            {deployItems.map(([k, v]) => (
              <div key={k} style={rowStyle}>
                <span style={{ color: 'rgba(245,238,242,0.35)', minWidth: 140, flexShrink: 0 }}>{k}</span>
                <span style={{ fontFamily: 'monospace', color: 'rgba(245,238,242,0.65)', wordBreak: 'break-all' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={box}>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 4, color: 'rgba(245,238,242,0.25)', textTransform: 'uppercase', marginBottom: 14 }}>API Routes</div>
            {apiRoutes.map(([method, route, desc]) => (
              <div key={route} style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,107,168,0.1)', color: '#FF6BA8', flexShrink: 0 }}>{method}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(245,238,242,0.7)', minWidth: 180, flexShrink: 0 }}>{route}</span>
                <span style={{ fontFamily: 'Georgia,serif', fontSize: 11, color: 'rgba(245,238,242,0.35)' }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
