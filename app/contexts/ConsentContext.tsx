'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface ConsentState {
  ad_storage: 'granted' | 'denied'
  analytics_storage: 'granted' | 'denied'
  functionality_storage: 'granted' | 'denied'
  personalization_storage: 'granted' | 'denied'
  security_storage: 'granted' | 'denied'
}

interface ConsentContextType {
  consent: ConsentState | null
  hasConsent: boolean
  updateConsent: (granted: boolean) => void
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined)

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState | null>(null)
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    // Check for existing consent
    const savedConsent = localStorage.getItem('cookie-consent')
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent)
        setConsent(parsed)
        setHasConsent(true)
        updateGoogleConsent(parsed)
      } catch (e) {
        // Invalid consent, reset
        localStorage.removeItem('cookie-consent')
      }
    }
  }, [])

  const updateGoogleConsent = (consentState: ConsentState) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('consent', 'update', {
        ad_storage: consentState.ad_storage,
        analytics_storage: consentState.analytics_storage,
        functionality_storage: consentState.functionality_storage,
        personalization_storage: consentState.personalization_storage,
        security_storage: consentState.security_storage,
      })
    }
  }

  const updateConsent = (granted: boolean) => {
    const consentState: ConsentState = {
      ad_storage: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
      functionality_storage: 'granted', // Always granted for basic functionality
      personalization_storage: granted ? 'granted' : 'denied',
      security_storage: 'granted', // Always granted for security
    }

    setConsent(consentState)
    setHasConsent(true)
    localStorage.setItem('cookie-consent', JSON.stringify(consentState))
    updateGoogleConsent(consentState)
  }

  return (
    <ConsentContext.Provider value={{ consent, hasConsent, updateConsent }}>
      {children}
    </ConsentContext.Provider>
  )
}

export function useConsent() {
  const context = useContext(ConsentContext)
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider')
  }
  return context
}

