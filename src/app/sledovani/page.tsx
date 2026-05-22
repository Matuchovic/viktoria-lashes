'use client'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function TrackingContent() {
  const params = useSearchParams()
  const token = params.get('token')
  const id = params.get('id')
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchLocation = useCallback(async () => {
    if (!token || !id) return
    try {
      const res = await fetch(`/api/safety/location?token=${token}&id=${id}`)
      if (!res.ok) { setError('Neplatný odkaz.'); return }
      const d = await res.json()
      setData(d)
      setLastUpdate(new Date())
    } catch { setError('Chyba připojení.') }
  }, [token, id])

  useEffect(() => {
    fetchLocation()
    const interval = setInterval(fetchLocation, 15000) // every 15s
    return () => clearInterval(interval)
  }, [fetchLocation])

  const minsAgo = lastUpdate ? Math.round((Date.now() - lastUpdate.getTime()) / 60000) : null

  return (
    <main style={{ minHeight:'100vh', background:'#080608', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, fontFamily:'Georgia,serif' }}>
      
      {/* Logo */}
      <div style={{ fontFamily:'Georgia,serif', fontSize:13, letterSpacing:4, textTransform:'uppercase', marginBottom:32, color:'rgba(245,238,242,0.5)' }}>
        Viktória <span style={{ color:'#FF6BA8' }}>Lashes</span>
        <div style={{ fontSize:9, letterSpacing:3, color:'rgba(245,238,242,0.25)', marginTop:4, textAlign:'center' }}>🛡️ Bezpečnostní sledování</div>
      </div>

      {error && (
        <div style={{ color:'#f87171', fontSize:14, textAlign:'center' }}>{error}</div>
      )}

      {!data && !error && (
        <div style={{ color:'rgba(245,238,242,0.4)', fontSize:13 }}>Načítám polohu...</div>
      )}

      {data && (
        <div style={{ width:'100%', maxWidth:420, display:'flex', flexDirection:'column', gap:16 }}>

          {/* Status */}
          <div style={{ padding:'20px 24px', borderRadius:16, position:'relative', overflow:'hidden',
            background: data.returnedAt ? 'rgba(74,222,128,0.1)' : 'rgba(255,107,168,0.08)',
            border: `1px solid ${data.returnedAt ? 'rgba(74,222,128,0.4)' : 'rgba(255,107,168,0.3)'}` }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background: data.returnedAt ? 'linear-gradient(90deg,transparent,#4ade80,transparent)' : 'linear-gradient(90deg,transparent,#FF6BA8,transparent)' }}/>
            <div style={{ fontSize:9, letterSpacing:3, textTransform:'uppercase', color: data.returnedAt ? '#4ade80' : '#FF6BA8', marginBottom:6 }}>
              {data.returnedAt ? '✓ Bezpečně zpět' : '● Na cestě'}
            </div>
            <div style={{ fontSize:18, fontWeight:300, color:'rgba(245,238,242,0.9)', marginBottom:4 }}>
              {data.returnedAt ? 'Viktória se vrátila' : 'Viktória je u klientky'}
            </div>
            {data.returnedAt && (
              <div style={{ fontSize:12, color:'rgba(245,238,242,0.45)' }}>
                Vrátila se v {new Date(data.returnedAt).toLocaleTimeString('cs-CZ', {hour:'2-digit', minute:'2-digit'})}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ padding:'20px 24px', borderRadius:16, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[
                ['Klientka', data.clientName],
                ['Adresa', data.address],
                ['Odjezd', new Date(data.expectedBack ? Date.now() : Date.now()).toLocaleTimeString('cs-CZ', {hour:'2-digit', minute:'2-digit'})],
                ['Návrat do', new Date(data.expectedBack).toLocaleTimeString('cs-CZ', {hour:'2-digit', minute:'2-digit'})],
              ].map(([l, v]) => (
                <div key={l as string}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'rgba(245,238,242,0.25)', marginBottom:4 }}>{l}</div>
                  <div style={{ fontSize:13, color:'rgba(245,238,242,0.75)' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Live location */}
          {data.lat && data.lng && !data.returnedAt && (
            <a
              href={`https://www.google.com/maps?q=${data.lat},${data.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display:'block', padding:'16px 24px', borderRadius:16, background:'rgba(255,107,168,0.1)', border:'1px solid rgba(255,107,168,0.35)', textDecoration:'none', textAlign:'center', color:'#FF6BA8', fontSize:13, letterSpacing:1 }}>
              📍 Zobrazit polohu v Google Maps →
            </a>
          )}

          {!data.lat && !data.returnedAt && (
            <div style={{ padding:'16px 24px', borderRadius:16, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', textAlign:'center', fontSize:12, color:'rgba(245,238,242,0.35)' }}>
              GPS poloha se načítá... Aktualizuje se každých 15 sekund.
            </div>
          )}

          {/* Last update */}
          <div style={{ textAlign:'center', fontSize:10, letterSpacing:2, color:'rgba(245,238,242,0.2)', textTransform:'uppercase' }}>
            Poslední aktualizace: {lastUpdate ? lastUpdate.toLocaleTimeString('cs-CZ') : '—'}
            {' · '}Auto-refresh každých 15s
          </div>

          {/* Time warning */}
          {!data.returnedAt && new Date(data.expectedBack) < new Date() && (
            <div style={{ padding:'16px 24px', borderRadius:16, background:'rgba(248,113,113,0.15)', border:'1px solid rgba(248,113,113,0.5)', textAlign:'center' }}>
              <div style={{ fontSize:16, marginBottom:6 }}>⚠️</div>
              <div style={{ fontSize:13, color:'#f87171', marginBottom:4 }}>Viktória měla být zpět!</div>
              <div style={{ fontSize:11, color:'rgba(248,113,113,0.7)' }}>Očekávaný čas návratu: {new Date(data.expectedBack).toLocaleTimeString('cs-CZ', {hour:'2-digit', minute:'2-digit'})}</div>
              <a href="tel:+420720307007" style={{ display:'block', marginTop:12, padding:'10px', borderRadius:10, background:'#f87171', color:'white', textDecoration:'none', fontSize:13, fontWeight:600 }}>
                📞 Zavolat Viktorii
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  )
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight:'100vh', background:'#080608', display:'flex', alignItems:'center', justifyContent:'center', color:'#FF6BA8', fontFamily:'Georgia,serif' }}>Načítám...</div>}>
      <TrackingContent />
    </Suspense>
  )
}
