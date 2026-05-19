import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      colors: {
        pink: {
          neon:  '#FF6BA8',
          deep:  '#C4698A',
          soft:  '#E8A4BE',
          glow:  'rgba(255,107,168,0.25)',
          muted: 'rgba(232,164,190,0.15)',
        },
        gold: {
          DEFAULT: '#D4AA70',
          light:   '#E8C98A',
        },
        black: {
          DEFAULT: '#080608',
          2:       '#0F0A0D',
          3:       '#150E12',
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.04)',
          border:  'rgba(255,255,255,0.08)',
          hover:   'rgba(255,255,255,0.07)',
        },
        text: {
          primary: '#F5EEF2',
          muted:   'rgba(245,238,242,0.5)',
          dim:     'rgba(245,238,242,0.25)',
        },
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(196,105,138,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 20% 80%, rgba(255,107,168,0.06) 0%, transparent 50%)',
        'pink-gradient': 'linear-gradient(135deg, #C4698A 0%, #FF6BA8 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4AA70 0%, #E8C98A 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)', opacity: '0.6' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,107,168,0.2)' },
          '50%': { boxShadow: '0 0 60px rgba(255,107,168,0.5), 0 0 100px rgba(255,107,168,0.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'border-glow': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        orbit: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'counter-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        marquee: 'marquee 30s linear infinite',
        'border-glow': 'border-glow 2s ease-in-out infinite',
        orbit: 'orbit 20s linear infinite',
        'orbit-reverse': 'orbit 30s linear infinite reverse',
        'counter-up': 'counter-up 0.6s ease-out forwards',
      },
      boxShadow: {
        'pink-sm':  '0 0 20px rgba(255,107,168,0.2)',
        'pink-md':  '0 0 40px rgba(255,107,168,0.3)',
        'pink-lg':  '0 0 80px rgba(255,107,168,0.4)',
        'pink-xl':  '0 20px 60px rgba(255,107,168,0.4)',
        'glass':    'inset 0 1px 0 rgba(255,255,255,0.08)',
        'gold':     '0 0 30px rgba(212,170,112,0.3)',
      },
      borderRadius: {
        none: '0',
      },
    },
  },
  plugins: [animate],
}

export default config
