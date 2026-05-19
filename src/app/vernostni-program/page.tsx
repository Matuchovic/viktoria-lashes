'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { TIER_INFO, REWARDS, LASH_PASS_CHALLENGES } from '@/lib/loyalty'

const TIERS = [
  { key:'BEGINNER', pts:'0 – 999', perks:['5 % sleva na doplnění','Uvítací tipy od Viktórie','250 bodů za registraci'] },
  { key:'LOVER',    pts:'1 000 – 2 999', perks:['10 % sleva na doplnění','Prioritní termíny','Narozeninová sleva'] },
  { key:'QUEEN',    pts:'3 000 – 5 999', perks:['15 % sleva na vše','Early access novinky','Kvartální dáreček'] },
  { key:'ELITE',    pts:'6 000 +', perks:['20 % sleva na vše','VIP termíny 24/7','Přímá linka na Viktórii','Dárek každé 3 měsíce'] },
]

const BONUSES = [
  { icon:'🎂', label:'Narozeninový měsíc', desc:'2× body celý narozeninový měsíc' },
  { icon:'👯', label:'Přiveď kamarádku',   desc:'Obě dostanete 500 bodů navíc' },
  { icon:'🔥', label:'Věrná zákaznice',    desc:'3 návštěvy po sobě = bonus 300 bodů' },
  { icon:'💝', label:'Valentýn & Vánoce', desc:'Speciální sezónní výzvy s bonusy' },
]

export default function LoyaltyPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen bg-black pt-28 pb-24 px-8 md:px-16">
        <div className="max-w-5xl mx-auto">

          {/* Hero */}
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}} className="mb-20 text-center">
            <div className="section-label mb-4">✦ Věrnostní program</div>
            <h1 className="font-serif text-6xl md:text-8xl font-light mb-6">
              Lash <em className="not-italic" style={{background:'linear-gradient(135deg,#E8A4BE,#FF6BA8,#D4AA70)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',filter:'drop-shadow(0 0 25px rgba(255,107,168,0.5))'}}>Body</em>
            </h1>
            <p className="text-text-muted font-light text-lg max-w-xl mx-auto leading-relaxed">
              Za každou návštěvu sbíráte body a odemykáte exkluzivní výhody. Čím více Vás milujeme, tím více Vás odměníme.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <Link href="/register" className="btn-primary border-none">Začít sbírat body →</Link>
              <Link href="/login" className="btn-ghost">Přihlásit se</Link>
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="mb-20">
            <div className="section-label mb-4">Jak to funguje</div>
            <div className="grid grid-cols-3 gap-6">
              {[
                {num:'01', icon:'💳', label:'Zaregistrujte se', desc:'Ihned získáte 250 Lash Body uvítací bonus'},
                {num:'02', icon:'✨', label:'Navštivte studio', desc:'1 Kč = 1 Lash Body za každou návštěvu'},
                {num:'03', icon:'🎁', label:'Uplatněte odměny', desc:'Vyměňte body za slevy a dárky'},
              ].map((s,i) => (
                <motion.div key={s.num} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3+i*0.1}}
                  className="glass-card p-8 text-center relative overflow-hidden group hover:border-pink-deep/40 transition-all duration-300"
                  style={{cursor:'none'}}>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-neon to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                  <div className="font-serif text-5xl font-light text-pink-neon/10 absolute top-4 right-6">{s.num}</div>
                  <div className="text-4xl mb-4">{s.icon}</div>
                  <div className="font-serif text-lg font-light mb-2">{s.label}</div>
                  <div className="text-text-muted font-light text-sm">{s.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tiers */}
          <div className="section-label mb-4">Úrovně</div>
          <h2 className="section-title mb-10">Lash Tiers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {TIERS.map((t,i) => {
              const info = TIER_INFO[t.key as keyof typeof TIER_INFO]
              const isElite = t.key === 'ELITE'
              return (
                <motion.div key={t.key} initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.1+i*0.1}}
                  className="relative overflow-hidden rounded-2xl p-6 border group transition-all duration-300"
                  style={{
                    background: isElite ? '#12060e' : 'rgba(255,255,255,0.03)',
                    borderColor: isElite ? '#8B506A' : 'rgba(255,107,168,0.15)',
                    cursor:'none',
                  }}
                  whileHover={{y:-6, boxShadow:`0 20px 50px ${info.color}25`}}>
                  <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{background:`linear-gradient(90deg,transparent,${info.color},transparent)`}}/>
                  {isElite && <div className="absolute top-3 right-3 text-[9px] tracking-[2px] uppercase font-medium px-2.5 py-1 rounded-full" style={{background:'#D4AA70',color:'#1a0800'}}>VIP</div>}
                  <div className="text-3xl mb-3">{info.icon}</div>
                  <div className="font-serif text-lg font-light mb-1" style={{color: isElite ? '#F0C8D8' : 'rgba(245,238,242,0.9)'}}>{info.label}</div>
                  <div className="font-light tracking-[2px] uppercase mb-4 text-[10px]" style={{color: isElite ? '#D4AA70' : 'rgba(245,238,242,0.35)'}}>{t.pts} bodů</div>
                  <div className="w-full h-px mb-4" style={{background: isElite ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.06)'}}/>
                  {t.perks.map(p => (
                    <div key={p} className="flex items-start gap-2 mb-2">
                      <span className="mt-0.5 text-xs" style={{color:info.color}}>✦</span>
                      <span className="font-light text-xs leading-relaxed" style={{color: isElite ? 'rgba(240,200,216,0.75)' : 'rgba(245,238,242,0.6)'}}>{p}</span>
                    </div>
                  ))}
                </motion.div>
              )
            })}
          </div>

          {/* Rewards */}
          <div className="section-label mb-4">Obchod s odměnami</div>
          <h2 className="section-title mb-10">Utraťte Lash Body</h2>
          <div className="grid grid-cols-5 gap-4 mb-20">
            {REWARDS.map((r,i) => (
              <motion.div key={r.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                className="glass-card p-5 text-center group hover:border-pink-deep/50 transition-all duration-300 relative overflow-hidden"
                style={{cursor:'none'}}
                whileHover={{y:-4, boxShadow:'0 12px 40px rgba(255,107,168,0.15)'}}>
                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity" style={{background:'linear-gradient(90deg,transparent,#FF6BA8,transparent)'}}/>
                <div className="inline-block mb-3 px-3 py-1 rounded-full text-[10px] font-medium tracking-wider" style={{background:'rgba(196,105,138,0.12)',border:'1px solid rgba(196,105,138,0.25)',color:'#C4698A'}}>
                  {r.points.toLocaleString('cs-CZ')} Lb
                </div>
                <div className="text-2xl mb-2">🎁</div>
                <div className="font-serif font-light text-sm mb-1">{r.label}</div>
                <div className="text-text-dim font-light text-xs">hodnota {r.valueKc} Kč</div>
              </motion.div>
            ))}
          </div>

          {/* Lash Pass */}
          <div className="section-label mb-4">Sezónní výzva</div>
          <h2 className="section-title mb-8">Lash Pass — Jaro 2026</h2>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
            className="rounded-3xl overflow-hidden mb-20 relative"
            style={{background:'#0d0608',border:'1px solid #7a4060'}}>
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{background:'linear-gradient(90deg,transparent,#FF6BA8,#D4AA70,#FF6BA8,transparent)'}}/>
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <div className="font-light tracking-[4px] uppercase mb-2 text-[10px]" style={{color:'#D4AA70'}}>✦ Sezóna aktivní</div>
                <div className="font-serif text-2xl font-light text-white">Jarní Lash Pass</div>
              </div>
              <div className="px-4 py-2 rounded-full text-[10px] tracking-[2px] uppercase" style={{background:'rgba(212,170,112,0.1)',border:'1px solid rgba(212,170,112,0.3)',color:'#D4AA70'}}>Jaro 2026</div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-2 gap-3 mb-6">
                {LASH_PASS_CHALLENGES.map((c,i) => (
                  <div key={c.id} className="flex items-center gap-3 rounded-2xl p-4 transition-all duration-200"
                    style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{border:'1.5px solid rgba(255,255,255,0.15)',color:'#C4698A',fontSize:14}}>✓</div>
                    <div>
                      <div className="font-light text-sm" style={{color:'rgba(245,235,240,0.85)'}}>{c.label}</div>
                      <div className="font-medium text-[11px] mt-0.5" style={{color:'#D4AA70'}}>+{c.points} Lash Body</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl p-5 flex items-center gap-5" style={{background:'rgba(212,170,112,0.07)',border:'1px solid rgba(212,170,112,0.2)'}}>
                <span className="text-3xl">🏆</span>
                <div>
                  <div className="font-light tracking-[3px] uppercase mb-1 text-[9px]" style={{color:'#D4AA70'}}>Sezónní odměna za splnění</div>
                  <div className="font-serif text-lg font-light text-white">Exkluzivní sleva 25 % + dáreček od Viktórie</div>
                  <div className="font-light text-xs mt-1" style={{color:'rgba(255,255,255,0.35)'}}>Splňte všechny výzvy do 30. 6. 2026</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bonuses */}
          <div className="section-label mb-4">Bonusové akce</div>
          <h2 className="section-title mb-8">Dvojité body & speciální akce</h2>
          <div className="grid grid-cols-4 gap-4 mb-20">
            {BONUSES.map((b,i) => (
              <motion.div key={b.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                className="glass-card p-6 text-center group hover:border-pink-deep/40 transition-all duration-300 relative overflow-hidden"
                style={{cursor:'none'}}
                whileHover={{y:-4,boxShadow:'0 10px 35px rgba(196,105,138,0.12)'}}>
                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity" style={{background:'linear-gradient(90deg,transparent,#C4698A,transparent)'}}/>
                <div className="text-3xl mb-3">{b.icon}</div>
                <div className="font-serif font-light text-base mb-2">{b.label}</div>
                <div className="text-text-muted font-light text-xs leading-relaxed">{b.desc}</div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
            className="glass-card p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#FF6BA8,#D4AA70,transparent)'}}/>
            <div className="font-light tracking-[4px] uppercase mb-4 text-[10px]" style={{color:'#D4AA70'}}>✦ Začněte dnes</div>
            <h3 className="font-serif text-4xl font-light mb-4">Získejte 250 bodů zdarma</h3>
            <p className="text-text-muted font-light mb-8 max-w-md mx-auto">Zaregistrujte se a ihned dostanete uvítací bonus. Každá návštěva Vás posouvá blíže k exkluzivním odměnám.</p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/register" className="btn-primary border-none">Registrovat se zdarma →</Link>
              <Link href="/rezervace" className="btn-ghost">Rezervovat termín</Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
