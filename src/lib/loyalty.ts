import { prisma } from './prisma'

export const TIER_THRESHOLDS = {
  BEGINNER: 0,
  LOVER: 1000,
  QUEEN: 3000,
  ELITE: 6000,
}

export function getTier(points: number): string {
  if (points >= 6000) return 'ELITE'
  if (points >= 3000) return 'QUEEN'
  if (points >= 1000) return 'LOVER'
  return 'BEGINNER'
}

export const TIER_INFO = {
  BEGINNER: { label:'Lash Beginner', icon:'🌸', color:'#C4698A', discount:5 },
  LOVER:    { label:'Lash Lover',    icon:'💕', color:'#D4589A', discount:10 },
  QUEEN:    { label:'Lash Queen',    icon:'✨', color:'#D86AB0', discount:15 },
  ELITE:    { label:'Viktória Elite',icon:'👑', color:'#D4AA70', discount:20 },
}

export const REWARDS = [
  { id:'r1', points:500,  label:'Sleva 50 Kč',       valueKc:50  },
  { id:'r2', points:1000, label:'Odstranění zdarma',  valueKc:99  },
  { id:'r3', points:2000, label:'Sleva 200 Kč',       valueKc:200 },
  { id:'r4', points:3500, label:'Doplnění zdarma',    valueKc:199 },
  { id:'r5', points:5000, label:'Mega Volume −50 %',  valueKc:400 },
]

export const LASH_PASS_CHALLENGES = [
  { id:'c1', label:'Rezervuj 1 návštěvu',     points:200 },
  { id:'c2', label:'Napiš recenzi',           points:150 },
  { id:'c3', label:'Vyzkoušej novou techniku',points:300 },
  { id:'c4', label:'Doplnění do 3 týdnů',     points:100 },
  { id:'c5', label:'Přiveď kamarádku',        points:500 },
  { id:'c6', label:'Sdílej na Instagramu',    points:100 },
]

export async function addPoints(userId: string, points: number, reason: string) {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { loyaltyPoints: { increment: points } },
    }),
    prisma.lashPointsHistory.create({
      data: { userId, points, reason },
    }),
  ])
}

export async function awardRegistrationBonus(userId: string) {
  await addPoints(userId, 250, 'Uvítací bonus za registraci 🌸')
}
