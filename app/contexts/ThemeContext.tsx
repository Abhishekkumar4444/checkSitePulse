'use client'

import { createContext, useContext, useEffect, useLayoutEffect, useState, useMemo } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  effectiveTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Helper to get initial theme from localStorage (only on client)
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  try {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      return savedTheme
    }
  } catch (error) {
    // localStorage might not be available (e.g., in private browsing)
    console.warn('Failed to read theme from localStorage:', error)
  }
  return 'system'
}

// Helper to get effective theme
function getEffectiveTheme(theme: Theme): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with 'system' to avoid hydration mismatch
  // We'll read from localStorage in useEffect on client-side only
  const [theme, setThemeState] = useState<Theme>('system')
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  
  // Read theme from localStorage immediately on client mount
  // Use useLayoutEffect to run synchronously before paint to prevent flash
  useLayoutEffect(() => {
    // Read from localStorage - this is the source of truth
    const savedTheme = getInitialTheme()
    
    // Update state immediately to match localStorage
    setThemeState(savedTheme)
    
    // Ensure document theme matches the saved preference
    const effective = savedTheme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : savedTheme
    document.documentElement.setAttribute('data-theme', effective)
  }, []) // Only run once on mount
  
  // Calculate effective theme immediately
  const effectiveTheme = useMemo(() => {
    if (theme === 'system') {
      return systemTheme
    }
    return theme
  }, [theme, systemTheme])

  // Set theme attribute on document immediately
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme)
  }, [effectiveTheme])

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const newSystemTheme = mediaQuery.matches ? 'dark' : 'light'
      setSystemTheme(newSystemTheme)
      document.documentElement.setAttribute('data-theme', newSystemTheme)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    // Update state immediately
    setThemeState(newTheme)
    
    // Save to localStorage with error handling
    try {
      localStorage.setItem('theme', newTheme)
    } catch (error) {
      // localStorage might not be available (e.g., in private browsing, quota exceeded)
      console.warn('Failed to save theme to localStorage:', error)
    }
    
    // Update document theme immediately
    if (newTheme === 'system') {
      const newEffective = systemTheme
      document.documentElement.setAttribute('data-theme', newEffective)
    } else {
      document.documentElement.setAttribute('data-theme', newTheme)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

