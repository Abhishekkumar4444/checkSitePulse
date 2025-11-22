import type { Metadata } from 'next'
import styles from '../page.module.css'

export const metadata: Metadata = {
  title: 'About - CheckSitePulse',
  description: 'About CheckSitePulse - Real-time website status monitoring service',
}

export default function About() {
  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleIcon}>💓</span>
          About CheckSitePulse
        </h1>
        <p className={styles.subtitle}>Real-time website status monitoring made simple</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>What is CheckSitePulse?</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            CheckSitePulse is a free, real-time website status monitoring tool that helps you check if websites 
            are up or down. We provide instant status checks, response time measurements, and historical data 
            to help you monitor website availability.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Features</h2>
          <ul style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginLeft: '2rem' }}>
            <li>🔍 <strong>Real-time Status Checks:</strong> Get instant website status updates</li>
            <li>⚡ <strong>Response Time Monitoring:</strong> Track website performance metrics</li>
            <li>📊 <strong>Historical Data:</strong> View response time trends over time</li>
            <li>🌐 <strong>Popular Sites Monitoring:</strong> Check status of popular websites</li>
            <li>📱 <strong>Mobile Friendly:</strong> Works seamlessly on all devices</li>
            <li>🌙 <strong>Dark Mode:</strong> Comfortable viewing in any lighting</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>How It Works</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            When you check a website, we make an HTTP request to the specified URL and measure:
          </p>
          <ul style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginLeft: '2rem' }}>
            <li>HTTP status code (200 = up, 500+ = down)</li>
            <li>Response time in milliseconds</li>
            <li>Server response status</li>
          </ul>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginTop: '1rem' }}>
            All checks are performed in real-time, ensuring you get the most current status information.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Privacy & Data</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            Your privacy is important to us. All search history is stored locally in your browser. 
            We don't collect or store your personal information. For more details, please see our 
            <a href="/privacy" style={{ color: '#667eea', marginLeft: '0.5rem' }}>Privacy Policy</a>.
          </p>
        </section>

        <section>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Contact</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            Have questions or feedback? We'd love to hear from you! Use the contact form on our website 
            or reach out through our support channels.
          </p>
        </section>
      </div>
    </main>
  )
}

