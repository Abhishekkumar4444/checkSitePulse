'use client'

import { useEffect, useRef } from 'react'

interface AdSenseProps {
  slot: string
  style?: React.CSSProperties
  format?: string
  responsive?: boolean
}

export default function AdSense({ slot, style, format = 'auto', responsive = true }: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (!adRef.current || initialized.current) return
    
    // Monitor ad status changes
    const checkAdStatus = () => {
      const adElement = adRef.current?.querySelector('.adsbygoogle') as HTMLElement
      if (adElement) {
        const status = adElement.getAttribute('data-adsbygoogle-status')
        if (status === 'done') {
          console.log(`[AdSense] Ad loaded successfully for slot: ${slot}`)
        } else if (status === 'error') {
          console.error(`[AdSense] Ad failed to load for slot: ${slot}`)
        } else if (status === 'unfilled') {
          console.warn(`[AdSense] No ad available for slot: ${slot} (this is normal for new accounts)`)
        }
      }
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
                console.log(`[AdSense] Ad initialized for slot: ${slot}`, {
                  slot,
                  client: adElement.getAttribute('data-ad-client'),
                  format: adElement.getAttribute('data-ad-format')
                })
              } catch (e) {
                // Ad already initialized, ignore
                initialized.current = true
                console.log(`[AdSense] Ad already initialized for slot: ${slot}`)
              }
            } else {
              initialized.current = true
              console.log(`[AdSense] Ad status for slot ${slot}:`, status)
            }
          }
        } else {
          console.warn('[AdSense] adsbygoogle script not loaded yet')
        }
      } catch (err) {
        console.error('[AdSense] Error initializing ad:', err)
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
  }, [slot])

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

