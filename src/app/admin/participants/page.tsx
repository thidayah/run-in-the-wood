'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Iconify, ICONS } from '@/lib/icons'
import { participantsApi } from '@/lib/api-client'
import { eventsApi } from '@/lib/api-client'
import AdminTemplate from "@/components/layout/AdminTemplate"

interface Participant {
  id: string
  full_name: string
  email: string
  phone_number: string
  birth_date: string
  gender: 'male' | 'female' | 'other'
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  medical_notes: string | null
  registration_date: string
  unique_code: string
  payment_status: 'pending' | 'paid' | 'expired' | 'cancelled'
  payment_amount: number
  payment_date: string | null
  event_id: string
  created_at: string
  updated_at: string
  events?: {
    id: string
    title: string
    date: string
    location: string
    distance: string
  }
}

interface Event {
  id: string
  title: string
}

export default function AdminParticipantsPage() {
  const router = useRouter()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    event_id: '',
    search: '',
    payment_status: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false
  })
  const [showDetails, setShowDetails] = useState<string | null>(null)
  const [updatingPayment, setUpdatingPayment] = useState<string | null>(null)

  // Load events for filter dropdown
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await eventsApi.getAll()
        if (response.success && response.data) {
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
        payment_status: filters.payment_status || undefined
      })
      
      if (response.success && response.data) {
        setParticipants(response.data.items as Participant[])
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
  }, [filters.page, filters.event_id, filters.payment_status])

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, page: 1 }))
    loadParticipants()
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const handleUpdatePaymentStatus = async (id: string, newStatus: 'paid' | 'expired' | 'cancelled') => {
    try {
      setUpdatingPayment(id)
      
      const response = await participantsApi.updatePayment(id, {
        status: newStatus,
        payment_date: newStatus === 'paid' ? new Date().toISOString() : undefined
      })
      
      if (response.success && response.data) {
        // Update local state
        setParticipants(prev => prev.map(p => 
          p.id === id 
            ? { ...p, payment_status: newStatus, payment_date: response.data?.payment_date || null }
            : p
        ))
      } else {
        alert(response.message || 'Failed to update payment status')
      }
    } catch (err: any) {
      alert(err.message || 'Update failed')
    } finally {
      setUpdatingPayment(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'expired': return 'bg-orange-500/20 text-orange-400'
      case 'cancelled': return 'bg-red-500/20 text-red-400'
      default: return 'bg-forest-600/20 text-forest-400'
    }
  }

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'male': return 'Male'
      case 'female': return 'Female'
      case 'other': return 'Other'
      default: return gender
    }
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  const exportToCSV = () => {
    // Simple CSV export
    const headers = [
      'Unique Code',
      'Full Name',
      'Email',
      'Phone',
      'Age',
      'Gender',
      'Event',
      'Event Date',
      'Registration Date',
      'Payment Status',
      'Payment Amount',
      'Payment Date',
      'Emergency Contact',
      'Emergency Phone'
    ]
    
    const rows = participants.map(p => [
      p.unique_code,
      p.full_name,
      p.email,
      p.phone_number,
      calculateAge(p.birth_date),
      getGenderLabel(p.gender),
      p.events?.title || '',
      p.events?.date ? formatDate(p.events.date) : '',
      formatDateTime(p.registration_date),
      p.payment_status.toUpperCase(),
      p.payment_amount,
      p.payment_date ? formatDateTime(p.payment_date) : '',
      p.emergency_contact_name || '',
      p.emergency_contact_phone || ''
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `participants_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <AdminTemplate>
      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-heading text-3xl font-bold mb-2">Participants Management</h1>
                <p className="text-forest-300">Manage all event registrations and payments</p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Iconify icon="heroicons:arrow-down-tray" className="h-5 w-5" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-forest-400">Total Participants</p>
                  <p className="text-3xl font-bold">{pagination.total}</p>
                </div>
                <Iconify 
                  icon={ICONS.users}
                  className="h-10 w-10 text-trail-500"
                />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-forest-400">Paid</p>
                  <p className="text-3xl font-bold text-green-500">
                    {participants.filter(p => p.payment_status === 'paid').length}
                  </p>
                </div>
                <Iconify 
                  icon="heroicons:banknotes"
                  className="h-10 w-10 text-green-500"
                />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-forest-400">Pending</p>
                  <p className="text-3xl font-bold text-yellow-500">
                    {participants.filter(p => p.payment_status === 'pending').length}
                  </p>
                </div>
                <Iconify 
                  icon="heroicons:clock"
                  className="h-10 w-10 text-yellow-500"
                />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-forest-400">Cancelled</p>
                  <p className="text-3xl font-bold text-red-500">
                    {participants.filter(p => p.payment_status === 'cancelled').length}
                  </p>
                </div>
                <Iconify 
                  icon="heroicons:x-circle"
                  className="h-10 w-10 text-red-500"
                />
              </div>
            </Card>
          </div>

          {/* Filters Card */}
          <Card className="mb-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-forest-300 mb-2">
                  Search
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
                    placeholder="Name, email, phone, code..."
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
                  onChange={(e) => setFilters(prev => ({ ...prev, event_id: e.target.value, page: 1 }))}
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

              {/* Payment Status Filter */}
              <div>
                <label className="block text-sm font-medium text-forest-300 mb-2">
                  Payment Status
                </label>
                <select
                  value={filters.payment_status}
                  onChange={(e) => setFilters(prev => ({ ...prev, payment_status: e.target.value, page: 1 }))}
                  className="w-full px-4 py-2 rounded-lg border border-forest-700 bg-forest-900 text-white focus:outline-none focus:border-trail-500"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Results Per Page */}
              <div>
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
                  <option value="100">100</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6 pt-6 border-t border-forest-800">
              <Button
                onClick={handleSearch}
                className="flex items-center gap-2"
              >
                <Iconify icon={ICONS.search} className="h-4 w-4" />
                Apply Filters
              </Button>
              
              <Button
                onClick={() => {
                  setFilters({
                    page: 1,
                    limit: 20,
                    event_id: '',
                    search: '',
                    payment_status: ''
                  })
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </Card>

          {/* Participants Table */}
          <Card className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <Iconify 
                  icon="svg-spinners:ring-resize"
                  className="h-12 w-12 mx-auto mb-4 text-trail-500"
                />
                <p className="text-forest-300">Loading participants...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <Iconify 
                  icon="heroicons:exclamation-triangle"
                  className="h-12 w-12 mx-auto mb-4 text-red-500"
                />
                <p className="text-forest-300 mb-4">{error}</p>
                <Button onClick={loadParticipants}>Try Again</Button>
              </div>
            ) : participants.length === 0 ? (
              <div className="text-center py-12">
                <Iconify 
                  icon="heroicons:user-group"
                  className="h-16 w-16 mx-auto mb-4 text-forest-600"
                />
                <h3 className="text-xl font-bold mb-2">No Participants Found</h3>
                <p className="text-forest-300">
                  {filters.search || filters.event_id || filters.payment_status
                    ? 'Try changing your search criteria'
                    : 'No registrations yet. Participants will appear here after registration.'}
                </p>
              </div>
            ) : (
              <>
                {/* Table Header Info */}
                <div className="mb-6">
                  <p className="text-forest-300">
                    Showing <span className="font-bold text-white">{((filters.page - 1) * filters.limit) + 1}</span> to{' '}
                    <span className="font-bold text-white">
                      {Math.min(filters.page * filters.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-bold text-white">{pagination.total}</span> participants
                  </p>
                </div>

                {/* Participants Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-forest-800">
                        <th className="py-3 px-4 text-left text-forest-300 font-medium">Participant</th>
                        <th className="py-3 px-4 text-left text-forest-300 font-medium">Event</th>
                        <th className="py-3 px-4 text-left text-forest-300 font-medium">Registration</th>
                        <th className="py-3 px-4 text-left text-forest-300 font-medium">Payment</th>
                        <th className="py-3 px-4 text-left text-forest-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((participant) => (
                        <React.Fragment key={participant.id}>
                          <tr className="border-b border-forest-800 hover:bg-forest-900/50 transition-colors">
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium mb-1">{participant.full_name}</div>
                                <div className="text-sm text-forest-400">
                                  <div>{participant.email}</div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span>{participant.phone_number}</span>
                                    <span className="text-xs px-2 py-0.5 bg-forest-800 rounded">
                                      {calculateAge(participant.birth_date)} years
                                    </span>
                                    <span className="text-xs px-2 py-0.5 bg-forest-800 rounded">
                                      {getGenderLabel(participant.gender)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            
                            <td className="py-4 px-4">
                              {participant.events ? (
                                <div>
                                  <div className="font-medium">{participant.events.title}</div>
                                  <div className="text-sm text-forest-400">
                                    {formatDate(participant.events.date)} • {participant.events.distance}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-forest-400 italic">Event not found</span>
                              )}
                            </td>
                            
                            <td className="py-4 px-4">
                              <div className="text-sm">
                                <div className="font-mono text-xs text-forest-400 mb-1">
                                  {participant.unique_code}
                                </div>
                                <div>{formatDateTime(participant.registration_date)}</div>
                              </div>
                            </td>
                            
                            <td className="py-4 px-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(participant.payment_status)}`}>
                                    {participant.payment_status.toUpperCase()}
                                  </span>
                                  <span className="font-medium">
                                    {formatPrice(participant.payment_amount)}
                                  </span>
                                </div>
                                {participant.payment_date && (
                                  <div className="text-xs text-forest-400">
                                    Paid: {formatDateTime(participant.payment_date)}
                                  </div>
                                )}
                              </div>
                            </td>
                            
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setShowDetails(showDetails === participant.id ? null : participant.id)}
                                  className="p-2 text-forest-400 hover:text-trail-500 transition-colors"
                                  title="View Details"
                                >
                                  <Iconify 
                                    icon={showDetails === participant.id ? "heroicons:eye-slash" : "heroicons:eye"} 
                                    className="h-4 w-4" 
                                  />
                                </button>
                                
                                {/* Payment Status Actions */}
                                <div className="relative group">
                                  <button
                                    className="p-2 text-forest-400 hover:text-blue-500 transition-colors"
                                    title="Update Payment"
                                  >
                                    <Iconify icon="heroicons:banknotes" className="h-4 w-4" />
                                  </button>
                                  
                                  <div className="absolute right-0 top-full mt-1 w-48 bg-forest-900 border border-forest-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                    <div className="p-2 space-y-1">
                                      <button
                                        onClick={() => handleUpdatePaymentStatus(participant.id, 'paid')}
                                        disabled={updatingPayment === participant.id || participant.payment_status === 'paid'}
                                        className="w-full text-left px-3 py-2 text-sm rounded hover:bg-green-500/20 hover:text-green-400 disabled:opacity-50"
                                      >
                                        Mark as Paid
                                      </button>
                                      <button
                                        onClick={() => handleUpdatePaymentStatus(participant.id, 'expired')}
                                        disabled={updatingPayment === participant.id || participant.payment_status === 'expired'}
                                        className="w-full text-left px-3 py-2 text-sm rounded hover:bg-orange-500/20 hover:text-orange-400 disabled:opacity-50"
                                      >
                                        Mark as Expired
                                      </button>
                                      <button
                                        onClick={() => handleUpdatePaymentStatus(participant.id, 'cancelled')}
                                        disabled={updatingPayment === participant.id || participant.payment_status === 'cancelled'}
                                        className="w-full text-left px-3 py-2 text-sm rounded hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50"
                                      >
                                        Mark as Cancelled
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(participant.unique_code)
                                    alert('Unique code copied to clipboard!')
                                  }}
                                  className="p-2 text-forest-400 hover:text-yellow-500 transition-colors"
                                  title="Copy Unique Code"
                                >
                                  <Iconify icon="heroicons:clipboard-document" className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                          
                          {/* Details Row */}
                          {showDetails === participant.id && (
                            <tr className="border-b border-forest-800 bg-forest-900/30">
                              <td colSpan={5} className="py-4 px-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Personal Details */}
                                  <div>
                                    <h4 className="font-bold mb-3 text-trail-400">Personal Details</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-forest-400">Birth Date</p>
                                          <p className="font-medium">{formatDate(participant.birth_date)}</p>
                                        </div>
                                        <div>
                                          <p className="text-forest-400">Gender</p>
                                          <p className="font-medium">{getGenderLabel(participant.gender)}</p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <h4 className="font-bold mt-6 mb-3 text-trail-400">Emergency Contact</h4>
                                    <div className="space-y-2 text-sm">
                                      <div>
                                        <p className="text-forest-400">Name</p>
                                        <p className="font-medium">
                                          {participant.emergency_contact_name || 'Not provided'}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-forest-400">Phone</p>
                                        <p className="font-medium">
                                          {participant.emergency_contact_phone || 'Not provided'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Medical Notes */}
                                  <div>
                                    <h4 className="font-bold mb-3 text-trail-400">Medical Information</h4>
                                    <div className="text-sm">
                                      <p className="text-forest-400 mb-2">Notes</p>
                                      <div className="p-3 bg-forest-900/50 rounded-lg border border-forest-700">
                                        {participant.medical_notes ? (
                                          <p className="whitespace-pre-wrap">{participant.medical_notes}</p>
                                        ) : (
                                          <p className="text-forest-400 italic">No medical notes provided</p>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <h4 className="font-bold mt-6 mb-3 text-trail-400">System Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div>
                                        <p className="text-forest-400">Participant ID</p>
                                        <p className="font-mono text-xs">{participant.id}</p>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-forest-400">Created</p>
                                          <p className="font-medium">{formatDateTime(participant.created_at)}</p>
                                        </div>
                                        <div>
                                          <p className="text-forest-400">Last Updated</p>
                                          <p className="font-medium">{formatDateTime(participant.updated_at)}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>

          {/* Pagination */}
          {!loading && !error && participants.length > 0 && (
            <div className="mt-8">
              <Card className="p-6">
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
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              pagination.page === pageNum
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
              </Card>
            </div>
          )}
        </div>
      </div>
    </AdminTemplate>
  )
}