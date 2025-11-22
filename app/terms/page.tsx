import type { Metadata } from 'next'
import styles from '../page.module.css'

export const metadata: Metadata = {
  title: 'Terms of Service - CheckSitePulse',
  description: 'Terms of Service for CheckSitePulse - Website status monitoring service',
}

export default function TermsOfService() {
  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.subtitle}>Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>1. Acceptance of Terms</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            By accessing and using CheckSitePulse, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>2. Use License</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Permission is granted to temporarily use CheckSitePulse for personal, non-commercial use. This license does not include:
          </p>
          <ul style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginLeft: '2rem' }}>
            <li>Modifying or copying the materials</li>
            <li>Using the materials for any commercial purpose</li>
            <li>Attempting to reverse engineer any software</li>
            <li>Removing any copyright or proprietary notations</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>3. Service Description</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            CheckSitePulse provides website status monitoring services. We check website availability and response times 
            by making HTTP requests to the websites you specify. Results are provided for informational purposes only.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>4. Disclaimer</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            The information on CheckSitePulse is provided on an "as is" basis. To the fullest extent permitted by law, 
            we exclude all representations, warranties, and conditions relating to our website and the use of this website.
          </p>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            We do not warrant that the website will be available, uninterrupted, secure, or error-free, or that defects 
            will be corrected.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>5. Limitations</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            In no event shall CheckSitePulse or its suppliers be liable for any damages (including, without limitation, 
            damages for loss of data or profit, or due to business interruption) arising out of the use or inability to 
            use the materials on CheckSitePulse.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>6. Accuracy of Materials</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            The materials appearing on CheckSitePulse could include technical, typographical, or photographic errors. 
            We do not warrant that any of the materials on its website are accurate, complete, or current.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>7. Links</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            CheckSitePulse has not reviewed all of the sites linked to our website and is not responsible for the 
            contents of any such linked site. The inclusion of any link does not imply endorsement by CheckSitePulse.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>8. Modifications</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            CheckSitePulse may revise these terms of service at any time without notice. By using this website, 
            you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>9. Governing Law</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            These terms and conditions are governed by and construed in accordance with applicable laws.
          </p>
        </section>
      </div>
    </main>
  )
}

