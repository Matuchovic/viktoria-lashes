'use client'
// src/app/dashboard/page.tsx
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { Navbar } from '@/components/layout/Navbar'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

const STATUS_STYLE: Record<string, string> = {
  PENDING:   'text-gold border-gold/30',
  CONFIRMED: 'text-green-400 border-green-500/30',
  CANCELLED: 'text-red-400 border-red-500/30',
  COMPLETED: 'text-pink-soft border-pink-deep/30',
  NO_SHOW:   'text-text-dim border-glass-border',
}
const STATUS_LABELS: Record<string, string> = {
  PENDING:   'Čeká na potvrzení',
  CONFIRMED: 'Potvrzeno',
  CANCELLED: 'Zrušeno',
  COMPLETED: 'Dokončeno',
  NO_SHOW:   'Nedostavil/a se',
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch(`/api/bookings?email=${session?.user?.email}`)
      .then(r => r.json())
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [status, session])

  const upcoming  = bookings.filter(b => new Date(b.date) >= new Date() && b.status !== 'CANCELLED')
  const past      = bookings.filter(b => new Date(b.date) < new Date() || b.status === 'COMPLETED')

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-text-dim font-light tracking-[4px] uppercase text-sm">Načítám...</div>
      </div>
    )
  }

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen bg-black pt-28 pb-20 px-8 md:px-16 page-enter">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-12">
            <div>
              <div className="section-label mb-3">Zákaznický portál</div>
              <h1 className="font-serif text-5xl font-light">
                Dobrý den, <em className="text-pink-soft not-italic">{session?.user?.name?.split(' ')[0]}</em>
              </h1>
            </div>
            <button onClick={() => signOut({ callbackUrl:'/' })} className="btn-ghost py-2 px-5 text-[10px] mt-4">
              Odhlásit
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Nadcházející', value: upcoming.length, color: 'text-text-primary' },
              { label: 'Dokončeno',    value: past.filter(b => b.status === 'COMPLETED').length, color: 'text-pink-soft' },
              { label: 'Věrn. body',  value: '—', color: 'text-gold' },
            ].map(s => (
              <div key={s.label} className="glass-card p-6 text-center">
                <div className={`font-serif text-4xl font-light mb-2 ${s.color}`}>{s.value}</div>
                <div className="text-text-dim font-light tracking-[2px] uppercase" style={{ fontSize:10 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quick action */}
          <div className="mb-10">
            <Link href="/rezervace" className="btn-primary inline-flex">
              + Nová rezervace →
            </Link>
          </div>

          {/* Upcoming bookings */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl font-light mb-6">
              Nadcházející návštěvy
            </h2>
            {upcoming.length === 0 ? (
              <div className="glass-card p-10 text-center">
                <div className="text-text-dim font-light mb-4 text-sm">Žádné nadcházející rezervace</div>
                <Link href="/rezervace" className="btn-primary text-xs py-3 px-8">
                  Zarezervovat termín
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map(b => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity:0, y:10 }}
                    animate={{ opacity:1, y:0 }}
                    className="glass-card p-6 flex items-center justify-between gap-6 flex-wrap"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-pink-muted border border-pink-deep/30 flex items-center justify-center font-serif text-xl text-pink-soft">
                        {new Date(b.date).getDate()}
                      </div>
                      <div>
                        <div className="font-serif text-lg font-light">{b.service?.nameCs}</div>
                        <div className="text-text-dim font-light text-xs mt-0.5">
                          {new Date(b.date).toLocaleDateString('cs-CZ', { weekday:'long', day:'numeric', month:'long' })} v {b.time}
                        </div>
                        <div className="text-text-dim font-light text-xs">{b.artist?.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`status-badge border text-[10px] ${STATUS_STYLE[b.status] ?? ''}`}>
                        {STATUS_LABELS[b.status] ?? b.status}
                      </span>
                      <div className="font-serif text-xl text-pink-neon">{formatPrice(b.totalKc)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* History */}
          {past.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl font-light mb-6">Historie návštěv</h2>
              <div className="space-y-2">
                {past.slice(0,10).map(b => (
                  <div key={b.id} className="glass-card p-5 flex items-center justify-between gap-4 opacity-70 hover:opacity-100 transition-opacity">
                    <div>
                      <div className="font-light text-sm">{b.service?.nameCs}</div>
                      <div className="text-text-dim font-light text-xs">
                        {new Date(b.date).toLocaleDateString('cs-CZ', { day:'numeric', month:'long', year:'numeric' })} · {b.artist?.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`status-badge border text-[10px] ${STATUS_STYLE[b.status] ?? ''}`}>
                        {STATUS_LABELS[b.status] ?? b.status}
                      </span>
                      <div className="font-serif text-lg text-text-muted">{formatPrice(b.totalKc)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </>
  )
}
