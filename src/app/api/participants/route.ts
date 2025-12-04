import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from "@/lib/supabase/server"
import { successResponse, errorResponse } from '@/lib/api-response'
import { CreateParticipant } from "@/lib/supabase/participants/types"

// interface CreateParticipantDTO {
//   event_id: string
//   full_name: string
//   email: string
//   phone_number: string
//   birth_date: string
//   gender: 'male' | 'female' | 'other'
//   emergency_contact_name?: string
//   emergency_contact_phone?: string
//   medical_notes?: string
//   payment_amount: number
// }

export async function POST(request: NextRequest) {
  try {
    const body: CreateParticipant = await request.json()

    // Validation
    const requiredFields = [
      'event_id',
      'full_name',
      'email',
      'phone_number',
      'birth_date',
      'gender',
      'payment_amount'
    ]

    const missingFields = requiredFields.filter(field => !body[field as keyof CreateParticipant])

    if (missingFields.length > 0) {
      return NextResponse.json(
        errorResponse(`Missing required fields: ${missingFields.join(', ')}`),
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        errorResponse('Invalid email format'),
        { status: 400 }
      )
    }

    // Check if event exists and registration is open
    const { data: event, error: eventError } = await supabaseServer
      .from('events')
      .select('id, title, price, max_participants, current_participants, registration_open')
      .eq('id', body.event_id)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        errorResponse('Event not found'),
        { status: 404 }
      )
    }

    if (!event.registration_open) {
      return NextResponse.json(
        errorResponse('Registration for this event is closed'),
        { status: 400 }
      )
    }

    // Check if event has available slots
    if (event.current_participants >= event.max_participants) {
      return NextResponse.json(
        errorResponse('Event is fully booked'),
        { status: 400 }
      )
    }

    // Check if email already registered for this event
    const { data: existingParticipant } = await supabaseServer
      .from('participants')
      .select('id')
      .eq('event_id', body.event_id)
      .eq('email', body.email)
      .neq('payment_status', 'cancelled')
      .single()

    if (existingParticipant) {
      return NextResponse.json(
        errorResponse('Email already registered for this event'),
        { status: 400 }
      )
    }

    // Generate unique code (RITW{year}-{6 digits})
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000)
    const twoDigitYear = new Date().getFullYear().toString().slice(-2) || '00'
    const uniqueCode = `RITW${twoDigitYear}-${randomDigits}`

    // Insert participant data
    const { data: participant, error: insertError } = await supabaseServer
      .from('participants')
      .insert([{
        ...body,
        unique_code: uniqueCode,
        payment_status: 'pending',
        registration_date: new Date().toISOString()
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Insert participant error:', insertError)
      return NextResponse.json(
        errorResponse('Failed to create participant', insertError),
        { status: 500 }
      )
    }

    // Update event participant count manually
    const { error: updateError } = await supabaseServer
      .from('events')
      .update({
        current_participants: event.current_participants + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', body.event_id)
      .gte('current_participants', event.current_participants) // Optimistic lock
      .select('current_participants')
      .single()

    if (updateError) {
      console.error('Update event participants error:', updateError)

      // Rollback participant insertion
      await supabaseServer
        .from('participants')
        .delete()
        .eq('id', participant.id)

      return NextResponse.json(
        errorResponse('Failed to update event participant count. Registration rolled back.', updateError),
        { status: 500 }
      )
    }

    // // Update event participant count
    // const { error: updateError } = await supabaseServer.rpc('increment_participants', {
    //   event_id: body.event_id
    // })

    // if (updateError) {
    //   console.error('Update event participants error:', updateError)
    //   // Rollback participant insertion? Atau biarkan inconsistency?
    // }

    return NextResponse.json(
      successResponse({
        participant,
        unique_code: uniqueCode,
        message: 'Registration successful. Please complete payment.'
      }, 'Participant registered successfully'),
      { status: 201 }
    )

  } catch (error: any) {
    console.error('POST /api/participants error:', error)

    return NextResponse.json(
      errorResponse('Internal server error', error),
      { status: 500 }
    )
  }
}