import { NextRequest, NextResponse } from 'next/server'
import { createEvent, getAllEvents, getUpcomingEvents } from "@/lib/supabase/events/services"
import { successResponse, errorResponse } from '@/lib/api-response'
import { CreateEvent } from "@/lib/supabase/events/types"

export async function GET(request: NextRequest) {
  try {
    const events = await getAllEvents()
    return NextResponse.json(
      successResponse(events, 'Events retrieved successfully'),
      { status: 200 }
    )
  } catch (error: any) {
    console.error('GET /api/events error:', error)
    
    return NextResponse.json(
      errorResponse('Failed to retrieve events', error),
      { status: 500 }
    )
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     const body: CreateEvent = await request.json()
    
//     // Validation
//     if (!body.title || !body.date || !body.location || !body.distance || body.price === undefined) {
//       return NextResponse.json(
//         errorResponse('Missing required fields: title, date, location, distance, price'),
//         { status: 400 }
//       )
//     }
    
//     const event = await createEvent(body)
    
//     return NextResponse.json(
//       successResponse(event, 'Event created successfully'),
//       { status: 201 }
//     )
//   } catch (error: any) {
//     console.error('POST /api/events error:', error)
    
//     return NextResponse.json(
//       errorResponse('Failed to create event', error),
//       { status: 500 }
//     )
//   }
// }