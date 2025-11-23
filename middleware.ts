import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Supported locales
export const locales = ['en', 'es', 'fr', 'de', 'hi', 'zh', 'ja', 'ar'] as const
export type Locale = (typeof locales)[number]

// Default locale
export const defaultLocale: Locale = 'en'

// Locale detection
export function getLocale(request: NextRequest): Locale {
  // Check if locale is in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    const locale = pathname.split('/')[1] as Locale
    if (locales.includes(locale)) {
      return locale
    }
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    for (const locale of locales) {
      if (acceptLanguage.includes(locale)) {
        return locale
      }
    }
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/ads.txt') ||
    pathname.startsWith('/icon.svg') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // For now, don't redirect - let routes work normally
  // Locale detection will work client-side via LocaleContext
  // This allows the app to work without restructuring to [locale] routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|ads.txt).*)',
  ],
}

