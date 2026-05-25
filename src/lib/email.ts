import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.viktoria-lashes.cz'

function baseHtml(content: string, accentColor = '#D4AA70'): string {
  return `<!DOCTYPE html><html lang="cs"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080608;">
<div style="max-width:520px;margin:0 auto;font-family:Georgia,serif;">
  <div style="height:2px;background:linear-gradient(90deg,#080608,${accentColor},#FF6BA8,${accentColor},#080608);"></div>
  <div style="background:#080608;padding:28px 32px;text-align:center;">
    <div style="font-size:9px;letter-spacing:6px;color:rgba(212,170,112,0.5);text-transform:uppercase;margin-bottom:10px;">&#10022; Viktória Lashes &#10022;</div>
    <div style="font-size:26px;font-weight:300;color:#f5eef2;letter-spacing:4px;">VIKTÓRIA <span style="color:#FF6BA8;font-style:italic;">Lashes</span></div>
    <div style="width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(212,170,112,0.5),transparent);margin-top:16px;"></div>
  </div>
  <div style="background:#0a0608;padding:32px;">${content}</div>
  <div style="background:#080608;padding:16px 32px;text-align:center;border-top:1px solid rgba(212,170,112,0.1);">
    <div style="font-size:10px;color:rgba(245,238,242,0.2);letter-spacing:1px;line-height:2;">
      Viktória Lashes &middot; Mladá Boleslav &amp; okolí<br/>
      <a href="mailto:viktorialadikova23@gmail.com" style="color:rgba(255,107,168,0.4);text-decoration:none;">viktorialadikova23@gmail.com</a>
      &nbsp;&middot;&nbsp;
      <a href="mailto:viktorialashes1@gmail.com" style="color:rgba(255,107,168,0.4);text-decoration:none;">viktorialashes1@gmail.com</a><br/>
      <a href="${APP_URL}" style="color:rgba(212,170,112,0.4);text-decoration:none;">viktoria-lashes.cz</a>
    </div>
  </div>
  <div style="height:2px;background:linear-gradient(90deg,#080608,${accentColor},#FF6BA8,${accentColor},#080608);"></div>
</div>
</body></html>`
}

// 1. Potvrzení rezervace
export async function sendBookingConfirmation(booking: {
  customerName: string
  customerEmail: string
  bookingRef: string
  service?: { nameCs?: string } | null
  date: string | Date
  time: string
  totalKc: number
  notes?: string | null
}) {
  const rawDate = booking.date
  let dateStr: string
  if (typeof rawDate === 'string' && rawDate.includes('.')) {
    dateStr = rawDate // already formatted e.g. "27. května 2026"
  } else {
    const date = new Date(rawDate)
    dateStr = isNaN(date.getTime()) ? String(rawDate) : date.toLocaleDateString('cs-CZ', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
  }

  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;padding:5px 14px;border:1px solid rgba(74,222,128,0.3);border-radius:20px;font-size:10px;letter-spacing:3px;color:#4ade80;text-transform:uppercase;margin-bottom:12px;">&#10003; Rezervace potvrzena</div>
      <p style="font-size:20px;font-weight:300;color:#f5eef2;margin:0 0 8px;">Těším se na vás! &#128197;</p>
      <p style="font-size:13px;color:rgba(245,238,242,0.5);line-height:1.8;margin:0;">Vaše rezervace je potvrzena. Přijedu k vám ve sjednaném čase.</p>
    </div>
    <div style="border:1px solid rgba(74,222,128,0.2);padding:24px;margin-bottom:24px;background:rgba(74,222,128,0.03);">
      <div style="font-size:9px;letter-spacing:4px;color:rgba(74,222,128,0.5);text-transform:uppercase;margin-bottom:14px;">Detail rezervace</div>
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <tr><td style="color:rgba(245,238,242,0.35);padding:7px 0;border-bottom:0.5px solid rgba(255,255,255,0.05);">&#268;. rezervace</td><td style="color:rgba(245,238,242,0.7);text-align:right;padding:7px 0;border-bottom:0.5px solid rgba(255,255,255,0.05);">#${booking.bookingRef?.slice(-6).toUpperCase()}</td></tr>
        <tr><td style="color:rgba(245,238,242,0.35);padding:7px 0;border-bottom:0.5px solid rgba(255,255,255,0.05);">Slu&#382;ba</td><td style="color:rgba(245,238,242,0.7);text-align:right;padding:7px 0;border-bottom:0.5px solid rgba(255,255,255,0.05);">${booking.service?.nameCs ?? 'Slu&#382;ba'}</td></tr>
        <tr><td style="color:rgba(245,238,242,0.35);padding:7px 0;border-bottom:0.5px solid rgba(255,255,255,0.05);">Datum</td><td style="color:rgba(245,238,242,0.7);text-align:right;padding:7px 0;border-bottom:0.5px solid rgba(255,255,255,0.05);">${dateStr}</td></tr>
        <tr><td style="color:rgba(245,238,242,0.35);padding:7px 0;border-bottom:0.5px solid rgba(255,255,255,0.05);">&#268;as</td><td style="color:rgba(245,238,242,0.7);text-align:right;padding:7px 0;border-bottom:0.5px solid rgba(255,255,255,0.05);">${booking.time}</td></tr>
        ${booking.notes ? `<tr><td style="color:rgba(245,238,242,0.35);padding:7px 0;border-bottom:0.5px solid rgba(255,255,255,0.05);">Adresa</td><td style="color:rgba(245,238,242,0.7);text-align:right;padding:7px 0;border-bottom:0.5px solid rgba(255,255,255,0.05);">${booking.notes.replace('&#128205; Adresa: ','').split(' | ')[0]}</td></tr>` : ''}
        <tr><td style="color:rgba(245,238,242,0.35);padding:7px 0;">Cena</td><td style="color:#FF6BA8;text-align:right;padding:7px 0;font-size:20px;font-weight:300;">${booking.totalKc} K&#269;</td></tr>
      </table>
    </div>
    <div style="background:rgba(212,170,112,0.06);border:1px solid rgba(212,170,112,0.2);padding:14px 18px;margin-bottom:24px;">
      <div style="font-size:11px;color:rgba(212,170,112,0.7);line-height:1.8;">&#128161; <strong style="color:rgba(212,170,112,0.9);">P&#345;ipravte se:</strong> Odli&#269;te o&#269;n&#237; okol&#237; a vyvarujte se mastn&#253;ch kr&#233;m&#367; kolem o&#269;&#237;.</div>
    </div>
    <div style="text-align:center;margin-bottom:12px;">
      <a href="${APP_URL}/dashboard" style="display:inline-block;padding:13px 32px;background:linear-gradient(135deg,#C4698A,#FF6BA8);color:white;text-decoration:none;font-size:11px;letter-spacing:3px;text-transform:uppercase;border-radius:50px;">Zobrazit rezervaci &#8594;</a>
    </div>
    <p style="font-size:11px;color:rgba(245,238,242,0.25);text-align:center;margin:0;line-height:1.8;">Pot&#345;ebujete zm&#283;nit term&#237;n? Napi&#353;te mi nejpozd&#283;ji 48 hodin p&#345;edem.</p>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: booking.customerEmail,
    subject: `Potvrzení rezervace — ${booking.service?.nameCs ?? 'Viktória Lashes'} ✓`,
    html: baseHtml(content, '#4ade80'),
  })
}

// 2. Registrace — uvítací email
export async function sendWelcomeEmail(user: { name: string; email: string }) {
  const firstName = user.name.split(' ')[0]

  const content = `
    <p style="font-size:20px;font-weight:300;color:#f5eef2;margin:0 0 8px;">V&#237;tejte v m&#233; rodin&#283;! &#128149;</p>
    <p style="font-size:13px;color:rgba(245,238,242,0.5);line-height:1.8;margin:0 0 24px;">D&#283;kuji za registraci, <strong style="color:rgba(245,238,242,0.8);">${firstName}</strong>. V&#225;&#353; &#250;&#269;et je vytvořen a &#269;ek&#225; na v&#225;s uv&#237;tac&#237; d&#225;rek ode m&#283;!</p>
    <div style="border:1px solid rgba(255,107,168,0.25);padding:24px;text-align:center;margin-bottom:24px;background:rgba(255,107,168,0.04);">
      <div style="font-size:9px;letter-spacing:5px;color:rgba(255,107,168,0.5);text-transform:uppercase;margin-bottom:10px;">M&#367;j uv&#237;tac&#237; bonus pro v&#225;s</div>
      <div style="font-size:52px;font-weight:300;color:#FF6BA8;line-height:1;margin-bottom:4px;">250</div>
      <div style="font-size:10px;letter-spacing:5px;color:rgba(255,107,168,0.7);text-transform:uppercase;margin-bottom:8px;">Lash Body bod&#367; zdarma</div>
      <div style="font-size:11px;color:rgba(245,238,242,0.3);">P&#345;ips&#225;no na v&#225;&#353; nov&#253; &#250;&#269;et</div>
    </div>
    <div style="border:0.5px solid rgba(255,255,255,0.07);padding:16px 20px;margin-bottom:24px;">
      <div style="font-size:9px;letter-spacing:3px;color:rgba(245,238,242,0.25);text-transform:uppercase;margin-bottom:10px;">P&#345;ihla&#353;ovac&#237; &#250;daje</div>
      <table style="width:100%;font-size:12px;border-collapse:collapse;">
        <tr><td style="color:rgba(245,238,242,0.35);padding:6px 0;border-bottom:0.5px solid rgba(255,255,255,0.05);">Email</td><td style="color:rgba(245,238,242,0.7);text-align:right;padding:6px 0;border-bottom:0.5px solid rgba(255,255,255,0.05);">${user.email}</td></tr>
        <tr><td style="color:rgba(245,238,242,0.35);padding:6px 0;">Heslo</td><td style="color:rgba(245,238,242,0.7);text-align:right;padding:6px 0;">va&#353;e zvolen&#233; heslo</td></tr>
      </table>
    </div>
    <div style="text-align:center;margin-bottom:12px;">
      <a href="${APP_URL}/dashboard" style="display:inline-block;padding:13px 32px;background:linear-gradient(135deg,#C4698A,#FF6BA8);color:white;text-decoration:none;font-size:11px;letter-spacing:3px;text-transform:uppercase;border-radius:50px;">P&#345;ihl&#225;sit se do &#250;&#269;tu &#8594;</a>
    </div>
    <p style="font-size:12px;color:rgba(245,238,242,0.3);line-height:1.8;text-align:center;margin:0;">T&#283;&#353;&#237;m se na va&#353;i n&#225;v&#353;t&#283;vu! &#127800;</p>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Vítejte u Viktórie — 250 Lash Body bodů vás čeká! 💕',
    html: baseHtml(content, '#FF6BA8'),
  })
}

// 3. Email s body po COMPLETED (bez registrace)
export async function sendPointsEmail(params: { to: string; points: number; serviceName: string }) {
  const content = `
    <p style="font-size:20px;font-weight:300;color:#f5eef2;margin:0 0 8px;">D&#283;kuji za va&#353;i n&#225;v&#353;t&#283;vu! &#127800;</p>
    <p style="font-size:13px;color:rgba(245,238,242,0.5);line-height:1.8;margin:0 0 24px;">Va&#353;e <strong style="color:rgba(245,238,242,0.8);">${params.serviceName}</strong> je hotov&#225;. Jsem r&#225;da, &#382;e jste si m&#283; vybraly!</p>
    <div style="border:1px solid rgba(212,170,112,0.3);padding:24px;text-align:center;margin-bottom:24px;">
      <div style="font-size:9px;letter-spacing:5px;color:rgba(212,170,112,0.5);text-transform:uppercase;margin-bottom:10px;">Na v&#225;s &#269;ek&#225;</div>
      <div style="font-size:52px;font-weight:300;color:#D4AA70;line-height:1;margin-bottom:4px;">${params.points}</div>
      <div style="font-size:10px;letter-spacing:5px;color:rgba(212,170,112,0.7);text-transform:uppercase;">Lash Body bod&#367;</div>
    </div>
    <p style="font-size:13px;color:rgba(245,238,242,0.45);line-height:1.8;margin:0 0 20px;">Zaregistrujte se zdarma a body v&#225;m automaticky p&#345;i&#269;tu. Sb&#237;rejte je za ka&#382;dou n&#225;v&#353;t&#283;vu a vym&#283;&#328;te za slevy a d&#225;rky!</p>
    <div style="text-align:center;margin-bottom:12px;">
      <a href="${APP_URL}/register" style="display:inline-block;padding:13px 32px;background:linear-gradient(135deg,#C4698A,#FF6BA8);color:white;text-decoration:none;font-size:11px;letter-spacing:3px;text-transform:uppercase;border-radius:50px;">Zaregistrovat se a z&#237;skat ${params.points} bod&#367; &#8594;</a>
    </div>
    <div style="text-align:center;"><a href="${APP_URL}/login" style="font-size:11px;color:rgba(245,238,242,0.3);text-decoration:none;">Ji&#382; m&#225;m &#250;&#269;et &#8212; p&#345;ihl&#225;sit se</a></div>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: params.to,
    subject: `Získala jste ${params.points} Lash Body bodů! 💛`,
    html: baseHtml(content, '#D4AA70'),
  })
}

// Legacy exports pro zpětnou kompatibilitu
export async function sendBookingReminder(booking: any) {
  // placeholder
}
export async function sendContactReply(to: string, name: string) {
  // placeholder
}
