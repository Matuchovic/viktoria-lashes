// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, addMinutes, parse, startOfDay, eachMinuteOfInterval } from 'date-fns'
import { cs } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return amount.toLocaleString('cs-CZ') + ' Kč'
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'd. MMMM yyyy', { locale: cs })
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'EEEE d. MMM', { locale: cs })
}

export function generateTimeSlots(
  startTime: string = '09:00',
  endTime: string = '20:00',
  intervalMin: number = 30
): string[] {
  const base = new Date(2000, 0, 1)
  const start = parse(startTime, 'HH:mm', base)
  const end = parse(endTime, 'HH:mm', base)

  const slots: string[] = []
  let current = start
  while (current < end) {
    slots.push(format(current, 'HH:mm'))
    current = addMinutes(current, intervalMin)
  }
  return slots
}

export function getAvailableSlots(
  allSlots: string[],
  bookedSlots: { time: string; durationMin: number }[],
  serviceDuration: number
): { time: string; available: boolean }[] {
  const bookedTimes = new Set<string>()

  bookedSlots.forEach(({ time, durationMin }) => {
    const base = new Date(2000, 0, 1)
    const start = parse(time, 'HH:mm', base)
    const blockedSlots = Math.ceil(durationMin / 30)
    for (let i = 0; i < blockedSlots; i++) {
      bookedTimes.add(format(addMinutes(start, i * 30), 'HH:mm'))
    }
  })

  return allSlots.map(time => {
    const base = new Date(2000, 0, 1)
    const start = parse(time, 'HH:mm', base)
    const slotsNeeded = Math.ceil(serviceDuration / 30)

    let available = true
    for (let i = 0; i < slotsNeeded; i++) {
      if (bookedTimes.has(format(addMinutes(start, i * 30), 'HH:mm'))) {
        available = false
        break
      }
    }
    return { time, available }
  })
}

export const CZECH_DAYS = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota']
export const CZECH_MONTHS = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince']

export function formatBookingDate(dateStr: string, time: string): string {
  const d = new Date(dateStr)
  return `${CZECH_DAYS[d.getDay()]} ${d.getDate()}. ${CZECH_MONTHS[d.getMonth()]} ${d.getFullYear()} v ${time}`
}

export const SERVICE_ICONS: Record<string, string> = {
  CLASSIC: '✦',
  VOLUME: '❋',
  MEGA_VOLUME: '✸',
  WET_LOOK: '◈',
  HYBRID: '❖',
  INFILL: '◉',
  LIFTING: '⌁',
  REMOVAL: '○',
}

export const BOOKING_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:   { label: 'Čeká na potvrzení', color: 'text-gold' },
  CONFIRMED: { label: 'Potvrzeno',          color: 'text-green-400' },
  CANCELLED: { label: 'Zrušeno',            color: 'text-red-400' },
  COMPLETED: { label: 'Dokončeno',          color: 'text-pink-soft' },
  NO_SHOW:   { label: 'Nedostavil/a se',    color: 'text-text-dim' },
}
