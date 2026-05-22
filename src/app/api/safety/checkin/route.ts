import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const checkins = await prisma.safetyCheckin.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  return NextResponse.json(checkins)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { address, clientName, clientPhone, expectedMinutes, notes } = await req.json()
  const expectedBack = new Date(Date.now() + Number(expectedMinutes) * 60 * 1000)
  const checkin = await prisma.safetyCheckin.create({
    data: { address, clientName, clientPhone, expectedBack, notes: notes || null },
  })
  return NextResponse.json(checkin)
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await req.json()
  const checkin = await prisma.safetyCheckin.update({
    where: { id },
    data: { returnedAt: new Date() },
  })
  return NextResponse.json(checkin)
}
