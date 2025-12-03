import Link from "next/link"
import { Button } from "./Button"

export default function SectionCTA() {
  return (
    <section className="bg-gradient-to-br from-forest-900 to-forest-950 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl font-bold mb-6">
          Ready for the Adventure?
        </h2>
        <p className="text-lg text-forest-300 mb-8 max-w-2xl mx-auto">
          Join our next trail running event and experience nature like never before.
        </p>
        <Link href={'/events'}>
          <Button size="md" className="animate-pulse-slow">
            View All Events
          </Button>
        </Link>
      </div>
    </section>
  )
}
