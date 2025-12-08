import { ApiResponse } from '@/lib/api-response'
import { CreateEvent, UpdateEvent } from "./supabase/events/types"
import { CreateParticipant, Participant, ParticipantsResponse } from "./supabase/participants/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL + '/api' || '/api'

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
  create: (eventData: CreateEvent) => 
    apiRequest<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),

  // // PUT update event
  update: (id: string, eventData: UpdateEvent) => 
    apiRequest<Event>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }),

  // // DELETE event
  delete: (id: string) => 
    apiRequest<null>(`/events/${id}`, {
      method: 'DELETE',
    }),

  // GET upcoming events
  getUpcoming: (limit?: number) =>
    apiRequest<Event[]>(`/events/upcoming${limit ? `?limit=${limit}` : ''}`),
}

export const participantsApi = {
  // GET all participants with filters
  getAll: (params?: {
    page?: number
    limit?: number
    event_id?: string
    search?: string
    payment_status?: string
    sort_by?: string
    sort_order?: string
  }) => {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.event_id) queryParams.append('event_id', params.event_id)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.payment_status) queryParams.append('payment_status', params.payment_status)
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order)

    const queryString = queryParams.toString()
    return apiRequest<ParticipantsResponse>(
      `/participants${queryString ? `?${queryString}` : ''}`
    )
  },

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
  getByCode: (code: string) =>
    apiRequest<Participant>(`/participants/code/${code}`),

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