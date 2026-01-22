'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { type User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { logoutAction } from '@/app/auth/actions'
import { useState, useEffect } from 'react'

export function LoginButton({ user: initialUser }: { user?: User | null }) {
  const [loading, setLoading] = useState(false)
  const [isIframe, setIsIframe] = useState(false)
  const [user, setUser] = useState<User | null>(initialUser || null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setIsIframe(window.self !== window.top)

    // Debug: Check cookies
    console.log('[LoginButton] Document Cookies:', document.cookie)

    // Check initial session
    const checkSession = async () => {
      console.log('[LoginButton] Checking session...')
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log('[LoginButton] Session result:', session ? 'Found session' : 'No session', error || '')
      if (session?.user) {
        setUser(session.user)
      }
    }
    
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
      
      if (event === 'SIGNED_IN') {
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const handleLogin = async () => {
    if (isIframe) {
      alert('Google Login cannot run in iframe preview for security reasons.\n\nPlease click "Open in Browser" or test at http://localhost:3000 in an external browser.')
      return
    }

    setLoading(true)
    try {
      // Preserve the page user started on so the callback can redirect back
      const next = `${location.pathname}${location.search || ''}`
      const loginUrl = `/auth/login?next=${encodeURIComponent(next)}`
      console.log('[LoginButton] Redirecting to server-side OAuth start', { loginUrl })
      window.location.assign(loginUrl)
    } catch (error: any) {
      console.error('Error logging in:', error)
      alert('Login error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      const { error } = await logoutAction()
      if (error) {
        throw new Error(error)
      }
      setUser(null)
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-foreground font-medium hidden sm:inline-block">
          {user.email}
        </span>
        <Button 
          onClick={handleLogout} 
          disabled={loading}
          variant="ghost"
        >
          {loading ? 'Signing out...' : 'Sign out'}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Button 
        onClick={handleLogin} 
        disabled={loading}
        variant="outline"
        className={isIframe ? "opacity-80" : ""}
      >
        {loading ? 'Connecting...' : 'Login with Google'}
      </Button>
      {isIframe && (
        <p className="text-[10px] text-muted-foreground text-center max-w-[120px] leading-tight">
          ⚠️ Please test in external browser
        </p>
      )}
    </div>
  )
}
