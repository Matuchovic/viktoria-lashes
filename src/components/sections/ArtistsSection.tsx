'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const TITLES = ['Zakladatelka', 'Vaše stylistka']

export function ArtistsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [titleIdx, setTitleIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTitleIdx(i => (i + 1) % TITLES.length), 2500)
    return () => clearInterval(t)
  }, [])

  return (
    <section id="stylistky" className="bg-black-3 px-8 md:px-16 py-32 overflow-hidden">
      <motion.div ref={ref} initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8}} className="mb-16">
        <div className="section-label mb-5">O mně</div>
        <h2 className="section-title">Vaše stylistka</h2>
      </motion.div>

      {/* Centered card */}
      <div className="flex justify-center">
        <motion.div
          initial={{opacity:0,y:40}} animate={inView?{opacity:1,y:0}:{}}
          transition={{duration:0.9,ease:[0.16,1,0.3,1]}}
          className="relative w-full max-w-2xl overflow-hidden"
          style={{ background:'rgba(255,255,255,0.03)' }}
        >
          {/* Animated border chase */}
          {['top','right','bottom','left'].map((side,i) => (
            <motion.div key={side} className="absolute pointer-events-none"
              style={{
                ...(side==='top'    ? {top:0,left:0,right:0,height:2} : {}),
                ...(side==='right'  ? {top:0,right:0,bottom:0,width:2} : {}),
                ...(side==='bottom' ? {bottom:0,left:0,right:0,height:2} : {}),
                ...(side==='left'   ? {top:0,left:0,bottom:0,width:2} : {}),
                background: side==='top'||side==='bottom'
                  ? 'linear-gradient(90deg,transparent,#FF6BA8,#D4AA70,transparent)'
                  : 'linear-gradient(180deg,transparent,#FF6BA8,#D4AA70,transparent)',
              }}
              animate={{
                ...(side==='top'    ? {scaleX:[0,1,1,0],x:['0%','0%','0%','0%']} : {}),
                ...(side==='right'  ? {scaleY:[0,1,1,0]} : {}),
                ...(side==='bottom' ? {scaleX:[0,1,1,0],originX:1} : {}),
                ...(side==='left'   ? {scaleY:[0,1,1,0],originY:1} : {}),
              }}
              transition={{duration:4,delay:i,repeat:Infinity,ease:'linear'}}
            />
          ))}

          {/* Corner accents */}
          {[{t:'top-0 left-0',b:'border-t-2 border-l-2'},{t:'top-0 right-0',b:'border-t-2 border-r-2'},{t:'bottom-0 left-0',b:'border-b-2 border-l-2'},{t:'bottom-0 right-0',b:'border-b-2 border-r-2'}].map((c,i)=>(
            <div key={i} className={`absolute ${c.t} ${c.b} w-5 h-5 pointer-events-none`}
              style={{borderColor:'rgba(255,107,168,0.6)',boxShadow:'0 0 10px rgba(255,107,168,0.3)'}}/>
          ))}

          <div className="relative z-10 p-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Avatar column */}
            <div className="flex flex-col items-center gap-5">
              <div className="relative w-36 h-36">
                {/* Dual orbit */}
                <motion.div animate={{rotate:360}} transition={{duration:7,repeat:Infinity,ease:'linear'}}
                  className="absolute inset-[-14px] rounded-full" style={{border:'1px dashed rgba(255,107,168,0.25)'}}>
                  <div className="absolute w-2.5 h-2.5 rounded-full top-0 left-1/2 -translate-x-1/2"
                    style={{background:'#FF6BA8',boxShadow:'0 0 10px #FF6BA8, 0 0 20px #FF6BA8'}}/>
                </motion.div>
                <motion.div animate={{rotate:-360}} transition={{duration:11,repeat:Infinity,ease:'linear'}}
                  className="absolute inset-[-26px] rounded-full" style={{border:'1px dashed rgba(212,170,112,0.18)'}}>
                  <div className="absolute w-2 h-2 rounded-full top-0 left-1/2 -translate-x-1/2"
                    style={{background:'#D4AA70',boxShadow:'0 0 8px #D4AA70'}}/>
                </motion.div>
                {/* Avatar */}
                <div className="w-full h-full rounded-full flex items-center justify-center"
                  style={{background:'linear-gradient(135deg,#1a0510,#2d0a1e)',border:'1px solid rgba(255,107,168,0.35)',
                    boxShadow:'0 0 50px rgba(255,107,168,0.2),inset 0 1px 0 rgba(255,255,255,0.07)'}}>
                  <span className="font-serif text-6xl font-light" style={{
                    background:'linear-gradient(135deg,#E8A4BE,#FF6BA8,#D4AA70)',
                    WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
                    filter:'drop-shadow(0 0 12px rgba(255,107,168,0.6))',animation:'shimmer 4s linear infinite',backgroundSize:'200% auto',
                  }}>V</span>
                </div>
              </div>

              <div className="text-center">
                <div className="font-serif text-2xl font-light mb-3"
                  style={{textShadow:'0 0 20px rgba(255,107,168,0.2)'}}>Viktória Ladiková</div>
                {/* Rotating title — only 2 */}
                <div style={{height:24,overflow:'hidden',position:'relative'}}>
                  <AnimatePresence mode="wait">
                    <motion.div key={titleIdx}
                      initial={{y:24,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-24,opacity:0}}
                      transition={{duration:0.4,ease:[0.16,1,0.3,1]}}
                      className="absolute inset-x-0 text-center font-sans font-light tracking-[4px] uppercase"
                      style={{fontSize:11,color:'#FF6BA8',textShadow:'0 0 20px rgba(255,107,168,0.8)'}}>
                      {TITLES[titleIdx]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {['Klasické řasy','Mega Volume','Wet Look','Objemové'].map(s=>(
                  <span key={s} className="text-[10px] tracking-wider px-3 py-1"
                    style={{border:'1px solid rgba(255,255,255,0.1)',color:'rgba(245,238,242,0.4)'}}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Info column */}
            <div className="flex flex-col gap-5">
              {[
                {icon:'✦',label:'Zkušenosti',       value:'4+ roky v oboru'},
                {icon:'◈',label:'Oblast působení',   value:'Mladá Boleslav & okolí'},
                {icon:'🏠',label:'Přijíždím k Vám',  value:'Domů, za dokonalostí'},
                {icon:'❋',label:'Specializace',      value:'Klasické · Volume · Mega'},
              ].map((item,i)=>(
                <motion.div key={item.label}
                  initial={{opacity:0,x:20}} animate={inView?{opacity:1,x:0}:{}}
                  transition={{delay:0.4+i*0.1}} whileHover={{x:4}}
                  className="flex items-start gap-4 pb-4"
                  style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <span style={{fontSize:15,color:'#FF6BA8',textShadow:'0 0 12px rgba(255,107,168,0.6)',minWidth:20}}>{item.icon}</span>
                  <div>
                    <div className="font-sans font-light tracking-[2px] uppercase mb-0.5" style={{fontSize:10,color:'rgba(245,238,242,0.3)'}}>{item.label}</div>
                    <div className="font-serif font-light" style={{fontSize:15,color:'rgba(245,238,242,0.8)'}}>{item.value}</div>
                  </div>
                </motion.div>
              ))}
              <p className="text-text-muted font-light leading-relaxed text-sm">
                S více než 4 lety zkušeností přijíždím přímo k Vám domů —
                pro maximální komfort a luxusní výsledky.
              </p>
              <Link href="/rezervace" className="btn-primary self-start">Rezervovat →</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
