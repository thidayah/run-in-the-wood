'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Iconify, ICONS } from '@/lib/icons'
import Image from 'next/image'
import Template from "@/components/layout/Template"
import { participantsApi } from "@/lib/api-client"

export default function OrderPage() {
  const searchParams = useSearchParams()
  const orderCode = searchParams.get('code')

  const [timeLeft, setTimeLeft] = useState(600) // 10 menit dalam detik
  const [isExpired, setIsExpired] = useState(false)
  const [loading, setLoading] = useState(true)
  const [orderData, setOrderData] = useState<any>(null)
  const qrisImage = '/images/payment-qris.jpeg' // Path public/images/qris/

  useEffect(() => {
    // Simulasi loading data
    const timer = setTimeout(() => {
      // setOrderData(MOCK_ORDER)
      // setLoading(false)
      fetchEventDetail()
    }, 1000)

    return () => clearTimeout(timer)
  }, [orderCode])

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const fetchEventDetail = async () => {
    try {
      setLoading(true)
      if (!orderCode) {
        alert('Order code is missing')
        return
      }
      const response = await participantsApi.getByCode(orderCode)
      if (response.success) {
        //@ts-ignore
        setOrderData(response.data || null)
      } else {
        alert(response.message)
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 250);
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleConfirmPayment = () => {
    if (!orderData) return

    // Format message untuk WhatsApp
    const message = `Halo Run in the Wood! Saya sudah melakukan pembayaran untuk order ${orderData.unique_code}.

Data Peserta:
- Nama: ${orderData.full_name}
- Email: ${orderData.email}
- No. HP: ${orderData.phone_number}
- Event: ${orderData.event.title}
- Tanggal: ${formatDate(orderData.event.date)}
- Jumlah: ${formatPrice(orderData.payment_amount)}

Mohon konfirmasi pembayaran saya. Terima kasih!

(Lampirkan bukti pembayaran)`

    // Encode message URL
    const encodedMessage = encodeURIComponent(message)
    const whatsappNumber = '6287737815286'
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
  }

  const handleRetryPayment = () => {
    // Reset timer dan refresh halaman
    setTimeLeft(600)
    setIsExpired(false)
    // Bisa juga regenerate QRIS baru di sini
  }

  if (loading) {
    return (
      <Template>
        <div className="container mx-auto px-4 py-20 min-h-[100svh] flex justify-center items-center">
          <div className="  text-center ">
            <Iconify icon="svg-spinners:ring-resize" className="h-12 w-12 mx-auto mb-6 text-trail-500" />
            <p className="text-forest-300 text-center">Loading...</p>
          </div>
        </div>
      </Template>
    )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Template>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Order Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-trail-500/30 bg-trail-500/10 px-4 py-2 mb-4">
                <Iconify icon={ICONS.qrcode} className="h-4 w-4 text-trail-500" />
                <span className="text-sm text-trail-400">Order #{orderData.unique_code}</span>
              </div>
              <h1 className="font-heading text-3xl font-bold mb-4">
                Complete Your <span className="text-trail-500">Payment</span>
              </h1>
              <p className="text-sm text-forest-300">
                Scan the QRIS code below to pay for your registration. Payment must be completed before the timer expires.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Payment Details */}
              <div className="space-y-6">
                {/* Payment Timer Card */}
                <Card className="border-2 border-trail-500/30 p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Iconify icon={ICONS.clock} className="h-5 w-5 text-trail-500" />
                      <span className="text-sm font-medium text-trail-400">Payment Expires In</span>
                    </div>

                    <div className={`
                    font-mono text-5xl font-bold mb-4
                    ${timeLeft <= 60 ? 'text-red-500 animate-pulse' : 'text-white'}
                  `}>
                      {formatTime(timeLeft)}
                    </div>

                    <div className="h-2 bg-forest-800 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full ${timeLeft <= 60 ? 'bg-red-500' : 'bg-trail-500'
                          }`}
                        style={{ width: `${(timeLeft / 300) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-forest-400">
                      Complete payment within 10 minutes to secure your spot
                    </p>
                  </div>
                </Card>

                {/* QRIS Card */}
                <Card className="text-center p-6">
                  <div className="mb-4">
                    <Iconify icon={ICONS.qrcode} className="h-12 w-12 mx-auto mb-2 text-trail-500" />
                    <h3 className="font-heading text-2xl font-bold mb-2">QRIS Payment</h3>
                    <p className="text-forest-300 text-sm">
                      Scan with any Indonesian e-wallet or banking app
                    </p>
                  </div>

                  {/* QRIS Image */}
                  <div className="relative max-w-xs mx-auto mb-6">
                    <div className="aspect-square bg-white rounded-3xl ">
                      {qrisImage ? (
                        <Image
                          src={qrisImage}
                          alt="QRIS Payment Code"
                          width={400}
                          height={400}
                          className="w-full h-auto rounded-3xl"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                          <p className="text-forest-700">QRIS Image</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Amount */}
                  <div className="mb-6">
                    <p className="text-sm text-forest-400 mb-1">Payment Amount</p>
                    <div className="font-heading text-3xl font-bold text-white">
                      {formatPrice(orderData.payment_amount)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {!isExpired ? (
                      <>
                        <Button
                          onClick={handleConfirmPayment}
                          size="md"
                          className="w-full"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <Iconify icon={ICONS.whatsapp} className="h-5 w-5" />
                            Confirm Payment via WhatsApp
                          </span>
                        </Button>

                        {/* <button
                        onClick={() => {
                          // Copy order ID to clipboard
                          navigator.clipboard.writeText(orderData.orderId)
                          alert('Order ID copied to clipboard!')
                        }}
                        className="text-sm text-forest-400 hover:text-trail-500 transition-colors"
                      >
                        Copy Order ID for reference
                      </button> */}
                      </>
                    ) : (
                      <>
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 mb-4">
                          <div className="flex items-center gap-2 justify-center text-red-400 mb-2">
                            <Iconify icon="heroicons:exclamation-triangle" className="h-5 w-5" />
                            <span className="font-medium">Payment Expired</span>
                          </div>
                          <p className="text-sm text-forest-300">
                            The payment window has expired. Please generate a new QRIS code.
                          </p>
                        </div>

                        <Button
                          onClick={handleRetryPayment}
                          size="md"
                          className="w-full"
                        >
                          Generate New QRIS Code
                        </Button>
                      </>
                    )}
                  </div>
                </Card>

                {/* Payment Instructions */}
                <Card className="p-6">
                  <h3 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                    <Iconify icon={ICONS.check} className="h-5 w-5 text-trail-500" />
                    How to Pay
                  </h3>

                  <ol className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-trail-500/20 text-trail-500 text-xs font-bold flex-shrink-0">
                        1
                      </span>
                      <span className="text-forest-300">Open your mobile banking/e-wallet app</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-trail-500/20 text-trail-500 text-xs font-bold flex-shrink-0">
                        2
                      </span>
                      <span className="text-forest-300">Tap 'Scan QRIS' or 'QRIS Payment'</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-trail-500/20 text-trail-500 text-xs font-bold flex-shrink-0">
                        3
                      </span>
                      <span className="text-forest-300">Scan the QR code on the top</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-trail-500/20 text-trail-500 text-xs font-bold flex-shrink-0">
                        4
                      </span>
                      <span className="text-forest-300">Confirm payment amount matches</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-trail-500/20 text-trail-500 text-xs font-bold flex-shrink-0">
                        5
                      </span>
                      <span className="text-forest-300">Complete payment & screenshot receipt</span>
                    </li>
                  </ol>
                </Card>
              </div>

              {/* Right Column - QRIS Payment */}
              <div className="space-y-6">
                {/* Order Summary Card */}
                <Card className="p-6">
                  <h3 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                    <Iconify icon={ICONS.calendar} className="h-5 w-5 text-trail-500" />
                    Order Summary
                  </h3>

                  <div className="space-y-4">
                    {/* Event Info */}
                    <div className="pb-4 border-b border-forest-800">
                      <h4 className="font-medium text-lg mb-2">{orderData.event.title}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Iconify icon={ICONS.calendar} className="h-4 w-4 text-forest-500" />
                          <span className="text-forest-300">{formatDate(orderData.event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Iconify icon={ICONS.location} className="h-4 w-4 text-forest-500" />
                          <span className="text-forest-300">{orderData.event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Iconify icon={ICONS.runner} className="h-4 w-4 text-forest-500" />
                          <span className="text-forest-300">{orderData.event.distance}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Iconify icon={ICONS.elevation} className="h-4 w-4 text-forest-500" />
                          <span className="text-forest-300">± {orderData.event.elevation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Participant Info */}
                    <div className="pb-4  border-forest-800">
                      <h4 className="font-medium mb-3 text-forest-300">Participant Details</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-forest-400">Full Name</p>
                          <p className="font-medium">{orderData.full_name}</p>
                        </div>
                        <div>
                          <p className="text-forest-400">Gender</p>
                          <p className="font-medium capitalize">{orderData.gender}</p>
                        </div>
                        <div>
                          <p className="text-forest-400">Email</p>
                          <p className="font-medium">{orderData.email}</p>
                        </div>
                        <div>
                          <p className="text-forest-400">Phone</p>
                          <p className="font-medium">{orderData.phone_number}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Important Notes */}
                <Card className="p-6">
                  <h3 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">
                    <Iconify icon="heroicons:information-circle" className="h-5 w-5 text-trail-500" />
                    Important Notes
                  </h3>

                  <ul className="space-y-2 text-sm text-forest-300">
                    <li className="flex items-start gap-2">
                      <Iconify icon="heroicons:check-circle" className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Keep your payment receipt screenshot for confirmation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Iconify icon="heroicons:check-circle" className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Registration will be confirmed within 24 hours after payment verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Iconify icon="heroicons:check-circle" className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Use the WhatsApp button to send payment confirmation</span>
                    </li>
                  </ul>
                </Card>

                {/* Support Card */}
                {/* <Card className="p-6"> */}
                <h3 className="font-heading text-lg font-bold mb-3">Need Help?</h3>
                <div className="space-y-3">
                  <a
                    href={`https://wa.me/6287737815286?text=Halo%20Run%20in%20the%20Wood,%20saya%20membutuhkan%20bantuan%20untuk%20order%20${orderData.unique_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-forest-700 hover:border-trail-500 hover:bg-trail-500/5 transition-all group"
                  >
                    <Iconify icon={ICONS.whatsapp} className="h-6 w-6 text-green-500" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Contact Support via WhatsApp</p>
                      <p className="text-xs text-forest-400">Fast response within 15 minutes</p>
                    </div>
                  </a>
                  {/* <div className="flex items-center gap-3 p-3 rounded-lg border border-forest-700">
                    <Iconify icon={ICONS.mail} className="h-6 w-6 text-trail-500" />
                    <div>
                      <p className="font-medium text-sm">Email Support</p>
                      <p className="text-xs text-forest-400">support@runinthewood.com</p>
                    </div>
                  </div> */}
                </div>
                {/* </Card> */}
              </div>
            </div>
          </div>
        </div>
      </Template>
    </Suspense>
  )
}