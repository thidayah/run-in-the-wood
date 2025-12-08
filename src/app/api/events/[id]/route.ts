import { NextRequest, NextResponse } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-response'
import { deleteEvent, getEventById, updateEvent } from "@/lib/supabase/events/services"
import { UpdateEvent } from "@/lib/supabase/events/types"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {    
    const { id } = await params  
    
    if (!id) {
      return NextResponse.json(
        errorResponse('Event ID is required'),
        { status: 400 }
      )
    }
    
    const event = await getEventById(id)
    
    if (!event) {
      return NextResponse.json(
        errorResponse('Event not found'),
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      successResponse(event, 'Event retrieved successfully'),
      { status: 200 }
    )
  } catch (error: any) {
    console.error('GET /api/events/[id] error:', error)
    
    return NextResponse.json(
      errorResponse('Failed to retrieve event', error),
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body: UpdateEvent = await request.json()
    
    if (!id) {
      return NextResponse.json(
        errorResponse('Event ID is required'),
        { status: 400 }
      )
    }
    
    // Validate if event exists
    try {
      await getEventById(id)
    } catch {
      return NextResponse.json(
        errorResponse('Event not found'),
        { status: 404 }
      )
    }
    
    const updatedEvent = await updateEvent(id, body)
    
    return NextResponse.json(
      successResponse(updatedEvent, 'Event updated successfully'),
      { status: 200 }
    )
  } catch (error: any) {
    console.error('PUT /api/events/[id] error:', error)
    
    return NextResponse.json(
      errorResponse('Failed to update event', error),
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        errorResponse('Event ID is required'),
        { status: 400 }
      )
    }
    
    // Validate if event exists
    try {
      await getEventById(id)
    } catch {
      return NextResponse.json(
        errorResponse('Event not found'),
        { status: 404 }
      )
    }
    
    await deleteEvent(id)
    
    return NextResponse.json(
      successResponse(null, 'Event deleted successfully'),
      { status: 200 }
    )
  } catch (error: any) {
    console.error('DELETE /api/events/[id] error:', error)
    
    return NextResponse.json(
      errorResponse('Failed to delete event', error),
      { status: 500 }
    )
  }
}