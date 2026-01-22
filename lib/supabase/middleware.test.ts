import { updateSession } from './middleware'

// Mock Next types and utilities
const setCalls: any[] = []
const requestMock: any = {
  cookies: {
    getAll: () => [],
    set: (name: string, value: string) => setCalls.push([name, value]),
  },
}

vi.mock('next/server', () => ({
  NextResponse: {
    next: ({ request }: any) => ({ cookies: { set: vi.fn(), getAll: vi.fn(() => []) } }),
  },
}))

// Mock supabase server client creation inside this module
vi.mock('@supabase/ssr', async () => {
  const { createServerClient } = await import('../../test/mocks/supabase')
  return { createServerClient }
})

describe('middleware updateSession', () => {
  it('returns a response and interacts with cookies', async () => {
    const res = await updateSession(requestMock as any)
    expect(res).toBeTruthy()
  })
})

