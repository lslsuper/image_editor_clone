import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function normalizeNext(nextParam: string | null) {
  if (!nextParam) return '/'
  return nextParam.startsWith('/') ? nextParam : '/'
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  console.log('[Auth Login] Route hit:', request.url)
  const next = normalizeNext(searchParams.get('next'))

  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'
  const origin = new URL(request.url).origin
  const baseOrigin = !isLocalEnv && forwardedHost ? `https://${forwardedHost}` : origin

  const redirectTo = `${baseOrigin}/auth/callback?next=${encodeURIComponent(next)}`

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  })

  if (error || !data?.url) {
    console.error('[Auth Login] OAuth start error:', error)
    return NextResponse.redirect(`${baseOrigin}/auth/auth-code-error`)
  }

  console.log('[Auth Login] Redirecting to provider URL')
  return NextResponse.redirect(data.url)
}
