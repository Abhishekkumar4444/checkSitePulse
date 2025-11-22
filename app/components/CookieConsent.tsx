'use client'

import { useEffect, useState } from 'react'
import { useConsent } from '../contexts/ConsentContext'
import styles from './CookieConsent.module.css'

export default function CookieConsent() {
  const { hasConsent, updateConsent } = useConsent()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show banner if no consent has been given
    if (!hasConsent) {
      // Small delay for better UX
      setTimeout(() => setIsVisible(true), 500)
    }
  }, [hasConsent])

  const handleAccept = () => {
    updateConsent(true)
    setIsVisible(false)
  }

  const handleReject = () => {
    updateConsent(false)
    setIsVisible(false)
  }

  if (!isVisible || hasConsent) {
    return null
  }

  return (
    <div className={styles.consentBanner}>
      <div className={styles.consentContent}>
        <div className={styles.consentText}>
          <h3 className={styles.consentTitle}>🍪 Cookie Consent</h3>
          <p>
            We use cookies to personalize content and ads, to provide social media features and to analyze our traffic. 
            We also share information about your use of our site with our social media, advertising and analytics partners.
          </p>
        </div>
        <div className={styles.consentButtons}>
          <button
            onClick={handleAccept}
            className={styles.acceptButton}
            aria-label="Accept cookies"
          >
            Accept All
          </button>
          <button
            onClick={handleReject}
            className={styles.rejectButton}
            aria-label="Reject cookies"
          >
            Reject All
          </button>
        </div>
      </div>
    </div>
  )
}

