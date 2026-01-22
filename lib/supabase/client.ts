import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Prevent the client from trying to exchange OAuth codes in the browser
        // because we complete the exchange on the server callback.
        detectSessionInUrl: false,
      },
      cookieOptions: {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      }
    }
  )
}
