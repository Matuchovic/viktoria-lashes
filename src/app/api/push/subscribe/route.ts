import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { endpoint, keys } = await req.json()
    const session = await getServerSession(authOptions)

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { p256dh: keys.p256dh, auth: keys.auth, userId: (session?.user as any)?.id || null },
      create: { endpoint, p256dh: keys.p256dh, auth: keys.auth, userId: (session?.user as any)?.id || null },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { endpoint } = await req.json()
    await prisma.pushSubscription.deleteMany({ where: { endpoint } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
