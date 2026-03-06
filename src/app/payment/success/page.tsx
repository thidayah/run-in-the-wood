'use client'

import { useState, useEffect, use, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Iconify, ICONS } from '@/lib/icons'
import Template from "@/components/layout/Template"
import PaymentError from "@/components/ui/PaymentError"
import PaymentLoading from "@/components/ui/PaymentLoading"

interface TransactionData {
  order_id: string
  transaction_status: string
  status_code: string
}

interface ParamsTypes {
  order_id: string;
  transaction_status: string;
  status_code: string;
}

export default function PaymentSuccessPage({ searchParams }: { searchParams: Promise<ParamsTypes> }) {
  const router = useRouter()

  const orderId = use(searchParams).order_id
  const transactionStatus = use(searchParams).transaction_status
  const statusCode = use(searchParams).status_code

  const [transactionData, setTransactionData] = useState<TransactionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(60) // 60 seconds\

  useEffect(() => {
    if (orderId && transactionStatus) {
      setTransactionData({
        order_id: orderId,
        transaction_status: transactionStatus,
        status_code: statusCode || '',
      })
    } else {
      setError('No transaction data received')
    }

    setLoading(false)
  }, [searchParams])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      router.push('/')
    }
  }, [countdown, router])

  const handleRedirect = () => {
    router.push('/')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'settlement':
      case 'capture':
        return 'text-green-500'
      case 'pending':
        return 'text-yellow-500'
      case 'expire':
      case 'deny':
      case 'cancel':
        return 'text-red-500'
      default:
        return 'text-forest-300'
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'settlement':
        return 'Payment Successful!'
      case 'capture':
        return 'Payment Captured!'
      case 'pending':
        return 'Payment Pending'
      case 'expire':
        return 'Payment Expired'
      case 'deny':
        return 'Payment Denied'
      case 'cancel':
        return 'Payment Cancelled'
      default:
        return 'Payment Status: ' + status
    }
  }

  if (loading) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentLoading />
      </Suspense>
    )
  }

  if (error) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentError error={error} />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Template>
        <div className="container mx-auto px-4 py-12 min-h-svh">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-trail-500/20 mb-4">
                {transactionData?.transaction_status === 'settlement' ? (
                  <Iconify
                    icon="heroicons:check-circle"
                    className="h-12 w-12 text-green-500"
                  />
                ) : (
                  <Iconify
                    icon="heroicons:clock"
                    className="h-12 w-12 text-yellow-500"
                  />
                )}
              </div>

              <h1 className="font-heading text-4xl font-bold mb-2">
                {getStatusMessage(transactionData?.transaction_status || '')}
              </h1>
              <p className="text-forest-300 mb-6">
                Order ID: <span className="font-mono font-bold">{transactionData?.order_id}</span>
              </p>
              <div className=" flex items-center justify-center ">
                <p className="text-sm text-forest-400">Transaction Status:  &nbsp;</p>
                <p className={`font-bold text-lg ${getStatusColor(transactionData?.transaction_status || '')}`}>
                  {transactionData?.transaction_status?.toUpperCase()}
                  {transactionData?.transaction_status === 'settlement' && ' ✓'}
                </p>
              </div>
            </div>

            {/* Important Information */}
            <Card className="mb-8 border-2 border-trail-500/30 bg-gradient-to-br from-forest-800/50 to-forest-900/50 p-6">
              <div className="flex items-start gap-4">
                <Iconify
                  icon="heroicons:information-circle"
                  className="h-8 w-8 text-trail-500 flex-shrink-0"
                />

                <div>
                  <h3 className="font-heading text-lg font-bold mb-2">What's Next?</h3>

                  {transactionData?.transaction_status === 'settlement' ? (
                    <div className="space-y-2 text-forest-300">
                      <p>✓ Your payment has been confirmed and your registration is complete!</p>
                      <p>✓ A confirmation email will be sent to your email address.</p>
                      <p>✓ Our team may contact you via WhatsApp for any updates.</p>
                      <p>✓ You'll receive your race kit information 1 day before the event.</p>
                    </div>
                  ) : transactionData?.transaction_status === 'pending' ? (
                    <div className="space-y-2 text-forest-300">
                      <p>⏰ Your payment is being processed.</p>
                      <p>📧 We'll notify you once the payment is confirmed.</p>
                      <p>❓ If you've already paid, please wait a few minutes for confirmation.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-forest-300">
                      <p>❌ There was an issue with your payment.</p>
                      <p>🔄 Please try registering again or contact our support.</p>
                      <p>📞 WhatsApp: +62 812 3456 7890</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleRedirect}
                className="flex items-center gap-2"
              >
                <Iconify icon="heroicons:home" className="h-5 w-5" />
                Back to Home
                <span className="text-xs opacity-70 ml-2">({countdown}s)</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push('/participants')}
                className="flex items-center gap-2"
              >
                <Iconify icon={ICONS.users} className="h-5 w-5" />
                View All Participants
              </Button>
            </div>

            {/* Support Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-forest-500">
                Need help? Contact us via{' '}
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_CONTACT_WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-trail-500 hover:underline"
                >
                  WhatsApp
                </a>
                {' '}or{' '}
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                  className="text-trail-500 hover:underline"
                >
                  Email
                </a>
              </p>
            </div>
          </div>
        </div>
      </Template>
    </Suspense>
  )
}