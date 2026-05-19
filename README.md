# 🌸 Viktoria Lashes Official

Prémiová webová aplikace pro luxusní řasové studio v Praze.

**Tech Stack:** Next.js 15 · TypeScript · Tailwind CSS · Framer Motion · Prisma · Supabase · NextAuth · Stripe · Nodemailer

---

## 🚀 Spuštění projektu

### 1. Klonovat repozitář

```bash
git clone https://github.com/YOUR_USERNAME/viktoria-lashes.git
cd viktoria-lashes
npm install
```

### 2. Nastavit Supabase

1. Jít na [supabase.com](https://supabase.com) → **New Project**
2. Zapamatovat: **Project URL**, **Anon Key**, **Service Role Key**
3. V **Settings → Database** zkopírovat Connection strings:
   - **URI** (Transaction pooler) → `DATABASE_URL`
   - **URI** (Session pooler nebo Direct) → `DIRECT_URL`

### 3. Vytvořit `.env.local`

```bash
cp .env.example .env.local
# Vyplnit všechny proměnné v .env.local
```

Povinné proměnné:
```
DATABASE_URL=postgresql://postgres.[ref]:[pass]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[ref]:[pass]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

### 4. Inicializovat databázi

```bash
npm run db:push    # Vytvoří tabulky
npm run db:seed    # Naplní testovacími daty
npm run db:studio  # Otevře Prisma Studio (volitelné)
```

### 5. Spustit vývojový server

```bash
npm run dev
# → http://localhost:3000
```

---

## 📁 Struktura projektu

```
viktoria-lashes/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # 🏠 Hlavní landing page
│   │   ├── rezervace/page.tsx          # 📅 Rezervační systém (5 kroků)
│   │   ├── dashboard/page.tsx          # 👤 Zákaznický dashboard
│   │   ├── admin/page.tsx              # 🔧 Admin dashboard
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx          # 🔐 Přihlášení
│   │   │   └── register/page.tsx       # 📝 Registrace
│   │   └── api/
│   │       ├── auth/[...nextauth]/     # NextAuth routes
│   │       ├── auth/register/          # Registrace endpoint
│   │       ├── bookings/               # GET + POST rezervace
│   │       ├── services/               # GET služby
│   │       ├── contact/                # POST kontaktní formulář
│   │       └── admin/stats/            # GET admin statistiky
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx              # Luxusní navigace s mobile menu
│   │   │   ├── Footer.tsx              # Footer s linky a social
│   │   │   └── Providers.tsx           # SessionProvider wrapper
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx         # Hero s particles a parallax
│   │   │   ├── StatsBanner.tsx         # Animované počítadla
│   │   │   ├── ServicesSection.tsx     # Grid 8 služeb
│   │   │   ├── TestimonialsSection.tsx # Infinite marquee recenzí
│   │   │   ├── ArtistsSection.tsx      # Tým 3 stylistek
│   │   │   └── ContactSection.tsx      # Kontakt + formulář
│   │   └── ui/
│   │       ├── CustomCursor.tsx        # Luxusní kurzor s magnetic efektem
│   │       └── Toaster.tsx             # Toast notifikace
│   ├── lib/
│   │   ├── prisma.ts                   # Prisma singleton
│   │   ├── auth.ts                     # NextAuth config
│   │   ├── email.ts                    # Nodemailer šablony
│   │   └── utils.ts                    # Helper funkce
│   └── types/index.ts                  # TypeScript typy
├── prisma/
│   ├── schema.prisma                   # Databázové schéma
│   └── seed.ts                         # Seed data
├── .github/workflows/ci.yml            # GitHub Actions CI/CD
├── vercel.json                         # Vercel konfigurace
└── .env.example                        # Šablona proměnných
```

---

## 🌐 Deployment na Vercel

### Automaticky přes GitHub

1. Pushovat kód na GitHub
2. Jít na [vercel.com](https://vercel.com) → **Import Project**
3. Vybrat repozitář → **Deploy**
4. Přidat Environment Variables v Vercel dashboardu

### GitHub Actions CI/CD

Přidat do GitHub Secrets:
```
VERCEL_TOKEN          # Z Vercel Account Settings
VERCEL_ORG_ID         # Z .vercel/project.json po `vercel link`
VERCEL_PROJECT_ID     # Z .vercel/project.json po `vercel link`
DATABASE_URL          # Supabase connection string
DIRECT_URL            # Supabase direct URL
NEXTAUTH_SECRET       # Random secret
NEXTAUTH_URL          # https://yourdomain.com
```

### Vercel CLI (manuálně)

```bash
npm i -g vercel
vercel login
vercel link        # Propojit projekt
vercel env add     # Přidat proměnné
vercel --prod      # Deploy do produkce
```

---

## 💳 Stripe integrace

```bash
# Nastavit webhook
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Test platby
Karta: 4242 4242 4242 4242
Datum: jakýkoliv budoucí
CVC:   jakékoliv 3 číslice
```

---

## 📧 Email (Nodemailer)

Pro Gmail: Vytvořit **App Password** v Google Account → 2FA → App Passwords

```
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=vas-email@gmail.com
EMAIL_SERVER_PASSWORD=xxxx-xxxx-xxxx-xxxx  # App Password
```

---

## 🔑 Admin přístup

Po seednování databáze:
- **Email:** `admin@viktoralashes.cz`
- **Heslo:** `admin123`
- **URL:** `/admin`

---

## 📱 Features

| Feature | Status |
|---------|--------|
| Landing page + animace | ✅ |
| 5-krokový booking systém | ✅ |
| NextAuth (Credentials + Google) | ✅ |
| Zákaznický dashboard | ✅ |
| Admin dashboard + statistiky | ✅ |
| E-mail potvrzení rezervace | ✅ |
| PostgreSQL + Prisma ORM | ✅ |
| Supabase hosting | ✅ |
| GitHub Actions CI/CD | ✅ |
| Stripe záloha | 🔧 Konfigurace |
| PWA manifest | 🔧 Konfigurace |
| SMS notifikace | 📋 Plánováno |

---

## 🎨 Design systém

- **Primární font:** Cormorant Garamond (serif, luxusní)
- **Sekundární font:** Outfit (sans, moderní)
- **Hlavní barvy:**
  - `#FF6BA8` — Pink Neon (akcent)
  - `#C4698A` — Pink Deep (tlačítka)
  - `#E8A4BE` — Pink Soft (texty)
  - `#D4AA70` — Gold (premium akcent)
  - `#080608` — Deep Black (pozadí)
- **Animace:** Framer Motion + CSS animations
- **Efekty:** Glassmorphism, Particle system, Custom cursor, Parallax

---

*Vytvořeno s ❤️ pro Viktoria Lashes Official, Praha*
