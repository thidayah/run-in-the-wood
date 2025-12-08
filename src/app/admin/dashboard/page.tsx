'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Iconify, ICONS } from '@/lib/icons'

interface UserSession {
  id: string
  name: string
  email: string
  username: string
  role: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState(true)

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

    // setTimeout(() => {
    //   setLoading(false)
    // }, 250);
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'DELETE',
      })      
      // Clear local state and redirect
      setUser(null)
      router.push('/admin/login')
      router.refresh()
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 to-forest-900">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-forest-800 bg-forest-950/95 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <Iconify 
                icon={ICONS.tree}
                className="h-8 w-8 text-trail-500"
              />
              <div>
                <h1 className="font-heading text-xl font-bold">
                  Run in the <span className="text-trail-500">Wood</span>
                </h1>
                <p className="text-xs text-forest-400">Admin Dashboard</p>
              </div>
            </div>
            
            {/* Right: User Info & Logout */}
            <div className="flex items-center gap-4">
              {user && (
                <>
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-forest-400">{user.email}</p>
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-trail-500 to-trail-600 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-forest-700 text-forest-300 hover:border-red-500 hover:text-red-400 transition-colors"
                  >
                    <Iconify icon="heroicons:arrow-left-on-rectangle" className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Card */}
          <Card className="mb-8 p-6">
            <div className="flex items-center gap-4 mb-6">
              <Iconify 
                icon={ICONS.dashboard}
                className="h-8 w-8 text-trail-500"
              />
              <h2 className="font-heading text-2xl font-bold">
                Welcome to Dashboard
              </h2>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-forest-300 mb-4">
                Welcome back, <span className="font-bold text-trail-400">{user?.name}</span>! 
                You are logged in as an administrator.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 hidden">
                {/* Quick Stats Cards */}
                <Card className="hover:border-trail-500/30 transition-colors p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-forest-400">Total Events</p>
                      <p className="text-3xl font-bold">2</p>
                    </div>
                    <Iconify 
                      icon={ICONS.calendar}
                      className="h-8 w-8 text-trail-500"
                    />
                  </div>
                </Card>
                
                <Card className="hover:border-trail-500/30 transition-colors p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-forest-400">Total Participants</p>
                      <p className="text-3xl font-bold">0</p>
                    </div>
                    <Iconify 
                      icon={ICONS.users}
                      className="h-8 w-8 text-trail-500"
                    />
                  </div>
                </Card>
                
                <Card className="hover:border-trail-500/30 transition-colors p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-forest-400">Active Now</p>
                      <p className="text-3xl font-bold">1</p>
                    </div>
                    <Iconify 
                      icon={ICONS.active}
                      className="h-8 w-8 text-trail-500"
                    />
                  </div>
                </Card>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-8 pt-8 border-t border-forest-800">
                <h3 className="font-heading text-lg font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => router.push('/admin/events')}
                    className="p-4 rounded-lg border border-forest-700 hover:border-trail-500 hover:bg-trail-500/5 transition-colors text-left"
                  >
                    <Iconify icon={ICONS.calendar} className="h-6 w-6 text-trail-500 mb-2" />
                    <p className="font-medium">Manage Events</p>
                    <p className="text-sm text-forest-400">Create and edit events</p>
                  </button>
                  
                  <button
                    onClick={() => router.push('/admin/participants')}
                    className="p-4 rounded-lg border border-forest-700 hover:border-trail-500 hover:bg-trail-500/5 transition-colors text-left"
                  >
                    <Iconify icon={ICONS.users} className="h-6 w-6 text-trail-500 mb-2" />
                    <p className="font-medium">View Participants</p>
                    <p className="text-sm text-forest-400">Manage registrations</p>
                  </button>
                  
                  <button
                    onClick={() => router.push('/events')}
                    className="p-4 rounded-lg border border-forest-700 hover:border-trail-500 hover:bg-trail-500/5 transition-colors text-left"
                  >
                    <Iconify icon={ICONS.eye} className="h-6 w-6 text-trail-500 mb-2" />
                    <p className="font-medium">View Site</p>
                    <p className="text-sm text-forest-400">See public website</p>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="p-4 rounded-lg border border-forest-700 hover:border-red-500 hover:bg-red-500/5 transition-colors text-left"
                  >
                    <Iconify icon={ICONS.logout} className="h-6 w-6 text-red-500 mb-2" />
                    <p className="font-medium">Logout</p>
                    <p className="text-sm text-forest-400">End your session</p>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}