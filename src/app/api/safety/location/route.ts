import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { checkinId, lat, lng, accuracy } = await req.json()
    await prisma.safetyCheckin.update({
      where: { id: checkinId },
      data: {
        lastLat: lat,
        lastLng: lng,
        lastLocationAt: new Date(),
      },
    })
    return NextResponse.json({ ok: true })
  } catch(e) {
    console.error('Location update error:', e)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  const checkinId = searchParams.get('id')

  if (!token || !checkinId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  try {
    // Find by id — token can be shareToken OR checkinId itself (fallback)
    const checkin = await prisma.safetyCheckin.findFirst({
      where: {
        id: checkinId,
        OR: [
          { shareToken: token },
          { id: token }, // fallback: token = id
        ],
      },
    })

    if (!checkin) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({
      lat: checkin.lastLat,
      lng: checkin.lastLng,
      lastLocationAt: checkin.lastLocationAt,
      clientName: checkin.clientName,
      address: checkin.address,
      expectedBack: checkin.expectedBack,
      departedAt: checkin.departedAt,
      returnedAt: checkin.returnedAt,
    })
  } catch(e) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
