export interface Participant {
  id: string
  event_id: string
  full_name: string
  email: string
  phone_number: string
  birth_date: string
  gender: 'male' | 'female' | 'other'
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_notes?: string
  registration_date: string
  unique_code: string
  payment_status: 'pending' | 'paid' | 'expired' | 'cancelled'
  payment_amount: number
  payment_date?: string
  created_at: string
  updated_at: string
}

export interface CreateParticipant {
  event_id: string
  full_name: string
  email: string
  phone_number: string
  birth_date: string
  gender: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_notes?: string
  payment_amount?: number
}

export interface UpdateParticipant {
  payment_status?: 'pending' | 'paid' | 'expired' | 'cancelled'
  payment_date?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_notes?: string
}

export interface ParticipantsResponse {
  items: ParticipantDetailResponse[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
    next_page: number | null
    prev_page: number | null
  }
  filters: {
    event_id?: string
    search?: string
    payment_status?: string
    sort_by: string
    sort_order: string
  }
}

// export interface ParticipantsQueryParams {
//   page?: number
//   limit?: number
//   event_id?: string
//   search?: string
//   payment_status?: string
//   sort_by?: string
//   sort_order?: 'asc' | 'desc'
// }

export interface ParticipantDetailResponse {
  id: string
  event_id: string
  full_name: string
  email: string
  phone_number: string
  birth_date: string
  gender: 'male' | 'female' | 'other'
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_notes?: string
  registration_date: string
  unique_code: string
  payment_status: 'pending' | 'paid' | 'expired' | 'cancelled'
  payment_amount: number
  payment_date?: string
  created_at: string
  updated_at: string
  event: {
    id: string
    title: string
    date: string
    location: string
    distance: string
    elevation: string
    price: number
    registration_open: boolean
    image_url?: string
  }
}

export interface ParticipantWithEvent extends Participant {
  events: {
    id: string
    title: string
    date: string
    location: string
    distance: string
    elevation: string
  }
}