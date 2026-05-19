// src/lib/email.ts
import nodemailer from 'nodemailer'
import type { Booking } from '@prisma/client'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

function brandedHtml(content: string): string {
  return `
<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Georgia, serif; background: #080608; color: #F5EEF2; margin: 0; padding: 0; }
  .wrap { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .header { text-align: center; padding: 40px 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .logo { font-size: 28px; font-weight: 300; letter-spacing: 6px; color: #F5EEF2; text-transform: uppercase; }
  .logo span { color: #FF6BA8; }
  .content { padding: 40px 0; font-size: 16px; line-height: 1.8; color: rgba(245,238,242,0.8); }
  .highlight { color: #FF6BA8; font-style: italic; }
  .detail-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 24px; margin: 24px 0; }
  .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px; }
  .detail-label { color: rgba(245,238,242,0.4); letter-spacing: 1px; text-transform: uppercase; font-size: 11px; }
  .detail-value { color: #F5EEF2; }
  .price { font-size: 28px; color: #FF6BA8; font-style: italic; }
  .footer { text-align: center; padding: 32px 0; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: rgba(245,238,242,0.3); letter-spacing: 2px; }
  .btn { display: inline-block; background: linear-gradient(135deg, #C4698A, #FF6BA8); color: white; padding: 14px 32px; text-decoration: none; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin: 24px 0; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="logo">Viktoria <span>Lashes</span></div>
    <div style="font-size:11px;letter-spacing:4px;color:rgba(245,238,242,0.3);margin-top:8px;text-transform:uppercase;">Luxusní Řasové Studio Praha</div>
  </div>
  <div class="content">${content}</div>
  <div class="footer">
    <p>Pařížská 18, 110 00 Praha 1</p>
    <p>+420 777 888 999 · info@viktoralashes.cz</p>
    <p style="margin-top:16px;">© ${new Date().getFullYear()} Viktoria Lashes Official</p>
  </div>
</div>
</body>
</html>`
}

export async function sendBookingConfirmation(booking: {
  customerName: string
  customerEmail: string
  service: string
  artist: string
  date: string
  time: string
  totalKc: number
  depositKc: number
  bookingRef: string
}) {
  const content = `
    <p>Milá <span class="highlight">${booking.customerName}</span>,</p>
    <p>vaše rezervace v Viktoria Lashes byla úspěšně přijata. Těšíme se na vás!</p>
    <div class="detail-box">
      <div class="detail-row"><span class="detail-label">Č. rezervace</span><span class="detail-value">#${booking.bookingRef.slice(-8).toUpperCase()}</span></div>
      <div class="detail-row"><span class="detail-label">Služba</span><span class="detail-value">${booking.service}</span></div>
      <div class="detail-row"><span class="detail-label">Stylistka</span><span class="detail-value">${booking.artist}</span></div>
      <div class="detail-row"><span class="detail-label">Datum</span><span class="detail-value">${booking.date}</span></div>
      <div class="detail-row"><span class="detail-label">Čas</span><span class="detail-value">${booking.time}</span></div>
      <div class="detail-row"><span class="detail-label">Celková cena</span><span class="detail-value price">${booking.totalKc.toLocaleString('cs-CZ')} Kč</span></div>
      <div class="detail-row"><span class="detail-label">Záloha</span><span class="detail-value">${booking.depositKc.toLocaleString('cs-CZ')} Kč (30%)</span></div>
    </div>
    <p><strong>Připomínky:</strong></p>
    <ul style="color:rgba(245,238,242,0.6);line-height:2;">
      <li>Přijďte prosím 5 minut před termínem</li>
      <li>Přijďte s čistými řasami bez řasenky</li>
      <li>Zrušení do 24h předem je zdarma</li>
    </ul>
    <p>V případě dotazů nás kontaktujte na <a href="mailto:info@viktoralashes.cz" style="color:#FF6BA8;">info@viktoralashes.cz</a> nebo +420 777 888 999.</p>
    <p>S láskou,<br><span class="highlight">Tým Viktoria Lashes</span></p>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: booking.customerEmail,
    subject: `✨ Potvrzení rezervace — Viktoria Lashes #${booking.bookingRef.slice(-8).toUpperCase()}`,
    html: brandedHtml(content),
  })
}

export async function sendBookingReminder(booking: {
  customerName: string
  customerEmail: string
  service: string
  date: string
  time: string
}) {
  const content = `
    <p>Milá <span class="highlight">${booking.customerName}</span>,</p>
    <p>připomínáme vám zítřejší návštěvu v Viktoria Lashes.</p>
    <div class="detail-box">
      <div class="detail-row"><span class="detail-label">Služba</span><span class="detail-value">${booking.service}</span></div>
      <div class="detail-row"><span class="detail-label">Datum</span><span class="detail-value">${booking.date}</span></div>
      <div class="detail-row"><span class="detail-label">Čas</span><span class="detail-value">${booking.time}</span></div>
    </div>
    <p>Těšíme se na vás!</p>
    <p><span class="highlight">Tým Viktoria Lashes</span></p>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: booking.customerEmail,
    subject: `⏰ Připomínka termínu — zítra v ${booking.time}`,
    html: brandedHtml(content),
  })
}

export async function sendContactReply(to: string, name: string) {
  const content = `
    <p>Milá <span class="highlight">${name}</span>,</p>
    <p>obdrželi jsme vaši zprávu a brzy se vám ozveme. Obvykle odpovídáme do 2 hodin v pracovní dny.</p>
    <p>Pokud je věc urgentní, zavolejte nám na <strong>+420 777 888 999</strong>.</p>
    <p>S pozdravem,<br><span class="highlight">Tým Viktoria Lashes</span></p>
  `
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Obdrželi jsme vaši zprávu — Viktoria Lashes',
    html: brandedHtml(content),
  })
}
