import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const securityLog: { time: number; ip: string; path: string; type: string; ua: string }[] = []

export function logSecurityEvent(ip: string, path: string, type: string, ua: string) {
  securityLog.unshift({ time: Date.now(), ip, path, type, ua })
  if (securityLog.length > 200) securityLog.pop()
}

export async function POST(req: Request) {
  const { ip, path, type, ua } = await req.json()
  logSecurityEvent(ip || 'unknown', path || '/', type || 'UNKNOWN', ua || '')
  return NextResponse.json({ ok: true })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const last24h = securityLog.filter(e => e.time > Date.now() - 86400000)
  const ipCounts: Record<string, number> = {}
  last24h.forEach(e => { ipCounts[e.ip] = (ipCounts[e.ip] || 0) + 1 })
  const suspiciousIps = Object.entries(ipCounts).filter(([,c]) => c > 5).sort((a,b) => b[1]-a[1])
  return NextResponse.json({ total: securityLog.length, last24h: last24h.length, suspiciousIps, recentEvents: securityLog.slice(0, 50) })
}
