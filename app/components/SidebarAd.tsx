'use client'

import { useEffect, useRef } from 'react'
import { useConsent } from '../contexts/ConsentContext'
import styles from './SidebarAd.module.css'

interface SidebarAdProps {
  position: 'left' | 'right'
  slot: string
}

export default function SidebarAd({ position, slot }: SidebarAdProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)
  const { consent, hasConsent } = useConsent()

  useEffect(() => {
    if (!adRef.current || initialized.current) return
    
    // Don't initialize ads if user hasn't consented or has denied consent
    if (!hasConsent || (consent && consent.ad_storage === 'denied')) {
      return
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
        // AdSense error, ignore
      }
    }

    // Wait for AdSense script to load
    if ((window as any).adsbygoogle) {
      // Small delay to ensure DOM is ready
      setTimeout(initAd, 100)
    } else {
      // Wait for script to load
      const checkScript = setInterval(() => {
        if ((window as any).adsbygoogle) {
          initAd()
          clearInterval(checkScript)
        }
      }, 100)
      
      // Cleanup after 10 seconds
      setTimeout(() => clearInterval(checkScript), 10000)
      
      return () => clearInterval(checkScript)
    }
  }, [slot, hasConsent, consent])

  return (
    <div ref={adRef} className={`${styles.sidebarAd} ${styles[position]}`}>
      <div className={styles.adLabel}>Advertisement</div>
      <div className={styles.adContainer}>
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '160px',
            height: '600px',
            minHeight: '600px',
          }}
          data-ad-client="ca-pub-3522508702369023"
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  )
}
