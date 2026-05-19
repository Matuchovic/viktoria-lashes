import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendBookingConfirmation } from '@/lib/email'
import { formatDate } from '@/lib/utils'
import { z } from 'zod'

const CreateBookingSchema = z.object({
  serviceId:     z.string().min(1),
  artistId:      z.string().min(1),
  date:          z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time:          z.string().regex(/^\d{2}:\d{2}$/),
  customerName:  z.string().min(2).max(100),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(9).max(20),
  notes:         z.string().optional(),
  // Allow inline service/artist data for static IDs
  serviceName:   z.string().optional(),
  servicePrice:  z.number().optional(),
  serviceDuration: z.number().optional(),
  artistName:    z.string().optional(),
})

// Map static IDs to service data
const STATIC_SERVICES: Record<string, { nameCs: string; priceKc: number; durationMin: number; category: string }> = {
  's1': { nameCs:'Klasické řasy (50D–60D)', priceKc:499,  durationMin:45,  category:'CLASSIC' },
  's2': { nameCs:'Objemové řasy (80D)',      priceKc:599,  durationMin:60,  category:'VOLUME' },
  's3': { nameCs:'Mega Volume (100D)',       priceKc:799,  durationMin:60,  category:'MEGA_VOLUME' },
  's4': { nameCs:'Wet Look (60D)',           priceKc:999,  durationMin:60,  category:'WET_LOOK' },
  's5': { nameCs:'Doplnění řas',            priceKc:199,  durationMin:20,  category:'INFILL' },
  's6': { nameCs:'Odstranění řas',          priceKc:99,   durationMin:25,  category:'REMOVAL' },
}

const STATIC_ARTISTS: Record<string, { name: string }> = {
  'a1': { name:'Viktória Ladiková' },
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url   = new URL(req.url)
  const email = url.searchParams.get('email') ?? undefined
  const status = url.searchParams.get('status') ?? undefined

  const where: any = {}
  if (status) where.status = status
  if (email)  where.customerEmail = email
  if ((session.user as any)?.role === 'CUSTOMER') {
    where.customerEmail = session.user?.email
  }

  try {
    const bookings = await prisma.booking.findMany({
      where,
      include: { service: true, artist: true },
      orderBy: [{ date: 'desc' }, { time: 'asc' }],
      take: 100,
    })
    return NextResponse.json(bookings)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = CreateBookingSchema.parse(body)

    const session = await getServerSession(authOptions)

    // Resolve service — try DB first, fall back to static map
    let service: any = null
    let artist: any = null

    try {
      service = await prisma.service.findUnique({ where: { id: data.serviceId } })
    } catch {}

    if (!service && STATIC_SERVICES[data.serviceId]) {
      // Create or find service in DB by name
      const sData = STATIC_SERVICES[data.serviceId]
      try {
        service = await prisma.service.findFirst({ where: { nameCs: sData.nameCs } })
        if (!service) {
          service = await prisma.service.create({
            data: {
              name: sData.nameCs, nameCs: sData.nameCs,
              description: '', descriptionCs: '',
              category: sData.category as any,
              priceKc: sData.priceKc, durationMin: sData.durationMin,
              depositPct: sData.priceKc > 0 ? 30 : 0,
              sortOrder: 99,
            }
          })
        }
      } catch {
        // If DB fails, create mock service object
        service = { id: data.serviceId, ...sData, depositPct: 30 }
      }
    }

    if (!service) {
      return NextResponse.json({ error: 'Neplatná služba.' }, { status: 400 })
    }

    // Resolve artist
    try {
      artist = await prisma.artist.findUnique({ where: { id: data.artistId } })
    } catch {}

    if (!artist && STATIC_ARTISTS[data.artistId]) {
      try {
        artist = await prisma.artist.findFirst({ where: { name: STATIC_ARTISTS[data.artistId].name } })
        if (!artist) {
          artist = await prisma.artist.create({
            data: {
              name: STATIC_ARTISTS[data.artistId].name,
              titleCs: 'Zakladatelka',
              bioCs: 'Zakladatelka Viktória Lashes',
              yearsExp: 4, clientCount: 500, certCount: 6,
              specialties: [],
            }
          })
        }
      } catch {
        artist = { id: data.artistId, name: STATIC_ARTISTS[data.artistId].name }
      }
    }

    if (!artist) {
      return NextResponse.json({ error: 'Neplatná stylistka.' }, { status: 400 })
    }

    const bookingDate = new Date(data.date)
    const depositKc = Math.round((service.priceKc ?? service.priceKc) * ((service.depositPct ?? 30) / 100))

    const booking = await prisma.booking.create({
      data: {
        serviceId:     service.id,
        artistId:      artist.id,
        userId:        (session?.user as any)?.id ?? undefined,
        customerName:  data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        date:          bookingDate,
        time:          data.time,
        notes:         data.notes ?? null,
        totalKc:       service.priceKc,
        depositKc,
        status:        'PENDING',
      },
      include: { service: true, artist: true },
    })

    sendBookingConfirmation({
      customerName:  data.customerName,
      customerEmail: data.customerEmail,
      service:       service.nameCs,
      artist:        artist.name,
      date:          formatDate(bookingDate),
      time:          data.time,
      totalKc:       service.priceKc,
      depositKc,
      bookingRef:    booking.bookingRef,
    }).catch(console.error)

    return NextResponse.json({ bookingRef: booking.bookingRef, id: booking.id }, { status: 201 })

  } catch (err: any) {
    console.error('Booking error:', err)
    return NextResponse.json({ error: err?.message ?? 'Interní chyba.' }, { status: 500 })
  }
}
