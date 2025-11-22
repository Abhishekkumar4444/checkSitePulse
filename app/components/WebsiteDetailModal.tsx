'use client'

import { useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import styles from './WebsiteDetailModal.module.css'

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

interface WebsiteDetailModalProps {
  isOpen: boolean
  onClose: () => void
  website: {
    name: string
    url: string
    icon: string
  }
  status: WebsiteStatus | null
  history: HistoryEntry[]
}

export default function WebsiteDetailModal({
  isOpen,
  onClose,
  website,
  status,
  history,
}: WebsiteDetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

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

  // Prepare chart data
  const chartData = history.map((entry, index) => ({
    time: entry.time,
    responseTime: entry.responseTime,
    status: entry.status,
    index: index + 1,
  }))

  // Calculate statistics
  const avgResponseTime = history.length > 0
    ? Math.round(history.reduce((sum, entry) => sum + entry.responseTime, 0) / history.length)
    : 0
  const minResponseTime = history.length > 0
    ? Math.min(...history.map(entry => entry.responseTime))
    : 0
  const maxResponseTime = history.length > 0
    ? Math.max(...history.map(entry => entry.responseTime))
    : 0
  const uptimePercentage = history.length > 0
    ? Math.round((history.filter(entry => entry.status < 500).length / history.length) * 100)
    : 0

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <span className={styles.websiteIcon}>{website.icon}</span>
            <div>
              <h2>{website.name}</h2>
              <p className={styles.websiteUrl}>{website.url}</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.modalContent}>
          {status ? (
            <>
              {/* Status Banner */}
              <div 
                className={styles.statusBanner}
                style={{
                  backgroundColor: getStatusColor(status.isDown) + '15',
                  borderColor: getStatusColor(status.isDown),
                }}
              >
                <div className={styles.statusBannerContent}>
                  <span className={styles.statusEmoji}>{getStatusEmoji(status.isDown)}</span>
                  <div>
                    <div className={styles.statusBannerTitle}>
                      {status.isDown ? 'Website is Down' : 'Website is Operational'}
                    </div>
                    <div className={styles.statusBannerSubtitle}>
                      Status: {status.status} {status.statusText}
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <div className={styles.statIcon}>⚡</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statLabel}>Current Response</div>
                    <div className={styles.statValue}>{formatResponseTime(status.responseTime)}</div>
                  </div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statIcon}>📊</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statLabel}>Average Response</div>
                    <div className={styles.statValue}>{formatResponseTime(avgResponseTime)}</div>
                  </div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statIcon}>⬆️</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statLabel}>Fastest Response</div>
                    <div className={styles.statValue}>{formatResponseTime(minResponseTime)}</div>
                  </div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statIcon}>⬇️</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statLabel}>Slowest Response</div>
                    <div className={styles.statValue}>{formatResponseTime(maxResponseTime)}</div>
                  </div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statIcon}>✅</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statLabel}>Uptime</div>
                    <div className={styles.statValue}>{uptimePercentage}%</div>
                  </div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statIcon}>📈</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statLabel}>Total Checks</div>
                    <div className={styles.statValue}>{history.length}</div>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className={styles.detailsSection}>
                <h3 className={styles.sectionTitle}>Detailed Information</h3>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>HTTP Status Code:</span>
                    <span className={styles.detailValue}>{status.status}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Status Text:</span>
                    <span className={styles.detailValue}>{status.statusText}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Response Time:</span>
                    <span className={styles.detailValue}>{formatResponseTime(status.responseTime)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Last Checked:</span>
                    <span className={styles.detailValue}>{formatDate(status.timestamp)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Website Status:</span>
                    <span 
                      className={styles.detailValue}
                      style={{ color: getStatusColor(status.isDown) }}
                    >
                      {status.isDown ? 'Down' : 'Up'}
                    </span>
                  </div>
                  {status.verified && (
                    <div className={styles.verificationBadge}>
                      <span className={styles.verificationIcon}>✓</span>
                      <span className={styles.verificationText}>Real-time verified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Colorful Graph */}
              {history.length > 0 && (
                <div className={styles.chartSection}>
                  <h3 className={styles.sectionTitle}>Response Time History</h3>
                  <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorResponseTime" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#764ba2" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        <XAxis 
                          dataKey="time" 
                          stroke="var(--text-secondary)"
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                          stroke="var(--text-secondary)"
                          label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }}
                          style={{ fontSize: '12px' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--card-bg)', 
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            boxShadow: 'var(--shadow-md)',
                            color: 'var(--text-primary)'
                          }}
                          formatter={(value: number) => [`${value}ms`, 'Response Time']}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="responseTime"
                          stroke="#667eea"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorResponseTime)"
                          name="Response Time"
                          dot={{ fill: '#667eea', r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* History Table */}
              {history.length > 0 && (
                <div className={styles.historySection}>
                  <h3 className={styles.sectionTitle}>Check History</h3>
                  <div className={styles.historyTable}>
                    <div className={styles.tableHeader}>
                      <div className={styles.tableCell}>Time</div>
                      <div className={styles.tableCell}>Response Time</div>
                      <div className={styles.tableCell}>Status</div>
                    </div>
                    {history.slice().reverse().slice(0, 10).map((entry, index) => (
                      <div key={index} className={styles.tableRow}>
                        <div className={styles.tableCell}>{entry.time}</div>
                        <div className={styles.tableCell}>{formatResponseTime(entry.responseTime)}</div>
                        <div className={styles.tableCell}>
                          <span 
                            className={styles.statusBadge}
                            style={{
                              backgroundColor: entry.status >= 500 ? '#dc354520' : '#28a74520',
                              color: entry.status >= 500 ? '#dc3545' : '#28a745',
                            }}
                          >
                            {entry.status} {entry.status >= 500 ? '❌' : '✅'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {status.error && (
                <div className={styles.errorBox}>
                  <strong>Error Details:</strong> {status.error}
                </div>
              )}
            </>
          ) : (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading website details...</p>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button 
            className={styles.visitButton}
            onClick={() => window.open(website.url, '_blank', 'noopener,noreferrer')}
          >
            🌐 Visit Website
          </button>
          <button className={styles.closeButtonFooter} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

