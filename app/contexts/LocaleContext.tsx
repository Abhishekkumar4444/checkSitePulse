'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Locale, defaultLocale, locales } from '../i18n/config'
// Preload default English messages synchronously
import enMessages from '../i18n/messages/en.json'

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

async function loadMessages(locale: Locale) {
  try {
    const messages = await import(`../i18n/messages/${locale}.json`)
    return messages.default
  } catch (error) {
    // Fallback to English if locale file doesn't exist
    return enMessages
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  
  // Initialize locale synchronously
  const getInitialLocale = (): Locale => {
    if (typeof window === 'undefined') return defaultLocale
    
    const savedLocale = localStorage.getItem('preferred-locale') as Locale
    if (savedLocale && locales.includes(savedLocale)) {
      return savedLocale
    }
    
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length > 0) {
      const pathLocale = segments[0] as Locale
      if (locales.includes(pathLocale)) {
        return pathLocale
      }
    }
    
    return defaultLocale
  }
  
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Initialize with default, will update in useEffect
    return defaultLocale
  })
  const [messages, setMessages] = useState<any>(enMessages)

  // Initialize locale and load messages on mount
  useEffect(() => {
    const initialLocale = getInitialLocale()
    setLocaleState(initialLocale)
    
    // Load messages for the initial locale
    if (initialLocale === defaultLocale) {
      setMessages(enMessages)
    } else {
      loadMessages(initialLocale).then(setMessages)
    }
  }, [])

  // Load messages when locale changes
  useEffect(() => {
    if (locale === defaultLocale) {
      setMessages(enMessages)
    } else {
      loadMessages(locale).then(setMessages)
    }
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    if (newLocale === locale) return
    
    // Store locale preference in localStorage
    localStorage.setItem('preferred-locale', newLocale)
    
    // Update locale state (no URL change needed)
    setLocaleState(newLocale)
    
    // Reload messages for new locale
    loadMessages(newLocale).then(setMessages)
  }

  const t = (key: string): string => {
    if (!messages) return key
    
    const keys = key.split('.')
    let value: any = messages
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}


