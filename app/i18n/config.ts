export const locales = ['en', 'es', 'fr', 'de', 'hi', 'zh', 'ja', 'ar'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  hi: 'हिन्दी',
  zh: '中文',
  ja: '日本語',
  ar: 'العربية',
}

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  hi: '🇮🇳',
  zh: '🇨🇳',
  ja: '🇯🇵',
  ar: '🇸🇦',
}

