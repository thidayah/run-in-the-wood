'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminTemplate from "@/components/layout/AdminTemplate"
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Iconify, ICONS } from '@/lib/icons'
import { eventsApi } from '@/lib/api-client'

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  location: string
  distance: string
  elevation: string | null
  price: number
  max_participants: number
  current_participants: number
  registration_open: boolean
  image_url: string | null
  created_at: string
  updated_at: string
}

export default function AdminEventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await eventsApi.getAll()

      if (response.success && response.data) {
        //@ts-ignore
        setEvents(response.data)
      } else {
        setError(response.message || 'Failed to load events')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }

    try {
      setDeleteLoading(id)

      const response = await eventsApi.delete(id)

      if (response.success) {
        // Remove from local state
        setEvents(prev => prev.filter(event => event.id !== id))
      } else {
        alert(response.message || 'Failed to delete event')
      }
    } catch (err: any) {
      alert(err.message || 'Delete failed')
    } finally {
      setDeleteLoading(null)
      setShowDeleteConfirm(null)
    }
  }

  const toggleRegistrationStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await eventsApi.update(id, {
        registration_open: !currentStatus
      })

      if (response.success && response.data) {
        // Update local state
        setEvents(prev => prev.map(event =>
          event.id === id
            //@ts-ignore
            ? { ...event, registration_open: response.data!.registration_open }
            : event
        ))
      } else {
        alert(response.message || 'Failed to update event')
      }
    } catch (err: any) {
      alert(err.message || 'Update failed')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getParticipantsPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100)
  }

  return (
    <AdminTemplate>
      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-heading text-3xl font-bold mb-2">Events Management</h1>
                <p className="text-forest-300">Manage all trail running events</p>
              </div>

              <Button
                onClick={() => router.push('/admin/events/create')}
                className="flex items-center gap-2"
              >
                <Iconify icon="heroicons:plus" className="h-5 w-5" />
                Create New Event
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-forest-400">Total Events</p>
                  <p className="text-3xl font-bold">{events.length}</p>
                </div>
                <Iconify
                  icon={ICONS.calendar}
                  className="h-10 w-10 text-trail-500"
                />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-forest-400">Active Events</p>
                  <p className="text-3xl font-bold">
                    {events.filter(e => e.registration_open).length}
                  </p>
                </div>
                <Iconify
                  icon="heroicons:check-circle"
                  className="h-10 w-10 text-green-500"
                />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-forest-400">Total Participants</p>
                  <p className="text-3xl font-bold">
                    {events.reduce((sum, event) => sum + event.current_participants, 0)}
                  </p>
                </div>
                <Iconify
                  icon={ICONS.users}
                  className="h-10 w-10 text-blue-500"
                />
              </div>
            </Card>
          </div>

          {/* Events Table */}
          <Card className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <Iconify
                  icon="svg-spinners:ring-resize"
                  className="h-12 w-12 mx-auto mb-4 text-trail-500"
                />
                <p className="text-forest-300">Loading events...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <Iconify
                  icon="heroicons:exclamation-triangle"
                  className="h-12 w-12 mx-auto mb-4 text-red-500"
                />
                <p className="text-forest-300 mb-4">{error}</p>
                <Button onClick={loadEvents}>Try Again</Button>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <Iconify
                  icon="heroicons:calendar"
                  className="h-16 w-16 mx-auto mb-4 text-forest-600"
                />
                <h3 className="text-xl font-bold mb-2">No Events Found</h3>
                <p className="text-forest-300 mb-6">Create your first event to get started</p>
                <Button onClick={() => router.push('/admin/events/create')}>
                  Create First Event
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-forest-800">
                      <th className="py-3 px-4 text-left text-forest-300 font-medium">Event</th>
                      <th className="py-3 px-4 text-left text-forest-300 font-medium">Date</th>
                      <th className="py-3 px-4 text-left text-forest-300 font-medium">Participants</th>
                      <th className="py-3 px-4 text-left text-forest-300 font-medium">Price</th>
                      <th className="py-3 px-4 text-left text-forest-300 font-medium">Status</th>
                      <th className="py-3 px-4 text-left text-forest-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr
                        key={event.id}
                        className="border-b border-forest-800 hover:bg-forest-900/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium mb-1">{event.title}</div>
                            <div className="text-sm text-forest-400">
                              {event.location} • {event.distance}
                              {event.elevation && ` • ${event.elevation}`}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="text-sm">
                            {formatDate(event.date)}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-forest-300">
                                {event.current_participants}/{event.max_participants}
                              </span>
                              <span className="text-forest-400">
                                {getParticipantsPercentage(event.current_participants, event.max_participants)}%
                              </span>
                            </div>
                            <div className="h-2 bg-forest-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${event.current_participants >= event.max_participants
                                    ? 'bg-red-500'
                                    : 'bg-trail-500'
                                  }`}
                                style={{
                                  width: `${getParticipantsPercentage(event.current_participants, event.max_participants)}%`
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-medium">
                            {formatPrice(event.price)}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <button
                            onClick={() => toggleRegistrationStatus(event.id, event.registration_open)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${event.registration_open
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                              }`}
                          >
                            {event.registration_open ? 'Open' : 'Closed'}
                          </button>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {/* <button
                              onClick={() => router.push(`/admin/events/${event.id}`)}
                              className="p-2 text-forest-400 hover:text-trail-500 transition-colors"
                              title="View Details"
                            >
                              <Iconify icon="heroicons:eye" className="h-4 w-4" />
                            </button> */}

                            <button
                              onClick={() => router.push(`/admin/events/${event.id}/edit`)}
                              className="p-2 text-forest-400 hover:text-blue-500 transition-colors"
                              title="Edit"
                            >
                              <Iconify icon="heroicons:pencil-square" className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => setShowDeleteConfirm(showDeleteConfirm === event.id ? null : event.id)}
                              disabled={deleteLoading === event.id}
                              className="p-2 text-forest-400 hover:text-red-500 transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deleteLoading === event.id ? (
                                <Iconify icon="svg-spinners:ring-resize" className="h-4 w-4" />
                              ) : (
                                <Iconify icon="heroicons:trash" className="h-4 w-4" />
                              )}
                            </button>
                          </div>

                          {/* Delete Confirmation */}
                          {showDeleteConfirm === event.id && (
                            <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                              <p className="text-sm text-red-400 mb-2">
                                Are you sure you want to delete "{event.title}"?
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                  Yes, Delete
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(null)}
                                  className="px-3 py-1 text-xs border border-forest-700 text-forest-300 rounded hover:border-forest-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AdminTemplate>
  )
}