'use client'

import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import styles from './StaticPageLayout.module.css'

interface StaticPageLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  icon?: string
  tag?: string
}

export default function StaticPageLayout({
  children,
  title,
  subtitle,
  icon = '💓',
  tag,
}: StaticPageLayoutProps) {
  return (
    <div className={styles.page}>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.navBrand}>
            💓 CheckSitePulse
          </Link>
          <div className={styles.navRight}>
            <ThemeToggle />
            <Link href="/" className={styles.backBtn}>
              ← Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className={styles.main}>

        {/* Hero */}
        <div className={styles.hero}>
          {tag && (
            <div className={styles.tag}>{tag}</div>
          )}
          <h1 className={styles.title}>
            <span className={styles.titleGradient}>{icon}</span>{' '}
            {title}
          </h1>
          {subtitle && (
            <p className={styles.subtitle}>{subtitle}</p>
          )}
        </div>

        {/* Content */}
        <div className={styles.content}>
          {children}
        </div>

        {/* Back button */}
        <div className={styles.backWrap}>
          <Link href="/" className={styles.checkBtn}>
            🔎 Check a Website
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/about" className={styles.footerLink}>About</Link>
          <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
          <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
        </div>
      </footer>
    </div>
  )
}
