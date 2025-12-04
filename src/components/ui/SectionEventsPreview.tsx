'use client'
import { Iconify } from "@/lib/icons"
import { useEffect, useState } from "react"
import { eventsApi } from "@/lib/api-client"
import EventCard from "./EventCard"
import { Event } from "@/lib/supabase/events/types"

export default function SectionEventsPreview() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await eventsApi.getUpcoming()
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
      <div className="container mx-auto px-4 py-40 flex justify-center items-center">
        <div className="  text-center ">
          <Iconify icon="svg-spinners:ring-resize" className="h-12 w-12 mx-auto mb-6 text-trail-500" />
        </div>
      </div>
    )
  }

  return (
    <section id="events" className="bg-gradient-to-b from-forest-950 to-forest-900 py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-center mb-12">
          Upcoming <span className="text-trail-500">Events</span>
        </h2>
        {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  )
}
