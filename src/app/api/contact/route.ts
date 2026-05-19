// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendContactReply } from '@/lib/email'
import { z } from 'zod'

const ContactSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  message: z.string().min(10).max(2000),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = ContactSchema.parse(body)

    await prisma.contactMessage.create({
      data: { name: data.name, email: data.email, message: data.message },
    })

    sendContactReply(data.email, data.name).catch(console.error)

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Neplatná data.' }, { status: 422 })
    }
    return NextResponse.json({ error: 'Chyba serveru.' }, { status: 500 })
  }
}
