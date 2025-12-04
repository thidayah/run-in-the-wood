import { NextRequest, NextResponse } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-response'
import { supabaseServer } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

interface PaymentUpdateDTO {
  status: 'paid' | 'expired' | 'cancelled'
  payment_date?: string
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body: PaymentUpdateDTO = await request.json()
    
    if (!id) {
      return NextResponse.json(
        errorResponse('Participant ID is required'),
        { status: 400 }
      )
    }
    
    if (!body.status) {
      return NextResponse.json(
        errorResponse('Payment status is required'),
        { status: 400 }
      )
    }

    // Get current participant data
    const { data: participant, error: participantError } = await supabaseServer
      .from('participants')
      .select('*, events!inner(*)')
      .eq('id', id)
      .single()
    
    if (participantError || !participant) {
      return NextResponse.json(
        errorResponse('Participant not found'),
        { status: 404 }
      )
    }
    
    // Prepare update data
    const updateData: any = {
      payment_status: body.status,
      payment_date: body.payment_date,
      updated_at: new Date().toISOString()
    }
    
    if (body.status === 'paid' && !participant.payment_date) {
      updateData.payment_date = body.payment_date || new Date().toISOString()
    }
    
    // Update participant payment status
    const { data: updatedParticipant, error: updateError } = await supabaseServer
      .from('participants')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (updateError) {
      console.error('Update participant payment error:', updateError)
      return NextResponse.json(
        errorResponse('Failed to update payment status', updateError),
        { status: 500 }
      )
    }
    
    // If payment is cancelled, decrement event participant count
    if (body.status === 'cancelled' && participant.payment_status !== 'cancelled') {
      const { error: eventUpdateError } = await supabaseServer
        .from('events')
        .update({
          current_participants: Math.max(0, participant.events.current_participants - 1),
          updated_at: new Date().toISOString()
        })
        .eq('id', participant.event_id)
      
      if (eventUpdateError) {
        console.error('Decrement event participants error:', eventUpdateError)
      }
    }
    
    // If payment changed from cancelled to paid, increment count
    if (body.status === 'paid' && participant.payment_status === 'cancelled') {
      const { error: eventUpdateError } = await supabaseServer
        .from('events')
        .update({
          current_participants: participant.events.current_participants + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', participant.event_id)
      
      if (eventUpdateError) {
        console.error('Increment event participants error:', eventUpdateError)
      }
    }
    
    return NextResponse.json(
      successResponse(updatedParticipant, 'Payment status updated successfully'),
      { status: 200 }
    )
    
  } catch (error: any) {
    console.error('PUT /api/participants/[id]/payment error:', error)
    
    return NextResponse.json(
      errorResponse('Internal server error', error),
      { status: 500 }
    )
  }
}