'use client'
// src/components/ui/CustomCursor.tsx
import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const rx = useRef(0)
  const ry = useRef(0)
  const cx = useRef(0)
  const cy = useRef(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cx.current = e.clientX
      cy.current = e.clientY
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top  = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', onMove)

    let raf: number
    const animate = () => {
      rx.current += (cx.current - rx.current) * 0.12
      ry.current += (cy.current - ry.current) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = rx.current + 'px'
        ringRef.current.style.top  = ry.current + 'px'
      }
      raf = requestAnimationFrame(animate)
    }
    animate()

    // Hover effects
    const interactable = () => document.querySelectorAll('a, button, [data-cursor]')
    const addHover = () => {
      dotRef.current?.classList.add('!w-1.5', '!h-1.5', '!bg-gold')
      ringRef.current?.classList.add('!w-16', '!h-16', '!border-gold/60')
    }
    const removeHover = () => {
      dotRef.current?.classList.remove('!w-1.5', '!h-1.5', '!bg-gold')
      ringRef.current?.classList.remove('!w-16', '!h-16', '!border-gold/60')
    }

    const observer = new MutationObserver(() => {
      document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', addHover)
        el.addEventListener('mouseleave', removeHover)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot fixed w-3 h-3 rounded-full pointer-events-none z-[9999] mix-blend-screen transition-[width,height,background] duration-300"
        style={{ background: 'var(--pink-neon)', transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={ringRef}
        className="cursor-ring fixed rounded-full pointer-events-none z-[9998] transition-[width,height,border-color] duration-300"
        style={{
          width: 40, height: 40,
          border: '1px solid rgba(255,107,168,0.4)',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  )
}
