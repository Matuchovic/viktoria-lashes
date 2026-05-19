'use client'
// src/components/ui/Toaster.tsx
import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'
interface Toast { id: string; message: string; type: ToastType }

const ToastCtx = createContext<{ toast: (msg: string, type?: ToastType) => void }>({
  toast: () => {},
})

export function useToast() { return useContext(ToastCtx) }

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])

  return (
    <ToastCtx.Provider value={{ toast }}>
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={cn(
                'glass-card px-6 py-4 flex items-center gap-3 min-w-[280px]',
                'relative overflow-hidden',
                t.type === 'success' && 'border-pink-deep/50',
                t.type === 'error'   && 'border-red-500/50',
                t.type === 'info'    && 'border-gold/50',
              )}
            >
              <span className={cn(
                'text-xl',
                t.type === 'success' && 'text-pink-neon',
                t.type === 'error'   && 'text-red-400',
                t.type === 'info'    && 'text-gold',
              )}>
                {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
              </span>
              <span className="text-sm font-light text-text-muted">{t.message}</span>
              <div
                className={cn(
                  'absolute bottom-0 left-0 h-px',
                  t.type === 'success' ? 'bg-pink-neon' : t.type === 'error' ? 'bg-red-400' : 'bg-gold',
                )}
                style={{ width: '100%', animation: 'shrink 4s linear forwards' }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <style>{`@keyframes shrink { from { width:100% } to { width:0% } }`}</style>
    </ToastCtx.Provider>
  )
}
