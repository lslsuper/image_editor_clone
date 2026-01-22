import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Debug: Log all received cookies
  const cookieNames = request.cookies.getAll().map(c => c.name)
  console.log('[Middleware] Received Cookies:', cookieNames.join(', '))

  if (request.nextUrl.pathname.startsWith('/auth/login')) {
    console.log('[Middleware] Auth login request:', request.nextUrl.pathname)
  }
  
  // Check for the specific auth cookie
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)\./)?.[1]
  if (projectId) {
    const authCookie = request.cookies.get(`sb-${projectId}-auth-token.0`) || request.cookies.get(`sb-${projectId}-auth-token`)
    console.log(`[Middleware] Auth Cookie (sb-${projectId}-...):`, authCookie ? 'Present' : 'Missing')
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|auth/login|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
