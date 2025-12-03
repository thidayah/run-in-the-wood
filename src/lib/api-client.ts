import { ApiResponse } from '@/lib/api-response'
import { CreateEvent, UpdateEvent } from "./supabase/events/types"
import { CreateParticipant, Participant } from "./supabase/participants/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL+'/api' || '/api'

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data: ApiResponse<T> = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }
    
    return data
  } catch (error: any) {
    console.error('API request error:', error)
    throw error
  }
}

// Event-specific API calls
export const eventsApi = {
  // GET all events
  getAll: () => apiRequest<Event[]>('/events'),
  
  // GET event by ID
  getById: (id: string) => apiRequest<Event>(`/events/${id}`),
  
  // POST create event
  // create: (eventData: CreateEvent) => 
  //   apiRequest<Event>('/events', {
  //     method: 'POST',
  //     body: JSON.stringify(eventData),
  //   }),
  
  // // PUT update event
  // update: (id: string, eventData: UpdateEvent) => 
  //   apiRequest<Event>(`/events/${id}`, {
  //     method: 'PUT',
  //     body: JSON.stringify(eventData),
  //   }),
  
  // // DELETE event
  // delete: (id: string) => 
  //   apiRequest<null>(`/events/${id}`, {
  //     method: 'DELETE',
  //   }),
  
  // // GET upcoming events
  // getUpcoming: (limit?: number) => 
  //   apiRequest<Event[]>(`/events/upcoming${limit ? `?limit=${limit}` : ''}`),
}

export const participantsApi = {
  // POST create participant
  create: (participantData: CreateParticipant) => 
    apiRequest<{
      participant: Participant
      unique_code: string
      message: string
    }>('/participants', {
      method: 'POST',
      body: JSON.stringify(participantData),
    }),
  
  // GET participant by unique code
  // getByCode: (code: string) => 
  //   apiRequest<Participant>(`/participants/code/${code}`),
  
  // PUT update participant payment status
  updatePayment: (id: string, paymentData: { 
    status: 'paid' | 'expired' | 'cancelled'
    payment_date?: string 
  }) =>
    apiRequest<Participant>(`/participants/${id}/payment`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    }),
}