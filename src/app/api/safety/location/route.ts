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
    const { checkinId, lat, lng } = await req.json()
    // Store coords in notes as JSON until DB migration adds lastLat/lastLng columns
    await prisma.safetyCheckin.update({
      where: { id: checkinId },
      data: {
        notes: JSON.stringify({ lat, lng, updatedAt: new Date().toISOString() }),
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
    const checkin = await prisma.safetyCheckin.findFirst({
      where: { id: checkinId },
    })

    if (!checkin) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Parse coords from notes
    let lat = null, lng = null, lastLocationAt = null
    try {
      if (checkin.notes && checkin.notes.startsWith('{')) {
        const geo = JSON.parse(checkin.notes)
        lat = geo.lat; lng = geo.lng; lastLocationAt = geo.updatedAt
      }
    } catch {}

    return NextResponse.json({
      lat, lng, lastLocationAt,
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
