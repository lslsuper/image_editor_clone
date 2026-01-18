'use client'

import { useEffect } from 'react'
import { createLogger } from '@/lib/logger'

const logger = createLogger('GlobalErrorHandler')

export function GlobalErrorHandler() {
  useEffect(() => {
    // Monkey patch removeChild to prevent browser extensions from crashing React
    // This is a common issue where extensions (like Google Translate) modify the DOM
    // causing React to fail when it tries to remove a node that's no longer a child
    if (typeof Node === 'function' && Node.prototype) {
      const originalRemoveChild = Node.prototype.removeChild
      Node.prototype.removeChild = function <T extends Node>(child: T): T {
        try {
          return originalRemoveChild.apply(this, arguments as any) as T
        } catch (error: any) {
          // Ignore NotFoundError which usually happens when third-party extensions modify the DOM
          if (error?.name === 'NotFoundError') {
            logger.warn('DOM', 'Suppressed NotFoundError in removeChild (likely extension conflict)', {
              message: error.message
            })
            return child
          }
          throw error
        }
      }
    }

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
