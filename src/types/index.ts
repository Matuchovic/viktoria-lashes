// src/types/index.ts

export type ServiceCategory =
  | 'CLASSIC'
  | 'VOLUME'
  | 'MEGA_VOLUME'
  | 'WET_LOOK'
  | 'HYBRID'
  | 'INFILL'
  | 'LIFTING'
  | 'REMOVAL'

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW'

export type UserRole = 'CUSTOMER' | 'ARTIST' | 'ADMIN'

export interface Service {
  id: string
  name: string
  nameCs: string
  description: string
  descriptionCs: string
  category: ServiceCategory
  priceKc: number
  durationMin: number
  depositPercent: number
  isActive: boolean
  sortOrder: number
}

export interface Artist {
  id: string
  name: string
  title: string
  titleCs: string
  bio: string
  bioCs: string
  avatarUrl: string | null
  yearsExp: number
  clientCount: number
  certCount: number
  specialties: string[]
  isActive: boolean
}

export interface TimeSlot {
  time: string       // "09:00"
  available: boolean
  bookingId?: string
}

export interface Booking {
  id: string
  bookingRef: string
  serviceId: string
  service: Service
  artistId: string
  artist: Artist
  userId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string       // "2026-01-15"
  time: string       // "10:00"
  status: BookingStatus
  notes: string | null
  totalKc: number
  depositKc: number
  depositPaid: boolean
  stripeSessionId: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateBookingInput {
  serviceId: string
  artistId: string
  date: string
  time: string
  customerName: string
  customerEmail: string
  customerPhone: string
  notes?: string
}

export interface AdminStats {
  totalBookings: number
  confirmedBookings: number
  cancelledBookings: number
  revenueThisMonth: number
  revenueLastMonth: number
  newCustomers: number
  totalCustomers: number
  popularService: string
  occupancyRate: number
}

export interface GalleryItem {
  id: string
  src: string
  alt: string
  category: string
  label: string
}

export interface Testimonial {
  id: string
  authorName: string
  initials: string
  text: string
  rating: number
  source: string
  date: string
}
