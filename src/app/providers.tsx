'use client'

import { createContext, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeProvider, useTheme } from 'next-themes'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

function usePrevious<T>(value: T) {
  let ref = useRef<T | undefined>(undefined)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

function ThemeWatcher() {
  let { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    let media = window.matchMedia('(prefers-color-scheme: dark)')

    function onMediaChange() {
      let systemTheme = media.matches ? 'dark' : 'light'
      if (resolvedTheme === systemTheme) {
        setTheme('system')
      }
    }

    onMediaChange()
    media.addEventListener('change', onMediaChange)

    return () => {
      media.removeEventListener('change', onMediaChange)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export const AppContext = createContext<{ previousPathname?: string }>({})

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize PostHog client
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      defaults: '2025-05-24',
      capture_exceptions: true,
      debug: process.env.NODE_ENV === 'development',
    })
  }, [])

  let pathname = usePathname()
  let previousPathname = usePrevious(pathname)

  // Track page views
  useEffect(() => {
    if (pathname !== previousPathname) {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
        page: pathname,
      })
    }
  }, [pathname, previousPathname])

  return (
    <AppContext.Provider value={{ previousPathname }}>
      <PHProvider client={posthog}>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <ThemeWatcher />
          {children}
        </ThemeProvider>
      </PHProvider>
    </AppContext.Provider>
  )
}
