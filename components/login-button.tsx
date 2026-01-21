'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { type User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export function LoginButton({ user: initialUser }: { user?: User | null }) {
  const [loading, setLoading] = useState(false)
  const [isIframe, setIsIframe] = useState(false)
  const [user, setUser] = useState<User | null>(initialUser || null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setIsIframe(window.self !== window.top)

    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (error) throw error
    } catch (error) {
      console.error('Error logging in:', error)
      alert('Login error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
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
