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