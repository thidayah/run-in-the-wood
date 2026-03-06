'use client'

import { useState, useEffect, use, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Iconify } from '@/lib/icons'
import { participantsApi } from '@/lib/api-client'
import Template from "@/components/layout/Template"
import PaymentLoading from "@/components/ui/PaymentLoading"
import PaymentError from "@/components/ui/PaymentError"

interface TransactionData {
  order_id: string
  transaction_status: string
  status_code: string
  payment_type?: string
}

interface ParamsTypes {
  order_id: string;
  transaction_status: string;
  status_code: string;
  payment_type?: string;
}

export default function PaymentPendingPage({ searchParams }: { searchParams: Promise<ParamsTypes> }) {
  const router = useRouter()

  const orderId = use(searchParams).order_id
  const transactionStatus = use(searchParams).transaction_status
  const statusCode = use(searchParams).status_code
  const paymentType = use(searchParams).payment_type

  const [transactionData, setTransactionData] = useState<TransactionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkingStatus, setCheckingStatus] = useState(false)

  useEffect(() => {
    if (orderId && transactionStatus) {
      setTransactionData({
        order_id: orderId,
        transaction_status: transactionStatus,
        status_code: statusCode || '',
        payment_type: paymentType || undefined,

      })
    } else {
      setError('No transaction data received')
    }

    setLoading(false)
  }, [searchParams])

  // Auto check every 10 seconds to see if payment status has changed
  useEffect(() => {
    const interval = setInterval(() => {
      if (transactionData?.order_id) {
        handleCheckStatus(transactionData.order_id)
      }
    }, 30 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [transactionData]);

  const getPaymentMethodInstructions = (method?: string) => {
    switch (method?.toLowerCase()) {
      case 'bank_transfer':
      case 'bca':
      case 'bni':
      case 'bri':
      case 'permata':
        return {
          title: 'Bank Transfer Instructions',
          steps: [
            'Complete the payment via bank transfer to the virtual account number provided',
            'The amount will be automatically verified after transfer',
            'This process usually takes 1-2 minutes',
            'Please keep your transfer receipt as proof'
          ]
        }
      case 'gopay':
      case 'shopeepay':
      case 'dana':
      case 'ovo':
        return {
          title: 'E-Wallet Instructions',
          steps: [
            'Open your e-wallet app and complete the payment',
            'Make sure you have sufficient balance',
            'Payment will be processed immediately',
            'The status will update automatically within 1 minute'
          ]
        }
      case 'credit_card':
        return {
          title: 'Credit Card Instructions',
          steps: [
            'Complete the 3D Secure authentication with your bank',
            'This may redirect you to your bank\'s page',
            'Payment confirmation is usually instant',
            'Check your card statement for verification'
          ]
        }
      case 'cstore':
      case 'alfamart':
      case 'indomaret':
        return {
          title: 'Convenience Store Instructions',
          steps: [
            'Bring the payment code to the nearest convenience store',
            'Tell the cashier you want to make a payment',
            'Show the payment code to the cashier',
            'Pay the exact amount in cash',
            'Keep the receipt as proof of payment'
          ]
        }
      default:
        return {
          title: 'Payment Instructions',
          steps: [
            'Complete the payment using your chosen method',
            'The payment will be automatically verified',
            'This may take a few minutes to process',
            'You will be redirected automatically once payment is confirmed'
          ]
        }
    }
  }

  const handleCheckStatus = async (order_id: string) => {
    if (!order_id) return

    try {
      setCheckingStatus(true)

      // Cek status participant di database
      const orderId = order_id.split('-')[1] + '-' + order_id.split('-')[2]
      const response = await participantsApi.getByCode(orderId)
      if (response.success && response.data) {
        if (response.data.payment_status === 'paid') {
          router.push('/payment/success?order_id=' + response.data.unique_code + '&transaction_status=settlement')
          return
        }
      }

      // alert('Payment still pending. Please complete your payment.')
    } catch (err) {
      console.error('Error checking status:', err)
      // alert('Failed to check payment status. Please try again.')
    } finally {
      setCheckingStatus(false)
    }
  }

  const instructions = getPaymentMethodInstructions(transactionData?.payment_type)

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
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500/20 mb-4">
                <Iconify
                  icon="heroicons:clock"
                  className="h-12 w-12 text-yellow-500 animate-pulse"
                />
              </div>

              <h1 className="font-heading text-4xl font-bold mb-2">
                Payment Pending
              </h1>
              <p className="text-forest-300 mb-6">
                Order ID: <span className="font-mono font-bold">{transactionData?.order_id}</span>
              </p>
              <div className="flex items-center justify-center">
                <p className="text-sm text-forest-400">Transaction Status: &nbsp;</p>
                <p className="font-bold text-lg text-yellow-500">
                  PENDING
                </p>
              </div>
            </div>

            <div className=" mb-8">
              {/* Payment Instructions */}
              <Card className="border-2 border-forest-700 p-4">
                <h3 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                  <Iconify icon="heroicons:information-circle" className="h-5 w-5 text-yellow-500" />
                  {instructions.title}
                </h3>

                <div className="space-y-4">
                  <ol className="space-y-3">
                    {instructions.steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3 text-forest-300">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-4 p-4 bg-forest-900/50 rounded-lg border border-forest-700">
                    <p className="text-sm text-forest-300 flex items-center gap-2">
                      <Iconify icon="heroicons:light-bulb" className="h-5 w-5 text-yellow-500" />
                      <span>The page will automatically update once payment is confirmed</span>
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => handleCheckStatus(transactionData?.order_id || '')}
                disabled={checkingStatus}
                className="flex items-center gap-2 min-w-[200px]"
              >
                {checkingStatus ? (
                  <>
                    <Iconify icon="svg-spinners:ring-resize" className="h-5 w-5" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Iconify icon="heroicons:arrow-path" className="h-5 w-5" />
                    Check Payment Status
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="flex items-center gap-2"
              >
                <Iconify icon="heroicons:home" className="h-5 w-5" />
                Back to Home
              </Button>
            </div>

            {/* Support Information */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <p className="text-sm text-forest-300">
                  Need help with payment?
                </p>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_CONTACT_WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-trail-500 hover:underline"
                >
                  WhatsApp Support
                </a>
                {' '}and{' '}
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                  className="text-trail-500 hover:underline"
                >
                  Email Support
                </a>
              </div>
            </div>

            {/* Auto-refresh indicator */}
            <div className="mt-6 text-center">
              <p className="text-xs text-forest-500 flex items-center justify-center gap-2">
                <Iconify
                  icon={checkingStatus ? "svg-spinners:ring-resize" : "heroicons:arrow-path"}
                  className="h-3 w-3"
                />
                Auto-checking payment status every 30 seconds
              </p>
            </div>
          </div>
        </div>
      </Template>
    </Suspense>
  )
}