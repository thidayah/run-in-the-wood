'use client'
import { Iconify, ICONS } from "@/lib/icons";
import { usePathname, useRouter } from "next/navigation";

const navigation = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Events', href: '#events' },
]

export default function Footer() {
  const pathname = usePathname()
  const router = useRouter()

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
      } else {
        const targetId = href.substring(1)
        router.push(`/${targetId === 'home' ? '/' : '#' + targetId}`)
      }
    } else {
      router.push(`${href}`)
    }
  }

  return (
    <>
      {/* <footer className="border-t border-forest-800 py-12" >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">          
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Iconify
                  icon={ICONS.tree}
                  className="h-8 w-8 text-trail-500"
                />
                <span className="font-heading text-xl font-bold">
                  Run in the <span className="text-trail-500">Wood</span>
                </span>
              </div>
              <p className="text-forest-400 text-sm">
                Trail running adventures through untouched forests and mountains.
              </p>
            </div>

            <div>
              <h4 className="font-heading font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <a onClick={() => handleSmoothScroll(item.href)} className="text-forest-400 hover:text-trail-500 text-sm cursor-pointer">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-forest-400">
                <li className="flex items-center gap-2">
                  <Iconify icon={ICONS.phone} className="h-4 w-4" />
                  <span>+62 877 3781 5286</span>
                </li>
                <li className="flex items-center gap-2">
                  <Iconify icon={ICONS.mail} className="h-4 w-4" />
                  <span>info@runminders.com</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/sobatsabtu" target="_blank" className="text-forest-400 hover:text-trail-500">
                  <Iconify icon={ICONS.instagram} className="h-6 w-6" />
                </a>
                <a href="https://www.x.com/sobatsabtu" target="_blank" className="text-forest-400 hover:text-trail-500">
                  <Iconify icon={ICONS.twitter} className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-forest-800 pt-8 text-center">
            <p className="text-sm text-forest-400">
              © 2024 Run in the Wood. All rights reserved.
            </p>
          </div>
        </div>
      </footer> */}

      <footer className="border-t border-forest-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row space-y-10 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Iconify
                  icon={ICONS.tree}
                  className="h-8 w-8 text-trail-500"
                />
                <span className="font-heading text-xl font-bold">
                  Run in the <span className="text-trail-500">Wood</span>
                </span>
              </div>
              <p className="text-forest-400 text-sm">
                © {new Date().getFullYear()} Run in the Wood. All rights reserved.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-bold mb-4 md:text-right">Follow Us</h4>
              <div className="flex gap-4">
                <a href={`https://wa.me/6285183081136?text=Halo%20Run%20in%20the%20Wood,%20saya%mau%bertanya`} target="_blank" className="text-forest-400 hover:text-trail-500">
                  <Iconify icon={ICONS.whatsapp} className="h-6 w-6" />
                </a>
                <a href="https://www.instagram.com/sobatsabtu" target="_blank" className="text-forest-400 hover:text-trail-500">
                  <Iconify icon={ICONS.instagram} className="h-6 w-6" />
                </a>
                {/* <a href="https://www.x.com/sobatsabtu" target="_blank" className="text-forest-400 hover:text-trail-500">
                  <Iconify icon={ICONS.twitter} className="h-6 w-6" />
                </a> */}
                <a href="mailto:info@runminders.com" target="_blank" className="text-forest-400 hover:text-trail-500">
                  <Iconify icon={ICONS.mail} className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}