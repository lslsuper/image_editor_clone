import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function normalizeNext(nextParam: string | null) {
  if (!nextParam) return '/'
  return nextParam.startsWith('/') ? nextParam : '/'
}

export async function GET(request: NextRequest) {
  console.log('[Auth Callback] Route hit')
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = normalizeNext(searchParams.get('next'))

  console.log('[Auth Callback] Code present:', !!code)

  if (code) {
    const forwardedHost = request.headers.get('x-forwarded-host')
    const isLocalEnv = process.env.NODE_ENV === 'development'

    let redirectUrl = `${origin}${next}`
    if (!isLocalEnv && forwardedHost) {
      redirectUrl = `https://${forwardedHost}${next}`
    }

    const response = NextResponse.redirect(redirectUrl)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            console.log('[Auth Callback] Setting cookies:', cookiesToSet.map(c => c.name).join(', '))
            cookiesToSet.forEach(({ name, value, options }) => {
              // Normalize cookie options for local dev to avoid browser rejection
              if (process.env.NODE_ENV === 'development') {
                options.secure = false
                delete options.domain
                if (options.sameSite === 'none') {
                  options.sameSite = 'lax'
                } else if (!options.sameSite) {
                  options.sameSite = 'lax'
                }
              }
              options.path = '/'
              console.log(`[Auth Callback] Cookie ${name} options:`, JSON.stringify(options))
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    console.log('[Auth Callback] Exchanging code for session...')
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      console.log('[Auth Callback] Session exchange successful')
      return response
    } else {
      console.error('[Auth Callback] Auth error:', error)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
