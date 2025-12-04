import { NextRequest, NextResponse } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-response'
import { supabaseServer } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {    
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        errorResponse('Unique code is required'),
        { status: 400 }
      )
    }
    
    // Get participant with event details
    const { data: participant, error } = await supabaseServer
      .from('participants')
      .select(`
        *,
        events (
          id,
          title,
          date,
          location,
          distance,
          elevation,
          price,
          registration_open,
          image_url
        )
      `)
      .eq('unique_code', id)
      .single()
    
    if (error || !participant) {
      return NextResponse.json(
        errorResponse('Participant not found with this code'),
        { status: 404 }
      )
    }
    
    // Format response data
    const responseData = {
      ...participant,
      event: participant.events
    }
    
    // Remove nested events object
    delete responseData.events
    
    return NextResponse.json(
      successResponse(responseData, 'Participant retrieved successfully'),
      { status: 200 }
    )
    
  } catch (error: any) {
    console.error('GET /api/participants/code/[id] error:', error)
    
    return NextResponse.json(
      errorResponse('Failed to retrieve participant', error),
      { status: 500 }
    )
  }
}