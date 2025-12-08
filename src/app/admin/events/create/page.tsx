'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Iconify, ICONS } from '@/lib/icons'
import { eventsApi } from '@/lib/api-client'
import AdminTemplate from "@/components/layout/AdminTemplate"

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    date: '',
    location: '',
    distance: '',
    elevation: '',
    price: '',
    max_participants: '100',
    registration_open: true
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }))
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.title || !formData.date || !formData.location || !formData.distance || !formData.price) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      setError('')

      const eventData = {
        title: formData.title,
        description: formData.description || undefined,
        image_url: formData.image_url || undefined,
        date: formData.date,
        location: formData.location,
        distance: formData.distance,
        elevation: formData.elevation || undefined,
        price: Number(formData.price),
        max_participants: Number(formData.max_participants) || 100,
        registration_open: formData.registration_open
      }

      const response = await eventsApi.create(eventData)

      if (response.success) {
        router.push('/admin/events')
        router.refresh()
      } else {
        setError(response.message || 'Failed to create event')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminTemplate>
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-forest-300 hover:text-trail-500 mb-4"
            >
              <Iconify icon="heroicons:arrow-left" className="h-5 w-5" />
              Back to Events
            </button>

            <h1 className="font-heading text-3xl font-bold mb-2">Create New Event</h1>
            <p className="text-forest-300">Add a new trail running event to the system</p>
          </div>

          {/* Form */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <div className="flex items-center gap-2 text-red-400">
                    <Iconify icon="heroicons:exclamation-circle" className="h-5 w-5" />
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-forest-300 mb-2">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-forest-700 bg-forest-900 text-white placeholder-forest-500 focus:outline-none focus:border-trail-500"
                  placeholder="e.g., Mountain Forest Challenge"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-forest-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-forest-700 bg-forest-900 text-white placeholder-forest-500 focus:outline-none focus:border-trail-500"
                  placeholder="Describe the event details, trail conditions, requirements..."
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-forest-300 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-forest-700 bg-forest-900 text-white placeholder-forest-500 focus:outline-none focus:border-trail-500"
                  placeholder="Image URL"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-forest-300 mb-2">
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-forest-700 bg-forest-900 text-white focus:outline-none focus:border-trail-500"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-forest-300 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-forest-700 bg-forest-900 text-white placeholder-forest-500 focus:outline-none focus:border-trail-500"
                    placeholder="e.g., Gunung Gede Pangrango National Park"
                    required
                  />
                </div>

                {/* Distance */}
                <div>
                  <label className="block text-sm font-medium text-forest-300 mb-2">
                    Distance <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="distance"
                    value={formData.distance}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-forest-700 bg-forest-900 text-white placeholder-forest-500 focus:outline-none focus:border-trail-500"
                    placeholder="e.g., 25KM, 42KM"
                    required
                  />
                </div>

                {/* Elevation */}
                <div>
                  <label className="block text-sm font-medium text-forest-300 mb-2">
                    Elevation Gain
                  </label>
                  <input
                    type="text"
                    name="elevation"
                    value={formData.elevation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-forest-700 bg-forest-900 text-white placeholder-forest-500 focus:outline-none focus:border-trail-500"
                    placeholder="e.g., 1500m"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-forest-300 mb-2">
                    Registration Fee (IDR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 rounded-lg border border-forest-700 bg-forest-900 text-white placeholder-forest-500 focus:outline-none focus:border-trail-500"
                    placeholder="350000"
                    required
                  />
                </div>

                {/* Max Participants */}
                <div>
                  <label className="block text-sm font-medium text-forest-300 mb-2">
                    Maximum Participants
                  </label>
                  <input
                    type="number"
                    name="max_participants"
                    value={formData.max_participants}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 rounded-lg border border-forest-700 bg-forest-900 text-white placeholder-forest-500 focus:outline-none focus:border-trail-500"
                    placeholder="100"
                  />
                </div>
              </div>

              {/* Registration Open */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="registration_open"
                  name="registration_open"
                  checked={formData.registration_open}
                  onChange={handleChange}
                  className="w-5 h-5 text-trail-500 bg-forest-800 border-forest-600 rounded focus:ring-trail-500 focus:ring-2"
                />
                <label htmlFor="registration_open" className="text-forest-300">
                  Open for registration immediately
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-forest-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Iconify icon="svg-spinners:ring-resize" className="h-5 w-5" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Iconify icon="heroicons:plus" className="h-5 w-5" />
                      Create Event
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </AdminTemplate>
  )
}