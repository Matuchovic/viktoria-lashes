'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const TOWNS = [
  { name: 'Mladá Boleslav', lat: 50.4151, lng: 14.9054, count: 47, main: true, x: 50, y: 45 },
  { name: 'Benátky n. J.', lat: 50.437, lng: 15.005, count: 23, x: 62, y: 48 },
  { name: 'Bakov n. J.', lat: 50.472, lng: 14.826, count: 18, x: 42, y: 35 },
  { name: 'Bělá p. B.', lat: 50.522, lng: 14.799, count: 12, x: 38, y: 25 },
  { name: 'Mnich. Hradiště', lat: 50.533, lng: 14.624, count: 15, x: 24, y: 22 },
  { name: 'Brandýs n. L.', lat: 50.190, lng: 14.663, count: 9, x: 30, y: 72 },
  { name: 'Lysá n. L.', lat: 50.201, lng: 14.832, count: 7, x: 44, y: 74 },
  { name: 'Nymburk', lat: 50.185, lng: 15.043, count: 6, x: 62, y: 78 },
  { name: 'Jičín', lat: 50.437, lng: 15.361, count: 5, x: 82, y: 42 },
  { name: 'Mělník', lat: 50.350, lng: 14.474, count: 8, x: 18, y: 58 },
  { name: 'Liberec', lat: 50.767, lng: 15.057, count: 4, x: 60, y: 8 },
  { name: 'Praha', lat: 50.076, lng: 14.420, count: 11, x: 20, y: 88 },
]

const TOTAL = TOWNS.reduce((s, t) => s + t.count, 0)

export function LashMapSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [hovered, setHovered] = useState<string | null>(null)
  const [active, setActive] = useState<string | null>(null)
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const end = TOTAL
    const step = Math.ceil(end / 60)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCounter(end); clearInterval(timer) }
      else setCounter(start)
    }, 20)
    return () => clearInterval(timer)
  }, [inView])

  const hoveredTown = TOWNS.find(t => t.name === (hovered || active))

  return (
    <section ref={ref} style={{ background:'#080608', padding:'80px 0', overflow:'hidden', position:'relative' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 50% at 50% 50%,rgba(255,107,168,0.05) 0%,transparent 70%)', pointerEvents:'none' }}/>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px' }}>

        {/* Header */}
        <motion.div initial={{ opacity:0, y:30 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.8 }}
          style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:5, color:'#FF6BA8', textTransform:'uppercase', marginBottom:12 }}>✦ Naše komunita</div>
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(28px,5vw,48px)', fontWeight:300, marginBottom:16, lineHeight:1.2 }}>
            Spokojenéé klientky<br/><em style={{ color:'#FF6BA8' }}>po celém okolí</em>
          </h2>
          {/* Counter */}
          <motion.div initial={{ opacity:0, scale:0.8 }} animate={inView?{opacity:1,scale:1}:{}} transition={{ delay:0.3 }}
            style={{ display:'inline-flex', alignItems:'center', gap:16, padding:'16px 32px', borderRadius:50, background:'rgba(255,107,168,0.08)', border:'1px solid rgba(255,107,168,0.25)' }}>
            <span style={{ fontFamily:'Georgia,serif', fontSize:'clamp(32px,6vw,52px)', color:'#FF6BA8', lineHeight:1 }}>{counter}+</span>
            <div style={{ textAlign:'left' }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:14, color:'rgba(245,238,242,0.8)' }}>spokojených klientek</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:11, color:'rgba(245,238,242,0.35)' }}>v {TOWNS.length} městech & obcích</div>
            </div>
          </motion.div>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignItems:'center' }}>

          {/* Map */}
          <motion.div initial={{ opacity:0, x:-30 }} animate={inView?{opacity:1,x:0}:{}} transition={{ duration:0.8, delay:0.2 }}>
            <div style={{ position:'relative', aspectRatio:'1', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,107,168,0.12)', borderRadius:24, overflow:'hidden' }}>
              <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 80% at 50% 50%,rgba(255,107,168,0.04) 0%,transparent 70%)' }}/>

              {/* Grid lines */}
              {[20,40,60,80].map(p => (
                <div key={p}>
                  <div style={{ position:'absolute', left:`${p}%`, top:0, bottom:0, width:1, background:'rgba(255,107,168,0.05)' }}/>
                  <div style={{ position:'absolute', top:`${p}%`, left:0, right:0, height:1, background:'rgba(255,107,168,0.05)' }}/>
                </div>
              ))}

              {/* Town dots */}
              {TOWNS.map((town, i) => (
                <motion.div
                  key={town.name}
                  initial={{ scale:0, opacity:0 }}
                  animate={inView ? { scale:1, opacity:1 } : {}}
                  transition={{ delay: 0.4 + i * 0.06, type:'spring', stiffness:300 }}
                  style={{ position:'absolute', left:`${town.x}%`, top:`${town.y}%`, transform:'translate(-50%,-50%)', cursor:'pointer', zIndex: hovered===town.name || active===town.name ? 10 : 1 }}
                  onMouseEnter={() => setHovered(town.name)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setActive(active===town.name ? null : town.name)}
                >
                  {/* Pulse ring for main */}
                  {town.main && (
                    <motion.div animate={{ scale:[1,2.5], opacity:[0.5,0] }} transition={{ duration:2, repeat:Infinity, ease:'easeOut' }}
                      style={{ position:'absolute', inset:0, borderRadius:'50%', background:'#FF6BA8' }}/>
                  )}

                  {/* Dot */}
                  <motion.div
                    animate={{ scale: hovered===town.name || active===town.name ? 1.4 : 1 }}
                    style={{
                      width: town.main ? 20 : Math.max(8, Math.min(16, town.count / 3)),
                      height: town.main ? 20 : Math.max(8, Math.min(16, town.count / 3)),
                      borderRadius:'50%',
                      background: town.main ? 'linear-gradient(135deg,#C4698A,#FF6BA8)' : `rgba(255,107,168,${0.4 + town.count/80})`,
                      boxShadow: town.main ? '0 0 20px rgba(255,107,168,0.7)' : `0 0 ${town.count/3}px rgba(255,107,168,0.4)`,
                      border: '1.5px solid rgba(255,107,168,0.6)',
                      position:'relative',
                    }}
                  />

                  {/* Tooltip */}
                  <AnimatePresence>
                    {(hovered===town.name || active===town.name) && (
                      <motion.div initial={{ opacity:0, y:4, scale:0.9 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, scale:0.9 }}
                        style={{ position:'absolute', bottom:'calc(100% + 8px)', left:'50%', transform:'translateX(-50%)', background:'rgba(8,6,8,0.97)', border:'1px solid rgba(255,107,168,0.35)', borderRadius:12, padding:'8px 12px', whiteSpace:'nowrap', pointerEvents:'none', boxShadow:'0 8px 24px rgba(0,0,0,0.6)' }}>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:'rgba(245,238,242,0.9)', marginBottom:2 }}>{town.name}</div>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:10, color:'#FF6BA8' }}>{town.count} klientek 💕</div>
                        <div style={{ position:'absolute', bottom:-4, left:'50%', transform:'translateX(-50%)', width:8, height:8, background:'rgba(8,6,8,0.97)', border:'0 0 1px 1px solid rgba(255,107,168,0.35)', rotate:'45deg' }}/>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Label */}
              <div style={{ position:'absolute', bottom:12, left:16, fontFamily:'Georgia,serif', fontSize:9, letterSpacing:2, color:'rgba(245,238,242,0.2)', textTransform:'uppercase' }}>
                Střední Čechy & okolí
              </div>
            </div>
          </motion.div>

          {/* Stats list */}
          <motion.div initial={{ opacity:0, x:30 }} animate={inView?{opacity:1,x:0}:{}} transition={{ duration:0.8, delay:0.3 }}>
            <div style={{ fontFamily:'Georgia,serif', fontSize:9, letterSpacing:4, color:'rgba(245,238,242,0.3)', textTransform:'uppercase', marginBottom:16 }}>Klientky podle města</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[...TOWNS].sort((a,b) => b.count - a.count).map((town, i) => (
                <motion.div key={town.name}
                  initial={{ opacity:0, x:20 }} animate={inView?{opacity:1,x:0}:{}} transition={{ delay:0.4+i*0.05 }}
                  onMouseEnter={() => setHovered(town.name)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:12,
                    background: hovered===town.name ? 'rgba(255,107,168,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${hovered===town.name ? 'rgba(255,107,168,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    cursor:'default', transition:'all 0.2s' }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:'#FF6BA8', boxShadow:'0 0 6px rgba(255,107,168,0.6)', flexShrink:0, opacity: 0.4 + town.count/80 }}/>
                  <div style={{ flex:1, fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.8)' }}>{town.name}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    {/* Bar */}
                    <div style={{ width:60, height:4, borderRadius:2, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                      <motion.div initial={{ width:0 }} animate={inView?{width:`${(town.count/47)*100}%`}:{}} transition={{ delay:0.6+i*0.05, duration:0.8 }}
                        style={{ height:'100%', background:'linear-gradient(90deg,#C4698A,#FF6BA8)', borderRadius:2 }}/>
                    </div>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'#FF6BA8', minWidth:28, textAlign:'right' }}>{town.count}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div initial={{ opacity:0 }} animate={inView?{opacity:1}:{}} transition={{ delay:1.2 }}
              style={{ marginTop:20, padding:'16px 20px', borderRadius:16, background:'rgba(255,107,168,0.06)', border:'1px solid rgba(255,107,168,0.2)', textAlign:'center' }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(245,238,242,0.7)', marginBottom:12 }}>
                Nejste na mapě? Přijedu i k vám! 💕
              </div>
              <a href="/rezervace" style={{ display:'inline-block', padding:'11px 28px', borderRadius:50, background:'linear-gradient(135deg,#C4698A,#FF6BA8)', color:'white', textDecoration:'none', fontFamily:'Georgia,serif', fontSize:13, boxShadow:'0 0 20px rgba(255,107,168,0.3)' }}>
                Rezervovat termín →
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
