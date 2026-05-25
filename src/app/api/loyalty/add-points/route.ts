import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { email, points, reason } = await req.json()
  if (!email || !points) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: 'Klientka nemá registraci' }, { status: 404 })

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { loyaltyPoints: { increment: Number(points) } },
  })

  await prisma.lashPointsHistory.create({
    data: {
      userId: user.id,
      points: Number(points),
      reason: reason || 'Body přidány Viktórií 💕',
    },
  }).catch(console.error)

  return NextResponse.json({ ok: true, newTotal: updated.loyaltyPoints })
}
