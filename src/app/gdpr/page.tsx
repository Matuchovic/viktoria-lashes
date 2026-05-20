import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Zásady ochrany osobních údajů (GDPR) | Viktória Lashes',
  description: 'Informace o zpracování osobních údajů v souladu s nařízením (EU) 2016/679 (GDPR).',
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
    <div className="mb-6">
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

export default function GdprPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-28 pb-24 px-5 md:px-16">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-14">
            <div className="font-light tracking-[5px] uppercase mb-4 text-xs" style={{ color: '#C4698A' }}>✦ Právní dokumenty</div>
            <h1 className="font-serif text-4xl md:text-5xl font-light mb-3">Zásady ochrany<br/>osobních údajů</h1>
            <p className="font-light italic text-sm mb-4" style={{ color: 'rgba(245,238,242,0.4)' }}>v souladu s nařízením (EU) 2016/679 (GDPR)</p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-light" style={{ color: 'rgba(245,238,242,0.35)', letterSpacing: 1 }}>
              <span>Správce: {COMPANY}</span>
              <span>IČO: {ICO}</span>
              <span>Platnost od: {DATE}</span>
            </div>
            <div className="mt-6 h-px w-full" style={{ background: 'linear-gradient(90deg,rgba(196,105,138,0.5),rgba(212,170,112,0.3),transparent)' }} />
          </div>

          {/* Správce box */}
          <div className="mb-10 p-5 rounded-2xl" style={{ background: 'rgba(212,170,112,0.06)', border: '1px solid rgba(212,170,112,0.18)' }}>
            <div className="text-xs font-light tracking-widest uppercase mb-3" style={{ color: '#D4AA70' }}>Totožnost správce osobních údajů</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-light" style={{ color: 'rgba(245,238,242,0.6)' }}>
              <div><span style={{ color: 'rgba(245,238,242,0.3)' }}>Firma: </span>{COMPANY}</div>
              <div><span style={{ color: 'rgba(245,238,242,0.3)' }}>IČO: </span>{ICO}</div>
              <div className="md:col-span-2"><span style={{ color: 'rgba(245,238,242,0.3)' }}>Sídlo: </span>{SIDLO}</div>
              <div><span style={{ color: 'rgba(245,238,242,0.3)' }}>Značka: </span>{BRAND}</div>
              <div><span style={{ color: 'rgba(245,238,242,0.3)' }}>Web: </span>{WEB}</div>
              <div><span style={{ color: 'rgba(245,238,242,0.3)' }}>Email: </span><a href={`mailto:${EMAIL}`} style={{ color: '#FF6BA8' }}>{EMAIL}</a></div>
              <div><span style={{ color: 'rgba(245,238,242,0.3)' }}>Tel.: </span><a href={`tel:${TEL.replace(/\s/g,'')}`} style={{ color: '#FF6BA8' }}>{TEL}</a></div>
            </div>
            <P>Správce nejmenoval pověřence pro ochranu osobních údajů (DPO), neboť zpracování nesplňuje podmínky čl. 37 GDPR. Dotazy směřujte na výše uvedený email.</P>
          </div>

          <Section title="2. Jaké osobní údaje zpracováváme">
            <SubSection title="2.1 Identifikační a kontaktní údaje">
              <ul className="ml-2"><Li>jméno a příjmení, e-mailová adresa, telefonní číslo,</Li><Li>adresa místa poskytnutí Služby.</Li></ul>
            </SubSection>
            <SubSection title="2.2 Transakční a smluvní data">
              <ul className="ml-2"><Li>informace o rezervacích a objednaných Službách,</Li><Li>platební a fakturační záznamy (nikoliv čísla platebních karet),</Li><Li>věrnostní body a záznamy programu Lash Body,</Li><Li>korespondence s Klientem.</Li></ul>
            </SubSection>
            <SubSection title="2.3 Zdravotní informace (zvláštní kategorie — čl. 9 GDPR)">
              <P>Se souhlasem Klienta zpracováváme informace o zdravotním stavu relevantní pro bezpečné provedení Služby (alergie, kontraindikace). Tyto údaje zpracováváme výhradně na základě výslovného souhlasu a uchovávány jsou pouze po nezbytně nutnou dobu.</P>
            </SubSection>
            <SubSection title="2.4 Technická data">
              <ul className="ml-2"><Li>IP adresa, cookies a záznamy o přístupu na web (viz Zásady cookies).</Li></ul>
            </SubSection>
          </Section>

          <Section title="3. Účely a právní základy zpracování">
            <SubSection title="3.1 Plnění smlouvy — čl. 6 odst. 1 písm. b) GDPR">
              <ul className="ml-2"><Li>zpracování a správa rezervací, komunikace s Klientem,</Li><Li>vystavení daňových dokladů, evidence plateb,</Li><Li>řešení reklamací.</Li></ul>
            </SubSection>
            <SubSection title="3.2 Plnění právní povinnosti — čl. 6 odst. 1 písm. c) GDPR">
              <ul className="ml-2"><Li>vedení účetní evidence (zákon č. 563/1991 Sb.),</Li><Li>archivace dokumentů dle zákonných lhůt.</Li></ul>
            </SubSection>
            <SubSection title="3.3 Oprávněný zájem správce — čl. 6 odst. 1 písm. f) GDPR">
              <ul className="ml-2"><Li>ochrana právních nároků Správce,</Li><Li>anonymizovaná statistika pro zlepšování Služeb.</Li></ul>
            </SubSection>
            <SubSection title="3.4 Souhlas Klienta — čl. 6 odst. 1 písm. a) GDPR">
              <ul className="ml-2"><Li>zasílání obchodních sdělení a newsletteru,</Li><Li>věrnostní program Lash Body,</Li><Li>zpracování zdravotních informací (čl. 9 odst. 2 písm. a) GDPR),</Li><Li>publikace recenzí a fotografií na sociálních sítích.</Li></ul>
              <P>Souhlas je dobrovolný a lze jej kdykoli odvolat bez negativních následků pro Klienta.</P>
            </SubSection>
          </Section>

          <Section title="4. Příjemci osobních údajů">
            <ul className="ml-2">
              <Li>Poskytovatelé IT a cloudových služeb — <strong style={{color:'rgba(245,238,242,0.7)'}}>Vercel Inc.</strong> a <strong style={{color:'rgba(245,238,242,0.7)'}}>Supabase Inc.</strong> — zabezpečené uložení dat na serverech v EU.</Li>
              <Li>Účetní a daňoví poradci vázaní mlčenlivostí.</Li>
              <Li>Orgány veřejné moci na základě zákonné povinnosti (soudy, finanční úřad).</Li>
              <Li>Poskytovatelé platebních služeb (v nezbytném rozsahu).</Li>
            </ul>
            <P>Správce neprodává ani nesdílí osobní údaje Klientů s třetími stranami za účelem přímého marketingu bez souhlasu Klienta.</P>
          </Section>

          <Section title="5. Předávání osobních údajů do třetích zemí">
            <P>Cloudové služby (Vercel Inc., Supabase Inc.) mohou zpracovávat data mimo Evropský hospodářský prostor (EHP). Předávání probíhá na základě standardních smluvních doložek schválených Evropskou komisí dle čl. 46 odst. 2 GDPR. Na žádost poskytneme bližší informace.</P>
          </Section>

          <Section title="6. Doba uchovávání osobních údajů">
            <ul className="ml-2">
              <Li><strong style={{color:'rgba(245,238,242,0.7)'}}>Smluvní dokumentace (rezervace, faktury):</strong> 10 let (zákon o účetnictví).</Li>
              <Li><strong style={{color:'rgba(245,238,242,0.7)'}}>Zdravotní informace:</strong> do odvolání souhlasu, max. 2 roky od poslední Služby.</Li>
              <Li><strong style={{color:'rgba(245,238,242,0.7)'}}>Věrnostní program:</strong> po dobu aktivní účasti + 1 rok.</Li>
              <Li><strong style={{color:'rgba(245,238,242,0.7)'}}>Marketingová komunikace:</strong> do odvolání souhlasu.</Li>
              <Li><strong style={{color:'rgba(245,238,242,0.7)'}}>Technická data (logy, cookies):</strong> max. 13 měsíců.</Li>
              <Li><strong style={{color:'rgba(245,238,242,0.7)'}}>Reklamace:</strong> 3 roky od vyřízení.</Li>
            </ul>
            <P>Po uplynutí lhůty jsou osobní údaje bezpečně a nenávratně vymazány nebo anonymizovány.</P>
          </Section>

          <Section title="7. Vaše práva">
            <SubSection title="7.1 Právo na přístup (čl. 15 GDPR)">
              <P>Máte právo získat přístup ke svým osobním údajům a informace o způsobu jejich zpracování.</P>
            </SubSection>
            <SubSection title="7.2 Právo na opravu (čl. 16 GDPR)">
              <P>Máte právo požadovat opravu nepřesných nebo doplnění neúplných osobních údajů.</P>
            </SubSection>
            <SubSection title="7.3 Právo na výmaz — „právo být zapomenut" (čl. 17 GDPR)">
              <P>Můžete požadovat výmaz, pokud: údaje již nejsou potřebné; byl odvolán souhlas a neexistuje jiný právní základ; údaje byly zpracovány protiprávně. Právo se neuplatní, je-li zpracování nutné pro splnění právní povinnosti nebo obhajobu právních nároků.</P>
            </SubSection>
            <SubSection title="7.4 Právo na omezení zpracování (čl. 18 GDPR)">
              <P>Můžete požadovat omezení zpracování při zpochybnění přesnosti nebo po dobu prošetřování námitky.</P>
            </SubSection>
            <SubSection title="7.5 Právo na přenositelnost (čl. 20 GDPR)">
              <P>Máte právo obdržet své osobní údaje ve strukturovaném, strojově čitelném formátu.</P>
            </SubSection>
            <SubSection title="7.6 Právo vznést námitku (čl. 21 GDPR)">
              <P>Můžete vznést námitku proti zpracování na základě oprávněného zájmu. Správce zpracování ukončí, neprokáže-li závažné oprávněné důvody, které nad Vašimi zájmy převažují.</P>
            </SubSection>
            <SubSection title="7.7 Právo odvolat souhlas">
              <P>Souhlas lze kdykoli odvolat emailem na <a href={`mailto:${EMAIL}`} style={{color:'#FF6BA8'}}>{EMAIL}</a> nebo v nastavení Vašeho účtu. Odvolání nemá vliv na zákonnost předchozího zpracování.</P>
            </SubSection>
            <SubSection title="7.8 Právo podat stížnost u dozorového úřadu">
              <P>Máte právo podat stížnost u Úřadu pro ochranu osobních údajů (ÚOOÚ): Pplk. Sochora 27, 170 00 Praha 7 | www.uoou.cz | posta@uoou.cz | +420 234 665 111.</P>
            </SubSection>
            <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(255,107,168,0.06)', border: '1px solid rgba(255,107,168,0.18)' }}>
              <P>Žádosti o výkon práv zasílejte na <a href={`mailto:${EMAIL}`} style={{color:'#FF6BA8'}}>{EMAIL}</a>. Správce odpoví do 30 dnů od obdržení žádosti (lze prodloužit o 2 měsíce, o čemž budete informováni).</P>
            </div>
          </Section>

          <Section title="8. Zabezpečení osobních údajů">
            <ul className="ml-2">
              <Li>Šifrovaný přenos dat (HTTPS / TLS).</Li>
              <Li>Přístup k datům pouze pro oprávněné osoby vázané mlčenlivostí.</Li>
              <Li>Pravidelné zálohy a obnova po havárii.</Li>
              <Li>Zabezpečené cloudové úložiště s dvoufaktorovým ověřením.</Li>
            </ul>
            <P>V případě porušení zabezpečení, které by mohlo ohrozit Vaše práva, budete neprodleně informováni v souladu s čl. 34 GDPR.</P>
          </Section>

          <Section title="9. Cookies a sledovací technologie">
            <P>Webová stránka {WEB} používá soubory cookies nezbytné pro fungování webu a analytické cookies pro zlepšování uživatelského zážitku. Nastavení cookies můžete spravovat prostřednictvím Vašeho prohlížeče. Analytické cookies jsou aktivovány pouze s Vaším souhlasem.</P>
          </Section>

          <Section title="10. Automatizované rozhodování a profilování">
            <P>Správce neprovádí automatizované rozhodování ve smyslu čl. 22 GDPR. Základní analytika věrnostního programu (vyhodnocení bodů a dosažené úrovně) nepředstavuje profilování ve smyslu GDPR.</P>
          </Section>

          <Section title="11. Aktualizace těchto Zásad">
            <P>Tyto Zásady mohou být průběžně aktualizovány. Aktuální verze je vždy dostupná na {WEB}. O podstatných změnách budete informováni emailem nebo oznámením na webu.</P>
            <P>Tyto Zásady nabývají účinnosti dnem {DATE}.</P>
          </Section>

          {/* Bottom links */}
          <div className="mt-16 pt-8 border-t border-glass-border flex flex-wrap gap-4 justify-between items-center">
            <Link href="/obchodni-podminky" className="text-sm font-light hover:text-pink-soft transition-colors" style={{ color: '#FF6BA8' }}>
              Obchodní podmínky →
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
