'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Iconify, ICONS } from '@/lib/icons'
import Template from "@/components/layout/Template"
import { eventsApi, participantsApi } from "@/lib/api-client"
import { Event } from "@/lib/supabase/events/types"

export default function RegistrationPage() {
  const params: { id: string } = useParams()

  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    birthDate: '',
    gender: 'male',
    // tshirtSize: 'M',
    emergencyContact: '',
    emergencyContactPhone: '',
    medicalNotes: '',
    agreeTerms: false,
    // agreePhotoRelease: false,
  })

  const fetchEventDetail = async () => {
    try {
      setLoading(true)
      const response = await eventsApi.getById(params.id)
      if (response.success) {
        //@ts-ignore
        setEvent(response.data || null)
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

  useEffect(() => {
    fetchEventDetail()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: '' }))

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'
    if (!formData.birthDate) newErrors.birthDate = 'Birth date is required'
    if (!formData.gender.trim()) newErrors.gender = 'Gender is required'
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required'
    if (!formData.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = 'Emergency contact phone is required'

    // Email format validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone number validation
    if (formData.phoneNumber && !/^[0-9+\-\s]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number'
    }

    // Terms agreement validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    setIsSubmitting(true)
    try {
      // // Generate unique code untuk payment
      // const uniqueCode = `RITW-${Date.now().toString().slice(-6)}`

      // // Simpan data sementara
      // sessionStorage.setItem('registrationData', JSON.stringify({
      //   ...formData,
      //   uniqueCode,
      //   event: MOCK_EVENT,
      //   registrationDate: new Date().toISOString()
      // }))

      const participantData = {
        event_id: params.id,
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        birth_date: formData.birthDate,
        gender: formData.gender,
        emergency_contact_name: formData.emergencyContact,
        emergency_contact_phone: formData.emergencyContactPhone,
        medical_notes: formData.medicalNotes,
        payment_amount: event?.price
      }

      const response = await participantsApi.create(participantData)

      if (response.success) {
        // Redirect ke payment page dengan unique code
        router.push(`/order?code=${response.data?.unique_code}`)
      } else {
        console.error('Registration failed:', response.message)
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
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
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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

  // Jika event tidak ditemukan atau registration closed
  if (!event?.registration_open) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <Iconify icon={ICONS.calendar} className="h-20 w-20 mx-auto mb-6 text-forest-600" />
          <h1 className="font-heading text-3xl font-bold mb-4">Registration Closed</h1>
          <p className="text-forest-300 mb-8">
            Registration for this event is currently closed or the event is sold out.
          </p>
          <Button onClick={() => router.push('/events')}>
            View Other Events
          </Button>
        </div>
      </main>
    )
  }

  return (
    <Template>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Registration Form */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="mb-6">
                  <h1 className="font-heading text-3xl font-bold mb-2">
                    Register for <span className="text-trail-500">{event.title}</span>
                  </h1>
                  <p className="text-forest-300">
                    Please fill in all the required information below to complete your registration.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information Section */}
                  <section>
                    <h3 className="font-heading text-xl font-bold mb-6 pb-3 border-b border-forest-800 flex items-center gap-2">
                      <Iconify icon={ICONS.users} className="h-5 w-5 text-trail-500" />
                      Personal Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-forest-300 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-forest-700'
                            } bg-forest-900 text-white placeholder-forest-500 focus:outline-none focus:border-trail-500`}
                          placeholder="Enter your full name"
                        />
                        {errors.fullName && (
                          <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-forest-300 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-forest-700'
                            } bg-forest-900 text-white placeholder-forest-500 focus:outline-none focus:border-trail-500`}
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-medium text-forest-300 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${errors.phoneNumber ? 'border-red-500' : 'border-forest-700'
                            } bg-forest-900 text-white placeholder-forest-500 focus:outline-none focus:border-trail-500`}
                          placeholder="+62 812 3456 7890"
                        />
                        {errors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-400">{errors.phoneNumber}</p>
                        )}
                      </div>

                      {/* Birth Date */}
                      <div>
                        <label className="block text-sm font-medium text-forest-300 mb-2">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${errors.birthDate ? 'border-red-500' : 'border-forest-700'
                            } bg-forest-900 text-white focus:outline-none focus:border-trail-500`}
                        />
                        {errors.birthDate && (
                          <p className="mt-1 text-sm text-red-400">{errors.birthDate}</p>
                        )}
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium text-forest-300 mb-2">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-forest-700 bg-forest-900 text-white focus:outline-none focus:border-trail-500"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.gender && (
                          <p className="mt-1 text-sm text-red-400">{errors.gender}</p>
                        )}
                      </div>

                      {/* T-Shirt Size */}
                      {/* <div>
                        <label className="block text-sm font-medium text-forest-300 mb-2">
                          T-Shirt Size
                        </label>
                        <select
                          name="tshirtSize"
                          value={formData.tshirtSize}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-forest-700 bg-forest-900 text-white focus:outline-none focus:border-trail-500"
                        >
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                        </select>
                        <p className="mt-1 text-xs text-forest-400">
                          Event t-shirt will be provided based on this size
                        </p>
                      </div> */}
                    </div>
                  </section>

                  {/* Emergency Contact Section */}
                  <section>
                    <h3 className="font-heading text-xl font-bold mb-6 pb-3 border-b border-forest-800 flex items-center gap-2">
                      <Iconify icon={ICONS.phone} className="h-5 w-5 text-trail-500" />
                      Emergency Contact
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Emergency Contact Name */}
                      <div>
                        <label className="block text-sm font-medium text-forest-300 mb-2">
                          Emergency Contact Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${errors.emergencyContact ? 'border-red-500' : 'border-forest-700'
                            } bg-forest-900 text-white placeholder-forest-500 focus:outline-none focus:border-trail-500`}
                          placeholder="Full name of emergency contact"
                        />
                        {errors.emergencyContact && (
                          <p className="mt-1 text-sm text-red-400">{errors.emergencyContact}</p>
                        )}
                      </div>

                      {/* Emergency Contact Phone */}
                      <div>
                        <label className="block text-sm font-medium text-forest-300 mb-2">
                          Emergency Contact Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="emergencyContactPhone"
                          value={formData.emergencyContactPhone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${errors.emergencyContactPhone ? 'border-red-500' : 'border-forest-700'
                            } bg-forest-900 text-white placeholder-forest-500 focus:outline-none focus:border-trail-500`}
                          placeholder="+62 812 3456 7890"
                        />
                        {errors.emergencyContactPhone && (
                          <p className="mt-1 text-sm text-red-400">{errors.emergencyContactPhone}</p>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Medical Information Section */}
                  <section>
                    <h3 className="font-heading text-xl font-bold mb-6 pb-3 border-b border-forest-800 flex items-center gap-2">
                      <Iconify icon="healthicons:health" className="h-5 w-5 text-trail-500" />
                      Medical Information
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-forest-300 mb-2">
                        Medical Notes / Allergies / Conditions
                      </label>
                      <textarea
                        name="medicalNotes"
                        value={formData.medicalNotes}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-forest-700 bg-forest-900 text-white placeholder-forest-500 focus:outline-none focus:border-trail-500"
                        placeholder="Please list any medical conditions, allergies, or medications that our medical team should be aware of..."
                      />
                      {/* <p className="mt-1 text-xs text-forest-400">
                        This information is confidential and will only be shared with our medical team
                      </p> */}
                    </div>
                  </section>

                  {/* Terms and Conditions */}
                  <section>
                    <h3 className="font-heading text-xl font-bold mb-6 pb-3 border-b border-forest-800 flex items-center gap-2">
                      <Iconify icon={ICONS.check} className="h-5 w-5 text-trail-500" />
                      Terms & Conditions
                    </h3>

                    <div className="space-y-4">
                      {/* Terms Agreement */}
                      <div className={`p-4 rounded-lg border ${errors.agreeTerms ? 'border-red-500 bg-red-500/5' : 'border-forest-700 bg-forest-900/30'
                        }`}>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleInputChange}
                            className="mt-1 w-4 h-4 text-trail-500 bg-forest-800 border-forest-600 rounded focus:ring-trail-500 focus:ring-2"
                          />
                          <div className="flex-1">
                            <span className="font-medium text-forest-200">
                              I agree to the Terms & Conditions and Waiver of Liability <span className="text-red-500">*</span>
                            </span>
                            <p className="mt-1 text-sm text-forest-400">
                              By checking this box, I acknowledge that I have read, understood, and agree to the event terms,
                              waiver of liability, and understand the risks associated with trail running.
                            </p>
                          </div>
                        </label>
                        {errors.agreeTerms && (
                          <p className="mt-2 text-sm text-red-400">{errors.agreeTerms}</p>
                        )}
                      </div>

                      {/* Photo Release */}
                      {/* <div className="p-4 rounded-lg border border-forest-700 bg-forest-900/30">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="agreePhotoRelease"
                            checked={formData.agreePhotoRelease}
                            onChange={handleInputChange}
                            className="mt-1 w-4 h-4 text-trail-500 bg-forest-800 border-forest-600 rounded focus:ring-trail-500 focus:ring-2"
                          />
                          <div className="flex-1">
                            <span className="font-medium text-forest-200">
                              Photo Release Agreement
                            </span>
                            <p className="mt-1 text-sm text-forest-400">
                              I grant permission to Run in the Wood to use photographs and/or video of me taken 
                              during the event for promotional purposes.
                            </p>
                          </div>
                        </label>
                      </div> */}
                    </div>
                  </section>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-forest-800">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                      {/* <p className="text-sm text-forest-400">
                        All fields marked with <span className="text-red-500">*</span> are required
                      </p> */}
                      <Button
                        type="submit"
                        size="md"
                        disabled={isSubmitting}
                        className="min-w-[200px]"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Iconify icon="svg-spinners:ring-resize" className="h-5 w-5" />
                            Processing...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Continue to Payment
                            <Iconify icon={ICONS.arrowRight} className="h-5 w-5" />
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </Card>
            </div>

            {/* Right Column - Event Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Event Summary Card */}
                <Card className="p-6">
                  <h3 className="font-heading text-xl font-bold mb-4">Event Summary</h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Iconify icon={ICONS.calendar} className="h-5 w-5 text-trail-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-forest-400">Event Date</p>
                        <p className="font-medium">{formatDate(event.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Iconify icon={ICONS.location} className="h-5 w-5 text-trail-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-forest-400">Location</p>
                        <p className="font-medium">{event.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Iconify icon={ICONS.runner} className="h-5 w-5 text-trail-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-forest-400">Distance</p>
                        <p className="font-medium">{event.distance}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Iconify icon={ICONS.elevation} className="h-5 w-5 text-trail-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-forest-400">Elevation Gain</p>
                        <p className="font-medium">± {event.elevation}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-forest-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-forest-300">Registration Fee</span>
                        <span className="font-heading text-2xl font-bold text-white">
                          {formatPrice(event.price)}
                        </span>
                      </div>
                      <p className="text-xs text-forest-400">
                        Includes: Event photos, post-race meal, and medical support
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Participants Progress */}
                <Card className="p-6">
                  <h4 className="font-heading text-lg font-bold mb-3">Registration Status</h4>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-forest-300">Participants</span>
                        <span className="text-forest-300">
                          {event.current_participants}/{event.max_participants}
                        </span>
                      </div>
                      <div className="h-2 bg-forest-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-trail-500 rounded-full"
                          style={{
                            width: `${(event.current_participants / event.max_participants) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Important Notes */}
                <Card className="p-6">
                  <h4 className="font-heading text-lg font-bold mb-3">Important Notes</h4>

                  <ul className="space-y-2 text-sm text-forest-300">
                    <li className="flex items-start gap-2">
                      <Iconify icon={ICONS.check} className="h-4 w-4 text-trail-500 mt-0.5 flex-shrink-0" />
                      <span>Payment must be completed within 1 hours of registration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Iconify icon={ICONS.check} className="h-4 w-4 text-trail-500 mt-0.5 flex-shrink-0" />
                      <span>Registration is non-refundable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Iconify icon={ICONS.check} className="h-4 w-4 text-trail-500 mt-0.5 flex-shrink-0" />
                      <span>Mandatory gear will be announced 1 week before event</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Template>
  )
}