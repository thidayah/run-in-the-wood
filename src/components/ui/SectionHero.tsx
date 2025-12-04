'use client'
import { Button } from '@/components/ui/Button'
import { Iconify, ICONS } from '@/lib/icons'
import Link from "next/link"

export default function SectionHero() {

  const handleSmoothScroll = (href: string) => {
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      const headerHeight = 40
      const targetPosition = targetElement.offsetTop - headerHeight
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section id="home" className="relative overflow-hidden py-16 md:py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23557d55%22%20fill-opacity=%220.1%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <Iconify
          icon={ICONS.mountain}
          className="h-16 w-16 text-forest-700/30"
        />
      </div>
      <div className="absolute bottom-20 right-10 animate-float delay-1000">
        <Iconify
          icon={ICONS.compass}
          className="h-20 w-20 text-forest-700/20"
        />
      </div>

      <div className="container relative mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-trail-500/30 bg-trail-500/10 px-4 py-2 mb-6">
          <span className="h-2 w-2 animate-pulse rounded-full bg-trail-500"></span>
          <span className="text-sm text-trail-400">
            Next Event: Mountain Trail Challenge
          </span>
        </div>

        <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
          Run Wild.
          <br />
          <span className="text-trail-500">Find Freedom.</span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-forest-300 mb-8">
          Challenge yourself in the heart of nature. Join our trail running adventures through untouched forests.
        </p>

        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={'/events'}>
          <Button size="md" className="group">
            Explore Events
            <Iconify
              icon={ICONS.arrowRight}
              className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
            />
          </Button>
          </Link>
          <Button variant="outline" size="md" onClick={() => handleSmoothScroll('#about')}>
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}