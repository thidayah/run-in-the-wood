
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseServer } from "@/lib/supabase/server"
import { errorResponse, successResponse } from "@/lib/api-response";
import { sendPaymentConfirmationEmail } from "@/lib/email";

// Verify Midtrans signature (optional but recommended)
function verifySignature(signature: string, orderId: string, statusCode: string, grossAmount: string, serverKey: string): boolean {
  const hash = crypto
    .createHash('sha512')
    .update(orderId + statusCode + grossAmount + serverKey)
    .digest('hex');
  return hash === signature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      transaction_id,
      order_id,
      status_code,
      transaction_status,
      transaction_time,
      payment_type,
      gross_amount,
      currency,
      fraud_status,
      signature_key
    } = body;

    const isProd = process.env.MIDTRANS_IS_PRODUCTION === "true";

    // Signature check ONLY on Production
    if (isProd) {
      const valid = verifySignature(
        signature_key,
        order_id,
        status_code,
        gross_amount,
        process.env.MIDTRANS_SERVER_KEY!
      );

      if (!valid) {
        console.error("Invalid signature from Midtrans");
        return NextResponse.json(errorResponse('Invalid signature'), { status: 401 })
      }
    } else {
      console.log("Signature verification skipped (development mode)");
    }

    // Extract order ID from order_id (format: REG-{uniqueCode}-{timestamp})
    const uniqueCode = order_id.split('-')[1] + '-' + order_id.split('-')[2];

    if (!uniqueCode) {
      console.error('Invalid order_id format:', order_id);
      return NextResponse.json(errorResponse('Invalid order_id'), { status: 400 })
    }

    let payment_status = 'pending';
    let payment_date = null;

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'accept') {
        payment_status = 'paid';
        payment_date = new Date(transaction_time).toISOString();
      }
    }
    else if (transaction_status === 'pending') {
      payment_status = 'pending';
    }
    else if (['deny', 'cancel', 'expire'].includes(transaction_status)) {
      payment_status = 'expired';
    }

    const { data: dataParticipant } = await supabaseServer
      .from('participants')
      .select(`*, event:events (*)`)
      .eq('unique_code', uniqueCode)
      .single();

    if (!dataParticipant) {
      return NextResponse.json(errorResponse('Participant registration not found'), { status: 404 })
    }

    const { data: updateStatusData, error: updateStatusError } = await supabaseServer
      .from('participants')
      .update({
        payment_status: payment_status,
        payment_date: payment_status === 'paid' ? payment_date : null,
        updated_at: new Date().toISOString()
      })
      .eq('unique_code', uniqueCode)
      .select('*')
      .single();

    if (updateStatusError) {
      console.error('Database update error:', updateStatusError);
      return NextResponse.json(errorResponse('Failed to update participant status'), { status: 500 })
    }

    // const { data: historyData, error: historyError } = await supabaseServer
    const { error: historyError } = await supabaseServer
      .from('ritw_transactions_history')
      .insert({
        participant_id: dataParticipant.id,
        transaction_id: transaction_id,
        transaction_status: transaction_status,
        payment_type: payment_type,
        gross_amount: parseFloat(gross_amount),
        transaction_time: new Date(transaction_time).toISOString(),
        raw_response: body, // save full response for debugging
      })
    // .select('*')
    // .single();

    if (historyError) {
      console.error('Database insert error:', historyError);
      return NextResponse.json(errorResponse('Failed to insert transactions history'), { status: 500 })
    }

    if (payment_status === 'failed') {
      const { error: updateParticipantError } = await supabaseServer
        .from('events')
        .update({
          current_participants: Math.max(0, dataParticipant.event.current_participants - 1),
          updated_at: new Date().toISOString()
        })
        .eq('id', dataParticipant.event_id);

      if (updateParticipantError) {
        return NextResponse.json(errorResponse('Failed to update participants'), { status: 500 })
      }
    }

    // // Update current participants
    let emailResult = null
    if (payment_status === 'paid') {
      //   const { error: updateParticipantError } = await supabaseServer
      //     .from('categories')
      //     .update({ current_participants: sequenceBib })
      //     .eq('id', dataRegistration.category_id);

      //   if (updateParticipantError) {
      //     return NextResponse.json({ status: false, message: 'Failed to update participants', error: updateParticipantError }, { status: 500 });
      //   }

      //   // Send email payment successfully
      //   const emailForm = {
      //     email: dataRegistration.email,
      //     name: dataRegistration.full_name,
      //     category: dataRegistration.category?.name || 'Unknown Category',
      //     registration_number: registrationNumber,
      //     bib_number: bibNumber,
      //     amount: parseFloat(gross_amount),
      //     payment_date: payment_date!,
      //     payment_method: payment_type,
      //   };

      //   const sendEmail = await registrationService.sendPaymentSuccess(emailForm);

      //   if (!sendEmail.status) {
      //     console.error('Failed to send payment success email:', sendEmail.error);
      //     // Jangan return error, log saja karena pembayaran sudah sukses
      //   }

      emailResult = await sendPaymentConfirmationEmail({
        orderId: uniqueCode,
        eventName: dataParticipant.event.title,
        eventDate: dataParticipant.event.date,
        participantName: dataParticipant.full_name,
        participantEmail: dataParticipant.email,
        paymentAmount: gross_amount,
        paymentDate: new Date(transaction_time).toISOString(),
        paymentMethod: payment_type.replace(/_/g, ' '),
        status: 'paid'
      })
    }

    return NextResponse.json(
      successResponse(
        {
          participant: updateStatusData,
          email: emailResult
        },
        'Webhook processed'
      ),
      { status: 200 }
    )
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(errorResponse('Webhook processing failed'), { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: true, message: 'Ok' });
}
