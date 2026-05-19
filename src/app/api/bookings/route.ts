// src/app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendBookingConfirmation } from '@/lib/email'
import { formatDate, formatBookingDate } from '@/lib/utils'
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
})

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url    = new URL(req.url)
  const status = url.searchParams.get('status') ?? undefined
  const email  = url.searchParams.get('email') ?? undefined
  const date   = url.searchParams.get('date') ?? undefined

  const where: any = {}
  if (status) where.status = status
  if (email)  where.customerEmail = email
  if (date)   where.date = new Date(date)
  if ((session.user as any)?.role === 'CUSTOMER') {
    where.customerEmail = session.user?.email
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: { service: true, artist: true },
    orderBy: [{ date: 'desc' }, { time: 'asc' }],
    take: 100,
  })

  return NextResponse.json(bookings)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = CreateBookingSchema.parse(body)

    // Verify service and artist exist
    const [service, artist] = await Promise.all([
      prisma.service.findUnique({ where: { id: data.serviceId } }),
      prisma.artist.findUnique({ where: { id: data.artistId } }),
    ])

    if (!service || !artist) {
      return NextResponse.json({ error: 'Neplatná služba nebo stylistka.' }, { status: 400 })
    }

    // Check slot availability
    const bookingDate = new Date(data.date)
    const conflict = await prisma.booking.findFirst({
      where: {
        artistId: data.artistId,
        date:     bookingDate,
        time:     data.time,
        status:   { in: ['PENDING', 'CONFIRMED'] },
      },
    })

    if (conflict) {
      return NextResponse.json({ error: 'Tento termín je již obsazen. Vyberte prosím jiný.' }, { status: 409 })
    }

    const session = await getServerSession(authOptions)
    const depositKc = Math.round(service.priceKc * ((service as any).depositPct ?? 30) / 100)

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

    // Send confirmation email (non-blocking)
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

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Neplatná vstupní data.', details: err.errors }, { status: 422 })
    }
    console.error('Booking error:', err)
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 })
  }
}
