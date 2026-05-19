import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { status } = await req.json()
    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
    })
    return NextResponse.json(booking)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
