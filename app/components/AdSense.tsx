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
  const adRef = useRef<HTMLDivElement>(null)
  const isLoaded = useRef(false)
  const [isDev, setIsDev] = useState(false)

  useEffect(() => {
    // Check if running on localhost or dev environment
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
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div
      ref={adRef}
      style={{
        width: '100%',
        textAlign: 'center',
        overflow: 'hidden',
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
        data-adtest={isDev ? 'on' : undefined}
      />
    </div>
  )
}
