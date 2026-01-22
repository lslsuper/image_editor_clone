import { render, screen, fireEvent } from '@testing-library/react'
import { LoginButton } from './login-button'
import * as supabaseClient from '@/lib/supabase/client'
import { logoutAction } from '@/app/auth/actions'

// Provide a mock implementation for browser client
const auth = {
  getSession: vi.fn(async () => ({ data: { session: null }, error: null })),
  signOut: vi.fn(async () => ({ error: null })),
  onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
}

vi.spyOn(supabaseClient, 'createClient').mockReturnValue({ auth } as any)

vi.mock('@/app/auth/actions', () => ({
  logoutAction: vi.fn(async () => ({ error: null })),
}))

function setIsTopWindow(value: boolean) {
  Object.defineProperty(window, 'top', {
    value: value ? window.self : {},
    configurable: true,
  })
}

function setLocation(url: string) {
  const parsed = new URL(url)
  Object.defineProperty(window, 'location', {
    value: {
      origin: parsed.origin,
      pathname: parsed.pathname,
      search: parsed.search,
      assign: vi.fn(),
    },
    writable: true,
    configurable: true,
  })
}

describe('LoginButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // default to not in iframe
    setIsTopWindow(true)
    setLocation('http://localhost:3000/')
  })

  it('renders login when no user', () => {
    render(<LoginButton />)
    expect(screen.getByText(/Login with Google/i)).toBeInTheDocument()
  })

  it('renders user email and sign out when user exists', () => {
    render(<LoginButton user={{ id: 'u1', email: 'a@b.com' } as any} />)
    expect(screen.getByText('a@b.com')).toBeInTheDocument()
    expect(screen.getByText(/Sign out/i)).toBeInTheDocument()
  })

  it('prevents login inside iframe', () => {
    setIsTopWindow(false)
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    render(<LoginButton />)
    fireEvent.click(screen.getByText(/Login with Google/i))
    expect(window.location.assign).not.toHaveBeenCalled()
  })

  it('redirects to server-side login route with next path', async () => {
    setLocation('http://localhost:3000/some?p=1')
    render(<LoginButton />)
    fireEvent.click(screen.getByText(/Login with Google/i))
    expect(window.location.assign).toHaveBeenCalledWith(
      '/auth/login?next=%2Fsome%3Fp%3D1'
    )
  })

  it('calls server logout action', async () => {
    render(<LoginButton user={{ id: 'u1', email: 'a@b.com' } as any} />)
    fireEvent.click(screen.getByText(/Sign out/i))
    expect(logoutAction).toHaveBeenCalled()
  })
})
