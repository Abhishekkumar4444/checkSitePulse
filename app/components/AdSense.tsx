'use client'

import { useEffect, useRef } from 'react'
import { useConsent } from '../contexts/ConsentContext'

interface AdSenseProps {
  slot: string
  style?: React.CSSProperties
  format?: string
  responsive?: boolean
}

export default function AdSense({ slot, style, format = 'auto', responsive = true }: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)
  const { consent, hasConsent } = useConsent()

  useEffect(() => {
    if (!adRef.current || initialized.current) return
    
    // Don't initialize ads if user hasn't consented or has denied consent
    if (!hasConsent || (consent && consent.ad_storage === 'denied')) {
      return
    }
    
    // Monitor ad status changes
    const checkAdStatus = () => {
      // Monitor ad status silently
    }
    
    const initAd = () => {
      try {
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          const adElement = adRef.current?.querySelector('.adsbygoogle') as HTMLElement
          if (adElement) {
            // Check if ad is already initialized
            const status = adElement.getAttribute('data-adsbygoogle-status')
            if (!status || status === 'unfilled') {
              try {
                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
                initialized.current = true
              } catch (e) {
                // Ad already initialized, ignore
                initialized.current = true
              }
            } else {
              initialized.current = true
            }
          }
        }
      } catch (err) {
        // Error initializing ad, ignore
      }
    }

    // Monitor ad status periodically
    const statusInterval = setInterval(checkAdStatus, 2000)
    
    // Wait for AdSense script to load
    let checkScript: NodeJS.Timeout | null = null
    
    if ((window as any).adsbygoogle) {
      // Small delay to ensure DOM is ready
      setTimeout(initAd, 100)
    } else {
      // Wait for script to load
      checkScript = setInterval(() => {
        if ((window as any).adsbygoogle) {
          initAd()
          if (checkScript) clearInterval(checkScript)
        }
      }, 100)
      
      // Cleanup after 10 seconds
      setTimeout(() => {
        if (checkScript) clearInterval(checkScript)
      }, 10000)
    }
    
    return () => {
      clearInterval(statusInterval)
      if (checkScript) clearInterval(checkScript)
    }
  }, [slot, hasConsent, consent])

  return (
    <div ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style,
        }}
        data-ad-client="ca-pub-3522508702369023"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}

