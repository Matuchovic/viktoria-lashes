// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Outfit } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { Toaster } from '@/components/ui/Toaster'
import { ViktoriaChatbot } from '@/components/ui/ViktoriaChatbot'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Viktória Lashes — Luxusní Řasové Studio Praha',
    template: '%s | Viktória Lashes',
  },
  description: 'Prémiové prodlužování řas v srdci Prahy. Klasické, objemové, mega volume, wet look a hybridní techniky. Rezervujte online — výsledky, které promění váš pohled.',
  keywords: ['prodlužování řas Praha', 'řasové studio', 'mega volume', 'lash lifting', 'Viktória Lashes', 'luxury beauty'],
  authors: [{ name: 'Viktória Lashes Official' }],
  creator: 'Viktória Lashes',
  openGraph: {
    title: 'Viktória Lashes — Luxusní Řasové Studio Praha',
    description: 'Prémiové prodlužování řas. Rezervujte online.',
    url: 'https://viktoralashes.cz',
    siteName: 'Viktória Lashes',
    locale: 'cs_CZ',
    type: 'website',
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#080608',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="bg-black text-text-primary antialiased font-sans cursor-none selection:bg-pink-neon/20 selection:text-pink-neon">
        <Providers>
          {children}
          <Toaster />
          <ViktoriaChatbot />
        </Providers>
      </body>
    </html>
  )
}
