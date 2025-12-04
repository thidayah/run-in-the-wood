import { NextRequest, NextResponse } from 'next/server'
import { getUpcomingEvents } from "@/lib/supabase/events/services"
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const events = await getUpcomingEvents(parseInt(searchParams.get('limit') || '3'))
    return NextResponse.json(
      successResponse(events, 'Upcoming Events retrieved successfully'),
      { status: 200 }
    )
  } catch (error: any) {
    console.error('GET /api/events/upcoming error:', error)

    return NextResponse.json(
      errorResponse('Failed to retrieve upcoming events', error),
      { status: 500 }
    )
  }
}