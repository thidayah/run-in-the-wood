import { supabaseServer } from "../server"
import { Event, CreateEvent, UpdateEvent } from '@/lib/supabase/events/types'

// Get all events
export async function getAllEvents() {
  const { data, error } = await supabaseServer
    .from('events')
    .select('*')
    .order('date', { ascending: true })
  
  if (error) throw error
  return data as Event[]
}

// Get upcoming events
export async function getUpcomingEvents(limit?: number) {
  const today = new Date().toISOString().split('T')[0]
  
  let query = supabaseServer
    .from('events')
    .select('*')
    .gte('date', today)
    .eq('registration_open', true)
    .order('date', { ascending: true })
  
  if (limit) {
    query = query.limit(limit)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data as Event[]
}

// Get event by ID
export async function getEventById(id: string) {
  const { data, error } = await supabaseServer
    .from('events')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data as Event
}

// Create new event
export async function createEvent(eventData: CreateEvent) {
  const { data, error } = await supabaseServer
    .from('events')
    .insert([eventData])
    .select()
    .single()
  
  if (error) throw error
  return data as Event
}

// Update event
export async function updateEvent(id: string, eventData: UpdateEvent) {
  const { data, error } = await supabaseServer
    .from('events')
    .update(eventData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Event
}

// Delete event
export async function deleteEvent(id: string) {
  const { error } = await supabaseServer
    .from('events')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Increment participant count
// export async function incrementParticipants(id: string) {
//   const { data, error } = await supabaseServer.rpc('increment_participants', {
//     event_id: id
//   })
  
//   if (error) throw error
//   return data
// }

// Check if event has available slots
// export async function checkEventAvailability(id: string) {
//   const event = await getEventById(id)
  
//   return {
//     available: event.registration_open && 
//                event.current_participants < event.max_participants,
//     remaining_slots: event.max_participants - event.current_participants,
//     event
//   }
// }