import type { Metadata } from 'next'
import styles from '../page.module.css'

export const metadata: Metadata = {
  title: 'Privacy Policy - CheckSitePulse',
  description: 'Privacy Policy for CheckSitePulse - Website status monitoring service',
}

export default function PrivacyPolicy() {
  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.subtitle}>Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>1. Introduction</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Welcome to CheckSitePulse ("we," "our," or "us"). We are committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>2. Information We Collect</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            We may collect information that you provide directly to us, including:
          </p>
          <ul style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginLeft: '2rem' }}>
            <li>Website URLs you search for</li>
            <li>Search history (stored locally in your browser)</li>
            <li>Cookie preferences</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>3. Cookies and Tracking Technologies</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            We use cookies and similar tracking technologies to:
          </p>
          <ul style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginLeft: '2rem' }}>
            <li>Remember your preferences (theme, cookie consent)</li>
            <li>Store your search history locally</li>
            <li>Display advertisements (with your consent)</li>
          </ul>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginTop: '1rem' }}>
            You can control cookies through your browser settings and our cookie consent banner.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>4. Google AdSense</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            We use Google AdSense to display advertisements. Google may use cookies and other tracking technologies 
            to serve personalized ads based on your interests. You can opt out of personalized advertising by 
            visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>Google's Ad Settings</a>.
          </p>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            For more information about how Google uses data, please visit 
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}> Google's Privacy Policy</a>.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>5. Data Storage</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            All data is stored locally in your browser (localStorage). We do not collect, store, or transmit 
            your personal information to our servers. Your search history and preferences remain on your device.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>6. Third-Party Services</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Our website uses the following third-party services:
          </p>
          <ul style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginLeft: '2rem' }}>
            <li><strong>Google AdSense:</strong> For displaying advertisements</li>
            <li><strong>Website Status API:</strong> For checking website status (requests made server-side)</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>7. Your Rights</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            You have the right to:
          </p>
          <ul style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginLeft: '2rem' }}>
            <li>Access and review your stored data (localStorage)</li>
            <li>Delete your search history at any time</li>
            <li>Control cookie preferences through our consent banner</li>
            <li>Opt out of personalized advertising</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>8. Children's Privacy</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            Our service is not intended for children under 13. We do not knowingly collect personal information 
            from children under 13.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>9. Changes to This Policy</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
            the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>10. Contact Us</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            If you have any questions about this Privacy Policy, please contact us through our website.
          </p>
        </section>
      </div>
    </main>
  )
}

