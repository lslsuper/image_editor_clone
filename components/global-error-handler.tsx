'use client'

import { useEffect } from 'react'
import { createLogger } from '@/lib/logger'

const logger = createLogger('GlobalErrorHandler')

export function GlobalErrorHandler() {
  useEffect(() => {
    // Handler for synchronous errors and unhandled exceptions
    const handleError = (event: ErrorEvent) => {
      logger.error('window.onerror', 'Uncaught exception detected', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      })
    }

    // Handler for unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      logger.error('window.onunhandledrejection', 'Unhandled promise rejection', {
        reason: event.reason
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    logger.info('GlobalErrorHandler', 'Global error listeners attached')

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  return null
}
