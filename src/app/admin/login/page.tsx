'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Iconify, ICONS } from '@/lib/icons'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if already logged in
  useEffect(() => {
    // const checkAuth = async () => {
    //   try {
    //     const response = await fetch('/api/auth')
    //     console.log({response});
        
    //     if (response.ok) {
    //       router.push('/admin/dashboard')
    //     }
    //   } catch (error) {
    //     // Not authenticated, stay on login page
    //   }
    // }
    
    // Check error from query params
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(errorParam)
    }
    
    // checkAuth()
  }, [router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to dashboard
        router.push('/admin/dashboard')
        router.refresh()
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-forest-950 to-forest-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Iconify
              icon={ICONS.tree}
              className="h-10 w-10 text-trail-500"
            />
            <h1 className="font-heading text-3xl font-bold">
              Run in the <span className="text-trail-500">Wood</span>
            </h1>
          </div>
          <p className="text-forest-300">Admin Portal</p>
        </div>

        {/* Login Card */}
        <Card className="border-2 border-forest-700 p-6">
          <h2 className="font-heading text-2xl font-bold mb-6 text-center">
            Administrator Login
          </h2>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="flex items-center gap-2 text-red-400">
                <Iconify icon="heroicons:exclamation-circle" className="h-5 w-5" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-forest-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Iconify
                  icon={ICONS.mail}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-forest-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-forest-700 bg-forest-900 text-white placeholder-forest-500 focus:outline-none focus:border-trail-500"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-forest-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Iconify
                  icon={ICONS.lock}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-forest-500"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-forest-700 bg-forest-900 text-white placeholder-forest-500 focus:outline-none focus:border-trail-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="md"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Iconify
                    icon="svg-spinners:ring-resize"
                    className="h-5 w-5"
                  />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Iconify icon={ICONS.login} className="h-5 w-5" />
                  Sign In
                </span>
              )}
            </Button>

            {/* Footer */}
            <div className="mt-4 text-center">
              <p className="text-sm text-forest-500">
                © {new Date().getFullYear()} Run in the Wood. Admin access only.
              </p>
            </div>
          </form>
        </Card>


      </div>
    </div>
  )
}