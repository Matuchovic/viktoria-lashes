import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const { address } = await req.json()
  const booking = await prisma.booking.findUnique({ where: { id } })
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  let notes = booking.notes || ''
  notes = notes.replace(/ADDR:[^\n]*/g, '').trim()
  if (address) notes = 'ADDR:' + address + (notes ? '\n' + notes : '')
  await prisma.booking.update({ where: { id }, data: { notes } })
  return NextResponse.json({ ok: true })
}
