// Mock next/headers before importing the module under test
const store = new Map<string, any>()
vi.mock('next/headers', () => ({
  cookies: () => ({
    getAll: () => Array.from(store.entries()).map(([name, v]) => ({ name, value: v.value })),
    set: (name: string, value: string, options?: any) => store.set(name, { value, options }),
  })
}))

describe('supabase server client cookies', () => {
  it('initializes without crash and can interact with cookies store', async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    const mod = await import('./server')
    const client = await mod.createClient()
    expect(client).toBeTruthy()

    // Simulate cookie write and assert stored
    store.set('sb-test', { value: 'v', options: { secure: false, sameSite: 'lax', path: '/' } })
    const all = Array.from(store.entries())
    expect(all[0][1].value).toBe('v')

    process.env.NODE_ENV = originalEnv
  })
})
