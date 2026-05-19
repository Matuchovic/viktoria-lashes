'use client'
import { useEffect, useRef, useState } from 'react'

interface Burst { id: number; x: number; y: number }

export function CustomCursor() {
  const svgRef  = useRef<SVGSVGElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const cx = useRef(0); const cy = useRef(0)
  const rx = useRef(0); const ry = useRef(0)
  const [bursts, setBursts] = useState<Burst[]>([])
  const [hover, setHover]   = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cx.current = e.clientX; cy.current = e.clientY
      if (svgRef.current) { svgRef.current.style.left = e.clientX+'px'; svgRef.current.style.top = e.clientY+'px' }
    }
    const click = (e: MouseEvent) => {
      const id = Date.now()
      setBursts(b => [...b, { id, x:e.clientX, y:e.clientY }])
      setTimeout(() => setBursts(b => b.filter(x => x.id !== id)), 1400)
    }
    const on  = () => setHover(true)
    const off = () => setHover(false)
    let raf: number
    const tick = () => {
      rx.current += (cx.current - rx.current) * 0.1
      ry.current += (cy.current - ry.current) * 0.1
      if (ringRef.current) { ringRef.current.style.left = rx.current+'px'; ringRef.current.style.top = ry.current+'px' }
      raf = requestAnimationFrame(tick)
    }
    tick()
    const obs = new MutationObserver(() => {
      document.querySelectorAll('a,button,[data-cursor]').forEach(el => { el.addEventListener('mouseenter',on); el.addEventListener('mouseleave',off) })
    })
    obs.observe(document.body, { childList:true, subtree:true })
    document.querySelectorAll('a,button,[data-cursor]').forEach(el => { el.addEventListener('mouseenter',on); el.addEventListener('mouseleave',off) })
    window.addEventListener('mousemove', move)
    window.addEventListener('click', click)
    return () => { window.removeEventListener('mousemove',move); window.removeEventListener('click',click); cancelAnimationFrame(raf); obs.disconnect() }
  }, [])

  const pink = '#FF6BA8'; const gold = '#D4AA70'
  const c = hover ? gold : pink

  return (
    <>
      {/* Eye cursor SVG */}
      <svg ref={svgRef} className="fixed pointer-events-none z-[9999]"
        style={{ transform:'translate(-50%,-50%)', width:44, height:32, overflow:'visible' }}
        viewBox="-22 -16 44 32">
        <defs>
          <radialGradient id="c-iris" cx="45%" cy="40%" r="50%">
            <stop offset="0%" stopColor={hover?'#4a1a2e':'#2d0a1e'}/>
            <stop offset="100%" stopColor="#080608"/>
          </radialGradient>
          <filter id="c-glow"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="c-glow2"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        {/* Eye shape */}
        <path d="M -18 0 Q 0 -10 18 0 Q 0 10 -18 0 Z" fill="#0a0208" stroke={c} strokeWidth="0.8" filter="url(#c-glow)" style={{transition:'stroke 0.3s'}}/>

        {/* Iris */}
        <circle cx="0" cy="0" r="6.5" fill="url(#c-iris)" filter="url(#c-glow)"/>
        <circle cx="0" cy="0" r="6.5" fill="none" stroke={c} strokeWidth="0.5" opacity="0.6"/>

        {/* Pupil */}
        <circle cx="0" cy="0" r="3" fill="#000"/>
        <circle cx="-1.5" cy="-1.5" r="1" fill="white" opacity="0.25"/>

        {/* Upper lashes */}
        {[
          {x:-12,y:-2,ex:-14,ey:-9,cx1:-13,cy1:-5,cx2:-14,cy2:-7},
          {x:-7, y:-6,ex:-8, ey:-13,cx1:-7.5,cy1:-9,cx2:-8,cy2:-11},
          {x:0,  y:-8,ex:0, ey:-15,cx1:0,cy1:-11,cx2:0,cy2:-13},
          {x:7,  y:-6,ex:8, ey:-13,cx1:7.5,cy1:-9,cx2:8,cy2:-11},
          {x:12, y:-2,ex:14,ey:-9, cx1:13,cy1:-5,cx2:14,cy2:-7},
          {x:-4, y:-7,ex:-4,ey:-14,cx1:-4,cy1:-10,cx2:-4,cy2:-12},
          {x:4,  y:-7,ex:4, ey:-14,cx1:4,cy1:-10,cx2:4,cy2:-12},
        ].map((l,i)=>(
          <path key={i} d={`M ${l.x} ${l.y} C ${l.cx1} ${l.cy1} ${l.cx2} ${l.cy2} ${l.ex} ${l.ey}`}
            stroke={i%2===0?c:(hover?'#E8C98A':'#E8A4BE')}
            strokeWidth={hover?1.4:1.1} strokeLinecap="round" fill="none"
            filter="url(#c-glow)"
            style={{
              strokeDasharray:20, strokeDashoffset:0,
              animation:`lash-wave ${1.5+i*0.2}s ease-in-out infinite alternate`,
              animationDelay:`${i*0.1}s`,
            }}
          />
        ))}

        {/* Iris sparkle */}
        <circle cx="-2" cy="-2" r="0.6" fill={c} style={{animation:'sparkle 1.8s ease-in-out infinite'}} filter="url(#c-glow2)"/>
      </svg>

      {/* Trailing glow ring */}
      <div ref={ringRef} className="fixed pointer-events-none z-[9998] rounded-full"
        style={{
          width:hover?56:42, height:hover?56:42,
          border:`1px solid ${hover?'rgba(212,170,112,0.4)':'rgba(255,107,168,0.3)'}`,
          transform:'translate(-50%,-50%)',
          boxShadow:`0 0 12px ${hover?'rgba(212,170,112,0.2)':'rgba(255,107,168,0.15)'}`,
          transition:'width 0.3s,height 0.3s,border-color 0.3s',
        }}
      />

      {/* Click bursts */}
      {bursts.map(b=>(
        <div key={b.id} className="fixed pointer-events-none z-[9997]"
          style={{ left:b.x, top:b.y, transform:'translate(-50%,-50%)' }}>
          <svg width="100" height="100" viewBox="-50 -50 100 100" className="absolute inset-0">
            {Array.from({length:12},(_,i)=>{
              const deg=(i/12)*360; const rad=deg*Math.PI/180
              const ex=Math.cos(rad)*38; const ey=Math.sin(rad)*38
              return <line key={i} x1={0} y1={0} x2={ex} y2={ey}
                stroke={i%3===0?gold:pink} strokeWidth={1.2} strokeLinecap="round"
                style={{strokeDasharray:38,strokeDashoffset:38,animation:`burst-line 0.7s ease-out forwards`,animationDelay:`${i*0.02}s`,filter:`drop-shadow(0 0 3px ${i%3===0?gold:pink})`}}
              />
            })}
            {/* Eye sparkle rings */}
            <circle cx="0" cy="0" r="0" fill="none" stroke={pink} strokeWidth="1"
              style={{animation:'burst-ring 0.8s ease-out forwards'}}/>
            <circle cx="0" cy="0" r="0" fill="none" stroke={gold} strokeWidth="0.7"
              style={{animation:'burst-ring2 1s ease-out forwards',animationDelay:'0.1s'}}/>
          </svg>
          <div className="absolute font-serif font-light tracking-[4px] uppercase whitespace-nowrap"
            style={{fontSize:10,color:pink,textShadow:`0 0 20px ${pink}`,top:'-36px',left:'50%',transform:'translateX(-50%)',animation:'burst-text 1.4s ease-out forwards'}}>
            Viktória Lashes
          </div>
        </div>
      ))}

      <style>{`
        @keyframes lash-wave {
          from { stroke-dashoffset: 2; }
          to   { stroke-dashoffset: -2; }
        }
        @keyframes sparkle {
          0%,100% { opacity:0.3; transform:scale(0.8); }
          50%      { opacity:1;   transform:scale(1.4); }
        }
        @keyframes burst-line {
          0%   { stroke-dashoffset:38; opacity:1; }
          80%  { stroke-dashoffset:0;  opacity:0.8; }
          100% { stroke-dashoffset:-10; opacity:0; }
        }
        @keyframes burst-ring {
          0%   { r:0;  opacity:1; }
          100% { r:35; opacity:0; }
        }
        @keyframes burst-ring2 {
          0%   { r:0;  opacity:0.7; }
          100% { r:48; opacity:0; }
        }
        @keyframes burst-text {
          0%   { opacity:0; transform:translateX(-50%) translateY(4px) scale(0.85); }
          25%  { opacity:1; transform:translateX(-50%) translateY(-10px) scale(1); }
          75%  { opacity:1; transform:translateX(-50%) translateY(-20px) scale(1); }
          100% { opacity:0; transform:translateX(-50%) translateY(-34px) scale(0.92); }
        }
      `}</style>
    </>
  )
}
