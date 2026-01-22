import { NextRequest } from 'next/server'
import { GET } from './route'

const auth = {
  exchangeCodeForSession: vi.fn(async (_: string) => ({ error: null })),
}

vi.mock('@supabase/ssr', () => ({
  createServerClient: () => ({ auth }),
}))

describe('auth callback route', () => {
  it('redirects to error page when no code', async () => {
    const req = new NextRequest('http://localhost:3000/auth/callback')
    const res = await GET(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toMatch('/auth/auth-code-error')
  })

  it('exchanges code and redirects to next on same origin', async () => {
    const req = new NextRequest('http://localhost:3000/auth/callback?code=abc&next=%2Fdash')
    const res = await GET(req)
    expect(auth.exchangeCodeForSession).toHaveBeenCalledWith('abc')
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('http://localhost:3000/dash')
  })
})
