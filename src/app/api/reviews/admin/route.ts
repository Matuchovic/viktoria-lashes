import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Admin — get all reviews
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(reviews)
}

// Admin — update review (approve/reject/reply/edit)
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id, status, adminReply, text, authorName, location, rating } = await req.json()
  const review = await prisma.review.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(adminReply !== undefined && { adminReply }),
      ...(text && { text }),
      ...(authorName && { authorName }),
      ...(location !== undefined && { location }),
      ...(rating && { rating }),
    },
  })
  return NextResponse.json(review)
}

// Admin — delete review
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await req.json()
  await prisma.review.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
