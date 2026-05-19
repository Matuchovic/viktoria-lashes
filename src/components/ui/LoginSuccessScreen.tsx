'use client'
import { motion, AnimatePresence } from 'framer-motion'

export function LoginSuccessScreen({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#080608' }}
        >
          {/* Radial glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%,rgba(196,105,138,0.15) 0%,transparent 70%)' }}/>
          <div className="absolute inset-0 hero-grid-bg" style={{ opacity: 0.2 }}/>

          {/* Orbit rings */}
          {[{s:400,d:'20s'},{s:600,d:'30s',rev:true}].map((r,i)=>(
            <div key={i} className="absolute rounded-full pointer-events-none"
              style={{width:r.s,height:r.s,left:'50%',top:'50%',marginLeft:-r.s/2,marginTop:-r.s/2,
                border:'1px solid rgba(255,107,168,0.08)',
                animation:`orbit ${r.d} linear infinite${(r as any).rev?' reverse':''}`}}/>
          ))}

          {/* Pink checkmark */}
          <div className="relative mb-8">
            {/* Outer glow ring */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0, 0.6, 0.3] }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle,rgba(255,107,168,0.4) 0%,transparent 70%)', margin: -20 }}
            />

            {/* Circle */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center"
              style={{
                width: 90, height: 90, borderRadius: '50%',
                background: 'linear-gradient(135deg,#C4698A,#FF6BA8)',
                boxShadow: '0 0 60px rgba(255,107,168,0.6), 0 0 120px rgba(255,107,168,0.3)',
              }}
            >
              {/* Checkmark SVG */}
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <motion.path
                  d="M 8 22 L 18 32 L 36 12"
                  stroke="white"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
                />
              </svg>
            </motion.div>

            {/* Sparkles around circle */}
            {['✦','✸','◈','❋'].map((s,i) => (
              <motion.span key={s}
                className="absolute font-serif pointer-events-none"
                style={{
                  fontSize: 12 + i * 2,
                  color: i % 2 === 0 ? '#FF6BA8' : '#D4AA70',
                  textShadow: `0 0 12px ${i % 2 === 0 ? '#FF6BA8' : '#D4AA70'}`,
                  top: `${-15 + i * 35}%`,
                  left: i % 2 === 0 ? '-30px' : 'auto',
                  right: i % 2 === 1 ? '-30px' : 'auto',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0.6], scale: [0, 1.3, 1], rotate: [0, 20, -10] }}
                transition={{ duration: 1, delay: 0.6 + i * 0.1, repeat: Infinity, repeatType: 'reverse', repeatDelay: 1 }}
              >
                {s}
              </motion.span>
            ))}
          </div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center px-8"
          >
            <div className="font-sans font-light tracking-[3px] uppercase mb-3"
              style={{ fontSize: 11, color: '#FF6BA8', textShadow: '0 0 15px rgba(255,107,168,0.7)' }}>
              Přihlášení proběhlo úspěšně
            </div>

            <motion.div
              className="font-serif font-light tracking-[6px] uppercase"
              style={{ fontSize: 'clamp(20px,4vw,32px)' }}
            >
              <span style={{
                background: 'linear-gradient(90deg,#E8A4BE 0%,#FF6BA8 30%,#D4AA70 55%,#FF6BA8 80%,#E8A4BE 100%)',
                backgroundSize: '300% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 3s linear infinite',
                filter: 'drop-shadow(0 0 20px rgba(255,107,168,0.5))',
                display: 'inline-block',
              }}>
                Viktória Lashes
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="font-sans font-light tracking-[4px] uppercase mt-3"
              style={{ fontSize: 9, color: 'rgba(245,238,242,0.25)' }}
            >
              Vítejte zpět ✨
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
