'use client'

import { Iconify, ICONS } from '@/lib/icons'
import Image from 'next/image'

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-trail-500/30 bg-trail-500/10 px-4 py-2">
              
              <span className="text-sm text-trail-400">About Us</span>
            </div>
            
            <h2 className="font-heading text-4xl font-bold">
              More Than Just a <span className="text-trail-500">Race</span>
            </h2>
            
            <div className="space-y-4 text-forest-300">
              <p className="text-lg">
                <span className="font-bold text-trail-400">Run in the Wood</span> is a trail running community 
                dedicated to connecting people with nature through challenging and immersive running experiences.
              </p>
              
              <p>
                Founded in 2020 by a group of passionate trail runners, we organize events that take you 
                through some of the most beautiful and untouched forest trails.
              </p>
              
              <p>
                Our mission is to promote outdoor adventure, environmental awareness, and the joy of 
                trail running while building a strong community of nature enthusiasts.
              </p>
            </div>
            
            
          </div>
          
          {/* Right Column - Image Collage */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="grid grid-cols-2 grid-rows-2 gap-3">
              {/* Large Image */}
              <div className="relative row-span-2 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Trail runners in misty forest"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-trail-500/20 backdrop-blur-sm flex items-center justify-center">
                      <Iconify icon={ICONS.runner} className="h-4 w-4 text-trail-400" />
                    </div>
                    <span className="text-sm font-medium text-white">
                      Trail Challenge
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Top Right Image */}
              <div className="relative rounded-xl overflow-hidden">
                <Image
                  // src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60"
                  src="https://images.unsplash.com/photo-1616430295549-d62d0c6acb8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60"
                  alt="Trail running community"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-trail-600/20 to-transparent"></div>
              </div>
              
              {/* Bottom Right Image */}
              <div className="relative rounded-xl overflow-hidden">
                <Image
                  // src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60"
                  src="https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60"
                  alt="Beautiful forest trail"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-forest-700/20 to-transparent"></div>                
              </div>
            </div>
            
            
          </div>
        </div>
      </div>
    </section>
  )
}