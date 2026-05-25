'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function getVisitorId() {
  let id = localStorage.getItem('vl_visitor_id')
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('vl_visitor_id', id)
  }
  return id
}

export function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const visitorId = getVisitorId()

    const ping = () => {
      fetch('/api/analytics/online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId, page: pathname }),
      }).catch(() => {})
    }

    ping() // immediate ping
    const interval = setInterval(ping, 20000) // every 20s
    return () => clearInterval(interval)
  }, [pathname])

  return null
}
