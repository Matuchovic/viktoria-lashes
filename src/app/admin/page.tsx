'use client'
// src/app/admin/page.tsx
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { formatPrice } from '@/lib/utils'

type Stats = {
  totalBookings: number
  confirmedBookings: number
  cancelledBookings: number
  revenueThisMonth: number
  revenueLastMonth: number
  totalCustomers: number
  newCustomers: number
  occupancyRate: number
  upcomingBookings: any[]
}

const STATUS_COLORS: Record<string, string> = {
  PENDING:   'text-gold border-gold/30 bg-gold/5',
  CONFIRMED: 'text-green-400 border-green-500/30 bg-green-500/5',
  CANCELLED: 'text-red-400 border-red-500/30 bg-red-500/5',
  COMPLETED: 'text-pink-soft border-pink-deep/30 bg-pink-muted',
  NO_SHOW:   'text-text-dim border-glass-border bg-glass',
}
const STATUS_LABELS: Record<string, string> = {
  PENDING:   'Čeká',
  CONFIRMED: 'Potvrzeno',
  CANCELLED: 'Zrušeno',
  COMPLETED: 'Dokončeno',
  NO_SHOW:   'Nedostavil',
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`glass-card p-6 relative overflow-hidden ${accent ? 'border-pink-deep/40' : ''}`}>
      {accent && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-neon to-transparent" />}
      <div className="text-text-dim font-light tracking-[2px] uppercase mb-3" style={{ fontSize: 10 }}>{label}</div>
      <div className={`font-serif text-4xl font-light leading-none mb-2 ${accent ? 'text-pink-neon' : 'text-text-primary'}`}>
        {value}
      </div>
      {sub && <div className="text-text-dim font-light text-xs">{sub}</div>}
    </div>
  )
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'customers'>('overview')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && (session.user as any)?.role !== 'ADMIN') router.push('/')
  }, [status, session, router])

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-text-dim font-light tracking-[4px] uppercase text-sm">Načítám dashboard...</div>
      </div>
    )
  }

  const revDiff = stats.revenueThisMonth - stats.revenueLastMonth
  const revPct  = stats.revenueLastMonth > 0 ? Math.round((revDiff / stats.revenueLastMonth) * 100) : 0

  return (
    <div className="min-h-screen bg-black">
      {/* Admin Nav */}
      <nav className="border-b border-glass-border px-8 md:px-16 py-5 flex items-center justify-between">
        <div className="font-serif text-xl font-light tracking-[4px] uppercase">
          Viktoria <span className="text-pink-neon">Admin</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="/" className="nav-link text-[10px]">← Web</a>
          <div className="text-text-dim font-light text-xs">{session?.user?.email}</div>
        </div>
      </nav>

      <div className="px-8 md:px-16 py-12">
        {/* Header */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-12">
          <div className="section-label mb-3">Přehled studia</div>
          <h1 className="font-serif text-5xl font-light">Dashboard</h1>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-glass-border mb-10">
          {[
            { id:'overview',  label:'Přehled' },
            { id:'bookings',  label:'Rezervace' },
            { id:'customers', label:'Klientky' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-6 py-3 font-sans font-light tracking-[2px] uppercase cursor-none transition-all duration-300 border-b-2 -mb-px ${
                activeTab === t.id
                  ? 'border-pink-neon text-text-primary'
                  : 'border-transparent text-text-dim hover:text-text-muted'
              }`}
              style={{ fontSize: 11 }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <StatCard
                label="Tržby tento měsíc"
                value={formatPrice(stats.revenueThisMonth)}
                sub={`${revPct >= 0 ? '+' : ''}${revPct}% vs. minulý měsíc`}
                accent
              />
              <StatCard label="Celkem rezervací"  value={stats.totalBookings.toString()} sub={`${stats.confirmedBookings} potvrzených`} />
              <StatCard label="Celkem klientek"   value={stats.totalCustomers.toString()} sub={`+${stats.newCustomers} tento měsíc`} />
              <StatCard label="Obsazenost"         value={`${stats.occupancyRate}%`} sub="potvrzených slotů" />
            </div>

            {/* Upcoming bookings */}
            <div className="glass-card overflow-hidden">
              <div className="px-8 py-5 border-b border-glass-border flex items-center justify-between">
                <h2 className="font-serif text-xl font-light">Nadcházející rezervace</h2>
                <span className="text-text-dim font-light text-xs">{stats.upcomingBookings.length} termínů</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-glass-border">
                      {['Klientka','Služba','Stylistka','Datum','Čas','Stav','Cena'].map(h => (
                        <th key={h} className="px-6 py-4 text-left font-light tracking-[2px] uppercase text-text-dim" style={{ fontSize: 10 }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.upcomingBookings.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-text-dim font-light text-sm">
                          Žádné nadcházející rezervace
                        </td>
                      </tr>
                    )}
                    {stats.upcomingBookings.map((b: any) => (
                      <tr key={b.id} className="border-b border-glass-border/50 hover:bg-white/[0.01] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-light text-sm">{b.customerName}</div>
                          <div className="text-text-dim font-light text-xs">{b.customerEmail}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-muted font-light">{b.service?.nameCs}</td>
                        <td className="px-6 py-4 text-sm text-text-muted font-light">{b.artist?.name}</td>
                        <td className="px-6 py-4 text-sm font-light">
                          {new Date(b.date).toLocaleDateString('cs-CZ', { day:'numeric', month:'short' })}
                        </td>
                        <td className="px-6 py-4 text-sm font-light">{b.time}</td>
                        <td className="px-6 py-4">
                          <span className={`status-badge border ${STATUS_COLORS[b.status] ?? ''}`}>
                            {STATUS_LABELS[b.status] ?? b.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-serif text-pink-neon text-lg font-light">
                          {formatPrice(b.totalKc)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="glass-card p-6 flex items-center justify-between">
                <div>
                  <div className="text-text-dim font-light tracking-[2px] uppercase mb-2" style={{ fontSize: 10 }}>Potvrzeno</div>
                  <div className="font-serif text-3xl font-light text-green-400">{stats.confirmedBookings}</div>
                </div>
                <div className="text-3xl opacity-30">✓</div>
              </div>
              <div className="glass-card p-6 flex items-center justify-between">
                <div>
                  <div className="text-text-dim font-light tracking-[2px] uppercase mb-2" style={{ fontSize: 10 }}>Zrušeno</div>
                  <div className="font-serif text-3xl font-light text-red-400">{stats.cancelledBookings}</div>
                </div>
                <div className="text-3xl opacity-30">✕</div>
              </div>
              <div className="glass-card p-6 flex items-center justify-between">
                <div>
                  <div className="text-text-dim font-light tracking-[2px] uppercase mb-2" style={{ fontSize: 10 }}>Minulý měsíc</div>
                  <div className="font-serif text-3xl font-light text-gold">{formatPrice(stats.revenueLastMonth)}</div>
                </div>
                <div className="text-3xl opacity-30">◈</div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'bookings' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="glass-card p-12 text-center">
            <div className="font-serif text-2xl font-light mb-3 text-text-muted">Správa rezervací</div>
            <p className="text-text-dim font-light text-sm">Plná tabulka rezervací s filtrováním a editací — implementace v produkční verzi s Supabase realtime.</p>
          </motion.div>
        )}

        {activeTab === 'customers' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="glass-card p-12 text-center">
            <div className="font-serif text-2xl font-light mb-3 text-text-muted">Databáze klientek</div>
            <p className="text-text-dim font-light text-sm">CRM systém s historií návštěv a věrnostními body — implementace v produkční verzi.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
