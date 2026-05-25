import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Vyplňte prosím všechna povinná pole.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Heslo musí mít alespoň 8 znaků.' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Tento e-mail je již registrován.' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashed,
        role: 'CUSTOMER',
        loyaltyPoints: 250,
      },
    })

    // Award registration bonus points history
    try {
      await prisma.lashPointsHistory.create({
        data: {
          userId: user.id,
          points: 250,
          reason: 'Uvítací bonus za registraci 🌸',
        },
      })
    } catch (e) {
      console.error('Points history error:', e)
    }

    // Send welcome email
    try {
      const { sendWelcomeEmail } = await import('@/lib/email')
      await sendWelcomeEmail({ name: user.name ?? 'Klientko', email: user.email })
    } catch (e) {
      console.error('Welcome email error:', e)
    }

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 })
  }
}
