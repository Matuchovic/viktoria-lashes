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
  try {
    await prisma.$executeRaw`UPDATE bookings SET address = ${address || null} WHERE id = ${id}`
    return NextResponse.json({ ok: true })
  } catch(e: any) {
    console.error('Address update error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
