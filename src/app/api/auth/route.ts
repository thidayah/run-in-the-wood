import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose' // Gunakan jose untuk Edge compatibility
import { successResponse, errorResponse } from '@/lib/api-response'
import { supabaseServer } from "@/lib/supabase/server"
import { jwtVerify } from 'jose'

// JWT Secret
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-32-character-secret-key-change-in-production-min-32-chars'
)

interface LoginRequest {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    
    // Validation
    if (!body.email || !body.password) {
      return NextResponse.json(
        errorResponse('Email and password are required'),
        { status: 400 }
      )
    }
    
    // Get user from database
    const { data: user, error } = await supabaseServer
      .from('admin_users')
      .select('*')
      .eq('email', body.email.toLowerCase().trim())
      .single()
    
    if (error || !user) {
      return NextResponse.json(
        errorResponse('Invalid credentials'),
        { status: 401 }
      )
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(body.password, user.password_hash)
    
    if (!isValidPassword) {
      return NextResponse.json(
        errorResponse('Invalid credentials'),
        { status: 401 }
      )
    }
    
    // Create JWT token dengan jose
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      role: 'admin'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET)
    
    // Create session data
    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: 'admin'
    }
    
    // Set cookie
    const response = NextResponse.json(
      successResponse({
        user: sessionData,
        token
      }, 'Login successful'),
      { status: 200 }
    )
    
    // Set HTTP-only cookie untuk production
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })
    
    // Set session cookie (non-httpOnly untuk client side access)
    response.cookies.set({
      name: 'user_session',
      value: JSON.stringify(sessionData),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60,
      path: '/'
    })
    
    return response
    
  } catch (error: any) {
    console.error('Auth API error:', error)
    
    return NextResponse.json(
      errorResponse('Authentication failed', error.message),
      { status: 500 }
    )
  }
}

// Logout endpoint
export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json(
      successResponse(null, 'Logout successful'),
      { status: 200 }
    )
    
    // Clear cookies
    response.cookies.delete('auth_token')
    response.cookies.delete('user_session')
    
    return response
    
  } catch (error: any) {
    console.error('Logout error:', error)
    
    return NextResponse.json(
      errorResponse('Logout failed', error.message),
      { status: 500 }
    )
  }
}

// Check auth status
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      return NextResponse.json(
        errorResponse('Not authenticated'),
        { status: 401 }
      )
    }
    
    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    
    return NextResponse.json(
      successResponse({
        user: payload,
        authenticated: true
      }, 'Authenticated'),
      { status: 200 }
    )
    
  } catch (error) {
    return NextResponse.json(
      errorResponse('Not authenticated'),
      { status: 401 }
    )
  }
}