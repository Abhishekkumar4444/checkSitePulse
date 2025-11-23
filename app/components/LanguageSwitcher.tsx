'use client'

import { useState } from 'react'
import { useLocale } from '../contexts/LocaleContext'
import { locales, localeNames, localeFlags, type Locale } from '../i18n/config'
import styles from './LanguageSwitcher.module.css'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.languageSwitcher}>
      <button
        className={styles.languageButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
      >
        <span className={styles.flag}>{localeFlags[locale]}</span>
        <span className={styles.localeName}>{localeNames[locale]}</span>
        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <>
          <div className={styles.overlay} onClick={() => setIsOpen(false)} />
          <div className={styles.dropdown}>
            {locales.map((loc) => (
              <button
                key={loc}
                className={`${styles.option} ${locale === loc ? styles.active : ''}`}
                onClick={() => {
                  setLocale(loc)
                  setIsOpen(false)
                }}
              >
                <span className={styles.flag}>{localeFlags[loc]}</span>
                <span>{localeNames[loc]}</span>
                {locale === loc && <span className={styles.check}>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

