// Minimal mocks for @supabase/ssr and @supabase/supabase-js used in tests
export const mockAuth = {
  getUser: vi.fn(async () => ({ data: { user: null }, error: null })),
  getSession: vi.fn(async () => ({ data: { session: null }, error: null })),
  signInWithOAuth: vi.fn(async () => ({ data: {}, error: null })),
  signOut: vi.fn(async () => ({ error: null })),
  exchangeCodeForSession: vi.fn(async (_code?: string) => ({ error: null })),
  onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
}

export function createBrowserClient() {
  return { auth: mockAuth }
}

export function createServerClient() {
  return { auth: mockAuth }
}

