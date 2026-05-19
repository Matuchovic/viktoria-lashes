'use client'
import { useEffect, useRef, useState } from 'react'

interface Trail { id: number; x: number; y: number; size: number; color: string; opacity: number }

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef   = useRef<HTMLDivElement>(null)
  const cx = useRef(0); const cy = useRef(0)
  const rx = useRef(0); const ry = useRef(0)
  const [trails, setTrails]   = useState<Trail[]>([])
  const [hover, setHover]     = useState(false)
  const trailId = useRef(0)
  const lastPos = useRef({ x:0, y:0 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cx.current = e.clientX; cy.current = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top  = e.clientY + 'px'
      }
      // Generate trail particles on movement
      const dx = e.clientX - lastPos.current.x
      const dy = e.clientY - lastPos.current.y
      const dist = Math.sqrt(dx*dx + dy*dy)
      if (dist > 8) {
        lastPos.current = { x: e.clientX, y: e.clientY }
        const colors = ['#FF6BA8','#E8A4BE','#ffffff','#FF6BA8','#D4AA70']
        const color = colors[Math.floor(Math.random() * colors.length)]
        const id = trailId.current++
        setTrails(t => [...t.slice(-18), {
          id, x: e.clientX + (Math.random()-0.5)*12,
          y: e.clientY + (Math.random()-0.5)*12,
          size: 2 + Math.random() * 3,
          color, opacity: 0.8 + Math.random() * 0.2,
        }])
        setTimeout(() => setTrails(t => t.filter(x => x.id !== id)), 600)
      }
    }
    const on  = () => setHover(true)
    const off = () => setHover(false)
    let raf: number
    const tick = () => {
      rx.current += (cx.current - rx.current) * 0.12
      ry.current += (cy.current - ry.current) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = rx.current + 'px'
        ringRef.current.style.top  = ry.current + 'px'
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    const obs = new MutationObserver(() => {
      document.querySelectorAll('a,button,[data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', on); el.addEventListener('mouseleave', off)
      })
    })
    obs.observe(document.body, { childList:true, subtree:true })
    document.querySelectorAll('a,button,[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', on); el.addEventListener('mouseleave', off)
    })
    window.addEventListener('mousemove', move)
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); obs.disconnect() }
  }, [])

  return (
    <>
      {/* Trail particles */}
      {trails.map(t => (
        <div key={t.id} className="fixed pointer-events-none z-[99996]"
          style={{ left: t.x, top: t.y, transform: 'translate(-50%,-50%)',
            width: t.size, height: t.size, borderRadius: '50%',
            background: t.color, boxShadow: `0 0 ${t.size*3}px ${t.color}`,
            animation: 'trail-fade 0.6s ease-out forwards',
          }}
        />
      ))}

      {/* VL cursor */}
      <div ref={cursorRef} className="fixed pointer-events-none z-[99999]"
        style={{ transform: 'translate(-50%,-50%)', transition: 'width 0.3s, height 0.3s' }}>
        {/* Glow behind */}
        <div style={{
          position:'absolute', inset:-8, borderRadius:'50%',
          background: hover ? 'radial-gradient(circle,rgba(212,170,112,0.3) 0%,transparent 70%)' : 'radial-gradient(circle,rgba(255,107,168,0.25) 0%,transparent 70%)',
          transition: 'background 0.3s',
        }}/>
        {/* VL text */}
        <div style={{
          position:'relative',
          fontFamily:'Georgia,serif',
          fontSize: hover ? 13 : 11,
          fontWeight: 300,
          letterSpacing: 2,
          color: hover ? '#D4AA70' : '#FF6BA8',
          textShadow: hover
            ? '0 0 12px #D4AA70, 0 0 24px rgba(212,170,112,0.6)'
            : '0 0 10px #FF6BA8, 0 0 20px rgba(255,107,168,0.5)',
          userSelect:'none',
          transition: 'all 0.3s',
          lineHeight: 1,
          padding: '3px 4px',
          whiteSpace: 'nowrap',
        }}>
          VL
          {/* Tiny lash above VL */}
          <svg style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', overflow:'visible' }}
            width="20" height="12" viewBox="0 0 20 12">
            {[{x:4,y:10,ex:2,ey:0},{x:7,y:10,ex:6,ey:0},{x:10,y:10,ex:10,ey:-1},{x:13,y:10,ex:14,ey:0},{x:16,y:10,ex:18,ey:1}].map((l,i)=>(
              <line key={i} x1={l.x} y1={l.y} x2={l.ex} y2={l.ey}
                stroke={hover?'#D4AA70':'#FF6BA8'} strokeWidth={hover?1.2:1}
                strokeLinecap="round"
                style={{
                  filter:`drop-shadow(0 0 3px ${hover?'#D4AA70':'#FF6BA8'})`,
                  transition:'stroke 0.3s',
                  animation:`lash-tip ${0.8+i*0.15}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Trailing ring */}
      <div ref={ringRef} className="fixed pointer-events-none z-[99998] rounded-full"
        style={{
          width: hover ? 52 : 38, height: hover ? 52 : 38,
          border: `1px solid ${hover ? 'rgba(212,170,112,0.5)' : 'rgba(255,107,168,0.4)'}`,
          transform: 'translate(-50%,-50%)',
          boxShadow: hover ? '0 0 15px rgba(212,170,112,0.2)' : '0 0 10px rgba(255,107,168,0.15)',
          transition: 'width 0.3s,height 0.3s,border-color 0.3s',
        }}
      />

      <style>{`
        @keyframes trail-fade {
          0%   { opacity: var(--o, 0.9); transform: translate(-50%,-50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%,-50%) scale(0.1) translateY(-12px); }
        }
        @keyframes lash-tip {
          from { transform: translateY(0px); }
          to   { transform: translateY(-1.5px); }
        }
      `}</style>
    </>
  )
}
