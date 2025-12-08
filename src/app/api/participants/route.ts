import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from "@/lib/supabase/server"
import { successResponse, errorResponse } from '@/lib/api-response'
import { CreateParticipant } from "@/lib/supabase/participants/types"

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const eventId = searchParams.get('event_id')
    const search = searchParams.get('search')
    const paymentStatus = searchParams.get('payment_status')
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = searchParams.get('sort_order') || 'desc'

    // Validate pagination
    if (page < 1) {
      return NextResponse.json(
        errorResponse('Page must be greater than 0'),
        { status: 400 }
      )
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        errorResponse('Limit must be between 1 and 100'),
        { status: 400 }
      )
    }

    // First, get total count to validate page range
    let countQuery = supabaseServer
      .from('participants')
      .select(`*,
         events!inner (*)`, 
        { count: 'exact', head: true }
      )
      .eq('events.registration_open', true)

    // Apply filters to count query too
    if (eventId) {
      countQuery = countQuery.eq('event_id', eventId)
    }

    if (paymentStatus) {
      countQuery = countQuery.eq('payment_status', paymentStatus)
    }

    if (search) {
      countQuery = countQuery.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone_number.ilike.%${search}%,unique_code.ilike.%${search}%`)
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      console.error('Count query error:', countError)
      return NextResponse.json(
        errorResponse('Failed to count participants', countError),
        { status: 500 }
      )
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    // Validate page range
    if (page > totalPages && totalPages > 0) {
      return NextResponse.json(
        errorResponse(`Page ${page} is out of range. Total pages: ${totalPages}`),
        { status: 400 }
      )
    }

    // If no data but page is 1, return empty result
    if (total === 0) {
      const responseData = {
        items: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          total_pages: 0,
          has_next: false,
          has_prev: false,
          next_page: null,
          prev_page: null
        },
        filters: {
          event_id: eventId,
          search: search,
          payment_status: paymentStatus,
          sort_by: sortBy,
          sort_order: sortOrder
        }
      }

      return NextResponse.json(
        successResponse(responseData, 'No participants found'),
        { status: 200 }
      )
    }

    // Calculate offset safely
    const offset = Math.min((page - 1) * limit, Math.max(0, total - 1))

    // Build main query
    let query = supabaseServer
      .from('participants')
      .select(`
        *,
        events!inner (
          id,
          title,
          date,
          location,
          distance,
          elevation,
          registration_open
        )
      `)
      .eq('events.registration_open', true)


    // query = query.eq('event.registration_open', true)

    // Apply filters (same as count query)
    if (eventId) {
      query = query.eq('event_id', eventId)
    }

    if (paymentStatus) {
      query = query.eq('payment_status', paymentStatus)
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone_number.ilike.%${search}%,unique_code.ilike.%${search}%`)
    }

    // Apply sorting
    const validSortColumns = [
      'created_at', 'updated_at', 'registration_date',
      'full_name', 'payment_status', 'payment_amount'
    ]

    const sortColumn = validSortColumns.includes(sortBy)
      ? sortBy
      : 'created_at'

    const order = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc'

    // Execute query with pagination
    const { data: participants, error } = await query
      .order(sortColumn, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('GET /api/participants error:', error)
      return NextResponse.json(
        errorResponse('Failed to retrieve participants', error),
        { status: 500 }
      )
    }

    // Calculate pagination info
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    // Format response
    const responseData = {
      items: participants || [],
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
        has_next: hasNextPage,
        has_prev: hasPrevPage,
        next_page: hasNextPage ? page + 1 : null,
        prev_page: hasPrevPage ? page - 1 : null
      },
      filters: {
        event_id: eventId,
        search: search,
        payment_status: paymentStatus,
        sort_by: sortColumn,
        sort_order: order
      }
    }

    return NextResponse.json(
      successResponse(responseData, 'Participants retrieved successfully'),
      { status: 200 }
    )

  } catch (error: any) {
    console.error('GET /api/participants error:', error)

    return NextResponse.json(
      errorResponse('Internal server error', error),
      { status: 500 }
    )
  }
}