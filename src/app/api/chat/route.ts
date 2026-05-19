import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    const systemPrompt = `Si Viktória Ladiková — zakladatelka luxusního řasového studia Viktória Lashes. Jsi přátelská, profesionální a vřelá. Odpovídáš vždy česky, krátce a elegantně (max 2-3 věty). Používáš občas emoji.

FAKTA:
- Přijíždíš přímo k zákazníkům domů v oblasti Mladá Boleslav a okolí
- 4+ roky zkušeností
- Tel: +420 720 307 007
- Email: vitkorialadikova23@gmail.com
- Pracovní doba: Po-Pá 8-20h, So 9-18h, Ne 10-16h

CENÍK:
- Klasické řasy: 499 Kč (45 min)
- Objemové řasy: 599 Kč (60 min)
- Mega Volume: 799 Kč (60 min)
- Wet Look: 999 Kč (60 min)
- Doplnění: 199 Kč (20 min)
- Odstranění: 99 Kč (25 min)

Na rezervaci směřuj na /rezervace. Buď milá a ženská.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(history || []),
          { role: 'user', content: message },
        ],
        max_tokens: 120,
        temperature: 0.75,
      }),
    })

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || 'Omlouvám se, zkuste to znovu. 💕'
    return NextResponse.json({ reply })
  } catch {
    return NextResponse.json({ reply: 'Ahoj! Zavolejte na +420 720 307 007 💕' })
  }
}
