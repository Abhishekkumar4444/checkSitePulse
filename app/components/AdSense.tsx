'use client'

import { useEffect, useRef, useState } from 'react'

interface AdSenseProps {
  slot: string
  style?: React.CSSProperties
  format?: string
  responsive?: boolean
}

export default function AdSense({
  slot,
  style,
  format = 'auto',
  responsive = true,
}: AdSenseProps) {
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

    // Wait for the ins element to be in DOM before pushing
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
    <div
      ref={containerRef}
      style={{
        width: '100%',
        textAlign: 'center',
        overflow: 'hidden',
        minHeight: '90px',
        ...style,
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
          ...style,
        }}
        data-ad-client="ca-pub-3522508702369023"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        {...(isDev ? { 'data-adtest': 'on' } : {})}
      />
    </div>
  )
}
