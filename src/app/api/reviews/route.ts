import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Public — get approved reviews
export async function GET() {
  const reviews = await prisma.review.findMany({
    where: { status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(reviews)
}

// Public — submit new review
export async function POST(req: Request) {
  const { authorName, authorEmail, location, text, rating, service } = await req.json()
  if (!authorName || !text) return NextResponse.json({ error: 'Vyplňte jméno a text.' }, { status: 400 })
  if (text.length < 10) return NextResponse.json({ error: 'Recenze je příliš krátká.' }, { status: 400 })
  if (rating < 1 || rating > 5) return NextResponse.json({ error: 'Neplatné hodnocení.' }, { status: 400 })

  const review = await prisma.review.create({
    data: { authorName, authorEmail: authorEmail || null, location: location || null, text, rating, service: service || null },
  })
  return NextResponse.json({ id: review.id, message: 'Recenze odeslána ke schválení.' }, { status: 201 })
}
