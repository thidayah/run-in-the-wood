'use client'

import { useEffect, useState } from 'react'
// import { Button } from '@/components/ui/Button'
import { Iconify, ICONS } from '@/lib/icons'
import { usePathname, useRouter } from "next/navigation"

const navigation = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Events', href: '#events' },
  { name: 'Registration', href: '/events' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleSmoothScroll = (href: string) => {
    if (href.includes("#")) {
      if (pathname === '/') {
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
        setIsMenuOpen(false)
      } else {
        const targetId = href.substring(1)
        router.push(`/${targetId === 'home' ? '/' : '#'+targetId}`)
      }
    } else {
      router.push(`${href}`)
    }
    setIsMenuOpen(false);
  }

  const handleLogoClick = () => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      router.push('/')
    }
    setIsMenuOpen(false);
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-forest-800 bg-forest-950/90 backdrop-blur-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Iconify
              icon={ICONS.tree}
              className="h-8 w-8 text-trail-500"
            />
            <div>
              <h1 className="font-heading text-xl font-bold">
                Run in the <span className="text-trail-500">Wood</span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <a
                key={item.name}
                // href={item.href}
                onClick={() => handleSmoothScroll(item.href)}
                className="text-forest-300 hover:text-trail-500 transition-colors duration-200 cursor-pointer"
              >
                {item.name}
              </a>
            ))}
            {/* <Button>Register Now</Button> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-forest-300"
            // onClick={() => setIsMenuOpen(!isMenuOpen)}
            onClick={toggleMenu}
          >
            <Iconify
              icon={isMenuOpen ? ICONS.close : ICONS.menu}
              className="h-6 w-6"
            />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-forest-800 pt-4">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  // href={item.href}
                  className="text-forest-300 hover:text-trail-500 py-2 px-4 rounded-lg hover:bg-forest-800 cursor-pointer"
                  // onClick={() => setIsMenuOpen(false)}
                  onClick={() => handleSmoothScroll(item.href)}
                >
                  {item.name}
                </a>
              ))}
              {/* <Button className="w-full mt-2">
                Register Now
              </Button> */}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}