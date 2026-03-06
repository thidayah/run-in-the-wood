'use client'

import { useState, useEffect, use, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Iconify, ICONS } from '@/lib/icons'
import Template from "@/components/layout/Template"
import PaymentLoading from "@/components/ui/PaymentLoading"
import PaymentError from "@/components/ui/PaymentError"

interface TransactionData {
  order_id: string
  transaction_status: string
  status_code: string
  status_message?: string
  fraud_status?: string
}

interface ParamsTypes {
  order_id: string;
  transaction_status: string;
  status_code: string;
  status_message?: string;
  fraud_status?: string;
}

export default function PaymentFailedPage({ searchParams }: { searchParams: Promise<ParamsTypes> }) {
  const router = useRouter()

  const orderId = use(searchParams).order_id
  const transactionStatus = use(searchParams).transaction_status
  const statusCode = use(searchParams).status_code
  const statusMessage = use(searchParams).status_message
  const fraudStatus = use(searchParams).fraud_status

  const [transactionData, setTransactionData] = useState<TransactionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    if (orderId && transactionStatus) {
      setTransactionData({
        order_id: orderId,
        transaction_status: transactionStatus,
        status_code: statusCode || '',
        status_message: statusMessage ? decodeURIComponent(statusMessage) : undefined,
        fraud_status: fraudStatus || undefined
      })
    } else {
      setError('No transaction data received')
    }

    setLoading(false)
  }, [searchParams])

  // Auto redirect countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      router.push('/events')
    }
  }, [countdown, router])

  const handleRedirect = () => {
    router.push('/events')
  }

  const handleContactSupport = () => {
    const orderId = transactionData?.order_id.split('-') || 'N/A'
    const message = `Halo Run in the Wood, saya mengalami kegagalan pembayaran dengan detail:
- Order ID: ${orderId[1]}-${orderId[2]}
- Status: ${transactionData?.transaction_status}
- Waktu: ${new Date().toLocaleString('id-ID')}

Mohon bantuannya. Terima kasih.`

    window.open(`https://wa.me/${process.env.NEXT_PUBLIC_CONTACT_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'deny':
        return {
          title: 'Payment Denied',
          description: 'Your payment was denied by the bank or payment provider.',
          icon: 'heroicons:no-symbol',
          color: 'text-red-500',
          bgColor: 'bg-red-500/20'
        }
      case 'expire':
        return {
          title: 'Payment Expired',
          description: 'The payment time limit has expired. Please try again.',
          icon: 'heroicons:clock',
          color: 'text-orange-500',
          bgColor: 'bg-orange-500/20'
        }
      case 'cancel':
        return {
          title: 'Payment Cancelled',
          description: 'You have cancelled the payment process.',
          icon: 'heroicons:x-circle',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/20'
        }
      case 'failure':
        return {
          title: 'Payment Failed',
          description: 'Your payment could not be processed. Please try again.',
          icon: 'heroicons:exclamation-triangle',
          color: 'text-red-500',
          bgColor: 'bg-red-500/20'
        }
      default:
        return {
          title: 'Transaction Failed',
          description: 'Your transaction could not be completed successfully.',
          icon: 'heroicons:exclamation-circle',
          color: 'text-red-500',
          bgColor: 'bg-red-500/20'
        }
    }
  }

  const getFailureReason = (status: string, fraudStatus?: string) => {
    if (fraudStatus === 'challenge') {
      return 'Transaction flagged for fraud detection. Please use a different payment method.'
    }

    switch (status) {
      case 'deny':
        return [
          'Insufficient balance or credit limit',
          'Card or account not authorized for online transactions',
          'Incorrect PIN or authentication failed',
          'Bank declined the transaction'
        ]
      case 'expire':
        return [
          'Payment not completed within the time limit',
          'QR code expired before payment was made',
          'Virtual account not paid within the specified period'
        ]
      case 'cancel':
        return [
          'You closed the payment window before completing',
          'Payment was manually cancelled'
        ]
      default:
        return [
          'Network or connection issue during payment',
          'Payment provider service temporarily unavailable',
          'Technical error occurred'
        ]
    }
  }

  const getRecommendations = (status: string) => {
    switch (status) {
      case 'deny':
        return [
          'Check your balance or credit limit',
          'Contact your bank to enable online transactions',
          'Try a different payment method',
          'Use a different card or e-wallet'
        ]
      case 'expire':
        return [
          'Start a new registration and complete payment within the time limit',
          'Prepare your payment method before starting',
          'Keep the payment page open until completed'
        ]
      case 'cancel':
        return [
          'Restart the registration process',
          'Complete the payment without closing the window',
          'Contact support if you need assistance'
        ]
      default:
        return [
          'Check your internet connection',
          'Try a different payment method',
          'Wait a few minutes and try again',
          'Contact support if the problem persists'
        ]
    }
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



  const statusInfo = transactionData
    ? getStatusMessage(transactionData.transaction_status)
    : getStatusMessage('failure')

  const failureReasons = transactionData
    ? getFailureReason(transactionData.transaction_status, transactionData.fraud_status)
    : getFailureReason('failure')

  const recommendations = transactionData
    ? getRecommendations(transactionData.transaction_status)
    : getRecommendations('failure')

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
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${statusInfo.bgColor} mb-4`}>
                <Iconify
                  icon={statusInfo.icon}
                  className={`h-12 w-12 ${statusInfo.color}`}
                />
              </div>

              <h1 className="font-heading text-4xl font-bold mb-2">
                {statusInfo.title}
              </h1>
              <p className="text-forest-300 text-lg mb-2">
                {statusInfo.description}
              </p>
              {transactionData?.order_id && (
                <p className="text-forest-400 mb-6">
                  Order ID: <span className="font-mono font-bold">{transactionData.order_id}</span>
                </p>
              )}
              <div className=" flex items-center justify-center ">
                <p className="text-sm text-forest-400">Transaction Status:  &nbsp;</p>
                <p className={`font-bold text-lg ${getStatusColor(transactionData?.transaction_status || '')}`}>
                  {transactionData?.transaction_status?.toUpperCase()}
                  {transactionData?.transaction_status === 'settlement' && ' ✓'}
                </p>
              </div>
            </div>

            {/* Failure Reasons */}
            <Card className="mb-8 border-2 border-forest-700 p-6">
              <h3 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                <Iconify icon="heroicons:exclamation-circle" className="h-5 w-5 text-red-500" />
                Why did this happen?
              </h3>

              <ul className="space-y-3">
                {Array.isArray(failureReasons) ? (
                  failureReasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-3 text-forest-300">
                      <Iconify icon="heroicons:x-mark" className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-start gap-3 text-forest-300">
                    <Iconify icon="heroicons:x-mark" className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{failureReasons}</span>
                  </li>
                )}
              </ul>
            </Card>

            {/* Recommendations */}
            <Card className="mb-8 border-2 border-trail-500/30 bg-gradient-to-br from-trail-500/10 to-transparent p-6">
              <h3 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                <Iconify icon="heroicons:light-bulb" className="h-5 w-5 text-trail-500" />
                What can you do?
              </h3>

              <ul className="space-y-3">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3 text-forest-300">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-trail-500/20 text-trail-500 text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleRedirect}
                className="flex items-center gap-2"
              >
                <Iconify icon="heroicons:home" className="h-5 w-5" />
                Back to Events
                <span className="text-xs opacity-70 ml-1">({countdown}s)</span>
              </Button>

              <Button
                onClick={handleContactSupport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Iconify icon={ICONS.whatsapp} className="h-5 w-5 text-green-500" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </Template>
    </Suspense>
  )
}