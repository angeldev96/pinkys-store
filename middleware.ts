import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create unauthenticated response first
  let response = NextResponse.next({
    request,
  })

  // Skip middleware for static files and non-admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return response
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Allow public access to login page
  if (request.nextUrl.pathname === '/admin/login') {
    // If already logged in, check if admin and redirect to dashboard
    if (user) {
      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role === 'admin') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
      } catch {
        // If check fails, just continue to login
      }
    }
    return response
  }

  // Protect all other admin routes
  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Check if user is admin for protected routes
  try {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  } catch {
    // If check fails, redirect to login
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
