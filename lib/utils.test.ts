import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility', () => {
  it('merges class names with tailwind-merge', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-sm', 'text-base')).toBe('text-base')
  })

  it('handles conditional and falsy values', () => {
    expect(cn('p-2', false && 'p-4', undefined, null, 'm-2')).toBe('p-2 m-2')
  })
})

