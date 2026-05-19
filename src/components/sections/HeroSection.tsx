'use client'
// src/components/sections/HeroSection.tsx
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

function Particle({ delay, left, drift }: { delay: number; left: number; drift: number }) {
  return (
    <motion.div
      className="absolute w-0.5 h-0.5 rounded-full bg-pink-neon"
      style={{ left: `${left}%`, bottom: '-10px' }}
      animate={{
        y: [0, -window.innerHeight * 1.2],
        x: [0, drift],
        opacity: [0, 0.6, 0.3, 0],
      }}
      transition={{
        duration: 6 + Math.random() * 8,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}

const CONTAINER_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
}

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
}

export function HeroSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 180])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    delay: -Math.random() * 10,
    left: Math.random() * 100,
    drift: (Math.random() - 0.5) * 120,
  }))

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-8 md:px-16 pt-28 pb-20">
      {/* Background */}
      <div className="absolute inset-0 bg-hero" />
      <div className="absolute inset-0 hero-grid-bg" />

      {/* Orbit rings */}
      <div
        className="absolute rounded-full border border-pink-glow opacity-30 animate-orbit"
        style={{ width: 500, height: 500, right: -100, top: '50%', marginTop: -250 }}
      />
      <div
        className="absolute rounded-full border border-pink-glow opacity-20 animate-orbit-reverse"
        style={{ width: 750, height: 750, right: -250, top: '50%', marginTop: -375 }}
      />
      <div
        className="absolute rounded-full border border-pink-glow opacity-40"
        style={{ width: 280, height: 280, right: 50, top: '50%', marginTop: -140, animation: 'orbit 15s linear infinite' }}
      />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: 1 + Math.random() * 2,
              height: 1 + Math.random() * 2,
              left: `${p.left}%`,
              background: p.id % 4 === 0 ? 'var(--gold)' : 'var(--pink-neon)',
            }}
            animate={{
              y: ['100vh', '-20vh'],
              x: [0, p.drift],
              opacity: [0, 0.6, 0.3, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 8,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-5xl w-full"
      >
        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-8"
        >
          {/* Label */}
          <motion.div variants={ITEM_VARIANTS} className="section-label">
            Mladá Boleslav &amp; okolí · Přijedu k Vám domů
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={ITEM_VARIANTS}
            className="font-serif font-light leading-none"
            style={{ fontSize: 'clamp(64px, 11vw, 130px)', letterSpacing: '-2px' }}
          >
            Viktoria<br />
            <em className="text-pink-soft not-italic">Lashes</em>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={ITEM_VARIANTS}
            className="text-text-muted font-light leading-relaxed max-w-lg"
            style={{ fontSize: 16, letterSpacing: 0.5 }}
          >
            Prémiové prodlužování řas přímo u Vás doma. Nemusíte nikam chodit —
            přijedu za Vámi a vytvoříme společně dokonalý výsledek z pohodlí domova.
          </motion.p>

          {/* CTA */}
          <motion.div variants={ITEM_VARIANTS} className="flex items-center gap-5 flex-wrap">
            <Link href="/rezervace" className="btn-primary">
              Rezervovat termín →
            </Link>
            <Link href="#sluzby" className="btn-ghost">
              Naše služby
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={ITEM_VARIANTS}
            className="flex items-center gap-8 pt-4"
          >
            {[
              { num: '🏠', label: 'Přijedu k vám' },
              { num: '✦',  label: 'Mladá Boleslav' },
              { num: '💕', label: 'Z pohodlí domova' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-3">
                <div className="w-px h-8 bg-glass-border" />
                <div>
                  <div className="font-serif text-lg font-light text-pink-soft">{b.num}</div>
                  <div className="text-text-dim font-light tracking-wider uppercase" style={{ fontSize: 10 }}>
                    {b.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <div
          className="w-px bg-gradient-to-b from-pink-neon to-transparent animate-pulse"
          style={{ height: 60 }}
        />
        <span className="text-text-dim font-light tracking-[4px] uppercase" style={{ fontSize: 9 }}>Scroll</span>
      </motion.div>
    </section>
  )
}
