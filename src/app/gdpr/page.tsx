'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/ui/CustomCursor'

const COMPANY = 'Hosabut s.r.o.'
const ICO = '23338342'
const SIDLO = 'Děčínská 552/1, Střížkov (Praha 8), 180 00 Praha'
const BRAND = 'Viktória Lashes'
const WEB = 'www.viktoria-lashes.cz'
const EMAIL = 'vitkorialadikova23@gmail.com'
const TEL = '+420 720 307 007'
const DATE = '20. 5. 2026'

function BrandGraph() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: 48, padding: '32px 28px', borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,107,168,0.12)', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#FF6BA8,#D4AA70,transparent)' }} />

      <div style={{ fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 5, textTransform: 'uppercase' as const, color: 'rgba(212,170,112,0.6)', marginBottom: 24, textAlign: 'center' as const }}>
        ✦ Struktura brand identity
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap' as const }}>

        {/* Hosabut box */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{ textAlign: 'center' as const }}
        >
          <div style={{ padding: '18px 24px', borderRadius: 14, background: 'rgba(212,170,112,0.08)', border: '1px solid rgba(212,170,112,0.35)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#D4AA70,transparent)' }} />
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 8, letterSpacing: 3, textTransform: 'uppercase' as const, color: '#D4AA70', marginBottom: 8 }}>Právní subjekt</div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 300, color: 'rgba(245,238,242,0.9)', marginBottom: 4 }}>Hosabut s.r.o.</div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 10, color: 'rgba(245,238,242,0.3)', marginBottom: 2 }}>IČO: {ICO}</div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 10, color: 'rgba(245,238,242,0.25)' }}>Praha 8</div>
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 6 }}>
              {['Smlouvy', 'Fakturace', 'GDPR'].map(t => (
                <span key={t} style={{ fontFamily: 'Georgia,serif', fontSize: 8, padding: '2px 8px', borderRadius: 20, background: 'rgba(212,170,112,0.12)', color: 'rgba(212,170,112,0.7)', border: '1px solid rgba(212,170,112,0.2)' }}>{t}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Arrow + License */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', padding: '0 16px', minWidth: 120 }}
        >
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase' as const, color: 'rgba(255,107,168,0.6)', marginBottom: 6, textAlign: 'center' as const }}>Licencuje</div>
          <div style={{ position: 'relative', width: '100%', height: 20, display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, height: 1.5, background: 'linear-gradient(90deg,#D4AA70,#FF6BA8)' }} />
            <motion.div
              animate={{ x: ['0%', '80%', '0%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: '#FF6BA8', boxShadow: '0 0 8px #FF6BA8' }}
            />
            <div style={{ position: 'absolute', right: -4, width: 0, height: 0, borderLeft: '8px solid #FF6BA8', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} />
          </div>
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 8, letterSpacing: 1, color: 'rgba(255,107,168,0.5)', marginTop: 6, textAlign: 'center' as const }}>brand & obchodní<br/>zastoupení</div>
        </motion.div>

        {/* Viktoria box */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          style={{ textAlign: 'center' as const }}
        >
          <div style={{ padding: '18px 24px', borderRadius: 14, background: 'rgba(255,107,168,0.08)', border: '1px solid rgba(255,107,168,0.35)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#FF6BA8,transparent)' }} />
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 8, letterSpacing: 3, textTransform: 'uppercase' as const, color: '#FF6BA8', marginBottom: 8 }}>Obchodní značka</div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 300, color: 'rgba(245,238,242,0.9)', marginBottom: 4, textShadow: '0 0 20px rgba(255,107,168,0.3)' }}>Viktória Lashes</div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 10, color: 'rgba(245,238,242,0.3)', marginBottom: 2 }}>Luxury Beauty Studio</div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 10, color: 'rgba(245,238,242,0.25)' }}>Mladá Boleslav & okolí</div>
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 6 }}>
              {['Klientky', 'Rezervace', 'Lash Body'].map(t => (
                <span key={t} style={{ fontFamily: 'Georgia,serif', fontSize: 8, padding: '2px 8px', borderRadius: 20, background: 'rgba(255,107,168,0.12)', color: 'rgba(255,107,168,0.7)', border: '1px solid rgba(255,107,168,0.2)' }}>{t}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom row — web */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        style={{ marginTop: 20, textAlign: 'center' as const }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 20px', borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
          <span style={{ fontFamily: 'Georgia,serif', fontSize: 11, color: 'rgba(245,238,242,0.5)' }}>{WEB}</span>
          <span style={{ fontFamily: 'Georgia,serif', fontSize: 9, color: 'rgba(245,238,242,0.25)' }}>— platforma</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

function H2({ t }: { t: string }) {
  return (
    <motion.h2
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 300, color: '#C4698A', marginBottom: 12, marginTop: 32, paddingBottom: 8, borderBottom: '1px solid rgba(196,105,138,0.2)' }}
    >{t}</motion.h2>
  )
}
function P({ c }: { c: string }) {
  return <p style={{ color: 'rgba(245,238,242,0.55)', fontSize: 14, fontWeight: 300, lineHeight: 1.8, marginBottom: 10, fontFamily: 'Georgia,serif', textAlign: 'justify' as const }}>{c}</p>
}
function Li({ c }: { c: string }) {
  return (
    <li style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
      <span style={{ color: '#C4698A', flexShrink: 0 }}>✦</span>
      <span style={{ color: 'rgba(245,238,242,0.55)', fontSize: 14, fontWeight: 300, lineHeight: 1.7, fontFamily: 'Georgia,serif' }}>{c}</span>
    </li>
  )
}

export default function GdprPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#080608', paddingTop: 112, paddingBottom: 96 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ marginBottom: 40 }}>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 10, letterSpacing: 5, textTransform: 'uppercase' as const, color: '#C4698A', marginBottom: 12 }}>✦ Právní dokumenty</div>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(28px,5vw,44px)', fontWeight: 300, marginBottom: 8 }}>Zásady ochrany osobních údajů</h1>
            <p style={{ fontFamily: 'Georgia,serif', fontSize: 13, fontStyle: 'italic', color: 'rgba(245,238,242,0.35)', marginBottom: 12 }}>v souladu s nařízením (EU) 2016/679 (GDPR)</p>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 11, color: 'rgba(245,238,242,0.2)', letterSpacing: 1 }}>Správce: {COMPANY} | IČO: {ICO} | Platnost od: {DATE}</div>
            <div style={{ height: 1, marginTop: 20, background: 'linear-gradient(90deg,rgba(196,105,138,0.5),rgba(212,170,112,0.3),transparent)' }} />
          </motion.div>

          <BrandGraph />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ marginBottom: 32, padding: 20, borderRadius: 16, background: 'rgba(212,170,112,0.06)', border: '1px solid rgba(212,170,112,0.18)' }}>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#D4AA70', marginBottom: 12 }}>Totožnost správce osobních údajů</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[['Firma', COMPANY],['IČO', ICO],['Sídlo', SIDLO],['Značka', BRAND],['Email', EMAIL],['Tel', TEL]].map(([l,v]) => (
                <div key={l} style={{ fontFamily: 'Georgia,serif', fontSize: 13, color: 'rgba(245,238,242,0.6)' }}>
                  <span style={{ color: 'rgba(245,238,242,0.3)' }}>{l}: </span>{v}
                </div>
              ))}
            </div>
          </motion.div>

          <H2 t="1. Zpracovávané osobní údaje" />
          <P c="Zpracováváme: jméno, email, telefon, adresa místa služby; data rezervací a plateb; věrnostní body; zdravotní informace (se souhlasem); technická data (IP, cookies)." />

          <H2 t="2. Účely a právní základy zpracování" />
          <P c="Plnění smlouvy (čl. 6 b): správa rezervací, fakturace, reklamace. Právní povinnost (čl. 6 c): účetnictví, archivace. Oprávněný zájem (čl. 6 f): ochrana nároků, analytika. Souhlas (čl. 6 a): newsletter, Lash Body, fotografie. Souhlas lze kdykoliv odvolat." />

          <H2 t="3. Příjemci a předávání do třetích zemí" />
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: 12 }}>
            <Li c="Vercel Inc. a Supabase Inc. — cloudové úložiště (servery v EU, standardní smluvní doložky EU)." />
            <Li c="Účetní a daňoví poradci vázaní mlčenlivostí." />
            <Li c="Orgány veřejné moci na základě zákona." />
            <Li c="Poskytovatelé platebních služeb v nezbytném rozsahu." />
          </ul>

          <H2 t="4. Doba uchovávání" />
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: 12 }}>
            <Li c="Smluvní dokumentace: 10 let (zákon o účetnictví)." />
            <Li c="Zdravotní informace: do odvolání souhlasu, max. 2 roky." />
            <Li c="Věrnostní program: po dobu účasti + 1 rok." />
            <Li c="Marketing: do odvolání souhlasu." />
            <Li c="Technická data: max. 13 měsíců. Reklamace: 3 roky." />
          </ul>

          <H2 t="5. Vaše práva" />
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: 12 }}>
            <Li c="Přístup (čl. 15): informace o zpracování Vašich údajů." />
            <Li c="Oprava (čl. 16): oprava nepřesných nebo doplnění neúplných údajů." />
            <Li c="Výmaz / být zapomenut (čl. 17): při splnění zákonných podmínek." />
            <Li c="Omezení zpracování (čl. 18): při zpochybnění přesnosti dat." />
            <Li c="Přenositelnost (čl. 20): data ve strojově čitelném formátu." />
            <Li c="Námitka (čl. 21): proti zpracování na základě oprávněného zájmu." />
            <Li c="Odvolání souhlasu: kdykoliv, bez negativních následků." />
            <Li c="Stížnost u ÚOOÚ: Pplk. Sochora 27, 170 00 Praha 7 | www.uoou.cz" />
          </ul>
          <div style={{ padding: 16, borderRadius: 12, background: 'rgba(255,107,168,0.06)', border: '1px solid rgba(255,107,168,0.18)', marginBottom: 24 }}>
            <P c={"Žádosti zasílejte na: " + EMAIL + ". Správce odpoví do 30 dnů."} />
          </div>

          <H2 t="6. Zabezpečení" />
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: 12 }}>
            <Li c="Šifrovaný přenos HTTPS / TLS." />
            <Li c="Přístup pouze pro oprávněné osoby vázané mlčenlivostí." />
            <Li c="Pravidelné zálohy, dvoufaktorové ověření, cloudové úložiště." />
          </ul>

          <H2 t="7. Automatizované rozhodování a aktualizace" />
          <P c="Správce neprovádí automatizované rozhodování dle čl. 22 GDPR. Tyto Zásady mohou být aktualizovány — aktuální verze vždy na viktoria-lashes.cz. Platnost od: 20. 5. 2026." />

          <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 12 }}>
            <Link href="/obchodni-podminky" style={{ fontFamily: 'Georgia,serif', fontSize: 13, color: '#FF6BA8', textDecoration: 'none' }}>Obchodní podmínky →</Link>
            <Link href="/" style={{ fontFamily: 'Georgia,serif', fontSize: 13, color: 'rgba(245,238,242,0.3)', textDecoration: 'none' }}>← Zpět na hlavní stránku</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
