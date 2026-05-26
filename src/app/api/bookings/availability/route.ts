import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/bookings/availability?date=YYYY-MM-DD&artistId=...&serviceDuration=60
 * Returns blocked HH:mm slots (30min grid) where a new booking would overlap.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  const artistId = searchParams.get('artistId')
  const serviceDurationParam = searchParams.get('serviceDuration')

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Neplatné datum.' }, { status: 400 })
  }

  const serviceDuration = Number(serviceDurationParam) || 60

  try {
    const where: any = {
      date: new Date(date),
      status: { in: ['PENDING', 'CONFIRMED'] },
    }
    // single artist - ignore artistId

    const bookings = await prisma.booking.findMany({
      where,
      include: { service: { select: { durationMin: true } } },
    })

    const toMin = (hhmm: string) => {
      const [h, m] = hhmm.split(':').map(Number)
      return h * 60 + m
    }
    const pad = (n: number) => String(n).padStart(2, '0')
    const fromMin = (mins: number) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`

    const SLOT_STEP = 30
    const DAY_START = 8 * 60
    const DAY_END = 20 * 60

    const blocked = new Set<string>()

    for (let start = DAY_START; start < DAY_END; start += SLOT_STEP) {
      const end = start + serviceDuration
      const slot = fromMin(start)

      const now = new Date()
      const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
      if (date === todayStr) {
        const nowMin = now.getHours() * 60 + now.getMinutes()
        if (start <= nowMin) {
          blocked.add(slot)
          continue
        }
      }

      if (end > DAY_END) {
        blocked.add(slot)
        continue
      }

      for (const b of bookings) {
        const bStart = toMin(b.time)
        const bDur = b.service?.durationMin ?? 60
        const bEnd = bStart + bDur
        if (start < bEnd && end > bStart) {
          blocked.add(slot)
          break
        }
      }
    }

    return NextResponse.json({
      date,
      artistId: artistId ?? null,
      serviceDuration,
      blocked: Array.from(blocked).sort(),
    })
  } catch (e) {
    console.error('Availability error:', e)
    return NextResponse.json({
      date,
      artistId: artistId ?? null,
      serviceDuration,
      blocked: [],
    })
  }
}
