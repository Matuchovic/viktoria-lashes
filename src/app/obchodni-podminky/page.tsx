import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Obchodni podminky | Viktoria Lashes',
  description: 'Vseobecne obchodni podminky sluzeb Viktoria Lashes, provozovano spolecnosti Hosabut s.r.o.',
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
  return React.createElement('li', { style: { display: 'flex', gap: 10, marginBottom: 6 } },
    React.createElement('span', { style: { color: '#C4698A', flexShrink: 0 } }, '\u2726'),
    React.createElement('span', { style: { color: 'rgba(245,238,242,0.55)', fontSize: 14, fontWeight: 300, lineHeight: 1.7, fontFamily: 'Georgia,serif' } }, children)
  )
}
function Ul({ children }: { children: React.ReactNode }) {
  return React.createElement('ul', { style: { listStyle: 'none', padding: 0, marginBottom: 12 } }, children)
}

export default function ObchodniPodminkyPage() {
  return React.createElement(React.Fragment, null,
    React.createElement(Navbar, null),
    React.createElement('main', { style: { minHeight: '100vh', background: '#080608', paddingTop: 112, paddingBottom: 96 } },
      React.createElement('div', { style: { maxWidth: 760, margin: '0 auto', padding: '0 24px' } },

        React.createElement('div', { style: { marginBottom: 48 } },
          React.createElement('div', { style: { fontFamily: 'Georgia,serif', fontSize: 10, letterSpacing: 5, textTransform: 'uppercase' as const, color: '#C4698A', marginBottom: 12 } }, '\u2726 Pravni dokumenty'),
          React.createElement('h1', { style: { fontFamily: 'Georgia,serif', fontSize: 40, fontWeight: 300, marginBottom: 8 } }, 'Obchodni podminky'),
          React.createElement('div', { style: { fontFamily: 'Georgia,serif', fontSize: 11, color: 'rgba(245,238,242,0.25)', letterSpacing: 1 } }, 'Provozovatel: ' + COMPANY + ' | ICO: ' + ICO + ' | Platnost od: ' + DATE),
          React.createElement('div', { style: { height: 1, marginTop: 20, background: 'linear-gradient(90deg,rgba(196,105,138,0.5),rgba(212,170,112,0.3),transparent)' } })
        ),

        React.createElement('div', { style: { marginBottom: 32, padding: 20, borderRadius: 16, background: 'rgba(212,170,112,0.06)', border: '1px solid rgba(212,170,112,0.18)' } },
          React.createElement('div', { style: { fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#D4AA70', marginBottom: 12 } }, 'Kontaktni udaje poskytovatele'),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 } },
            ...([['Firma',COMPANY],['ICO',ICO],['Znacka',BRAND],['Web',WEB],['Email',EMAIL],['Tel',TEL]]
              .map(([l,v]) => React.createElement('div', { key: l, style: { fontFamily: 'Georgia,serif', fontSize: 13, color: 'rgba(245,238,242,0.6)' } },
                React.createElement('span', { style: { color: 'rgba(245,238,242,0.3)' } }, l + ': '), v
              )))
          )
        ),

        React.createElement(H2, null, 'Clanek I. - Zakladni ustanoveni'),
        React.createElement(P, null, '1.1  Tyto vseobecne obchodni podminky upravuji vzajemna prava a povinnosti mezi spolecnosti ' + COMPANY + ', se sidlem ' + SIDLO + ', ICO: ' + ICO + ', a zakaznikem pri poskytovani sluzeb pod znackou ' + BRAND + '.'),
        React.createElement(P, null, '1.2  Predmetem podnikani je poskytovani kosmetickych sluzeb (prodluzovani, doplnovani a uprava ras), formou vyjezdu k Zakaznikovi.'),
        React.createElement(P, null, '1.3  Uzavrenim rezervace Klient potvrzuje souhlas s temito VOP. Aktualni zneni vzdy na ' + WEB + '.'),

        React.createElement(H2, null, 'Clanek II. - Obchodni znacka'),
        React.createElement(P, null, '2.1  Znacka "' + BRAND + '" je vyhradne registrovana a provozovana spolecnosti ' + COMPANY + '. Klient neni opravnen znacku, logotyp ani vizualni identitu pouzivat bez pisemneho souhlasu.'),
        React.createElement(P, null, '2.2  Vesker obsah webu ' + WEB + ' je chranen autorskym pravem. Neopravnene uziti je zakazano.'),

        React.createElement(H2, null, 'Clanek III. - Rezervace'),
        React.createElement(P, null, '3.1  Rezervaci lze provest pres web, telefonicky (' + TEL + '), emailem (' + EMAIL + ') nebo WhatsApp.'),
        React.createElement(P, null, '3.2  Smlouva je uzavrena potvrzenim rezervace nebo uhrazenim zalohy.'),
        React.createElement(P, null, '3.3  Poskytovatel je opravnen rezervaci odmitnout bez udani duvodu.'),
        React.createElement(P, null, '3.4  Klient je povinen zajistit vhodne podminky na miste (osvetleni, hygiena, klidne prostredi).'),

        React.createElement(H2, null, 'Clanek IV. - Ceny a platby'),
        React.createElement(P, null, '4.1  Ceny sluzeb jsou uvedeny na ' + WEB + ' a plati ke dni rezervace.'),
        React.createElement(P, null, '4.2  Na sluzby nad 10 km od sidla v Mlade Boleslavi se uplatni priplatek za vyjezd.'),
        React.createElement(P, null, '4.3  Platba v hotovosti po sluzbe nebo bezhotovostne. Zalpha az 30 % splatna do 48 h od potvrzeni.'),

        React.createElement(H2, null, 'Clanek V. - Storno podminky'),
        React.createElement(Ul, null,
          React.createElement(Li, null, 'Zruseni vice nez 48 h pred terminem: bez stornopoplatku, zalpha vracena.'),
          React.createElement(Li, null, 'Zruseni 24-48 h pred terminem: stornopoplatek 50 %, zalpha se nevrace.'),
          React.createElement(Li, null, 'Zruseni mene nez 24 h nebo no-show: stornopoplatek 100 % z ceny sluzby.')
        ),
        React.createElement(P, null, 'Zruseni se provadi prokazatelne (telefon, email, WhatsApp). Poskytovatel pri nenadale prekazce nabidne nahradni termin nebo vrati zalohu do 7 pracovnich dnu.'),

        React.createElement(H2, null, 'Clanek VI. - Prava a povinnosti'),
        React.createElement(P, null, 'Poskytovatel: provadi sluzby s odbornou peci, pouziva certifikovane materialy, informuje Klienta o peci, zachovava mlcenlivost.'),
        React.createElement(P, null, 'Klient: dostavit se vcas, sdelit zdravotni stav a alergie, zajistit podminky, uhradit cenu.'),

        React.createElement(H2, null, 'Clanek VII. - Reklamace'),
        React.createElement(P, null, '7.1  Reklamaci lze uplatnit do 7 dnu od provedeni sluzby emailem s fotodokumentaci.'),
        React.createElement(P, null, '7.2  Lhuta pro vyrizeni je 30 dnu. Pri opravnene reklamaci: naprava, sleva nebo vraceni casti ceny.'),
        React.createElement(P, null, '7.3  Poskytovatel neodpovida za vady zpusobene nedodrzenim pece, zamlcenim zdravotniho stavu nebo nadmernym namahani vysledku.'),

        React.createElement(H2, null, 'Clanek VIII. - Vernostni program Lash Body'),
        React.createElement(P, null, 'Podminky programu jsou na webu. Body nemaji penezni hodnotu, jsou neprenosne. Poskytovatel muze program zmenit s predstihem.'),

        React.createElement(H2, null, 'Clanek IX. - Ochrana osobnich udaju'),
        React.createElement(P, null, 'Zpracovani osobnich udaju se ridi Zasadami GDPR dostupnymi na viktoria-lashes.cz/gdpr.'),

        React.createElement(H2, null, 'Clanek X. - Reseni sporu'),
        React.createElement(P, null, 'Strany resi spory prednostne smirnou cestou. Klient-spotrebitel muze podat navrh na mimosoudni reseni u Ceske obchodni inspekce (COI), Stepanska 567/15, Praha 2, www.coi.cz.'),
        React.createElement(P, null, 'Smluvni vztah se ridi pravem Ceske republiky (zak. c. 89/2012 Sb., OZ).'),

        React.createElement(H2, null, 'Clanek XI. - Zaverecna ustanoveni'),
        React.createElement(P, null, 'VOP jsou platne od ' + DATE + '. Neplatnost jednoho ustanoveni nema vliv na ostatni.'),

        React.createElement('div', { style: { marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 12 } },
          React.createElement(Link, { href: '/gdpr', style: { fontFamily: 'Georgia,serif', fontSize: 13, color: '#FF6BA8' } }, 'Zasady GDPR →'),
          React.createElement(Link, { href: '/', style: { fontFamily: 'Georgia,serif', fontSize: 13, color: 'rgba(245,238,242,0.3)' } }, '← Zpet na hlavni stranku')
        )
      )
    ),
    React.createElement(Footer, null)
  )
}
