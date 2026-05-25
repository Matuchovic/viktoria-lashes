import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, body, url } = await req.json()
  if (!title || !body) return NextResponse.json({ error: 'Missing title or body' }, { status: 400 })

  const subs = await prisma.pushSubscription.findMany()
  if (subs.length === 0) return NextResponse.json({ sent: 0, message: 'Žádní odběratelé' })

  // Use fetch-based web-push (no external lib needed)
  const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
  const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY!
  const VAPID_EMAIL = 'mailto:viktorialadikova23@gmail.com'

  let sent = 0
  let failed = 0
  const toDelete: string[] = []

  for (const sub of subs) {
    try {
      const webpush = await import('web-push')
      webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE)

      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ title, body, url: url || '/', icon: '/apple-touch-icon.png', badge: '/favicon-32.png' })
      )
      sent++
    } catch (e: any) {
      if (e.statusCode === 410 || e.statusCode === 404) {
        toDelete.push(sub.endpoint) // expired subscription
      }
      failed++
    }
  }

  // Clean up expired subscriptions
  if (toDelete.length > 0) {
    await prisma.pushSubscription.deleteMany({ where: { endpoint: { in: toDelete } } })
  }

  return NextResponse.json({ sent, failed, total: subs.length })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const count = await prisma.pushSubscription.count()
  return NextResponse.json({ count })
}
