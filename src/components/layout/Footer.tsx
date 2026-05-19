// src/components/layout/Footer.tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-black-2 border-t border-glass-border">
      <div className="px-8 md:px-16 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="font-serif text-2xl font-light tracking-[6px] uppercase mb-5">
              Viktoria <span className="text-pink-neon">Lashes</span>
            </div>
            <p className="text-text-muted text-sm font-light leading-relaxed max-w-xs mb-8">
              Luxusní studio pro prodlužování řas v srdci Prahy. Kde krása setkává umění —
              každý pohled je dílem mistrů.
            </p>
            <div className="flex gap-3">
              {['IG', 'TT', 'FB', 'WA'].map(s => (
                <a
                  key={s}
                  href="#"
                  className="w-10 h-10 border border-glass-border flex items-center justify-center text-text-dim text-xs font-light tracking-wider hover:border-pink-neon hover:text-pink-neon transition-all duration-300 cursor-none"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-sans font-light tracking-[3px] uppercase text-pink-neon mb-5" style={{fontSize:'11px'}}>Služby</h4>
            <ul className="space-y-3">
              {['Klasické řasy', 'Objemové řasy', 'Mega Volume', 'Wet Look', 'Lash Lifting'].map(s => (
                <li key={s}>
                  <Link href="/sluzby" className="text-text-muted text-sm font-light hover:text-pink-soft transition-colors cursor-none">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-light tracking-[3px] uppercase text-pink-neon mb-5" style={{fontSize:'11px'}}>Studio</h4>
            <ul className="space-y-3">
              {[
                { label: 'Náš tým', href: '/#stylistky' },
                { label: 'Galerie', href: '/galerie' },
                { label: 'Rezervace', href: '/rezervace' },
                { label: 'Dárkové poukazy', href: '#' },
                { label: 'Věrnostní program', href: '#' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-text-muted text-sm font-light hover:text-pink-soft transition-colors cursor-none">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="glow-line mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-text-dim text-xs font-light tracking-wider">
          <span>© {new Date().getFullYear()} Viktoria Lashes Official. Všechna práva vyhrazena.</span>
          <span>Pařížská 18, Praha 1 · info@viktoralashes.cz · +420 777 888 999</span>
        </div>
      </div>
    </footer>
  )
}
