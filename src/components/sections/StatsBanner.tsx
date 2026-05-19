'use client'
// src/components/sections/StatsBanner.tsx
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start = Math.min(start + step, target)
      setVal(Math.floor(start))
      if (start >= target) clearInterval(timer)
    }, 20)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <div ref={ref} className="font-serif font-light text-[56px] md:text-[72px] leading-none">
      {val.toLocaleString('cs-CZ')}<span className="text-pink-neon">{suffix}</span>
    </div>
  )
}

export function StatsBanner() {
  const stats = [
    { target: 1200, suffix: '+', label: 'Spokojených klientek' },
    { target: 4800, suffix: '+', label: 'Dokončených projektů' },
    { target: 98,   suffix: '%', label: 'Doporučení přátelům' },
    { target: 8,    suffix: '',  label: 'Let zkušeností' },
  ]

  return (
    <div className="border-y border-glass-border bg-white/[0.02] px-8 md:px-16 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map(s => (
          <div key={s.label} className="text-center">
            <Counter target={s.target} suffix={s.suffix} />
            <div className="text-text-dim font-light tracking-[3px] uppercase mt-2" style={{ fontSize: 11 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
