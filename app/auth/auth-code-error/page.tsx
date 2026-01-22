'use client'

export default function AuthCodeError() {
  return (
    <main className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-xl font-semibold">Authentication Error</h1>
        <p className="text-sm text-muted-foreground">
          We couldn't complete the sign-in. Please try again. If the issue
          persists, ensure your Google OAuth redirect URL is configured in
          Supabase to include <code>/auth/callback</code> for this domain.
        </p>
      </div>
    </main>
  )
}

