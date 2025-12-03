export interface Event {
  id: string
  title: string
  description: string | null
  date: string // ISO date string
  location: string
  distance: string
  elevation: string | null
  price: number
  max_participants: number
  current_participants: number
  registration_open: boolean
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface CreateEvent {
  title: string
  description?: string
  date: string
  location: string
  distance: string
  elevation?: string
  price: number
  max_participants?: number
  current_participants?: number
  registration_open?: boolean
  image_url?: string
}

export interface UpdateEvent {
  title?: string
  description?: string
  date?: string
  location?: string
  distance?: string
  elevation?: string
  price?: number
  max_participants?: number
  current_participants?: number
  registration_open?: boolean
  image_url?: string
}