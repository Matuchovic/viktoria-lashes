import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const onlineUsers = new Map<string, { page: string; lastSeen: number; device: string; userName?: string; userId?: string }>()

function cleanup() {
  const now = Date.now()
  for (const [id, data] of onlineUsers.entries()) {
    if (now - data.lastSeen > 35000) onlineUsers.delete(id)
  }
}

export async function POST(req: Request) {
  try {
    const { visitorId, page } = await req.json()
    const session = await getServerSession(authOptions)
    const ua = req.headers.get('user-agent') || ''
    const isMobile = /mobile|android|iphone|ipad/i.test(ua)
    onlineUsers.set(visitorId, {
      page: page || '/',
      lastSeen: Date.now(),
      device: isMobile ? 'mobile' : 'desktop',
      userId: (session?.user as any)?.id,
      userName: session?.user?.name || undefined,
    })
    cleanup()
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  cleanup()
  const users = Array.from(onlineUsers.entries()).map(([id, data]) => ({
    id, page: data.page, device: data.device, lastSeen: data.lastSeen,
    userName: data.userName || null, isLoggedIn: !!data.userId,
  }))
  const pageStats: Record<string, number> = {}
  users.forEach(u => { pageStats[u.page] = (pageStats[u.page] || 0) + 1 })
  return NextResponse.json({ count: users.length, users, pageStats })
}
