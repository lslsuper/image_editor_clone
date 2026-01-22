import '@testing-library/jest-dom'

// Mock Supabase SSR and JS packages
vi.mock('@supabase/ssr', async () => {
  const mod = await import('./test/mocks/supabase')
  return {
    createServerClient: mod.createServerClient,
    createBrowserClient: mod.createBrowserClient,
  }
})

vi.mock('@supabase/supabase-js', async () => {
  // Only export types in app code; tests do not need real implementation
  return {}
})

// Mock Next.js app router navigation for client components
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  })
}))
