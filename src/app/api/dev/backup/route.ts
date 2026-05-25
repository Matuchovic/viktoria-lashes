import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const [users, bookings, reviews, checkins, pushSubs, pointsHistory] = await Promise.all([
    prisma.user.findMany({ select: { id:true, name:true, email:true, role:true, loyaltyPoints:true, createdAt:true, phone:true } }),
    prisma.booking.findMany({ include: { service: true } }),
    prisma.review.findMany(),
    prisma.safetyCheckin.findMany(),
    prisma.pushSubscription.findMany(),
    prisma.lashPointsHistory.findMany(),
  ])
  return NextResponse.json({
    meta: { createdAt: new Date().toISOString(), version: '1.0', project: 'viktoria-lashes' },
    counts: { users: users.length, bookings: bookings.length, reviews: reviews.length, checkins: checkins.length, pushSubs: pushSubs.length, pointsHistory: pointsHistory.length },
    data: { users, bookings, reviews, checkins, pushSubs, pointsHistory }
  })
}
