import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalUsers, totalBookings, totalRevenue, totalReviews,
    pendingReviews, pushSubs, bookingsLast7, usersLast7, usersList,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.booking.aggregate({ _sum: { totalKc: true }, where: { status: { not: 'CANCELLED' } } }),
    prisma.review.count(),
    prisma.review.count({ where: { status: 'PENDING' } }),
    prisma.pushSubscription.count(),
    prisma.booking.findMany({
      where: { createdAt: { gte: weekAgo } },
      select: { createdAt: true, totalKc: true, status: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: weekAgo } },
      select: { createdAt: true },
    }),
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, loyaltyPoints: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ])

  const days: Record<string, { bookings: number; revenue: number; users: number }> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' })
    days[key] = { bookings: 0, revenue: 0, users: 0 }
  }
  bookingsLast7.forEach(b => {
    const key = new Date(b.createdAt).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' })
    if (days[key]) { days[key].bookings++; days[key].revenue += b.totalKc }
  })
  usersLast7.forEach(u => {
    const key = new Date(u.createdAt).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' })
    if (days[key]) days[key].users++
  })

  return NextResponse.json({
    totalUsers, totalBookings,
    totalRevenue: totalRevenue._sum.totalKc ?? 0,
    totalReviews, pendingReviews, pushSubs,
    dailyStats: Object.entries(days).map(([date, v]) => ({ date, ...v })),
    usersList,
  })
}
