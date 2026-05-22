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
    default: 'Viktória Lashes — Luxusní Řasy | Mladá Boleslav & okolí',
    template: '%s | Viktória Lashes',
  },
  description: 'Prémiové prodlužování řas přímo u Vás doma. Přijedu za Vámi — Mladá Boleslav a okolí. Klasické, objemové, Mega Volume, Wet Look. Rezervujte online.',
  keywords: ['prodlužování řas Mladá Boleslav', 'řasy domů', 'řasové studio', 'mega volume řasy', 'Viktória Lashes', 'luxury beauty', 'lash lifting'],
  authors: [{ name: 'Viktória Lashes Official' }],
  creator: 'Viktória Lashes',
  metadataBase: new URL('https://www.viktoria-lashes.cz'),
  openGraph: {
    title: 'Viktória Lashes — Přijedu k Vám domů 💕',
    description: 'Prémiové prodlužování řas přímo u Vás doma. Mladá Boleslav & okolí. Rezervujte online.',
    url: 'https://www.viktoria-lashes.cz',
    siteName: 'Viktória Lashes',
    locale: 'cs_CZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Viktória Lashes — Přijedu k Vám domů',
    description: 'Prémiové prodlužování řas. Mladá Boleslav & okolí.',
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
