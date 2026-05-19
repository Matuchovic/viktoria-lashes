'use client'
// src/components/layout/Navbar.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/#sluzby',   label: 'Služby' },
  { href: '/#galerie',  label: 'Galerie' },
  { href: '/#stylistky', label: 'Studio' },
  { href: '/#recenze',  label: 'Recenze' },
  { href: '/#kontakt',  label: 'Kontakt' },
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

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-500',
          scrolled
            ? 'px-8 md:px-16 py-4 bg-black/85 backdrop-blur-xl border-b border-glass-border'
            : 'px-8 md:px-16 py-7'
        )}
      >
        {/* Logo */}
        <Link href="/" className="font-serif font-light text-xl tracking-[6px] uppercase text-text-primary hover:text-text-primary transition-colors">
          Viktória <span className="text-pink-neon">Lashes</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-10">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className="nav-link">{l.label}</Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              {(session.user as any)?.role === 'ADMIN' && (
                <Link href="/admin" style={{
                  fontFamily:'Georgia,serif', fontSize:10, letterSpacing:3,
                  textTransform:'uppercase', color:'#D4AA70',
                  textShadow:'0 0 12px rgba(212,170,112,0.6)',
                  border:'1px solid rgba(212,170,112,0.4)',
                  padding:'6px 14px', borderRadius:8,
                  background:'rgba(212,170,112,0.08)',
                  transition:'all 0.2s',
                  textDecoration:'none',
                }}>✦ Admin</Link>
              )}
              <Link href="/vernostni-program" className="nav-link">Lash Body ✦</Link>
              <Link href="/dashboard" className="nav-link">Moje rezervace</Link>
              <button onClick={() => signOut()} className="btn-ghost py-3 px-6 text-[10px]">
                Odhlásit
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="nav-link">Přihlásit</Link>
              <Link href="/rezervace" className="btn-primary py-3 px-7 text-[10px]">
                Rezervovat
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden flex flex-col gap-[5px] cursor-none p-1"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Otevřít menu"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            className="block w-6 h-px bg-text-primary origin-center transition-colors"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            className="block w-6 h-px bg-text-primary"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            className="block w-6 h-px bg-text-primary origin-center"
          />
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 lg:hidden"
          >
            <div className="font-serif text-4xl font-light tracking-[6px] uppercase mb-8">
              Viktória <span className="text-pink-neon">Lashes</span>
            </div>
            {links.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.1 }}
              >
                <Link
                  href={l.href}
                  className="font-serif text-3xl font-light text-text-muted hover:text-text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <Link
                href="/rezervace"
                className="btn-primary"
                onClick={() => setMobileOpen(false)}
              >
                Rezervovat termín
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
