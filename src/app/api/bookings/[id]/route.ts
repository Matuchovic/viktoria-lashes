import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await context.params
    const { status } = await req.json()
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { service: true },
    })

    // Send status change emails
    if (status === 'CONFIRMED' || status === 'CANCELLED') {
      try {
        const { sendBookingConfirmedEmail, sendBookingCancelledEmail } = await import('@/lib/email')
        const dateStr = booking.date.toLocaleDateString('cs-CZ', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
        const emailParams = {
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          bookingRef: booking.bookingRef,
          serviceName: booking.service?.nameCs ?? 'Služba',
          date: dateStr,
          time: booking.time,
        }
        if (status === 'CONFIRMED') await sendBookingConfirmedEmail(emailParams)
        else await sendBookingCancelledEmail(emailParams)
      } catch(e) { console.error('Status email error:', e) }
    }

    // Award loyalty points when completed
    if (status === 'COMPLETED') {
      const points = booking.totalKc
      let userId = booking.userId

      if (!userId && booking.customerEmail) {
        const user = await prisma.user.findUnique({
          where: { email: booking.customerEmail },
          select: { id: true },
        })
        userId = user?.id ?? null
      }

      if (userId) {
        // Has account — add points directly
        await prisma.user.update({
          where: { id: userId },
          data: { loyaltyPoints: { increment: points } },
        })
        await prisma.lashPointsHistory.create({
          data: { userId, points, reason: `Bodů za ${booking.service?.nameCs ?? 'službu'} 💕` },
        }).catch(console.error)
      } else if (booking.customerEmail) {
        // No account — send email with registration link + points info
        try {
          const { sendPointsEmail } = await import('@/lib/email')
          await sendPointsEmail({ to: booking.customerEmail, points, serviceName: booking.service?.nameCs ?? 'služba' })
        } catch(e) { console.error('Points email error:', e) }
      }
    }

    return NextResponse.json(booking)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
