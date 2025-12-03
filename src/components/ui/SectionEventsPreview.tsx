import { Card } from "./Card"
import { Iconify, ICONS } from "@/lib/icons"
import { Button } from "./Button"

export default function SectionEventsPreview() {
  return (
    <section id="events" className="bg-gradient-to-b from-forest-950 to-forest-900 py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-center mb-12">
          Upcoming <span className="text-trail-500">Events</span>
        </h2>
        {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {[1, 2].map((event) => (
            <Card key={event}>
              <div className="h-48 aspect-video bg-gradient-to-br from-forest-800 to-forest-900 rounded-t-xl mb-4 flex items-center justify-center">
                <Iconify
                  icon={ICONS.mountain}
                  className="h-20 w-20 text-trail-500/50"
                />
              </div>
              <div className="space-y-3 p-6">
                <h3 className="font-heading text-xl font-bold">
                  Forest Trail Challenge {event}
                </h3>
                <div className="space-y-2 text-sm text-forest-300">
                  <div className="flex items-center gap-2">
                    <Iconify icon={ICONS.calendar} className="h-4 w-4" />
                    <span>Jan {25 + event}, 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Iconify icon={ICONS.location} className="h-4 w-4" />
                    <span>Mountain Forest Area</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Iconify icon={ICONS.distance} className="h-4 w-4" />
                    <span>{10 * event}KM Trail</span>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  Register Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
