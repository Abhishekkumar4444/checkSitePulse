'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './SidebarAd.module.css'

interface SidebarAdProps {
  position: 'left' | 'right'
  slot: string
}

export default function SidebarAd({ position, slot }: SidebarAdProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pushed = useRef(false)
  const [isDev, setIsDev] = useState(false)

  useEffect(() => {
    const isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      process.env.NODE_ENV === 'development'
    setIsDev(isLocal)
  }, [])

  useEffect(() => {
    // Guard: don't push twice (Strict Mode double-invoke protection)
    if (pushed.current) return

    const container = containerRef.current
    if (!container) return

    const timer = setTimeout(() => {
      try {
        const ins = container.querySelector('ins.adsbygoogle')
        if (ins && typeof window !== 'undefined') {
          ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
          ;(window as any).adsbygoogle.push({})
          pushed.current = true
        }
      } catch (err) {
        // Silently ignore — happens in dev Strict Mode
      }
    }, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [isDev])

  return (
    <aside
      className={`${styles.sidebarAd} ${styles[position]}`}
      aria-label={`${position} sidebar advertisement`}
    >
      <div ref={containerRef} className={styles.adContainer}>
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
          {...(isDev ? { 'data-adtest': 'on' } : {})}
        />
      </div>
    </aside>
  )
}
