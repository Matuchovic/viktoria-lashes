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
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}
      style={{ marginBottom: 48, padding: '32px 28px', borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,107,168,0.12)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#FF6BA8,#D4AA70,transparent)' }} />
      <div style={{ fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 5, textTransform: 'uppercase' as const, color: 'rgba(212,170,112,0.6)', marginBottom: 24, textAlign: 'center' as const }}>✦ Struktura brand identity</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap' as const }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <div style={{ padding: '18px 24px', borderRadius: 14, background: 'rgba(212,170,112,0.08)', border: '1px solid rgba(212,170,112,0.35)', position: 'relative', textAlign: 'center' as const }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#D4AA70,transparent)' }} />
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 8, letterSpacing: 3, textTransform: 'uppercase' as const, color: '#D4AA70', marginBottom: 8 }}>Právní subjekt</div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 300, color: 'rgba(245,238,242,0.9)', marginBottom: 4 }}>Hosabut s.r.o.</div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 10, color: 'rgba(245,238,242,0.3)', marginBottom: 2 }}>IČO: {ICO}</div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 10, color: 'rgba(245,238,242,0.25)' }}>Praha 8</div>
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 6 }}>
              {['Smlouvy', 'Fakturace', 'GDPR'].map(t => <span key={t} style={{ fontFamily: 'Georgia,serif', fontSize: 8, padding: '2px 8px', borderRadius: 20, background: 'rgba(212,170,112,0.12)', color: 'rgba(212,170,112,0.7)', border: '1px solid rgba(212,170,112,0.2)' }}>{t}</span>)}
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', padding: '0 16px', minWidth: 120 }}>
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase' as const, color: 'rgba(255,107,168,0.6)', marginBottom: 6, textAlign: 'center' as const }}>Licencuje</div>
          <div style={{ position: 'relative', width: '100%', height: 20, display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, height: 1.5, background: 'linear-gradient(90deg,#D4AA70,#FF6BA8)' }} />
            <motion.div animate={{ x: ['0%', '80%', '0%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: '#FF6BA8', boxShadow: '0 0 8px #FF6BA8' }} />
            <div style={{ position: 'absolute', right: -4, width: 0, height: 0, borderLeft: '8px solid #FF6BA8', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} />
          </div>
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 8, color: 'rgba(255,107,168,0.5)', marginTop: 6, textAlign: 'center' as const }}>brand & obchodní<br/>zastoupení</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <div style={{ padding: '18px 24px', borderRadius: 14, background: 'rgba(255,107,168,0.08)', border: '1px solid rgba(255,107,168,0.35)', position: 'relative', textAlign: 'center' as const }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#FF6BA8,transparent)' }} />
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 8, letterSpacing: 3, textTransform: 'uppercase' as const, color: '#FF6BA8', marginBottom: 8 }}>Obchodní značka</div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 300, color: 'rgba(245,238,242,0.9)', marginBottom: 4, textShadow: '0 0 20px rgba(255,107,168,0.3)' }}>Viktória Lashes</div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 10, color: 'rgba(245,238,242,0.3)', marginBottom: 2 }}>Luxury Beauty Studio</div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 10, color: 'rgba(245,238,242,0.25)' }}>Mladá Boleslav & okolí</div>
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 6 }}>
              {['Klientky', 'Rezervace', 'Lash Body'].map(t => <span key={t} style={{ fontFamily: 'Georgia,serif', fontSize: 8, padding: '2px 8px', borderRadius: 20, background: 'rgba(255,107,168,0.12)', color: 'rgba(255,107,168,0.7)', border: '1px solid rgba(255,107,168,0.2)' }}>{t}</span>)}
            </div>
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} style={{ marginTop: 20, textAlign: 'center' as const }}>
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
  return <motion.h2 initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
    style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 300, color: '#C4698A', marginBottom: 12, marginTop: 32, paddingBottom: 8, borderBottom: '1px solid rgba(196,105,138,0.2)' }}>{t}</motion.h2>
}
function P({ c }: { c: string }) {
  return <p style={{ color: 'rgba(245,238,242,0.55)', fontSize: 14, fontWeight: 300, lineHeight: 1.8, marginBottom: 10, fontFamily: 'Georgia,serif', textAlign: 'justify' as const }}>{c}</p>
}
function Li({ c }: { c: string }) {
  return <li style={{ display: 'flex', gap: 10, marginBottom: 6 }}><span style={{ color: '#C4698A', flexShrink: 0 }}>✦</span><span style={{ color: 'rgba(245,238,242,0.55)', fontSize: 14, fontWeight: 300, lineHeight: 1.7, fontFamily: 'Georgia,serif' }}>{c}</span></li>
}

export default function ObchodniPodminkyPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#080608', paddingTop: 112, paddingBottom: 96 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ marginBottom: 40 }}>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 10, letterSpacing: 5, textTransform: 'uppercase' as const, color: '#C4698A', marginBottom: 12 }}>✦ Právní dokumenty</div>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(28px,5vw,44px)', fontWeight: 300, marginBottom: 8 }}>Obchodní podmínky</h1>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 11, color: 'rgba(245,238,242,0.2)', letterSpacing: 1 }}>Provozovatel: {COMPANY} | IČO: {ICO} | Platnost od: {DATE}</div>
            <div style={{ height: 1, marginTop: 20, background: 'linear-gradient(90deg,rgba(196,105,138,0.5),rgba(212,170,112,0.3),transparent)' }} />
          </motion.div>
          <BrandGraph />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ marginBottom: 32, padding: 20, borderRadius: 16, background: 'rgba(212,170,112,0.06)', border: '1px solid rgba(212,170,112,0.18)' }}>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 9, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#D4AA70', marginBottom: 12 }}>Kontaktní údaje poskytovatele</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[['Firma',COMPANY],['IČO',ICO],['Sídlo',SIDLO],['Značka',BRAND],['Email',EMAIL],['Tel',TEL]].map(([l,v]) => (
                <div key={l} style={{ fontFamily: 'Georgia,serif', fontSize: 13, color: 'rgba(245,238,242,0.6)' }}>
                  <span style={{ color: 'rgba(245,238,242,0.3)' }}>{l}: </span>{v}
                </div>
              ))}
            </div>
          </motion.div>

          <H2 t="Čl. I. — Základní ustanovení" />
          <P c={"1.1  VOP upravují vztahy mezi " + COMPANY + " (" + SIDLO + ", IČO: " + ICO + ") a Klientem při poskytování služeb pod značkou " + BRAND + "."} />
          <P c="1.2  Předmětem je poskytování kosmetických služeb (prodlužování, doplňování, úprava řas) formou výjezdů k Zákazníkovi." />
          <P c={"1.3  Uzavřením rezervace Klient potvrzuje souhlas s VOP. Aktuální znění vždy na " + WEB + "."} />

          <H2 t="Čl. II. — Obchodní značka" />
          <P c={"Značka \"" + BRAND + "\" je výhradně registrována a provozována " + COMPANY + ". Klient není oprávněn ji využívat bez písemného souhlasu. Veškerý obsah webu je chráněn autorským právem."} />

          <H2 t="Čl. III. — Rezervace" />
          <P c={"Rezervaci lze provést přes web, telefonicky (" + TEL + "), emailem (" + EMAIL + ") nebo WhatsApp. Smlouva vzniká potvrzením rezervace nebo uhrazením zálohy."} />
          <P c="Klient je povinen zajistit vhodné podmínky na místě služby (osvětlení, hygiena, klidné prostředí)." />

          <H2 t="Čl. IV. — Ceny a platby" />
          <P c={"Ceny jsou na " + WEB + ", platné ke dni rezervace. Nad 10 km od Mladé Boleslavi se uplatňuje příplatek za výjezd. Záloha až 30 % splatná do 48 h od potvrzení."} />

          <H2 t="Čl. V. — Storno podmínky" />
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: 12 }}>
            <Li c="Zrušení více než 48 h předem: bez poplatku, záloha vrácena." />
            <Li c="Zrušení 24–48 h předem: stornopoplatek 50 %, záloha se nevrací." />
            <Li c="Zrušení méně než 24 h nebo no-show: stornopoplatek 100 % z ceny." />
          </ul>

          <H2 t="Čl. VI. — Práva a povinnosti" />
          <P c="Poskytovatel: odborná péče, certifikované materiály, informace o péči po službě, mlčenlivost." />
          <P c="Klient: včasný příchod, sdělení zdravotního stavu a alergií, zajištění podmínek, úhrada ceny." />

          <H2 t="Čl. VII. — Reklamace" />
          <P c={"Reklamaci uplatněte do 7 dnů s fotodokumentací na " + EMAIL + ". Lhůta pro vyřízení: 30 dnů. Poskytovatel neodpovídá za vady vzniklé nedodržením péče nebo zamlčením zdravotního stavu."} />

          <H2 t="Čl. VIII. — Věrnostní program Lash Body" />
          <P c="Body nemají peněžní hodnotu a jsou nepřenosné. Podmínky programu jsou na webu. Poskytovatel může program změnit s předchozím oznámením." />

          <H2 t="Čl. IX. — Ochrana osobních údajů" />
          <P c="Zpracování osobních údajů se řídí Zásadami GDPR dostupnými na viktoria-lashes.cz/gdpr." />

          <H2 t="Čl. X. — Rozhodné právo a spory" />
          <P c="Strany řeší spory přednostně smírnou cestou. Klient-spotřebitel může podat návrh u ČOI (www.coi.cz). Vztah se řídí právem ČR (OZ č. 89/2012 Sb.)." />

          <H2 t="Čl. XI. — Závěrečná ustanovení" />
          <P c={"VOP platí od " + DATE + ". Neplatnost jednoho ustanovení neovlivní ostatní."} />

          <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 12 }}>
            <Link href="/gdpr" style={{ fontFamily: 'Georgia,serif', fontSize: 13, color: '#FF6BA8', textDecoration: 'none' }}>Zásady GDPR →</Link>
            <Link href="/" style={{ fontFamily: 'Georgia,serif', fontSize: 13, color: 'rgba(245,238,242,0.3)', textDecoration: 'none' }}>← Zpět na hlavní stránku</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
