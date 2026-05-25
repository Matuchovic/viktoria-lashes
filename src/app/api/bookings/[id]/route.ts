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
      include: { service: true },
    })

    // Award loyalty points when completed
    if (status === 'COMPLETED') {
      const points = booking.totalKc
      let userId = booking.userId

      if (!userId && booking.customerEmail) {
        const user = await prisma.user.findUnique({
          where: { email: booking.customerEmail },
          select: { id: true },
        })
        userId = user?.id ?? null
      }

      if (userId) {
        // Has account — add points directly
        await prisma.user.update({
          where: { id: userId },
          data: { loyaltyPoints: { increment: points } },
        })
        await prisma.lashPointsHistory.create({
          data: { userId, points, reason: `Bodů za ${booking.service?.nameCs ?? 'službu'} 💕` },
        }).catch(console.error)
      } else if (booking.customerEmail) {
        // No account — send email with registration link + points info
        try {
          const nodemailer = await import('nodemailer')
          const t = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
            secure: false,
            auth: { user: process.env.EMAIL_SERVER_USER, pass: process.env.EMAIL_SERVER_PASSWORD },
          })
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.viktoria-lashes.cz'
          await t.sendMail({
            from: process.env.EMAIL_FROM,
            to: booking.customerEmail,
            subject: `Získala jste ${points} Lash Body bodů! 💕`,
            html: `<div style="font-family:Georgia,serif;max-width:500px;margin:0 auto;background:#080608;color:#f5eef2;padding:32px;border-radius:16px;">
              <h2 style="color:#FF6BA8;font-weight:300;">Viktória Lashes</h2>
              <h1 style="font-weight:300;font-size:24px;">Děkujeme za návštěvu! 🌸</h1>
              <p style="color:rgba(245,238,242,0.7);line-height:1.8;">Vaše návštěva <strong>${booking.service?.nameCs ?? 'služby'}</strong> byla dokončena.</p>
              <div style="background:rgba(212,170,112,0.1);border:1px solid rgba(212,170,112,0.3);border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
                <div style="font-size:36px;color:#D4AA70;">${points}</div>
                <div style="color:#D4AA70;letter-spacing:3px;font-size:11px;text-transform:uppercase;">Lash Body bodů na vás čeká</div>
              </div>
              <p style="color:rgba(245,238,242,0.6);line-height:1.8;">Zaregistrujte se zdarma a body se vám automaticky přičtou!</p>
              <a href="${appUrl}/register" style="display:block;text-align:center;padding:14px;border-radius:50px;background:linear-gradient(135deg,#C4698A,#FF6BA8);color:white;text-decoration:none;font-size:15px;margin:20px 0;">
                Zaregistrovat se a získat ${points} bodů →
              </a>
            </div>`,
          })
        } catch(e) { console.error('Points email error:', e) }
      }
    }

    return NextResponse.json(booking)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
