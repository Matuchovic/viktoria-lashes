'use client'
// src/components/sections/ArtistsSection.tsx
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ARTISTS = [
  {
    name: 'Viktoria Semenova',
    titleCs: 'Zakladatelka & Master Stylistka',
    bioCs: 'S více než 8 lety zkušeností a certifikací z Paříže, Milána a Londýna. Specialistka na Mega Volume a unikátní wet look techniky. Vítězka Czech Beauty Awards 2023.',
    initial: 'V',
    stats: [{ num: '8+', label: 'Roků praxe' }, { num: '2k+', label: 'Klientek' }, { num: '12', label: 'Certifikátů' }],
    specialties: ['Mega Volume', 'Wet Look'],
  },
  {
    name: 'Aneta Dvořáčková',
    titleCs: 'Senior Lash Stylistka',
    bioCs: 'Specialistka na klasické a hybridní techniky. Absolventka London Lash Academy. Její práce se vyznačuje přesností, přirozeností a dokonalou symetrií každého setu.',
    initial: 'A',
    stats: [{ num: '5+', label: 'Roků praxe' }, { num: '1k+', label: 'Klientek' }, { num: '8', label: 'Certifikátů' }],
    specialties: ['Klasické řasy', 'Hybridní'],
  },
  {
    name: 'Kristýna Malá',
    titleCs: 'Lash & Brow Specialistka',
    bioCs: 'Expertka na lash lifting, laminaci obočí a barvení. Kombinuje smysl pro detail s moderními technikami pro komplexní péči o oční rámec pro každou klientku.',
    initial: 'K',
    stats: [{ num: '3+', label: 'Roků praxe' }, { num: '600+', label: 'Klientek' }, { num: '6', label: 'Certifikátů' }],
    specialties: ['Lash Lifting', 'Brow'],
  },
]

export function ArtistsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="stylistky" className="bg-black-3 px-8 md:px-16 py-32">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <div className="section-label mb-5">Náš tým</div>
        <h2 className="section-title mb-6">
          Mistři <em>svého řemesla</em>
        </h2>
        <p className="text-text-muted font-light leading-relaxed max-w-xl" style={{ fontSize: 16 }}>
          Každá stylistka prošla přísným výcvikem a disponuje certifikací od předních světových značek.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ARTISTS.map((a, i) => (
          <motion.div
            key={a.name}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="group glass-card p-10 text-center relative overflow-hidden"
          >
            {/* Bottom glow on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-neon to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

            {/* Avatar */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="w-full h-full rounded-full border border-glass-border flex items-center justify-center group-hover:border-pink-soft transition-colors duration-300">
                <span className="font-serif text-4xl font-light text-pink-soft">{a.initial}</span>
              </div>
              <div className="absolute inset-[-4px] rounded-full border border-pink-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <h3 className="font-serif text-2xl font-light mb-2 group-hover:text-pink-soft transition-colors duration-300">
              {a.name}
            </h3>
            <div className="font-light tracking-[2px] uppercase text-pink-neon mb-4" style={{ fontSize: 11 }}>
              {a.titleCs}
            </div>

            <div className="flex flex-wrap gap-2 justify-center mb-5">
              {a.specialties.map(s => (
                <span key={s} className="text-[10px] tracking-wider border border-glass-border px-3 py-1 text-text-dim">
                  {s}
                </span>
              ))}
            </div>

            <p className="text-text-muted text-sm font-light leading-relaxed mb-8">{a.bioCs}</p>

            <div className="flex justify-center gap-8 pt-6 border-t border-glass-border">
              {a.stats.map(s => (
                <div key={s.label}>
                  <div className="font-serif text-3xl font-light text-pink-soft">{s.num}</div>
                  <div className="text-text-dim font-light tracking-[2px] uppercase mt-1" style={{ fontSize: 10 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
