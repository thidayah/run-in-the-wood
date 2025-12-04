'use client'
import { Button } from '@/components/ui/Button'
import { Iconify, ICONS } from '@/lib/icons'
import Template from "@/components/layout/Template"
import EventCard from "@/components/ui/EventCard"
import { useEffect, useState } from "react"
import { eventsApi } from "@/lib/api-client"
import { Event } from "@/lib/supabase/events/types"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  // const [error, setError] = useState<string | null>(null)
  
  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await eventsApi.getAll()
      if (response.success) {
        //@ts-ignore
        setEvents(response.data || [])
      } else {
        alert(response.message)
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 500);
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

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
    <Template>
      {/* Hero Section */}
      <section className="relative pt-12 pb-2 bg-gradient-to-b from-forest-950 to-forest-900">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            All <span className="text-trail-500">Events</span>
          </h1>
          <p className="text-xl text-forest-300 max-w-3xl mx-auto mb-10">
            Discover our trail running adventures. From beginner-friendly trails to expert challenges,
            find the perfect race for your next adventure.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="pt-8 pb-16 bg-gradient-to-b from-forest-900 to-forest-950">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Iconify icon={ICONS.tree} className="h-16 w-16 mx-auto mb-6 text-trail-500" />
            <h2 className="font-heading text-3xl font-bold mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-lg text-forest-300 mb-8">
              Subscribe to our newsletter to be the first to know about new events,
              early bird registrations, and special offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-forest-700 bg-forest-900 text-white placeholder-forest-500 focus:outline-none focus:border-trail-500"
              />
              <Button onClick={() => alert('Soon!')}>
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Template>
  )
}
