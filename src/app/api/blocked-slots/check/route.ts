import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { date, time } = await req.json()
    const checkDate = new Date(date)
    const dayOfWeek = checkDate.getDay() === 0 ? 7 : checkDate.getDay()

    const blocks = await prisma.blockedSlot.findMany({ where: { isActive: true } })

    for (const b of blocks) {
      if (b.isGlobal) {
        return NextResponse.json({ blocked: true, mode: b.mode, message: b.clientMessage || 'Rezervace jsou momentalne pozastaveny.' })
      }
      if (b.type === 'DATE_RANGE' && b.dateFrom && b.dateTo) {
        const from = new Date(b.dateFrom)
        const to = new Date(b.dateTo)
        if (checkDate >= from && checkDate <= to) {
          if (b.startTime && b.endTime && time) {
            if (time >= b.startTime && time <= b.endTime) {
              return NextResponse.json({ blocked: true, mode: b.mode, message: b.clientMessage || 'Tento termin neni dostupny.' })
            }
          } else {
            return NextResponse.json({ blocked: true, mode: b.mode, message: b.clientMessage || 'Studio je v tomto obdobi zavreno.' })
          }
        }
      }
      if (b.type === 'DATE' && b.dateFrom) {
        const blockDate = new Date(b.dateFrom)
        if (checkDate.toDateString() === blockDate.toDateString()) {
          if (b.startTime && b.endTime && time) {
            if (time >= b.startTime && time <= b.endTime) {
              return NextResponse.json({ blocked: true, mode: b.mode, message: b.clientMessage || 'Tento termin neni dostupny.' })
            }
          } else {
            return NextResponse.json({ blocked: true, mode: b.mode, message: b.clientMessage || 'Tento den je studio zavreno.' })
          }
        }
      }
      if (b.type === 'RECURRING' && b.dayOfWeek === dayOfWeek) {
        if (b.startTime && b.endTime && time) {
          if (time >= b.startTime && time <= b.endTime) {
            return NextResponse.json({ blocked: true, mode: b.mode, message: b.clientMessage || 'Tento cas neni dostupny.' })
          }
        } else {
          return NextResponse.json({ blocked: true, mode: b.mode, message: b.clientMessage || 'Tento den studio nepracuje.' })
        }
      }
      if (b.type === 'TIME_BLOCK' && b.startTime && b.endTime && time) {
        if (time >= b.startTime && time <= b.endTime) {
          return NextResponse.json({ blocked: true, mode: b.mode, message: b.clientMessage || 'Tento cas neni dostupny.' })
        }
      }
    }
    return NextResponse.json({ blocked: false })
  } catch (e) {
    return NextResponse.json({ blocked: false })
  }
}
