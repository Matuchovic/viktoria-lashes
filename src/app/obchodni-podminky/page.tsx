import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Obchodní podmínky | Viktória Lashes',
  description: 'Všeobecné obchodní podmínky služeb Viktória Lashes, provozováno společností Hosabut s.r.o.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-serif text-xl md:text-2xl font-light mb-4" style={{ color: '#C4698A', borderBottom: '1px solid rgba(196,105,138,0.2)', paddingBottom: 12 }}>
        {title}
      </h2>
      {children}
    </div>
  )
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-text-muted font-light leading-relaxed text-sm mb-3" style={{ textAlign: 'justify' }}>{children}</p>
}
function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 mb-2">
      <span style={{ color: '#C4698A', flexShrink: 0, marginTop: 1 }}>✦</span>
      <span className="text-text-muted font-light text-sm leading-relaxed">{children}</span>
    </li>
  )
}
function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="font-serif text-base font-light mb-3" style={{ color: 'rgba(245,238,242,0.7)' }}>{title}</h3>
      {children}
    </div>
  )
}

const BRAND = 'Viktória Lashes'
const COMPANY = 'Hosabut s.r.o.'
const ICO = '23338342'
const SIDLO = 'Děčínská 552/1, Střížkov (Praha 8), 180 00 Praha'
const WEB = 'www.viktoria-lashes.cz'
const EMAIL = 'vitkorialadikova23@gmail.com'
const TEL = '+420 720 307 007'
const DATE = '20. 5. 2026'

export default function ObchodniPodminkyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-28 pb-24 px-5 md:px-16">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-14">
            <div className="font-light tracking-[5px] uppercase mb-4 text-xs" style={{ color: '#C4698A' }}>✦ Právní dokumenty</div>
            <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">Obchodní podmínky</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-light" style={{ color: 'rgba(245,238,242,0.35)', letterSpacing: 1 }}>
              <span>Provozovatel: {COMPANY}</span>
              <span>IČO: {ICO}</span>
              <span>Platnost od: {DATE}</span>
            </div>
            <div className="mt-6 h-px w-full" style={{ background: 'linear-gradient(90deg,rgba(196,105,138,0.5),rgba(212,170,112,0.3),transparent)' }} />
          </div>

          {/* Info box */}
          <div className="mb-10 p-5 rounded-2xl" style={{ background: 'rgba(212,170,112,0.06)', border: '1px solid rgba(212,170,112,0.18)' }}>
            <div className="text-xs font-light tracking-widest uppercase mb-2" style={{ color: '#D4AA70' }}>Kontaktní údaje poskytovatele</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-light" style={{ color: 'rgba(245,238,242,0.6)' }}>
              <div><span style={{ color: 'rgba(245,238,242,0.3)' }}>Firma: </span>{COMPANY}</div>
              <div><span style={{ color: 'rgba(245,238,242,0.3)' }}>IČO: </span>{ICO}</div>
              <div><span style={{ color: 'rgba(245,238,242,0.3)' }}>Sídlo: </span>{SIDLO}</div>
              <div><span style={{ color: 'rgba(245,238,242,0.3)' }}>Značka: </span>{BRAND}</div>
              <div><span style={{ color: 'rgba(245,238,242,0.3)' }}>Email: </span><a href={`mailto:${EMAIL}`} style={{ color: '#FF6BA8' }}>{EMAIL}</a></div>
              <div><span style={{ color: 'rgba(245,238,242,0.3)' }}>Tel.: </span><a href={`tel:${TEL.replace(/\s/g,'')}`} style={{ color: '#FF6BA8' }}>{TEL}</a></div>
            </div>
          </div>

          <Section title="Článek I. — Základní ustanovení">
            <P>1.1  Tyto všeobecné obchodní podmínky (dále jen „VOP") upravují vzájemná práva a povinnosti mezi společností {COMPANY}, se sídlem {SIDLO}, IČO: {ICO}, zapsanou v obchodním rejstříku vedeném Městským soudem v Praze (dále jen „Poskytovatel"), a zákazníkem (dále jen „Klient") při poskytování služeb pod obchodní značkou {BRAND}.</P>
            <P>1.2  Předmětem podnikání Poskytovatele je poskytování kosmetických služeb zaměřených na prodlužování, doplňování a úpravu řas (dále jen „Služby"), a to formou výjezdů Poskytovatele na adresu Klienta nebo jiné předem dohodnuté místo.</P>
            <P>1.3  Klientem se rozumí fyzická osoba způsobilá k právním úkonům, popřípadě osoba starší 15 let se souhlasem zákonného zástupce.</P>
            <P>1.4  Uzavřením rezervace Klient potvrzuje, že se s VOP seznámil, porozuměl jim a bez výhrad s nimi souhlasí. Tyto VOP jsou nedílnou součástí smluvního vztahu.</P>
            <P>1.5  Poskytovatel je oprávněn VOP jednostranně měnit; aktuální znění je vždy dostupné na {WEB}. Změna VOP se nedotýká práv vzniklých za předchozího znění.</P>
          </Section>

          <Section title="Článek II. — Obchodní značka a duševní vlastnictví">
            <P>2.1  Obchodní značka „{BRAND}" je výhradně registrována a provozována společností {COMPANY}. Klient není oprávněn tuto značku, logotyp, vizuální identitu ani jiné prvky duševního vlastnictví Poskytovatele jakkoliv využívat bez předchozího písemného souhlasu Poskytovatele.</P>
            <P>2.2  Veškerý obsah webové prezentace na adrese {WEB}, včetně fotografií, textů, grafiky a zdrojového kódu, je chráněn autorským právem. Jakékoliv neoprávněné užití je zakázáno.</P>
          </Section>

          <Section title="Článek III. — Rezervace a uzavření smlouvy">
            <P>3.1  Klient může provést rezervaci Služby prostřednictvím:</P>
            <ul className="mb-4 ml-2"><Li>rezervačního formuláře na {WEB},</Li><Li>telefonicky na {TEL},</Li><Li>emailem na {EMAIL},</Li><Li>WhatsApp na výše uvedeném čísle.</Li></ul>
            <P>3.2  Smlouva o poskytnutí Služby je uzavřena okamžikem potvrzení rezervace Poskytovatelem nebo uhrazením zálohy.</P>
            <P>3.3  Poskytovatel je oprávněn rezervaci odmítnout bez udání důvodu, zejména při nedostatečné kapacitě, zdravotní kontraindikaci nebo předchozím porušení povinností Klienta.</P>
            <P>3.4  Klient je povinen uvést pravdivé kontaktní údaje a zajistit vhodné podmínky pro výkon Služby na místě jejího provádění (osvětlení, hygiena, klidné prostředí).</P>
          </Section>

          <Section title="Článek IV. — Ceny a platební podmínky">
            <P>4.1  Ceny Služeb jsou uvedeny na {WEB} a jsou platné ke dni provedení rezervace.</P>
            <P>4.2  Ceny jsou v Kč a zahrnují DPH v zákonné výši (je-li Poskytovatel plátcem DPH).</P>
            <P>4.3  Na Služby prováděné mimo oblast do 10 km od sídla Poskytovatele v Mladé Boleslavi se uplatňuje příplatek za výjezd dle aktuálního ceníku zveřejněného na webu.</P>
            <P>4.4  Platba probíhá v hotovosti po provedení Služby nebo bezhotovostně na bankovní účet Poskytovatele.</P>
            <P>4.5  Poskytovatel může požadovat zálohu až 30 % z ceny Služby, splatnou do 48 hodin od potvrzení rezervace. Neuhrazením zálohy je Poskytovatel oprávněn rezervaci zrušit.</P>
            <P>4.6  V případě prodlení s úhradou je Poskytovatel oprávněn požadovat zákonný úrok z prodlení.</P>
          </Section>

          <Section title="Článek V. — Storno podmínky">
            <ul className="mb-4 ml-2">
              <Li><strong style={{color:'rgba(245,238,242,0.8)'}}>Zrušení více než 48 h před termínem:</strong> bez stornopoplatku, záloha vrácena v plné výši.</Li>
              <Li><strong style={{color:'rgba(245,238,242,0.8)'}}>Zrušení 24–48 h před termínem:</strong> stornopoplatek 50 % z ceny Služby, záloha se nevrací.</Li>
              <Li><strong style={{color:'rgba(245,238,242,0.8)'}}>Zrušení méně než 24 h nebo nedostavení se (no-show):</strong> stornopoplatek 100 % z ceny Služby.</Li>
            </ul>
            <P>5.2  Zrušení rezervace se provádí prokazatelnou formou (telefon, email, WhatsApp).</P>
            <P>5.3  Poskytovatel může zrušit rezervaci při nenadálé překážce (nemoc, vyšší moc) — Klientovi je nabídnut náhradní termín nebo vrácena záloha do 7 pracovních dnů.</P>
          </Section>

          <Section title="Článek VI. — Práva a povinnosti smluvních stran">
            <SubSection title="Povinnosti Poskytovatele:">
              <ul className="ml-2"><Li>Provádět Služby s odbornou péčí a v souladu s hygienickými standardy.</Li><Li>Používat certifikované materiály vhodné pro typ Klienta.</Li><Li>Informovat Klienta o průběhu a péči po Službě.</Li><Li>Zachovávat mlčenlivost o osobních údajích Klienta.</Li></ul>
            </SubSection>
            <SubSection title="Povinnosti Klienta:">
              <ul className="ml-2"><Li>Dostavit se včas nebo Poskytovatele o prodlení informovat.</Li><Li>Předem sdělit zdravotní stav, alergie a kontraindikace.</Li><Li>Zajistit vhodné podmínky na místě Služby.</Li><Li>Uhradit cenu dle platebních podmínek.</Li></ul>
            </SubSection>
          </Section>

          <Section title="Článek VII. — Reklamace a odpovědnost za vady">
            <P>7.1  Klient je oprávněn reklamovat Službu do 7 dnů od jejího provedení, prokazatelnou formou s fotodokumentací zaslanou na {EMAIL}.</P>
            <P>7.2  Lhůta pro vyřízení reklamace je 30 dnů. Uzná-li Poskytovatel reklamaci, nabídne nápravu, slevu nebo vrácení části ceny.</P>
            <P>7.3  Poskytovatel neodpovídá za vady vzniklé nedodržením péče, zamlčením zdravotního stavu nebo nadměrným mechanickým namáháním výsledku Služby.</P>
            <P>7.4  Celková odpovědnost za škodu je omezena na výši ceny příslušné Služby.</P>
          </Section>

          <Section title="Článek VIII. — Věrnostní program Lash Body">
            <P>8.1  Podmínky věrnostního programu „Lash Body" jsou dostupné na webu Poskytovatele.</P>
            <P>8.2  Věrnostní body nemají peněžní hodnotu a jsou nepřenosné. Poskytovatel může program kdykoli změnit nebo ukončit s předchozím oznámením.</P>
          </Section>

          <Section title="Článek IX. — Ochrana osobních údajů">
            <P>9.1  Zpracování osobních údajů Klienta se řídí Zásadami ochrany osobních údajů (GDPR) dostupnými na adrese <Link href="/gdpr" style={{color:'#FF6BA8'}}>viktoria-lashes.cz/gdpr</Link>. Tyto Zásady jsou nedílnou součástí smluvního vztahu.</P>
          </Section>

          <Section title="Článek X. — Rozhodné právo a řešení sporů">
            <P>10.1  Strany se dohodly na primárním řešení sporů smírnou cestou.</P>
            <P>10.2  Klient-spotřebitel je oprávněn podat návrh na mimosoudní řešení sporu České obchodní inspekci (ČOI), Štěpánská 567/15, 120 00 Praha 2, www.coi.cz.</P>
            <P>10.3  Smluvní vztah se řídí právním řádem České republiky, zejm. zákonem č. 89/2012 Sb., občanský zákoník.</P>
          </Section>

          <Section title="Článek XI. — Závěrečná ustanovení">
            <P>11.1  VOP jsou platné od {DATE} a nahrazují veškerá předchozí ujednání.</P>
            <P>11.2  Neplatnost jednoho ustanovení nemá vliv na platnost ostatních.</P>
            <P>11.3  VOP jsou vyhotoveny v českém jazyce; v případě sporu o výklad je rozhodující české znění.</P>
          </Section>

          {/* Bottom links */}
          <div className="mt-16 pt-8 border-t border-glass-border flex flex-wrap gap-4 justify-between items-center">
            <Link href="/gdpr" className="text-sm font-light hover:text-pink-soft transition-colors" style={{ color: '#FF6BA8' }}>
              Zásady ochrany osobních údajů →
            </Link>
            <Link href="/" className="text-sm font-light text-text-dim hover:text-text-muted transition-colors">
              ← Zpět na hlavní stránku
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
