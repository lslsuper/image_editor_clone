
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from './route'
import { NextRequest } from 'next/server'

// Mock environment variables
const MOCK_API_KEY = 'sk-test-key'
process.env.OPENROUTER_API_KEY = MOCK_API_KEY

// Helper to create NextRequest
function createRequest(body: any) {
  return new NextRequest('http://localhost:3000/api/generate', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// Mock global fetch
global.fetch = vi.fn()

describe('API Route POST /api/generate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.OPENROUTER_API_KEY = MOCK_API_KEY
  })

  it('returns 400 if prompt is missing', async () => {
    const req = createRequest({ image: 'data:image/png;base64,...' })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Missing prompt')
  })

  it('returns 500 if API key is missing', async () => {
    process.env.OPENROUTER_API_KEY = ''
    const req = createRequest({ prompt: 'test' })
    const res = await POST(req)
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toContain('missing OPENROUTER_API_KEY')
  })

  it('calls OpenRouter and returns images on success', async () => {
    const mockOpenRouterResponse = {
      choices: [
        {
          message: {
            content: [
              { type: 'image_url', image_url: { url: 'https://result.com/img.png' } }
            ]
          }
        }
      ]
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockOpenRouterResponse,
    })

    const req = createRequest({ prompt: 'a cat', image: 'data:...' })
    const res = await POST(req)
    
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.images).toHaveLength(1)
    expect(data.images[0]).toBe('https://result.com/img.png')

    // Verify fetch call
    expect(global.fetch).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': `Bearer ${MOCK_API_KEY}`
        })
      })
    )
  })

  it('handles OpenRouter error', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 502,
      text: async () => 'Bad Gateway',
    })

    const req = createRequest({ prompt: 'test' })
    const res = await POST(req)
    
    expect(res.status).toBe(502)
    const data = await res.json()
    expect(data.error).toContain('OpenRouter error: 502 Bad Gateway')
  })
})
