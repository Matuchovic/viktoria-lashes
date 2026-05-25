'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/#sluzby',       label: 'Služby' },
  { href: '/#galerie',      label: 'Galerie' },
  { href: '/#stylistky',    label: 'Studio' },
  { href: '/#recenze',      label: 'Recenze' },
  { href: '/#kontakt',      label: 'Kontakt' },
  { href: '/jak-rezervovat', label: 'Jak rezervovat?' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [pathname])

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-500',
          scrolled
            ? 'px-5 md:px-16 py-3 bg-black/90 backdrop-blur-xl border-b border-glass-border'
            : 'px-5 md:px-16 py-5 md:py-7'
        )}
      >
        {/* Logo */}
        <Link href="/" className="font-serif font-light text-base md:text-xl tracking-[4px] md:tracking-[6px] uppercase text-text-primary hover:text-text-primary transition-colors">
          Vikt<span style={{display:"inline-block",position:"relative"}}><span style={{display:"inline-block"}}>ó</span><span style={{position:"absolute",bottom:"110%",left:"50%",transform:"translateX(-50%) scaleY(0.7)",fontSize:"0.45em",color:"inherit",lineHeight:1,pointerEvents:"none"}}>´</span></span>ria <span className="text-pink-neon">Lashes</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-10">
          {links.map(l => (
            <li key={l.href}><Link href={l.href} className="nav-link">{l.label}</Link></li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/vernostni-program" className="nav-link">Lash Body ✦</Link>
          {session ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link href="/admin" style={{fontFamily:'Georgia,serif',fontSize:10,letterSpacing:3,textTransform:'uppercase',color:'#D4AA70',textShadow:'0 0 12px rgba(212,170,112,0.6)',border:'1px solid rgba(212,170,112,0.4)',padding:'6px 14px',borderRadius:8,background:'rgba(212,170,112,0.08)',transition:'all 0.2s',textDecoration:'none'}}>✦ Admin</Link>
              )}
              <Link href="/dashboard" className="nav-link">Moje rezervace</Link>
              <button onClick={() => signOut()} className="btn-ghost py-3 px-6 text-[10px]">Odhlásit</button>
            </div>
          ) : (
            <>
              <Link href="/login" className="nav-link">Přihlásit</Link>
              <Link href="/rezervace" className="btn-primary py-3 px-7 text-[10px]">Rezervovat</Link>
            </>
          )}
        </div>

        {/* Mobile right side */}
        <div className="flex lg:hidden items-center gap-3">
          {!mobileOpen && (
            <Link href="/rezervace" style={{fontFamily:'Georgia,serif',fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'#FF6BA8',border:'1px solid rgba(255,107,168,0.4)',padding:'7px 12px',borderRadius:8,background:'rgba(255,107,168,0.08)',textDecoration:'none'}}>
              Rezervovat
            </Link>
          )}
          {/* Hamburger */}
          <button
            className="flex flex-col gap-[5px] p-2 -mr-1"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Menu"
          >
            <motion.span animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="block w-5 h-px bg-text-primary origin-center"/>
            <motion.span animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} className="block w-5 h-px bg-text-primary"/>
            <motion.span animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="block w-5 h-px bg-text-primary origin-center"/>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center lg:hidden"
            style={{ paddingTop: 80 }}
          >
            <div className="font-serif text-3xl font-light tracking-[5px] uppercase mb-10">
              Vikt<span style={{display:"inline-block",position:"relative"}}><span style={{display:"inline-block"}}>ó</span><span style={{position:"absolute",bottom:"110%",left:"50%",transform:"translateX(-50%) scaleY(0.7)",fontSize:"0.45em",color:"inherit",lineHeight:1,pointerEvents:"none"}}>´</span></span>ria <span className="text-pink-neon">Lashes</span>
            </div>

            <div className="flex flex-col items-center gap-6 w-full px-8">
              {links.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 + 0.1 }} className="w-full text-center">
                  <Link href={l.href} className="font-serif text-2xl font-light text-text-muted hover:text-text-primary transition-colors" onClick={() => setMobileOpen(false)}>
                    {l.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="w-full text-center">
                <Link href="/vernostni-program" className="font-serif text-xl font-light" style={{ color: '#D4AA70' }} onClick={() => setMobileOpen(false)}>
                  Lash Body ✦
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }} className="w-full text-center">
                <Link href="/jak-rezervovat" className="font-serif text-lg font-light" style={{ color: '#FF6BA8' }} onClick={() => setMobileOpen(false)}>
                  📖 Jak rezervovat?
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }} className="flex flex-col gap-2 w-full pt-4 border-t border-glass-border">
                <div className="flex justify-center gap-6 pb-3 border-b border-glass-border">
                  <Link href="/obchodni-podminky" className="font-serif text-xs font-light" style={{ color: 'rgba(245,238,242,0.3)', letterSpacing: 1 }} onClick={() => setMobileOpen(false)}>Obchodní podmínky</Link>
                  <span style={{ color: 'rgba(245,238,242,0.15)' }}>·</span>
                  <Link href="/gdpr" className="font-serif text-xs font-light" style={{ color: 'rgba(245,238,242,0.3)', letterSpacing: 1 }} onClick={() => setMobileOpen(false)}>GDPR</Link>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }} className="flex flex-col gap-3 w-full">
                {session ? (
                  <>
                    {isAdmin && <Link href="/admin" className="text-center py-3 rounded-xl font-serif text-sm font-light" style={{ background: 'rgba(212,170,112,0.1)', border: '1px solid rgba(212,170,112,0.3)', color: '#D4AA70' }} onClick={() => setMobileOpen(false)}>✦ Admin panel</Link>}
                    <Link href="/dashboard" className="text-center py-3 rounded-xl font-serif text-sm font-light text-text-muted" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} onClick={() => setMobileOpen(false)}>Moje rezervace</Link>
                    <button onClick={() => { signOut(); setMobileOpen(false) }} className="py-3 rounded-xl font-serif text-sm font-light text-text-dim" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)' }}>Odhlásit</button>
                  </>
                ) : (
                  <>
                    <Link href="/rezervace" className="text-center py-4 rounded-xl font-serif text-sm tracking-widest uppercase" style={{ background: 'linear-gradient(135deg,#C4698A,#FF6BA8)', color: 'white', boxShadow: '0 0 30px rgba(255,107,168,0.35)' }} onClick={() => setMobileOpen(false)}>
                      Rezervovat termín →
                    </Link>
                    <Link href="/login" className="text-center py-3 rounded-xl font-serif text-sm font-light text-text-muted" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} onClick={() => setMobileOpen(false)}>Přihlásit se</Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
