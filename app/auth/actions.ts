'use server'

import { createClient } from '@/lib/supabase/server'

export async function logoutAction() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('[Auth Logout] signOut error:', error)
    return { error: error.message }
  }

  return { error: null }
}

