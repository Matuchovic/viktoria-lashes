// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  const [
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    revenueThisMonth,
    revenueLastMonth,
    totalCustomers,
    newCustomers,
    upcomingBookings,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'CONFIRMED' } }),
    prisma.booking.count({ where: { status: 'CANCELLED' } }),
    prisma.booking.aggregate({
      where: { createdAt: { gte: startOfMonth }, status: { in: ['CONFIRMED','COMPLETED'] } },
      _sum: { totalKc: true },
    }),
    prisma.booking.aggregate({
      where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }, status: { in: ['CONFIRMED','COMPLETED'] } },
      _sum: { totalKc: true },
    }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: startOfMonth } } }),
    prisma.booking.findMany({
      where: { date: { gte: now }, status: { in: ['PENDING','CONFIRMED'] } },
      include: { service: true, artist: true },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
      take: 10,
    }),
  ])

  return NextResponse.json({
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    revenueThisMonth: revenueThisMonth._sum.totalKc ?? 0,
    revenueLastMonth: revenueLastMonth._sum.totalKc ?? 0,
    totalCustomers,
    newCustomers,
    upcomingBookings,
    occupancyRate: totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0,
  })
}
