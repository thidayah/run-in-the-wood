import { Iconify, ICONS } from "@/lib/icons"
import { Card } from "./Card"
import { Button } from "./Button"
import { Event } from "@/lib/supabase/events/types"
import { useRouter } from "next/navigation"

export default function EventCard({ event }: { event: Event }) {
  const router = useRouter()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // const participantPercentage = (event.current_participants / event.max_participants) * 100

  return (
    // <Card glow={event.registration_open}>
    <Card>
      {/* Event Image */}
      <div className="relative h-56 aspect-video w-full mb-4 rounded-t-xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.image_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 to-transparent"></div>

        {/* Status Badge */}
        {/* {!event.registration_open && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 rounded-full bg-forest-700/80 text-forest-300 text-xs font-medium">
              Sold Out
            </span>
          </div>
        )} */}
      </div>

      {/* Event Details */}
      <div className="space-y-4 p-6">
        <div>
          <h3 className="font-heading text-xl font-bold mb-2 line-clamp-1">
            {event.title}
          </h3>
          {/* <p className="text-forest-300 text-sm line-clamp-2 mb-3">
            {event.description}
          </p> */}
        </div>

        {/* Event Info */}
        <div className="space-y-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Iconify icon={ICONS.calendar} className="h-4 w-4" />
              <span className="text-sm text-forest-300">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Iconify icon={ICONS.location} className="h-4 w-4" />
              <span className="text-sm text-forest-300">{event.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Iconify icon={ICONS.runner} className="h-4 w-4" />
              <span className="text-sm text-forest-300">{event.distance} Trail</span>
            </div>
            <div className="flex items-center gap-2">
              <Iconify icon={ICONS.elevation} className="h-4 w-4" />
              <span className="text-sm text-forest-300">±{event.elevation}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-2 border-t border-forest-800">
            <div>
              <span className="text-2xl font-bold text-white">{formatPrice(event.price)}</span>
              {/* <span className="text-xs text-forest-400 block">Registration Fee</span> */}
            </div>

            {/* Participants Progress */}
            {/* <div className="text-right">
              <div className="text-xs text-forest-300">
                {event.current_participants}/{event.max_participants}
              </div>
              <div className="w-24 h-1.5 bg-forest-800 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full ${event.registration_open ? 'bg-trail-500' : 'bg-forest-600'}`}
                  style={{ width: `${Math.min(participantPercentage, 100)}%` }}
                />
              </div>
            </div> */}
          </div>
        </div>

        {/* Action Button */}
        <Button
          className="w-full"
          disabled={!event.registration_open}
          onClick={() => router.push(`/registration/${event.id}`)}
        >
          {event.registration_open ? 'Register Now' : 'Sold Out'}
        </Button>
      </div>
    </Card>
  )
}