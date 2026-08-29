'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './page.module.css'
import ThemeToggle from './components/ThemeToggle'
import AdSense from './components/AdSense'
import SidebarAd from './components/SidebarAd'

interface WebsiteStatus {
  url: string
  status: number
  statusText: string
  isDown: boolean
  responseTime: number
  timestamp: string
  error?: string
  verified?: boolean
}

const POPULAR_WEBSITES = [
  { name: 'Google',     url: 'https://www.google.com',       icon: '🔍' },
  { name: 'YouTube',    url: 'https://www.youtube.com',      icon: '▶️' },
  { name: 'Facebook',   url: 'https://www.facebook.com',     icon: '📘' },
  { name: 'Instagram',  url: 'https://www.instagram.com',    icon: '📷' },
  { name: 'Twitter/X',  url: 'https://www.twitter.com',      icon: '🐦' },
  { name: 'WhatsApp',   url: 'https://web.whatsapp.com',     icon: '💬' },
  { name: 'Netflix',    url: 'https://www.netflix.com',      icon: '🎬' },
  { name: 'GitHub',     url: 'https://www.github.com',       icon: '💻' },
  { name: 'Amazon',     url: 'https://www.amazon.com',       icon: '🛒' },
  { name: 'ChatGPT',   url: 'https://chat.openai.com',      icon: '🤖' },
  { name: 'Reddit',     url: 'https://www.reddit.com',       icon: '🔴' },
  { name: 'Canva',      url: 'https://www.canva.com',        icon: '🎨' },
]

const AUTO_REFRESH_SECONDS = 60

function normalizeUrl(input: string): string {
  let url = input.trim()

  // Remove leading/trailing whitespace and slashes
  url = url.replace(/^\/+|\/+$/g, '') || url.trim()

  // Check if it already has a protocol
  const hasProtocol = url.startsWith('http://') || url.startsWith('https://')

  // Extract domain part (without protocol)
  let domain = hasProtocol ? url.replace(/^https?:\/\//, '') : url

  // Remove www. to check TLD cleanly
  const cleanDomain = domain.replace(/^www\./, '').split('/')[0].split('?')[0]

  // If there's no dot in the domain → no TLD → add .com
  if (!cleanDomain.includes('.')) {
    domain = `${cleanDomain}.com`
    return `https://${domain}`
  }

  // Has protocol already — return as-is (just cleaned)
  if (hasProtocol) {
    return url.replace(/\/$/, '')
  }

  // No protocol — add https://
  return `https://${url.replace(/\/$/, '')}`
}


function getDomain(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
}

function formatMs(ms: number): string {
  if (ms <= 0) return '—'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

function getResponseQuality(ms: number): 'good' | 'warn' | 'bad' {
  if (ms <= 0) return 'bad'
  if (ms < 500) return 'good'
  if (ms < 1500) return 'warn'
  return 'bad'
}

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchUrl, setSearchUrl] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [result, setResult] = useState<WebsiteStatus | null>(null)
  const [popularSites, setPopularSites] = useState<(WebsiteStatus | null)[]>(
    new Array(POPULAR_WEBSITES.length).fill(null)
  )
  const [isLoadingPopular, setIsLoadingPopular] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState(AUTO_REFRESH_SECONDS)
  const [searchHistory, setSearchHistory] = useState<{url: string; isDown: boolean | null}[]>([])
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [totalChecks, setTotalChecks] = useState(0)

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('csp_history')
      if (saved) setSearchHistory(JSON.parse(saved))
      const savedChecks = localStorage.getItem('csp_total_checks')
      if (savedChecks) setTotalChecks(parseInt(savedChecks, 10))
    } catch {}
  }, [])

  // Autofocus search input
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const checkOne = async (url: string): Promise<WebsiteStatus> => {
    const res = await fetch('/api/check-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    if (!res.ok) throw new Error('Failed to check')
    return res.json()
  }

  const checkPopularWebsites = useCallback(async () => {
    setIsLoadingPopular(true)
    setCountdown(AUTO_REFRESH_SECONDS)
    // Check all sites in parallel
    const results = await Promise.allSettled(
      POPULAR_WEBSITES.map(site => checkOne(site.url))
    )
    setPopularSites(results.map(r => r.status === 'fulfilled' ? r.value : null))
    setIsLoadingPopular(false)
    setLastChecked(new Date())
  }, [])

  // Initial load
  useEffect(() => {
    checkPopularWebsites()
  }, [checkPopularWebsites])

  // Auto-refresh countdown
  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          checkPopularWebsites()
          return AUTO_REFRESH_SECONDS
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(tick)
  }, [checkPopularWebsites])

  const saveHistory = (url: string, isDown: boolean) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(h => h.url !== url)
      const updated = [{ url, isDown }, ...filtered].slice(0, 8)
      localStorage.setItem('csp_history', JSON.stringify(updated))
      return updated
    })
    setTotalChecks(prev => {
      const next = prev + 1
      localStorage.setItem('csp_total_checks', String(next))
      return next
    })
  }

  const handleSearch = async (e?: React.FormEvent, overrideUrl?: string) => {
    e?.preventDefault()
    const raw = (overrideUrl || searchUrl).trim()
    if (!raw) return

    const normalized = normalizeUrl(raw)
    setIsSearching(true)
    setResult(null)

    try {
      const data = await checkOne(normalized)
      setResult(data)
      saveHistory(normalized, data.isDown)
    } catch {
      const errorResult: WebsiteStatus = {
        url: normalized,
        status: 0,
        statusText: 'Error',
        isDown: true,
        responseTime: 0,
        timestamp: new Date().toISOString(),
        error: 'Could not connect. Check the URL and try again.',
      }
      setResult(errorResult)
      saveHistory(normalized, true)
    } finally {
      setIsSearching(false)
    }
  }

  const handleHistoryClick = (url: string) => {
    setSearchUrl(getDomain(url))
    handleSearch(undefined, url)
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const handleClear = () => {
    setSearchUrl('')
    setResult(null)
    inputRef.current?.focus()
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('csp_history')
  }

  const upCount = popularSites.filter(s => s && !s.isDown).length
  const downCount = popularSites.filter(s => s && s.isDown).length

  return (
    <div className={styles.page}>
      {/* Sidebar Ads Desktop */}
      <SidebarAd position="left" slot="2108187963" />
      <SidebarAd position="right" slot="2108187963" />

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.navBrand}>
            <span className={styles.navLogo}>💓</span>
            CheckSitePulse
          </div>
          <div className={styles.navRight}>
            <a href="/about" className={styles.navLink}>About</a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroTag}>
            <div className={styles.heroTagDot} />
            Real-time Website Status Checker
          </div>
          <h1 className={styles.heroTitle}>
            Is the website{' '}
            <span className={styles.heroTitleHighlight}>down</span>
            ?
          </h1>
          <p className={styles.heroSubtitle}>
            Check if any website is down for everyone or just you — instantly, for free.
          </p>
        </section>

        {/* Stats strip */}
        {totalChecks > 0 && (
          <div className={styles.statsStrip}>
            <div className={styles.statPill}>
              <span className={styles.statPillIcon}>📊</span>
              <span className={styles.statPillValue}>{totalChecks.toLocaleString()}</span>
              <span>checks done</span>
            </div>
            {upCount > 0 && (
              <div className={styles.statPill}>
                <span className={styles.statPillIcon}>🟢</span>
                <span className={styles.statPillValue}>{upCount}</span>
                <span>sites online</span>
              </div>
            )}
            {downCount > 0 && (
              <div className={styles.statPill}>
                <span className={styles.statPillIcon}>🔴</span>
                <span className={styles.statPillValue}>{downCount}</span>
                <span>sites down</span>
              </div>
            )}
          </div>
        )}

        {/* Search */}
        <section className={styles.searchSection}>
          <form onSubmit={handleSearch}>
            <div className={styles.searchBox}>
              <input
                ref={inputRef}
                type="text"
                value={searchUrl}
                onChange={e => setSearchUrl(e.target.value)}
                placeholder="Enter website URL (e.g. google.com or https://example.com)"
                className={styles.searchInput}
                disabled={isSearching}
                autoComplete="off"
                spellCheck={false}
              />
              {(searchUrl || result) && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={handleClear}
                  disabled={isSearching}
                >
                  ✕
                </button>
              )}
              <button
                type="submit"
                className={styles.searchBtn}
                disabled={isSearching || !searchUrl.trim()}
              >
                {isSearching ? (
                  <>
                    <span className={styles.spinner} />
                    Checking...
                  </>
                ) : (
                  <>🔎 Check Status</>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Recent History chips */}
        {searchHistory.length > 0 && !result && (
          <section className={styles.historySection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>🕒 Recent</span>
              <button className={styles.clearHistoryBtn} onClick={clearHistory}>
                Clear
              </button>
            </div>
            <div className={styles.historyGrid}>
              {searchHistory.map((h, i) => (
                <button
                  key={i}
                  className={styles.historyChip}
                  onClick={() => handleHistoryClick(h.url)}
                >
                  <span
                    className={`${styles.historyChipDot} ${
                      h.isDown === null ? styles.unknown : h.isDown ? styles.down : styles.up
                    }`}
                  />
                  {getDomain(h.url)}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Result */}
        {result && (
          <section className={styles.resultSection}>
            <div className={styles.resultCard}>
              {/* Status Banner */}
              <div className={`${styles.statusBanner} ${result.isDown ? styles.offline : styles.online}`}>
                <div className={`${styles.statusIconWrap} ${result.isDown ? styles.offline : styles.online}`}>
                  {result.isDown ? '🔴' : '🟢'}
                </div>
                <div className={styles.statusText}>
                  <div className={`${styles.statusLabel} ${result.isDown ? styles.offline : styles.online}`}>
                    {result.isDown ? 'OFFLINE' : 'ONLINE'}
                  </div>
                  <div className={styles.statusUrl}>{getDomain(result.url)}</div>
                  <div className={styles.statusMessage}>
                    {result.isDown
                      ? '⚠️ The website appears to be down for everyone.'
                      : '✅ Website is up and running normally.'}
                  </div>
                </div>
                <div className={styles.statusActions}>
                  <button
                    className={styles.reCheckBtn}
                    onClick={() => handleSearch(undefined, result.url)}
                    disabled={isSearching}
                  >
                    {isSearching ? <span className={styles.spinner} /> : '🔄'} Re-check
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={() => handleCopyUrl(result.url)}
                    title="Copy URL"
                  >
                    {copiedUrl === result.url ? '✓ Copied' : '📋 Copy'}
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={() => window.open(result.url, '_blank', 'noopener,noreferrer')}
                    title="Open website"
                  >
                    🌐 Open
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className={styles.resultDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>HTTP Status</span>
                  <span className={`${styles.detailValue} ${result.status >= 500 || result.status === 0 ? styles.bad : styles.good}`}>
                    {result.status || '—'} {result.statusText}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Response Time</span>
                  <span className={`${styles.detailValue} ${styles[getResponseQuality(result.responseTime)]}`}>
                    {formatMs(result.responseTime)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Checked At</span>
                  <span className={styles.detailValue}>
                    {new Date(result.timestamp).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true,
                    })}
                  </span>
                </div>
                {result.verified && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Source</span>
                    <span className={styles.verifiedBadge}>✓ Real-time</span>
                  </div>
                )}
                {result.error && (
                  <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                    <span className={styles.detailLabel}>Error</span>
                    <span className={`${styles.detailValue} ${styles.bad}`}>{result.error}</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Ad between search and popular sites */}
        <div className={styles.adSection}>
          <AdSense
            slot="2108187963"
            format="horizontal"
            responsive={true}
            style={{ width: '100%', maxWidth: '728px', margin: '0 auto' }}
          />
        </div>

        {/* Popular Sites */}
        <section className={styles.popularSection}>
          <div className={styles.sectionHeader}>
            <div>
              <div className={styles.sectionTitle}>🌐 Popular Sites Status</div>
              <div className={styles.sectionSubtitle}>Live status — auto-refreshes every {AUTO_REFRESH_SECONDS}s</div>
            </div>
            <div className={styles.sectionMeta}>
              {lastChecked && (
                <span className={styles.lastCheckedText}>
                  Last: {lastChecked.toLocaleTimeString()}
                </span>
              )}
              <span className={styles.countdownText}>
                {isLoadingPopular ? 'Refreshing...' : `↻ ${countdown}s`}
              </span>
              <button
                className={styles.refreshBtn}
                onClick={checkPopularWebsites}
                disabled={isLoadingPopular}
              >
                <span className={styles.refreshIcon}>🔄</span>
                {isLoadingPopular ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>

          <div className={styles.sitesGrid}>
            {POPULAR_WEBSITES.map((site, index) => {
              const status = popularSites[index]
              const isLoading = !status && isLoadingPopular

              return (
                <div
                  key={site.url}
                  className={`${styles.siteCard} ${status ? (status.isDown ? styles.down : styles.up) : ''}`}
                  onClick={() => {
                    setSearchUrl(getDomain(site.url))
                    handleSearch(undefined, site.url)
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleSearch(undefined, site.url)}
                  title={`Check ${site.name} status`}
                >
                  <div className={styles.siteCardTop}>
                    <div className={styles.siteInfo}>
                      <span className={styles.siteIcon}>{site.icon}</span>
                      <span className={styles.siteName}>{site.name}</span>
                    </div>
                    <div
                      className={`${styles.siteStatusDot} ${
                        isLoading ? styles.loading : status?.isDown ? styles.down : styles.up
                      }`}
                    />
                  </div>
                  <div className={styles.siteCardBottom}>
                    <span
                      className={`${styles.siteStatusLabel} ${
                        isLoading ? styles.loading : status?.isDown ? styles.down : styles.up
                      }`}
                    >
                      {isLoading ? 'Checking…' : status?.isDown ? 'OFFLINE' : 'ONLINE'}
                    </span>
                    {status && (
                      <span className={styles.siteResponseTime}>
                        {formatMs(status.responseTime)}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div>Real-time website status monitoring — CheckSitePulse</div>
        <div className={styles.footerLinks}>
          <a href="/about" className={styles.footerLink}>About</a>
          <a href="/privacy" className={styles.footerLink}>Privacy Policy</a>
          <a href="/terms" className={styles.footerLink}>Terms of Service</a>
        </div>
      </footer>
    </div>
  )
}
