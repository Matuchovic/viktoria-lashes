'use client'
import { useEffect, useRef, useState } from 'react'

interface ClickBurst { id: number; x: number; y: number }

export function CustomCursor() {
  const lashRef  = useRef<SVGSVGElement>(null)
  const ringRef  = useRef<HTMLDivElement>(null)
  const cx = useRef(0)
  const cy = useRef(0)
  const rx = useRef(0)
  const ry = useRef(0)
  const [bursts, setBursts] = useState<ClickBurst[]>([])
  const [isHover, setIsHover] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cx.current = e.clientX
      cy.current = e.clientY
      if (lashRef.current) {
        lashRef.current.style.left  = e.clientX + 'px'
        lashRef.current.style.top   = e.clientY + 'px'
      }
    }

    const onClick = (e: MouseEvent) => {
      const id = Date.now()
      setBursts(b => [...b, { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => setBursts(b => b.filter(x => x.id !== id)), 1200)
    }

    const addHover = () => setIsHover(true)
    const removeHover = () => setIsHover(false)

    let raf: number
    const animate = () => {
      rx.current += (cx.current - rx.current) * 0.1
      ry.current += (cy.current - ry.current) * 0.1
      if (ringRef.current) {
        ringRef.current.style.left = rx.current + 'px'
        ringRef.current.style.top  = ry.current + 'px'
      }
      raf = requestAnimationFrame(animate)
    }
    animate()

    const observer = new MutationObserver(() => {
      document.querySelectorAll('a,button,[data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', addHover)
        el.addEventListener('mouseleave', removeHover)
      })
    })
    observer.observe(document.body, { childList:true, subtree:true })
    document.querySelectorAll('a,button,[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    window.addEventListener('mousemove', onMove)
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {/* Lash cursor SVG */}
      <svg
        ref={lashRef}
        className="fixed pointer-events-none z-[9999]"
        style={{ transform:'translate(-50%,-50%)', width:28, height:36 }}
        viewBox="0 0 28 36"
      >
        <defs>
          <filter id="lash-glow">
            <feGaussianBlur stdDeviation="1.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {/* Main lash strand */}
        <path d="M 14 32 C 12 24 8 16 10 4" stroke={isHover ? '#D4AA70' : '#FF6BA8'} strokeWidth={isHover?2.2:1.8} strokeLinecap="round" fill="none" filter="url(#lash-glow)"
          style={{ transition:'stroke 0.3s' }}/>
        {/* Secondary lashes */}
        <path d="M 16 32 C 16 22 14 14 18 3" stroke={isHover ? '#E8C98A' : '#E8A4BE'} strokeWidth={1.2} strokeLinecap="round" fill="none" filter="url(#lash-glow)" opacity={0.7}/>
        <path d="M 12 31 C 10 22 6 15 5 6" stroke={isHover ? '#D4AA70' : '#C4698A'} strokeWidth={0.9} strokeLinecap="round" fill="none" filter="url(#lash-glow)" opacity={0.5}/>
        {/* Root dot */}
        <circle cx="14" cy="32" r={isHover?3:2.5} fill={isHover?'#D4AA70':'#FF6BA8'} filter="url(#lash-glow)" style={{ transition:'all 0.3s' }}/>
        <circle cx="14" cy="32" r={isHover?5:4} fill="none" stroke={isHover?'#D4AA70':'#FF6BA8'} strokeWidth="0.5" opacity={0.4}/>
      </svg>

      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="fixed rounded-full pointer-events-none z-[9998]"
        style={{
          width:  isHover ? 48 : 36,
          height: isHover ? 48 : 36,
          border: `1px solid ${isHover?'rgba(212,170,112,0.5)':'rgba(255,107,168,0.35)'}`,
          transform:'translate(-50%,-50%)',
          transition:'width 0.3s, height 0.3s, border-color 0.3s',
          boxShadow:`0 0 10px ${isHover?'rgba(212,170,112,0.2)':'rgba(255,107,168,0.15)'}`,
        }}
      />

      {/* Click bursts — "VIKTÓRIA LASHES" */}
      {bursts.map(b => (
        <div key={b.id} className="fixed pointer-events-none z-[9997]" style={{ left:b.x, top:b.y, transform:'translate(-50%,-50%)' }}>
          {/* Radiating lashes */}
          <svg width="80" height="80" viewBox="-40 -40 80 80" className="absolute inset-0">
            {[0,45,90,135,180,225,270,315].map((deg,i) => {
              const rad = (deg * Math.PI) / 180
              const ex  = Math.cos(rad) * 30
              const ey  = Math.sin(rad) * 30
              return (
                <line key={deg} x1={0} y1={0} x2={ex} y2={ey}
                  stroke={i%2===0?'#FF6BA8':'#D4AA70'} strokeWidth={1.2} strokeLinecap="round"
                  style={{
                    transformOrigin:'center',
                    animation:`lash-burst 0.8s ease-out forwards`,
                    animationDelay:`${i*0.03}s`,
                    filter:`drop-shadow(0 0 3px ${i%2===0?'#FF6BA8':'#D4AA70'})`,
                  }}
                />
              )
            })}
          </svg>
          {/* Text popup */}
          <div
            className="absolute font-serif font-light tracking-[3px] uppercase whitespace-nowrap"
            style={{
              fontSize:11, color:'#FF6BA8',
              textShadow:'0 0 15px rgba(255,107,168,0.8)',
              top:'-32px', left:'50%',
              transform:'translateX(-50%)',
              animation:'click-text 1.2s ease-out forwards',
            }}
          >
            Viktória Lashes
          </div>
        </div>
      ))}

      <style>{`
        @keyframes lash-burst {
          0%   { stroke-dasharray: 30; stroke-dashoffset: 30; opacity: 1; }
          60%  { stroke-dashoffset: 0; opacity: 0.8; }
          100% { stroke-dashoffset: -30; opacity: 0; }
        }
        @keyframes click-text {
          0%   { opacity:0; transform:translateX(-50%) translateY(0px) scale(0.8); }
          20%  { opacity:1; transform:translateX(-50%) translateY(-8px) scale(1); }
          70%  { opacity:1; transform:translateX(-50%) translateY(-16px) scale(1); }
          100% { opacity:0; transform:translateX(-50%) translateY(-28px) scale(0.9); }
        }
      `}</style>
    </>
  )
}
