'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './page.module.css'
import StatusChart from './components/StatusChart'
import ShareButton from './components/ShareButton'
import ThemeToggle from './components/ThemeToggle'
import WebsiteDetailModal from './components/WebsiteDetailModal'
import AdSense from './components/AdSense'

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

interface HistoryEntry {
  time: string
  responseTime: number
  status: number
  timestamp: string
}

const POPULAR_WEBSITES = [
  { name: 'Google', url: 'https://www.google.com', icon: '🔍' },
  { name: 'GitHub', url: 'https://www.github.com', icon: '💻' },
  { name: 'Twitter', url: 'https://www.twitter.com', icon: '🐦' },
  { name: 'Facebook', url: 'https://www.facebook.com', icon: '👥' },
  { name: 'ChatGPT', url: 'https://chat.openai.com', icon: '🤖' },
  { name: 'Canva', url: 'https://www.canva.com', icon: '🎨' },
  { name: 'Instagram', url: 'https://www.instagram.com', icon: '📷' },
  { name: 'Amazon', url: 'https://www.amazon.com', icon: '🛒' },
]

export default function Home() {
  const [searchUrl, setSearchUrl] = useState('')
  const [searchResult, setSearchResult] = useState<WebsiteStatus | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [popularSites, setPopularSites] = useState<WebsiteStatus[]>([])
  const [isLoadingPopular, setIsLoadingPopular] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [history, setHistory] = useState<Record<string, HistoryEntry[]>>({})
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [selectedSiteForDetail, setSelectedSiteForDetail] = useState<string | null>(null)
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory')
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory))
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [])
  // Calculate stats from actual history data
  const calculateStats = () => {
    let totalChecks = 0
    let upCount = 0
    let downCount = 0
    let totalResponseTime = 0

    // Count all history entries across all websites
    Object.values(history).forEach(urlHistory => {
      urlHistory.forEach(entry => {
        totalChecks++
        if (entry.status >= 500) {
          downCount++
        } else {
          upCount++
        }
        totalResponseTime += entry.responseTime
      })
    })

    const avgResponseTime = totalChecks > 0 ? Math.round(totalResponseTime / totalChecks) : 0

    return {
      totalChecks,
      upCount,
      downCount,
      avgResponseTime,
    }
  }

  const stats = calculateStats()

  // Check popular websites on mount
  useEffect(() => {
    checkPopularWebsites()
  }, [])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      checkPopularWebsites()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkWebsiteStatus = async (url: string): Promise<WebsiteStatus> => {
    const response = await fetch('/api/check-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error('Failed to check website status')
    }

    return response.json()
  }

  const addToHistory = (url: string, status: WebsiteStatus) => {
    const historyEntry: HistoryEntry = {
      time: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      responseTime: status.responseTime,
      status: status.status,
      timestamp: status.timestamp,
    }

    setHistory(prev => {
      const urlHistory = prev[url] || []
      const newHistory = [...urlHistory, historyEntry].slice(-20) // Keep last 20 entries
      return { ...prev, [url]: newHistory }
    })
  }

  const checkPopularWebsites = async () => {
    setIsLoadingPopular(true)
    const results = await Promise.all(
      POPULAR_WEBSITES.map(site => checkWebsiteStatus(site.url))
    )
    setPopularSites(results)
    setIsLoadingPopular(false)
    setLastChecked(new Date())

    // Add to history
    results.forEach((result, index) => {
      addToHistory(POPULAR_WEBSITES[index].url, result)
    })
  }

  const isValidDomain = (domain: string): boolean => {
    // Remove www. if present
    let cleanDomain = domain.replace(/^www\./i, '')
    
    // Remove paths and query strings
    cleanDomain = cleanDomain.split('/')[0].split('?')[0]
    
    // Domain validation pattern:
    // - Must contain at least one dot (for TLD)
    // - Must start and end with alphanumeric characters
    // - Can contain hyphens but not at start/end
    // - Each part between dots must be 1-63 characters
    // - Must have a valid TLD (2+ letters)
    const domainPattern = /^([a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i
    
    return domainPattern.test(cleanDomain) && cleanDomain.length <= 253
  }

  const normalizeSearchUrl = (input: string): string => {
    let url = input.trim().toLowerCase()
    
    // Remove any leading/trailing whitespace and slashes
    url = url.replace(/^\/+|\/+$/g, '')
    
    // Check if it already starts with http:// or https://
    const hasProtocol = url.startsWith('http://') || url.startsWith('https://')
    
    // Remove protocol temporarily to check domain
    let domain = hasProtocol ? url.replace(/^https?:\/\//, '') : url
    
    // Remove www. if present
    domain = domain.replace(/^www\./, '')
    
    // Remove trailing slashes and paths
    domain = domain.split('/')[0]
    
    // Check if it has a valid TLD (top-level domain)
    const tldPattern = /\.(com|org|net|edu|gov|io|co|uk|us|ca|au|de|fr|jp|cn|in|br|ru|es|it|nl|se|no|dk|fi|pl|cz|gr|pt|ie|be|at|ch|tr|kr|tw|hk|sg|my|th|ph|id|vn|nz|za|mx|ar|cl|pe|co|ve|ec|uy|py|bo|cr|pa|do|gt|hn|ni|sv|bz|jm|tt|bb|gd|lc|vc|ag|dm|kn|bs|ai|vg|ky|bm|tc|ms|fk|gi|mt|cy|is|li|lu|mc|ad|sm|va|ax|fo|gl|sj|bv|pm|tf|hm|cc|cx|nf|aq|gs|pn|tk|nu|ws|as|mp|gu|vi|pr|um|mh|fm|pw|ki|nr|tv|to|sb|vu|nc|pf|wf|yt|re|bl|mf|gp|mq|pm|gf|tf|eh|ma|dz|tn|ly|eg|sd|ss|et|er|dj|so|ke|ug|rw|bi|tz|zm|mw|mz|mg|km|mu|sc|mv|lk|bd|bt|np|pk|af|ir|iq|sy|lb|jo|il|ps|sa|ye|om|ae|qa|bh|kw|kz|uz|tj|kg|tm|mn|ge|am|az|by|md|ua|ro|bg|rs|me|mk|al|ba|hr|si|sk|hu|ee|lv|lt|fi|ie|gb|gg|je|im|mt|cy|gr|pt|es|it|fr|de|nl|be|lu|ch|at|li|dk|se|no|is|fo|gl|sj|ax|fi|ee|lv|lt|pl|cz|sk|hu|ro|bg|si|hr|rs|me|mk|al|ba|md|ua|by|ru|kz|uz|tj|kg|tm|mn|ge|am|az|ir|iq|sy|lb|jo|il|ps|sa|ye|om|ae|qa|bh|kw|af|pk|np|bt|bd|lk|mv|sc|mu|km|mg|mz|mw|zm|tz|bi|rw|ug|ke|so|dj|er|et|ss|sd|eg|ly|dz|ma|eh|tf|gf|pm|mq|gp|bl|re|yt|wf|pf|nc|vu|sb|tv|nr|ki|pw|fm|mh|um|pr|vi|gu|mp|as|ws|nu|tk|pn|gs|aq|hm|tf|pm|bv|sj|gl|fo|ax|va|sm|ad|mc|lu|li|is|mt|cy|gi|ms|tc|bm|ky|vg|ai|bs|vc|lc|gd|bb|tt|jm|bz|sv|ni|hn|gt|do|pa|cr|bo|py|uy|ec|ve|co|pe|cl|ar|mx|za|nz|vn|id|ph|th|my|sg|hk|tw|kr|tr|ch|at|be|ie|pt|gr|cy|mt|lu|mc|ad|sm|va|ax|fo|gl|sj|bv|pm|tf|hm|cc|cx|nf|aq|gs|pn|tk|nu|ws|as|mp|gu|vi|pr|um|mh|fm|pw|ki|nr|tv|to|sb|vu|nc|pf|wf|yt|re|bl|mf|gp|mq|pm|gf|tf|eh|ma|dz|tn|ly|eg|sd|ss|et|er|dj|so|ke|ug|rw|bi|tz|zm|mw|mz|mg|km|mu|sc|mv|lk|bd|bt|np|pk|af|ir|iq|sy|lb|jo|il|ps|sa|ye|om|ae|qa|bh|kw|kz|uz|tj|kg|tm|mn|ge|am|az|by|md|ua|ro|bg|rs|me|mk|al|ba|hr|si|sk|hu|ee|lv|lt|fi|ie|gb|gg|je|im|mt|cy|gr|pt|es|it|fr|de|nl|be|lu|ch|at|li|dk|se|no|is|fo|gl|sj|ax|fi|ee|lv|lt|pl|cz|sk|hu|ro|bg|si|hr|rs|me|mk|al|ba|md|ua|by|ru|kz|uz|tj|kg|tm|mn|ge|am|az|ir|iq|sy|lb|jo|il|ps|sa|ye|om|ae|qa|bh|kw|af|pk|np|bt|bd|lk|mv|sc|mu|km|mg|mz|mw|zm|tz|bi|rw|ug|ke|so|dj|er|et|ss|sd|eg|ly|dz|ma|eh|tf|gf|pm|mq|gp|bl|re|yt|wf|pf|nc|vu|sb|tv|nr|ki|pw|fm|mh|um|pr|vi|gu|mp|as|ws|nu|tk|pn|gs|aq|hm|tf|pm|bv|sj|gl|fo|ax|va|sm|ad|mc|lu|li|is|mt|cy|gi|ms|tc|bm|ky|vg|ai|bs|vc|lc|gd|bb|tt|jm|bz|sv|ni|hn|gt|do|pa|cr|bo|py|uy|ec|ve|co|pe|cl|ar|mx|za|nz|vn|id|ph|th|my|sg|hk|tw|kr|tr|ch|at|be|ie|pt|gr|cy|mt|lu|mc|ad|sm|va|ax|fo|gl|sj|bv|pm|tf|hm|cc|cx|nf|aq|gs|pn|tk|nu|ws|as|mp|gu|vi|pr|um|mh|fm|pw|ki|nr|tv|to|sb|vu|nc|pf|wf|yt|re|bl|mf|gp|mq|pm|gf|tf|eh|ma|dz|tn|ly|eg|sd|ss|et|er|dj|so|ke|ug|rw|bi|tz|zm|mw|mz|mg|km|mu|sc|mv|lk|bd|bt|np|pk|af|ir|iq|sy|lb|jo|il|ps|sa|ye|om|ae|qa|bh|kw|kz|uz|tj|kg|tm|mn|ge|am|az|by|md|ua|ro|bg|rs|me|mk|al|ba|hr|si|sk|hu|ee|lv|lt|fi|ie|gb|gg|je|im|mt|cy|gr|pt|es|it|fr|de|nl|be|lu|ch|at|li|dk|se|no|is|fo|gl|sj|ax|fi|ee|lv|lt|pl|cz|sk|hu|ro|bg|si|hr|rs|me|mk|al|ba|md|ua|by|ru|kz|uz|tj|kg|tm|mn|ge|am|az|ir|iq|sy|lb|jo|il|ps|sa|ye|om|ae|qa|bh|kw|af|pk|np|bt|bd|lk|mv|sc|mu|km|mg|mz|mw|zm|tz|bi|rw|ug|ke|so|dj|er|et|ss|sd|eg|ly|dz|ma|eh|tf|gf|pm|mq|gp|bl|re|yt|wf|pf|nc|vu|sb|tv|nr|ki|pw|fm|mh|um|pr|vi|gu|mp|as|ws|nu|tk|pn|gs|aq|hm|tf|pm|bv|sj|gl|fo|ax|va|sm|ad|mc|lu|li|is|mt|cy|gi|ms|tc|bm|ky|vg|ai|bs|vc|lc|gd|bb|tt|jm|bz|sv|ni|hn|gt|do|pa|cr|bo|py|uy|ec|ve|co|pe|cl|ar|mx|za|nz|vn|id|ph|th|my|sg|hk|tw|kr|tr)$/i
    
    // Check if domain has a TLD (contains a dot followed by 2+ letter domain extension)
    // This pattern matches: .com, .org, .co.uk, .com.au, etc.
    const hasTld = /\.([a-z]{2,}(\.[a-z]{2,})?)$/i.test(domain)
    
    // Build the final URL
    let finalUrl = domain
    
    // Add .com if no TLD is present
    if (!hasTld) {
      finalUrl = `${domain}.com`
    }
    
    // Add https:// if protocol is missing
    if (!hasProtocol) {
      finalUrl = `https://${finalUrl}`
    } else {
      // If protocol was present, reconstruct with the cleaned domain
      const protocol = url.startsWith('http://') ? 'http://' : 'https://'
      finalUrl = `${protocol}${finalUrl}`
    }
    
    return finalUrl
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchUrl.trim()) return

    setIsSearching(true)
    setSearchResult(null)

    const normalizedUrl = normalizeSearchUrl(searchUrl)
    
    // Validate if the normalized URL is a valid domain/website
    try {
      const urlObj = new URL(normalizedUrl)
      const domain = urlObj.hostname.replace(/^www\./i, '')
      
      if (!isValidDomain(domain)) {
        setIsSearching(false)
        const errorResult: WebsiteStatus = {
          url: normalizedUrl,
          status: 0,
          statusText: 'Invalid Domain',
          isDown: true,
          responseTime: 0,
          timestamp: new Date().toISOString(),
          error: 'Please enter a valid website domain. Examples: google.com, github.com, or just "google"',
        }
        setSearchResult(errorResult)
        return
      }
    } catch (urlError) {
      setIsSearching(false)
      const errorResult: WebsiteStatus = {
        url: searchUrl,
        status: 0,
        statusText: 'Invalid URL',
        isDown: true,
        responseTime: 0,
        timestamp: new Date().toISOString(),
        error: 'Please enter a valid website domain. Examples: google.com, github.com, or just "google"',
      }
      setSearchResult(errorResult)
      return
    }

    try {
      const result = await checkWebsiteStatus(normalizedUrl)
      setSearchResult(result)
      addToHistory(normalizedUrl, result)
      
      // Add to search history
      setSearchHistory(prev => {
        const newHistory = [normalizedUrl, ...prev.filter(url => url !== normalizedUrl)].slice(0, 10) // Keep last 10 unique searches
        localStorage.setItem('searchHistory', JSON.stringify(newHistory))
        return newHistory
      })
    } catch (error) {
      const errorResult: WebsiteStatus = {
        url: normalizedUrl,
        status: 0,
        statusText: 'Error',
        isDown: true,
        responseTime: 0,
        timestamp: new Date().toISOString(),
        error: 'Failed to check website status',
      }
      setSearchResult(errorResult)
      addToHistory(normalizedUrl, errorResult)
    } finally {
      setIsSearching(false)
    }
  }

  const handleClear = () => {
    setSearchUrl('')
    setSearchResult(null)
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const getStatusColor = (isDown: boolean) => {
    return isDown ? '#dc3545' : '#28a745'
  }

  const getStatusEmoji = (isDown: boolean) => {
    return isDown ? '🔴' : '🟢'
  }

  return (
    <>
      {/* Marquee Banner */}
      <div className={styles.marqueeContainer}>
        <marquee className={styles.marquee} behavior="scroll" direction="left" scrollamount="3">
          Made with ❤️ for monitoring website status in real-time • Share this tool with others who need to check website status! • Made with ❤️ for monitoring website status in real-time • Share this tool with others who need to check website status!
        </marquee>
      </div>
      
      <main className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>
              <span className={styles.titleIcon}>💓</span>
              CheckSitePulse
            </h1>
            <p className={styles.subtitle}>
              Real-time website status monitoring with interactive analytics
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.totalChecks}</div>
            <div className={styles.statLabel}>Total Checks</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <div className={styles.statValue} style={{ color: '#28a745' }}>{stats.upCount}</div>
            <div className={styles.statLabel}>Sites Up</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>❌</div>
          <div className={styles.statContent}>
            <div className={styles.statValue} style={{ color: '#dc3545' }}>{stats.downCount}</div>
            <div className={styles.statLabel}>Sites Down</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⚡</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{formatResponseTime(stats.avgResponseTime)}</div>
            <div className={styles.statLabel}>Avg Response</div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className={styles.searchSection}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchInputWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              value={searchUrl}
              onChange={(e) => setSearchUrl(e.target.value)}
              placeholder="Enter website (e.g., cloudflare or cloudflare.com or https://example.com)"
              className={styles.searchInput}
              disabled={isSearching}
            />
          </div>
          <button
            type="submit"
            className={styles.searchButton}
            disabled={isSearching || !searchUrl.trim()}
          >
            {isSearching ? (
              <>
                <span className={styles.spinner}></span>
                Checking...
              </>
            ) : (
              <>
                <span>🔎</span> Check Status
              </>
            )}
          </button>
          {(searchUrl || searchResult) && (
            <button
              type="button"
              onClick={handleClear}
              className={styles.clearButton}
              disabled={isSearching}
              title="Clear search"
            >
              ✕ Clear
            </button>
          )}
        </form>

        {searchResult && (
          <div className={`${styles.resultCard} ${styles.fadeIn}`}>
            <div className={styles.resultHeader}>
              <div>
                <h2>Search Result</h2>
                <p className={styles.resultUrl}>{searchResult.url}</p>
              </div>
              <div className={styles.resultActions}>
                <ShareButton
                  url={searchResult.url}
                  status={searchResult.isDown ? 'Down' : 'Up'}
                  responseTime={formatResponseTime(searchResult.responseTime)}
                />
                <button
                  onClick={() => handleCopyUrl(searchResult.url)}
                  className={styles.copyButton}
                  title="Copy URL"
                >
                  {copiedUrl === searchResult.url ? '✓ Copied' : '📋 Copy'}
                </button>
                <button
                  onClick={() => window.open(searchResult.url, '_blank', 'noopener,noreferrer')}
                  className={styles.openButton}
                  title="Open website"
                >
                  🌐 Open
                </button>
              </div>
            </div>
            <div className={styles.statusBanner} style={{ backgroundColor: getStatusColor(searchResult.isDown) + '15', borderColor: getStatusColor(searchResult.isDown) }}>
              <div className={styles.statusBannerContent}>
                <span className={styles.statusEmoji}>{getStatusEmoji(searchResult.isDown)}</span>
                <div>
                  <div className={styles.statusBannerTitle}>
                    {searchResult.isDown ? 'Website is Down' : 'Website is Operational'}
                  </div>
                  <div className={styles.statusBannerSubtitle}>
                    Status: {searchResult.status} {searchResult.statusText}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.resultDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Response Time:</span>
                <span className={styles.detailValue}>{formatResponseTime(searchResult.responseTime)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Last Checked:</span>
                <span className={styles.detailValue}>{formatDate(searchResult.timestamp)}</span>
              </div>
              {searchResult.verified && (
                <div className={styles.verified}>
                  ✓ Verified with real-time check
                </div>
              )}
              {searchResult.error && (
                <div className={styles.error}>
                  <strong>Error:</strong> {searchResult.error}
                </div>
              )}
            </div>
            {history[searchResult.url] && history[searchResult.url].length > 0 && (
              <div className={styles.chartSection}>
                <h3 className={styles.chartTitle}>Response Time History</h3>
                <StatusChart data={history[searchResult.url]} websiteName={searchResult.url} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div className={styles.searchHistorySection}>
          <div className={styles.searchHistoryHeader}>
            <div className={styles.historyHeaderLeft}>
              <span className={styles.historyIcon}>🕒</span>
              <h3 className={styles.historyTitle}>Recent Searches</h3>
              <span className={styles.historyCount}>({searchHistory.length})</span>
            </div>
            <button
              onClick={() => {
                setSearchHistory([])
                localStorage.removeItem('searchHistory')
              }}
              className={styles.clearHistoryButton}
              title="Clear history"
            >
              🗑️ Clear All
            </button>
          </div>
          <div className={styles.searchHistoryGrid}>
            {searchHistory.map((url, index) => {
              const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
              const urlHistory = history[url] || []
              const latestEntry = urlHistory[urlHistory.length - 1]
              const isUp = latestEntry ? latestEntry.status < 500 : null
              
              return (
                <div
                  key={index}
                  className={styles.historyCard}
                  onClick={async () => {
                    // Check the website first, then open modal
                    setIsSearching(true)
                    const normalizedUrl = normalizeSearchUrl(domain)
                    
                    try {
                      const urlObj = new URL(normalizedUrl)
                      const domainName = urlObj.hostname.replace(/^www\./i, '')
                      
                      if (!isValidDomain(domainName)) {
                        setIsSearching(false)
                        return
                      }

                      const result = await checkWebsiteStatus(normalizedUrl)
                      addToHistory(normalizedUrl, result)
                      
                      // Open modal with the result
                      setSelectedSiteForDetail(normalizedUrl)
                    } catch (error) {
                      // Handle error
                    } finally {
                      setIsSearching(false)
                    }
                  }}
                >
                  <div className={styles.historyCardHeader}>
                    <div className={styles.historyCardIcon}>🌐</div>
                    <div className={styles.historyCardInfo}>
                      <h4 className={styles.historyCardTitle}>{domain}</h4>
                      {latestEntry && (
                        <div className={styles.historyCardStatus}>
                          <div className={`${styles.historyStatusDot} ${isUp ? styles.up : styles.down}`} />
                          <span className={styles.historyStatusText}>
                            {isUp ? 'Up' : 'Down'} • {formatResponseTime(latestEntry.responseTime)}
                          </span>
                        </div>
                      )}
                    </div>
                    {latestEntry && (
                      <div className={styles.historyCardBadge}>
                        {urlHistory.length} {urlHistory.length === 1 ? 'check' : 'checks'}
                      </div>
                    )}
                  </div>
                  <div className={styles.historyCardFooter}>
                    <span className={styles.historyCardTime}>
                      {latestEntry ? formatDate(latestEntry.timestamp) : 'Not checked yet'}
                    </span>
                    <span className={styles.historyCardArrow}>→</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Popular Websites Section */}
      <div className={styles.popularSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Popular Websites Status</h2>
            <p className={styles.sectionSubtitle}>Monitor the status of popular websites in real-time</p>
          </div>
          <button
            onClick={checkPopularWebsites}
            className={styles.refreshButton}
            disabled={isLoadingPopular}
          >
            {isLoadingPopular ? (
              <>
                <span className={styles.spinnerSmall}></span> Refreshing...
              </>
            ) : (
              <>
                <span>🔄</span> Refresh All
              </>
            )}
          </button>
        </div>

        <div className={styles.realTimeNote}>
          <span className={styles.noteIcon}>⚡</span>
          <span>All status checks are performed in real-time by making actual HTTP requests to each website</span>
        </div>

        {lastChecked && (
          <p className={styles.lastChecked}>
            Last checked: {lastChecked.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            })}
          </p>
        )}

        <div className={styles.websiteGrid}>
          {POPULAR_WEBSITES.map((site, index) => {
            const status = popularSites[index]
            const siteHistory = history[site.url] || []
            return (
              <div 
                key={site.url} 
                className={`${styles.websiteCard} ${status ? styles.fadeIn : ''} ${status ? styles.clickable : ''}`}
                onClick={(e) => {
                  // Don't open modal if clicking on buttons or interactive elements
                  if ((e.target as HTMLElement).closest('button')) {
                    return
                  }
                  if (status) {
                    setSelectedSiteForDetail(site.url)
                  }
                }}
                title={status ? `Click to view detailed information about ${site.name}` : ''}
              >
                <div className={styles.websiteHeader}>
                  <div className={styles.websiteTitle}>
                    <span className={styles.websiteIcon}>{site.icon}</span>
                    <h3>{site.name}</h3>
                  </div>
                  {status ? (
                    <div className={styles.statusIndicator}>
                      <div
                        className={`${styles.statusDot} ${
                          status.isDown ? styles.down : styles.up
                        }`}
                      />
                      <span className={styles.statusText}>
                        {status.isDown ? 'Down' : 'Up'}
                      </span>
                    </div>
                  ) : (
                    <div className={`${styles.statusIndicator} ${styles.loading}`}>
                      <div className={`${styles.statusDot} ${styles.loading}`} />
                      <span className={styles.statusText}>Checking...</span>
                    </div>
                  )}
                </div>
                {status && (
                  <>
                    <div className={styles.websiteDetails}>
                      <div className={styles.urlRow}>
                        <p className={styles.url}>{site.url}</p>
                        <button
                          onClick={() => handleCopyUrl(site.url)}
                          className={styles.copyButtonSmall}
                          title="Copy URL"
                        >
                          {copiedUrl === site.url ? '✓' : '📋'}
                        </button>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Status:</span>
                        <span className={styles.detailValue}>{status.status} {status.statusText}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Response:</span>
                        <span className={styles.detailValue}>{formatResponseTime(status.responseTime)}</span>
                      </div>
                      {status.verified && (
                        <div className={styles.verified}>
                          ✓ Real-time verified
                        </div>
                      )}
                      <p className={styles.timestamp}>
                        {formatDate(status.timestamp)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Ad Section */}
      <div className={styles.bottomAdSection}>
        <div className={styles.adLabel}>Advertisement</div>
        <AdSense 
          slot="2108187963" 
          style={{
            width: '100%',
            minHeight: '100px',
            maxWidth: '728px',
            margin: '0 auto'
          }}
          format="horizontal"
          responsive={true}
        />
      </div>
      </main>

      {/* Footer */}
      <div className={styles.footer}>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.9rem' }}>
          <a href="/about">About</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
      </div>

      {/* Website Detail Modal */}
      {selectedSiteForDetail && (() => {
        // Check if it's a popular website
        const site = POPULAR_WEBSITES.find(s => s.url === selectedSiteForDetail)
        const index = POPULAR_WEBSITES.findIndex(s => s.url === selectedSiteForDetail)
        const siteStatus = popularSites[index]
        const siteHistory = history[selectedSiteForDetail] || []
        
        // If it's a popular website, use its data
        if (site) {
          return (
            <WebsiteDetailModal
              isOpen={!!selectedSiteForDetail}
              onClose={() => setSelectedSiteForDetail(null)}
              website={site}
              status={siteStatus || null}
              history={siteHistory}
            />
          )
        }
        
        // Otherwise, it's from search history - create a site object and get latest status
        const domain = selectedSiteForDetail.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
        const siteName = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)
        const latestHistoryEntry = siteHistory[siteHistory.length - 1]
        
        // Get the latest status from history or check it
        let currentStatus: WebsiteStatus | null = null
        if (latestHistoryEntry) {
          currentStatus = {
            url: selectedSiteForDetail,
            status: latestHistoryEntry.status,
            statusText: latestHistoryEntry.status >= 500 ? 'Server Error' : 'OK',
            isDown: latestHistoryEntry.status >= 500,
            responseTime: latestHistoryEntry.responseTime,
            timestamp: latestHistoryEntry.timestamp,
            verified: true,
          }
        }
        
        return (
          <WebsiteDetailModal
            isOpen={!!selectedSiteForDetail}
            onClose={() => setSelectedSiteForDetail(null)}
            website={{
              name: siteName,
              url: selectedSiteForDetail,
              icon: '🌐'
            }}
            status={currentStatus}
            history={siteHistory}
          />
        )
      })()}
    </>
  )
}
