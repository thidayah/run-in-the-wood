'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import { Card } from '@/components/ui/Card'
import { Iconify, ICONS } from '@/lib/icons'
import { participantsApi } from '@/lib/api-client'
import { eventsApi } from '@/lib/api-client'
import { Event } from "@/lib/supabase/events/types"
import { ParticipantWithEvent } from "@/lib/supabase/participants/types"
import Template from "@/components/layout/Template"

// interface ParticipantWithEvent {
//   id: string
//   full_name: string
//   email: string
//   registration_date: string
//   unique_code: string
//   payment_status: 'pending' | 'paid' | 'expired' | 'cancelled'
//   events: {
//     id: string
//     title: string
//     date: string
//     location: string
//     distance: string
//   }
// }

// interface Event {
//   id: string
//   title: string
//   date: string
// }

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<ParticipantWithEvent[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    event_id: '',
    search: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false
  })

  // Load events for filter dropdown
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await eventsApi.getUpcoming()
        if (response.success && response.data) {
          //@ts-ignore
          setEvents(response.data)
        }
      } catch (err) {
        console.error('Failed to load events:', err)
      }
    }

    loadEvents()
  }, [])

  // Load participants
  const loadParticipants = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await participantsApi.getAll({
        page: filters.page,
        limit: filters.limit,
        event_id: filters.event_id || undefined,
        search: filters.search || undefined,
        payment_status: 'paid' // Hanya tampilkan yang sudah bayar
      })

      if (response.success && response.data) {
        //@ts-ignore
        setParticipants(response.data.items as ParticipantWithEvent[] || [])
        setPagination(response.data.pagination)
      } else {
        setError(response.message || 'Failed to load participants')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadParticipants()
  }, [filters.page, filters.event_id])

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, page: 1 }))
    loadParticipants()
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Template>
      {/* Hero Section */}
      <section className="relative pt-16 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Meet Our <span className="text-trail-500">Trail Runners</span>
            </h1>
            <p className="text-lg text-forest-300 mb-8">
              Join the community of passionate trail runners who have conquered our forest adventures.
              See who's running with you!
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 mb-20">
        <div className="container mx-auto px-4">
          {/* Filters Card */}
          {/* <Card className="mb-8 p-6"> */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            {/* Search */}
            <div className=" col-span-2">
              <label className="block text-sm font-medium text-forest-300 mb-2">
                Search Participants
              </label>
              <div className="relative">
                <Iconify
                  icon={ICONS.search}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-forest-500"
                />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-forest-700 bg-forest-900 text-white placeholder-forest-500 focus:outline-none focus:border-trail-500"
                />
              </div>
            </div>

            {/* Event Filter */}
            <div>
              <label className="block text-sm font-medium text-forest-300 mb-2">
                Filter by Event
              </label>
              <select
                value={filters.event_id}
                onChange={(e) => setFilters(prev => ({ ...prev, event_id: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-forest-700 bg-forest-900 text-white focus:outline-none focus:border-trail-500"
              >
                <option value="">All Events</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Per Page */}
            {/* <div>
                <label className="block text-sm font-medium text-forest-300 mb-2">
                  Results per page
                </label>
                <select
                  value={filters.limit}
                  onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
                  className="w-full px-4 py-2 rounded-lg border border-forest-700 bg-forest-900 text-white focus:outline-none focus:border-trail-500"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div> */}

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full px-6 py-2 bg-trail-500 text-white rounded-lg hover:bg-trail-600 transition-colors flex items-center justify-center gap-2"
              >
                {/* <Iconify icon={ICONS.search} className="h-4 w-4" /> */}
                Apply Filters
              </button>
            </div>
          </div>
          {/* </Card> */}

          {/* Participants Grid/Table */}
          <div className="mb-8">
            {loading ? (
              <div className="text-center py-12">
                <Iconify
                  icon="svg-spinners:ring-resize"
                  className="h-12 w-12 mx-auto mb-4 text-trail-500"
                />
                <p className="text-forest-300">Loading participants...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 p-6">
                <Iconify
                  icon="heroicons:exclamation-triangle"
                  className="h-12 w-12 mx-auto mb-4 text-red-500"
                />
                <p className="text-forest-300 mb-4">{error}</p>
                <button
                  onClick={loadParticipants}
                  className="px-4 py-2 bg-trail-500 text-white rounded-lg hover:bg-trail-600"
                >
                  Try Again
                </button>
              </div>
            ) : participants.length === 0 ? (
              <div className="text-center p-6 py-12">
                <Iconify
                  icon="heroicons:user-group"
                  className="h-16 w-16 mx-auto mb-4 text-forest-600"
                />
                <h3 className="text-xl font-bold mb-2">No Participants Found</h3>
                <p className="text-forest-300">
                  {filters.search || filters.event_id
                    ? 'Try changing your search criteria'
                    : 'Be the first to join an event!'}
                </p>
              </div>
            ) : (
              <>
                {/* Stats */}
                {/* <div className="mb-6">
                  <p className="text-forest-300">
                    Showing <span className="font-bold text-white">{((filters.page - 1) * filters.limit) + 1}</span> to{' '}
                    <span className="font-bold text-white">
                      {Math.min(filters.page * filters.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-bold text-white">{pagination.total}</span> participants
                  </p>
                </div> */}

                {/* Table View Option */}
                <div className="overflow-x-auto mb-8">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-forest-700">
                        <th className="py-3 px-4 text-left text-forest-300 uppercase">Participant</th>
                        <th className="py-3 px-4 text-left text-forest-300 uppercase">Event</th>
                        <th className="py-3 px-4 text-left text-forest-300 uppercase">Registered</th>
                        <th className="py-3 px-4 text-left text-forest-300 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((participant) => (
                        <tr key={participant.id} className="border-b border-forest-800 hover:bg-forest-900/50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-trail-500 to-trail-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {getInitials(participant.full_name)}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{participant.full_name}</div>
                                <div className="text-sm text-forest-400 capitalize">{participant.gender}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium">{participant.events.title}</div>
                              <div className="text-sm text-forest-400">{participant.events.distance}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {formatDate(participant.registration_date)}
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                              CONFIRMED
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>



          {/* Pagination */}
          {!loading && !error && participants.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-forest-300">
                Page {pagination.page} of {pagination.total_pages}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.has_prev}
                  className="px-4 py-2 rounded-lg border border-forest-700 text-forest-300 hover:border-trail-500 hover:text-trail-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Iconify icon="heroicons:chevron-left" className="h-4 w-4" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                    let pageNum
                    if (pagination.total_pages <= 5) {
                      pageNum = i + 1
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1
                    } else if (pagination.page >= pagination.total_pages - 2) {
                      pageNum = pagination.total_pages - 4 + i
                    } else {
                      pageNum = pagination.page - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${pagination.page === pageNum
                          ? 'bg-trail-500 text-white'
                          : 'border border-forest-700 text-forest-300 hover:border-trail-500 hover:text-trail-500'
                          }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.has_next}
                  className="px-4 py-2 rounded-lg border border-forest-700 text-forest-300 hover:border-trail-500 hover:text-trail-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  Next
                  <Iconify icon="heroicons:chevron-right" className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </Template>
  )
}