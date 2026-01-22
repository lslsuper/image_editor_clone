import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // In Next.js 15+/16, `cookies()` is async in RSC — must await before use
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          console.log('[Supabase Server] Setting cookies:', cookiesToSet.map(c => `${c.name}`).join(', '))
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Dev environment adjustments
              if (process.env.NODE_ENV === 'development') {
                options.secure = false
                delete options.domain
                options.sameSite = 'lax' // Explicitly set SameSite to Lax for local dev
              }
              
              console.log(`[Supabase Server] Cookie ${name} options:`, JSON.stringify(options))
              options.path = '/'
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            console.error('[Supabase Server] Error setting cookies:', error)
          }
        },
      },
    }
  )
}
