import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'GDPR | Viktória Lashes',
  description: 'Zasady ochrany osobnich udaju GDPR - Viktoria Lashes, Hosabut s.r.o.',
}

const COMPANY = 'Hosabut s.r.o.'
const ICO = '23338342'
const SIDLO = 'Decinska 552/1, Strizkov (Praha 8), 180 00 Praha'
const BRAND = 'Viktoria Lashes'
const WEB = 'www.viktoria-lashes.cz'
const EMAIL = 'vitkorialadikova23@gmail.com'
const TEL = '+420 720 307 007'
const DATE = '20. 5. 2026'

function H2({ children }: { children: string }) {
  return React.createElement('h2', {
    style: { fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 300, color: '#C4698A', marginBottom: 12, marginTop: 32, paddingBottom: 8, borderBottom: '1px solid rgba(196,105,138,0.2)' }
  }, children)
}

function P({ children }: { children: React.ReactNode }) {
  return React.createElement('p', {
    style: { color: 'rgba(245,238,242,0.55)', fontSize: 14, fontWeight: 300, lineHeight: 1.8, marginBottom: 10, fontFamily: 'Georgia,serif', textAlign: 'justify' as const }
  }, children)
}

function Li({ children }: { children: React.ReactNode }) {
  return React.createElement('li', {
    style: { display: 'flex', gap: 10, marginBottom: 6 }
  },
    React.createElement('span', { style: { color: '#C4698A', flexShrink: 0 } }, '\u2726'),
    React.createElement('span', { style: { color: 'rgba(245,238,242,0.55)', fontSize: 14, fontWeight: 300, lineHeight: 1.7, fontFamily: 'Georgia,serif' } }, children)
  )
}

function Ul({ children }: { children: React.ReactNode }) {
  return React.createElement('ul', { style: { listStyle: 'none', padding: 0, marginBottom: 12 } }, children)
}

export default function GdprPage() {
  return React.createElement(React.Fragment, null,
    React.createElement(Navbar, null),
    React.createElement('main', {
      style: { minHeight: '100vh', background: '#080608', paddingTop: 112, paddingBottom: 96 }
    },
      React.createElement('div', { style: { maxWidth: 760, margin: '0 auto', padding: '0 24px' } },

        React.createElement('div', { style: { marginBottom: 48 } },
          React.createElement('div', { style: { fontFamily: 'Georgia,serif', fontSize: 10, letterSpacing: 5, textTransform: 'uppercase' as const, color: '#C4698A', marginBottom: 12 } }, '\u2726 Pravni dokumenty'),
          React.createElement('h1', { style: { fontFamily: 'Georgia,serif', fontSize: 40, fontWeight: 300, marginBottom: 8 } }, 'Zasady ochrany osobnich udaju'),
          React.createElement('p', { style: { fontFamily: 'Georgia,serif', fontSize: 13, fontStyle: 'italic', color: 'rgba(245,238,242,0.35)', marginBottom: 16 } }, 'v souladu s narizenim (EU) 2016/679 (GDPR)'),
          React.createElement('div', { style: { fontFamily: 'Georgia,serif', fontSize: 11, color: 'rgba(245,238,242,0.25)', letterSpacing: 1 } },
            'Spravce: ' + COMPANY + ' | ICO: ' + ICO + ' | Platnost od: ' + DATE
          ),
          React.createElement('div', { style: { height: 1, marginTop: 20, background: 'linear-gradient(90deg,rgba(196,105,138,0.5),rgba(212,170,112,0.3),transparent)' } })
        ),

        React.createElement('div', { style: { marginBottom: 32, padding: 20, borderRadius: 16, background: 'rgba(212,170,112,0.06)', border: '1px solid rgba(212,170,112,0.18)' } },
          React.createElement('div', { style: { fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#D4AA70', marginBottom: 12 } }, 'Spravce osobnich udaju'),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 } },
            ...([
              ['Firma', COMPANY], ['ICO', ICO],
              ['Znacka', BRAND], ['Web', WEB],
              ['Email', EMAIL], ['Tel', TEL],
            ].map(([l, v]) => React.createElement('div', { key: l, style: { fontFamily: 'Georgia,serif', fontSize: 13, color: 'rgba(245,238,242,0.6)' } },
              React.createElement('span', { style: { color: 'rgba(245,238,242,0.3)' } }, l + ': '), v
            )))
          )
        ),

        React.createElement(H2, null, '1. Zpracovavane osobni udaje'),
        React.createElement(P, null, 'Zpracovavame tyto kategorie osobnich udaju:'),
        React.createElement(Ul, null,
          React.createElement(Li, null, 'Identifikacni udaje: jmeno, prijmeni, email, telefon, adresa mista sluzby.'),
          React.createElement(Li, null, 'Smluvni data: rezervace, platby, venostni body, korespondence.'),
          React.createElement(Li, null, 'Zdravotni informace (se souhlasem): alergie, kontraindikace.'),
          React.createElement(Li, null, 'Technicka data: IP adresa, cookies, zaznamy pristupu na web.')
        ),

        React.createElement(H2, null, '2. Ucely a pravni zaklady zpracovani'),
        React.createElement(P, null, 'Plneni smlouvy (cl. 6 odst. 1 pism. b) GDPR): sprava rezervaci, komunikace, fakturace, reklamace.'),
        React.createElement(P, null, 'Plneni pravni povinnosti (cl. 6 odst. 1 pism. c) GDPR): ucetni evidence, archivace dle zakona.'),
        React.createElement(P, null, 'Opravneny zajem (cl. 6 odst. 1 pism. f) GDPR): ochrana pravnich naroku, anonymizovana analytika.'),
        React.createElement(P, null, 'Souhlas (cl. 6 odst. 1 pism. a) GDPR): newsletter, vernostni program Lash Body, zdravotni informace, fotografie na soc. sitich. Souhlas lze kdykoliv odvolat.'),

        React.createElement(H2, null, '3. Prijemci osobnich udaju'),
        React.createElement(Ul, null,
          React.createElement(Li, null, 'Vercel Inc. a Supabase Inc. - cloudove uloziste dat na serverech v EU.'),
          React.createElement(Li, null, 'Ucetni a danovi poradci vazani mlcenlivosti.'),
          React.createElement(Li, null, 'Organy verejne moci na zaklade zakonnych povinnosti.'),
          React.createElement(Li, null, 'Poskytovately platebnich sluzeb (v nezbytnem rozsahu).')
        ),

        React.createElement(H2, null, '4. Predavani do tretich zemi'),
        React.createElement(P, null, 'Cloudove sluzby (Vercel, Supabase) mohou zpracovavat data mimo EHP. Predavani probiha na zaklade standardnich smluvnich dolozek schvalenych Evropskou komisi dle cl. 46 odst. 2 GDPR.'),

        React.createElement(H2, null, '5. Doba uchovavani'),
        React.createElement(Ul, null,
          React.createElement(Li, null, 'Smluvni dokumentace (rezervace, faktury): 10 let.'),
          React.createElement(Li, null, 'Zdravotni informace: do odvolani souhlasu, max. 2 roky.'),
          React.createElement(Li, null, 'Vernostni program: po dobu ucasti + 1 rok.'),
          React.createElement(Li, null, 'Marketingova komunikace: do odvolani souhlasu.'),
          React.createElement(Li, null, 'Technicka data: max. 13 mesicu.'),
          React.createElement(Li, null, 'Reklamace: 3 roky od vyrizeni.')
        ),

        React.createElement(H2, null, '6. Vase prava'),
        React.createElement(Ul, null,
          React.createElement(Li, null, 'Pravo na pristup (cl. 15 GDPR): ziskat informace o zpracovani Vasich udaju.'),
          React.createElement(Li, null, 'Pravo na opravu (cl. 16 GDPR): oprava nepresnych udaju.'),
          React.createElement(Li, null, 'Pravo na vymaz / "byt zapomenut" (cl. 17 GDPR): vymaz pri splneni podminek.'),
          React.createElement(Li, null, 'Pravo na omezeni zpracovani (cl. 18 GDPR): omezeni pri zpochybneni presnosti.'),
          React.createElement(Li, null, 'Pravo na prenositelnost (cl. 20 GDPR): udaje ve strojove citelnem formatu.'),
          React.createElement(Li, null, 'Pravo vznest namitku (cl. 21 GDPR): proti zpracovani na zaklade opravneneho zajmu.'),
          React.createElement(Li, null, 'Pravo odvolat souhlas: kdykoliv emailem, bez negativnich nasledku.'),
          React.createElement(Li, null, 'Pravo podat stiznost u UOOU: Pplk. Sochora 27, 170 00 Praha 7 | www.uoou.cz')
        ),
        React.createElement('div', { style: { padding: 16, borderRadius: 12, background: 'rgba(255,107,168,0.06)', border: '1px solid rgba(255,107,168,0.18)', marginBottom: 24 } },
          React.createElement(P, null, 'Zadosti o vykон prav zasílejte na: ' + EMAIL + '. Spravce odpovi do 30 dni.')
        ),

        React.createElement(H2, null, '7. Zabezpeceni'),
        React.createElement(Ul, null,
          React.createElement(Li, null, 'Sifrovany prenos (HTTPS / TLS).'),
          React.createElement(Li, null, 'Pristup pouze pro opravnene osoby vazane mlcenlivosti.'),
          React.createElement(Li, null, 'Pravidelne zalohy a obnova po havarii.'),
          React.createElement(Li, null, 'Zabezpecene cloudove uloziste s dvoufaktorovym overenim.')
        ),

        React.createElement(H2, null, '8. Automatizovane rozhodovani'),
        React.createElement(P, null, 'Spravce neprovadi automatizovane rozhodovani ve smyslu cl. 22 GDPR. Analytika vernostniho programu nepredstavuje profilovani ve smyslu GDPR.'),

        React.createElement(H2, null, '9. Aktualizace'),
        React.createElement(P, null, 'Tyto Zasady mohou byt prubeznе aktualizovany. Aktualni verze je vzdy dostupna na ' + WEB + '. Platnost od: ' + DATE + '.'),

        React.createElement('div', { style: { marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 12 } },
          React.createElement(Link, { href: '/obchodni-podminky', style: { fontFamily: 'Georgia,serif', fontSize: 13, color: '#FF6BA8' } }, 'Obchodni podminky →'),
          React.createElement(Link, { href: '/', style: { fontFamily: 'Georgia,serif', fontSize: 13, color: 'rgba(245,238,242,0.3)' } }, '← Zpet na hlavni stranku')
        )
      )
    ),
    React.createElement(Footer, null)
  )
}
