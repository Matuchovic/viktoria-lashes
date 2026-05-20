// src/components/layout/Footer.tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-black-2 border-t border-glass-border">
      <div className="px-8 md:px-16 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="font-serif text-2xl font-light tracking-[6px] uppercase mb-5">
              Viktória <span className="text-pink-neon">Lashes</span>
            </div>
            <p className="text-text-muted text-sm font-light leading-relaxed max-w-xs mb-8">
              Prémiové studio pro prodlužování řas. Přijedu přímo k Vám domů —
              Mladá Boleslav a okolí.
            </p>
            <div className="flex gap-3">
              {['IG','TT','FB','WA'].map(s=>(
                <a key={s} href="#" className="w-10 h-10 border border-glass-border flex items-center justify-center text-text-dim text-xs font-light tracking-wider hover:border-pink-neon hover:text-pink-neon transition-all duration-300 cursor-none">{s}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-sans font-light tracking-[3px] uppercase text-pink-neon mb-5" style={{fontSize:'11px'}}>Služby</h4>
            <ul className="space-y-3">
              {['Klasické řasy','Objemové řasy','Mega Volume','Wet Look','Doplnění řas'].map(s=>(
                <li key={s}><Link href="/sluzby" className="text-text-muted text-sm font-light hover:text-pink-soft transition-colors cursor-none">{s}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-sans font-light tracking-[3px] uppercase text-pink-neon mb-5" style={{fontSize:'11px'}}>Info</h4>
            <ul className="space-y-3">
              {[{label:'Kontakt',href:'/#kontakt'},{label:'Rezervace',href:'/rezervace'},{label:'O mně',href:'/#stylistky'},{label:'Přihlášení',href:'/login'},{label:'Lash Body ✦',href:'/vernostni-program'}].map(l=>(
                <li key={l.label}><Link href={l.href} className="text-text-muted text-sm font-light hover:text-pink-soft transition-colors cursor-none">{l.label}</Link></li>
              ))}
            </ul>
            <div className="mt-6 space-y-2">
              <h4 className="font-sans font-light tracking-[3px] uppercase text-text-dim mb-3" style={{fontSize:'10px'}}>Právní</h4>
              <div><Link href="/obchodni-podminky" className="text-text-dim text-xs font-light hover:text-pink-soft transition-colors">Obchodní podmínky</Link></div>
              <div><Link href="/gdpr" className="text-text-dim text-xs font-light hover:text-pink-soft transition-colors">Ochrana osobních údajů (GDPR)</Link></div>
            </div>
          </div>
        </div>

        <div className="glow-line mb-8"/>

        {/* Luxury bottom banner */}
        <div className="text-center py-6">
          <div className="font-serif text-lg font-light tracking-[6px] uppercase mb-2"
            style={{background:'linear-gradient(90deg,#E8A4BE,#FF6BA8,#D4AA70,#FF6BA8,#E8A4BE)',backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'shimmer 4s linear infinite',filter:'drop-shadow(0 0 15px rgba(255,107,168,0.4))'}}>
            Viktória Lashes Official
          </div>
          <div className="font-sans font-light tracking-[4px] uppercase text-text-dim mb-1" style={{fontSize:10}}>
            Luxury Beauty Experience
          </div>
          <div className="font-sans font-light tracking-[3px] text-text-dim mb-4" style={{fontSize:10}}>
            Booking System · Premium Lash Services
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-16" style={{background:'linear-gradient(90deg,transparent,rgba(255,107,168,0.3))'}}/>
            <span className="font-sans font-light tracking-[2px] text-text-dim" style={{fontSize:10}}>
              © 2026 All rights reserved.
            </span>
            <div className="h-px w-16" style={{background:'linear-gradient(90deg,rgba(255,107,168,0.3),transparent)'}}/>
          </div>
          <div className="font-sans font-light tracking-[3px]" style={{fontSize:9,color:'rgba(245,238,242,0.2)'}}>
            Powered by{' '}
            <span style={{color:'rgba(212,170,112,0.5)',textShadow:'0 0 8px rgba(212,170,112,0.3)'}}>
              Hosabut Technologies
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
