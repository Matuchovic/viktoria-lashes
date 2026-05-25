import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { to, subject, text } = await req.json()
  if (!to) return NextResponse.json({ error: 'Missing to' }, { status: 400 })
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
    secure: false,
    auth: { user: process.env.EMAIL_SERVER_USER, pass: process.env.EMAIL_SERVER_PASSWORD },
  })
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM, to,
      subject: subject || 'Test email — Viktória Lashes DEV',
      html: `<div style="font-family:Georgia,serif;padding:32px;background:#080608;color:#f5eef2;border-radius:16px;"><h2 style="color:#FF6BA8;">Test email ✓</h2><p style="color:rgba(245,238,242,0.6);">${text || 'Email systém funguje!'}</p><p style="color:rgba(245,238,242,0.3);font-size:12px;">DEV panel — ${new Date().toLocaleString('cs-CZ')}</p></div>`,
    })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
