'use client'

import { ReactNode, useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Iconify, ICONS } from '@/lib/icons'

interface UserSession {
  id: string
  name: string
  email: string
  username: string
  role: string
}

interface AdminTemplateProps {
  children: ReactNode
}

export default function AdminTemplate({ children }: AdminTemplateProps) {
  const router = useRouter()
  const path = usePathname()
  
  const [user, setUser] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setUser(data.data.user)
          } else {
            router.push('/admin/login')
          }
        } else {
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'DELETE',
        credentials: 'include'
      })
      
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-forest-950 to-forest-900">
        <Iconify 
          icon="svg-spinners:ring-resize"
          className="h-12 w-12 text-trail-500"
        />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const menuItems = [
    {
      name: 'Dashboard',
      icon: ICONS.dashboard,
      path: '/admin/dashboard'
    },
    {
      name: 'Events',
      icon: ICONS.calendar,
      path: '/admin/events',
      // active: true
    },
    {
      name: 'Participants',
      icon: ICONS.users,
      path: '/admin/participants',
      // active: true
    },
    {
      name: 'View Site',
      icon: 'heroicons:globe-alt',
      path: '/',
      external: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 to-forest-900 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-forest-900 border border-forest-700 rounded-lg"
      >
        <Iconify 
          icon={sidebarOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'}
          className="h-6 w-6 text-forest-300"
        />
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-80 bg-forest-950 border-r border-forest-800
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-forest-800">
          <div className="flex items-center gap-3">
            <Iconify 
              icon={ICONS.tree}
              className="h-8 w-8 text-trail-500"
            />
            <div>
              <h1 className="font-heading text-xl font-bold">
                Run in the <span className="text-trail-500">Wood</span>
              </h1>
              <p className="text-xs text-forest-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-forest-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-trail-500 to-trail-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-forest-400">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                {item.external ? (
                  <a
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-forest-300 hover:bg-forest-800 hover:text-white transition-colors"
                  >
                    <Iconify icon={item.icon} className="h-5 w-5" />
                    <span>{item.name}</span>
                    <Iconify icon="heroicons:arrow-up-right" className="h-4 w-4 ml-auto" />
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      router.push(item.path)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      // item.active
                      path === item.path
                        ? 'bg-trail-500/20 text-trail-500 border border-trail-500/30'
                        : 'text-forest-300 hover:bg-forest-800 hover:text-white'
                    }`}
                  >
                    <Iconify icon={item.icon} className="h-5 w-5" />
                    <span>{item.name}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-forest-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-forest-300 hover:bg-red-500/20 hover:text-red-400 border border-forest-700 hover:border-red-500/30 transition-colors"
          >
            <Iconify icon={ICONS.logout} className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="w-full md:w-[80%] lg:ml-20 ">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 border-b border-forest-800 bg-forest-950/95 backdrop-blur-md lg:hidden">
          <div className="px-4 py-6">
            <div className="flex items-center justify-between pl-16">
              <div className="flex items-center gap-3">
                <Iconify 
                  icon={ICONS.tree}
                  className="h-6 w-6 text-trail-500"
                />
                <span className="font-heading font-bold">
                  Admin Panel
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-trail-500 to-trail-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}