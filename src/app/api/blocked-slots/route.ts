import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - načíst všechny blokace
export async function GET() {
  try {
    const slots = await prisma.blockedSlot.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(slots)
  } catch (e) {
    return NextResponse.json({ error: 'Chyba při načítání' }, { status: 500 })
  }
}

// POST - vytvořit novou blokaci
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const slot = await prisma.blockedSlot.create({ data: body })
    return NextResponse.json(slot)
  } catch (e) {
    return NextResponse.json({ error: 'Chyba při vytváření' }, { status: 500 })
  }
}

// DELETE - smazat blokaci
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await req.json()
    await prisma.blockedSlot.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Chyba při mazání' }, { status: 500 })
  }
}

// PATCH - toggle aktivní/neaktivní
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id, isActive } = await req.json()
    const slot = await prisma.blockedSlot.update({
      where: { id },
      data: { isActive }
    })
    return NextResponse.json(slot)
  } catch (e) {
    return NextResponse.json({ error: 'Chyba při aktualizaci' }, { status: 500 })
  }
}
