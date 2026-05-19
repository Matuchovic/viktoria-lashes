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
    })
    return NextResponse.json(booking)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
