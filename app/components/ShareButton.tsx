'use client'

import { useState } from 'react'
import styles from '../page.module.css'

interface ShareButtonProps {
  url: string
  status: string
  responseTime: string
}

export default function ShareButton({ url, status, responseTime }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareText = `💓 ${url}\nStatus: ${status}\nResponse Time: ${responseTime}\n\nChecked via CheckSitePulse`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Website Status Check',
          text: shareText,
        })
      } catch (err) {
        // User cancelled or error occurred
        copyToClipboard(shareText)
      }
    } else {
      copyToClipboard(shareText)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleShare}
      className={styles.shareButton}
      title="Share status"
    >
      {copied ? '✓ Copied!' : '📤 Share'}
    </button>
  )
}

