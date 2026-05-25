import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: any = {}

  // DB ping
  try {
    const t = Date.now()
    await prisma.$queryRaw`SELECT 1`
    results.db = { ok: true, ms: Date.now() - t }
  } catch(e) {
    results.db = { ok: false, ms: -1 }
  }

  // SMTP ping
  try {
    const t = Date.now()
    const nodemailer = await import('nodemailer')
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
      auth: { user: process.env.EMAIL_SERVER_USER, pass: process.env.EMAIL_SERVER_PASSWORD }
    })
    await transport.verify()
    results.smtp = { ok: true, ms: Date.now() - t }
  } catch(e) {
    results.smtp = { ok: false, ms: -1 }
  }

  // Groq ping
  try {
    const t = Date.now()
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` }
    })
    results.groq = { ok: res.ok, ms: Date.now() - t }
  } catch(e) {
    results.groq = { ok: false, ms: -1 }
  }

  // Env vars check
  const envVars = ['DATABASE_URL','NEXTAUTH_SECRET','GROQ_API_KEY','EMAIL_SERVER_HOST','EMAIL_SERVER_USER','EMAIL_SERVER_PASSWORD','VAPID_PUBLIC_KEY','NEXT_PUBLIC_APP_URL']
  results.env = Object.fromEntries(envVars.map(k => [k, !!process.env[k]]))

  return NextResponse.json(results)
}
