
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

// Mock OpenAI SDK with a toggle to simulate error/success per test
let openAiShouldThrow = false
vi.mock('openai', () => {
  const ctor = vi.fn().mockImplementation((_cfg: any) => ({
    chat: {
      completions: {
        create: vi.fn(async (_args: any) => {
          if (openAiShouldThrow) throw new Error('OpenRouter error: 502 Bad Gateway')
          return {
            id: 'cmpl_1',
            model: 'mock-model',
            choices: [
              { message: { content: '![img](https://result.com/img.png)' } }
            ],
          }
        })
      }
    }
  }))
  return { default: ctor }
})

describe('API Route POST /api/generate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.OPENROUTER_API_KEY = MOCK_API_KEY
    openAiShouldThrow = false
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
    const req = createRequest({ prompt: 'a cat', image: 'data:...' })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.images).toHaveLength(1)
    expect(data.images[0]).toBe('https://result.com/img.png')
  })

  it('handles OpenRouter error', async () => {
    openAiShouldThrow = true
    const req = createRequest({ prompt: 'test' })
    const res = await POST(req)
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toContain('OpenRouter error: 502 Bad Gateway')
  })
})
