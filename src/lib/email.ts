import { Resend } from 'resend'
import { PaymentConfirmationEmail } from '@/components/emails/PaymentConfirmation'
import { RegsistrationConfirmationEmail } from "@/components/emails/RegistrationConfirmation"

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendParams {
  orderId: string
  eventName: string
  eventDate: string
  participantName: string
  participantEmail: string
  paymentAmount: number
  paymentDate?: string
  paymentMethod?: string
  paymentUrl?: string,
  status?: 'pending' | 'paid'
}

export async function sendRegistrationConfirmationEmail({
  orderId,
  eventName,
  eventDate,
  participantName,
  participantEmail,
  paymentAmount,
  paymentUrl,
  status = 'pending'
}: SendParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      // to: [participantEmail],
      to: ['muhamadt84@gmail.com'],
      subject: `Registration Successful - ${eventName}`,
      react: RegsistrationConfirmationEmail({
        orderId,
        eventName,
        eventDate,
        participantName,
        paymentAmount,
        paymentUrl,
        status
      }) as React.ReactElement
    })

    if (error) {
      console.error('Email sending error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

export async function sendPaymentConfirmationEmail
({
  orderId,
  eventName,
  eventDate,
  participantName,
  participantEmail,
  paymentAmount,
  paymentDate,
  paymentMethod,
  status = 'paid'
}: SendParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      // to: [participantEmail],
      to: ['muhamadt84@gmail.com'],
      subject: `Payment Confirmed - ${eventName}`,
      react: PaymentConfirmationEmail({
        orderId,
        eventName,
        eventDate,
        participantName,
        paymentAmount,
        paymentDate,
        paymentMethod,
        status
      }) as React.ReactElement
    })

    if (error) {
      console.error('Email sending error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}