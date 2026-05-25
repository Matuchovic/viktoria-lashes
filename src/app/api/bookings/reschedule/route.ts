import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Customer requests reschedule
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { bookingId, newDate, newTime, note } = await req.json()
  if (!bookingId || !newDate || !newTime) {
    return NextResponse.json({ error: 'Chybí parametry' }, { status: 400 })
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true },
  })

  if (!booking) return NextResponse.json({ error: 'Rezervace nenalezena' }, { status: 404 })
  if (booking.customerEmail !== session.user?.email && (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: 'CHANGE_REQUESTED',
      rescheduleDate: new Date(newDate),
      rescheduleTime: newTime,
      rescheduleNote: note || null,
    },
    include: { service: true },
  })

  // Notify admin
  try {
    const { sendRescheduleRequestEmail } = await import('@/lib/email')
    await sendRescheduleRequestEmail({
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      bookingRef: booking.bookingRef,
      serviceName: booking.service?.nameCs ?? 'Služba',
      oldDate: booking.date.toLocaleDateString('cs-CZ', { day:'numeric', month:'long', year:'numeric' }),
      oldTime: booking.time,
      newDate: new Date(newDate).toLocaleDateString('cs-CZ', { day:'numeric', month:'long', year:'numeric' }),
      newTime,
      note: note || '',
    })
  } catch(e) { console.error('Reschedule email error:', e) }

  return NextResponse.json(updated)
}

// Admin confirms or rejects reschedule
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { bookingId, action } = await req.json() // action: 'approve' | 'reject'

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true },
  })
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let updated
  if (action === 'approve') {
    updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        date: booking.rescheduleDate!,
        time: booking.rescheduleTime!,
        status: 'CONFIRMED',
        rescheduleDate: null,
        rescheduleTime: null,
        rescheduleNote: null,
      },
    })
  } else {
    updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        rescheduleDate: null,
        rescheduleTime: null,
        rescheduleNote: null,
      },
    })
  }

  // Notify customer
  try {
    const { sendRescheduleResponseEmail } = await import('@/lib/email')
    await sendRescheduleResponseEmail({
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      bookingRef: booking.bookingRef,
      serviceName: booking.service?.nameCs ?? 'Služba',
      approved: action === 'approve',
      newDate: action === 'approve' ? booking.rescheduleDate!.toLocaleDateString('cs-CZ', { day:'numeric', month:'long', year:'numeric' }) : '',
      newTime: action === 'approve' ? booking.rescheduleTime! : '',
      oldDate: booking.date.toLocaleDateString('cs-CZ', { day:'numeric', month:'long', year:'numeric' }),
      oldTime: booking.time,
    })
  } catch(e) { console.error('Response email error:', e) }

  return NextResponse.json(updated)
}
