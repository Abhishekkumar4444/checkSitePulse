'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './SidebarAd.module.css'

interface SidebarAdProps {
  position: 'left' | 'right'
  slot: string
}

export default function SidebarAd({ position, slot }: SidebarAdProps) {
  const isLoaded = useRef(false)
  const [isDev, setIsDev] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLocal =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        process.env.NODE_ENV === 'development'
      setIsDev(isLocal)
    }

    if (isLoaded.current) return

    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || []
        adsbygoogle.push({})
        isLoaded.current = true
      }
    } catch (err) {
      console.error('Sidebar AdSense error:', err)
    }
  }, [])

  return (
    <aside className={`${styles.sidebarAd} ${styles[position]}`} aria-label={`${position} sidebar advertisement`}>
      <div className={styles.adContainer}>
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '160px',
            height: '600px',
          }}
          data-ad-client="ca-pub-3522508702369023"
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
          data-adtest={isDev ? 'on' : undefined}
        />
      </div>
    </aside>
  )
}
