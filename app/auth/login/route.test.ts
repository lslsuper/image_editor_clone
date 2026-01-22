import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'

const auth = {
  signInWithOAuth: vi.fn(async () => ({ data: { url: 'https://example.com/oauth' }, error: null })),
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ auth }),
}))

describe('auth login route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to provider url', async () => {
    const req = new Request('http://localhost:3000/auth/login?next=%2Fdash')
    const res = await GET(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('https://example.com/oauth')
    expect(auth.signInWithOAuth).toHaveBeenCalled()
  })

  it('redirects to error page on failure', async () => {
    auth.signInWithOAuth.mockResolvedValueOnce({ data: null, error: { message: 'boom' } })
    const req = new Request('http://localhost:3000/auth/login?next=%2Fdash')
    const res = await GET(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('http://localhost:3000/auth/auth-code-error')
  })
})
