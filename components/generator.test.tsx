import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Generator } from './generator'
import { toast } from 'sonner'

// Mock fetch
global.fetch = vi.fn()

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

// Mock FileReader
class MockFileReader {
  onload: ((e: any) => void) | null = null
  readAsDataURL(file: File) {
    // Simulate async reading
    setTimeout(() => {
      if (this.onload) {
        this.onload({
          target: {
            result: 'data:image/png;base64,fake-image-data'
          }
        })
      }
    }, 0)
  }
}
global.FileReader = MockFileReader as any

describe('Generator Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders correctly', () => {
    render(<Generator />)
    expect(screen.getByText(/Try The AI Editor/i)).toBeInTheDocument()
    expect(screen.getByText(/Prompt Engine/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Describe your desired edits/i)).toBeInTheDocument()
  })

  it('shows toast when clicking generate without prompt', async () => {
    render(<Generator />)
    const generateBtn = screen.getByRole('button', { name: /Generate Now/i })
    fireEvent.click(generateBtn)
    expect(toast.error).toHaveBeenCalledWith('Please enter a prompt')
  })

  it('shows toast when clicking generate without image', async () => {
    render(<Generator />)
    const promptInput = screen.getByPlaceholderText(/Describe your desired edits/i)
    fireEvent.change(promptInput, { target: { value: 'A cat' } })
    
    const generateBtn = screen.getByRole('button', { name: /Generate Now/i })
    fireEvent.click(generateBtn)
    expect(toast.error).toHaveBeenCalledWith('Please upload at least one image')
  })

  it('handles image upload', async () => {
    render(<Generator />)
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' })
    const input = screen.getByLabelText(/Add/i) as HTMLInputElement
    
    expect(input).toBeInTheDocument()
    
    fireEvent.change(input, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(screen.getByAltText('Upload 1')).toBeInTheDocument()
    })
  })

  it('calls API and shows result on successful generation', async () => {
    // Mock successful fetch response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ images: ['https://example.com/result.png'] }),
    })

    render(<Generator />)
    
    // 1. Upload Image
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' })
    const input = screen.getByLabelText(/Add/i) as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })
    await waitFor(() => screen.getByAltText('Upload 1'))

    // 2. Enter Prompt
    const promptInput = screen.getByPlaceholderText(/Describe your desired edits/i)
    fireEvent.change(promptInput, { target: { value: 'Make it pop' } })

    // 3. Click Generate
    const generateBtn = screen.getByRole('button', { name: /Generate Now/i })
    fireEvent.click(generateBtn)

    // 4. Verify Loading State
    expect(screen.getByText(/Generating.../i)).toBeInTheDocument()

    // 5. Verify Result
    await waitFor(() => {
      expect(screen.getByAltText('Generated')).toBeInTheDocument()
      expect(screen.getByAltText('Generated')).toHaveAttribute('src', 'https://example.com/result.png')
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/generate', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('"prompt":"Make it pop"'),
    }))
  })

  it('handles API error', async () => {
    // Mock error fetch response
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Server exploded' }),
    })

    render(<Generator />)
    
    // Setup valid state
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' })
    const input = screen.getByLabelText(/Add/i) as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })
    await waitFor(() => screen.getByAltText('Upload 1'))

    const promptInput = screen.getByPlaceholderText(/Describe your desired edits/i)
    fireEvent.change(promptInput, { target: { value: 'Make it pop' } })

    const generateBtn = screen.getByRole('button', { name: /Generate Now/i })
    fireEvent.click(generateBtn)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Server exploded')
    })
  })
})
