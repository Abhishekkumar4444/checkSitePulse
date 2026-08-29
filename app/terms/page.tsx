import type { Metadata } from 'next'
import StaticPageLayout from '../components/StaticPageLayout'

export const metadata: Metadata = {
  title: 'Terms of Service - CheckSitePulse',
  description: 'Terms of Service for CheckSitePulse - Website status monitoring service',
}

const SECTIONS = [
  {
    num: '1',
    title: 'Acceptance of Terms',
    body: (
      <p>By accessing and using CheckSitePulse, you accept and agree to be bound by the terms and provisions of this agreement.</p>
    ),
  },
  {
    num: '2',
    title: 'Use License',
    body: (
      <>
        <p style={{ marginBottom: '0.6rem' }}>Permission is granted to temporarily use CheckSitePulse for personal, non-commercial use. This license does not include:</p>
        <ul>
          <li>Modifying or copying the materials</li>
          <li>Using the materials for any commercial purpose</li>
          <li>Attempting to reverse engineer any software</li>
          <li>Removing any copyright or proprietary notations</li>
        </ul>
      </>
    ),
  },
  {
    num: '3',
    title: 'Service Description',
    body: (
      <p>CheckSitePulse provides website status monitoring services. We check website availability and response times by making HTTP requests to the websites you specify. Results are provided for informational purposes only.</p>
    ),
  },
  {
    num: '4',
    title: 'Disclaimer',
    body: (
      <>
        <p style={{ marginBottom: '0.6rem' }}>The information on CheckSitePulse is provided on an &quot;as is&quot; basis. To the fullest extent permitted by law, we exclude all representations, warranties, and conditions relating to our website and the use of this website.</p>
        <p>We do not warrant that the website will be available, uninterrupted, secure, or error-free.</p>
      </>
    ),
  },
  {
    num: '5',
    title: 'Limitations',
    body: (
      <p>In no event shall CheckSitePulse or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CheckSitePulse.</p>
    ),
  },
  {
    num: '6',
    title: 'Accuracy of Materials',
    body: (
      <p>The materials appearing on CheckSitePulse could include technical, typographical, or photographic errors. We do not warrant that any of the materials on the website are accurate, complete, or current.</p>
    ),
  },
  {
    num: '7',
    title: 'Links',
    body: (
      <p>CheckSitePulse has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by CheckSitePulse.</p>
    ),
  },
  {
    num: '8',
    title: 'Modifications',
    body: (
      <p>CheckSitePulse may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
    ),
  },
  {
    num: '9',
    title: 'Governing Law',
    body: (
      <p>These terms and conditions are governed by and construed in accordance with applicable laws.</p>
    ),
  },
]

export default function TermsOfService() {
  return (
    <StaticPageLayout
      title="Terms of Service"
      subtitle={`Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
      icon="📋"
      tag="Legal"
    >
      <style>{`
        .csp-terms-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1.4rem 1.5rem;
          backdrop-filter: blur(10px);
          margin-bottom: 0.75rem;
        }
        .csp-terms-heading {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }
        .csp-terms-num {
          width: 26px;
          height: 26px;
          border-radius: 7px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
          color: #818cf8;
          flex-shrink: 0;
        }
        .csp-terms-card p,
        .csp-terms-card ul {
          color: var(--text-secondary);
          line-height: 1.8;
          font-size: 0.9rem;
        }
        .csp-terms-card ul {
          list-style: disc;
          padding-left: 1.25rem;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        @media (max-width: 480px) {
          .csp-terms-card { padding: 1rem 1.1rem; }
        }
      `}</style>

      {SECTIONS.map(({ num, title, body }) => (
        <div key={num} className="csp-terms-card">
          <h2 className="csp-terms-heading">
            <span className="csp-terms-num">{num}</span>
            {title}
          </h2>
          {body}
        </div>
      ))}
    </StaticPageLayout>
  )
}
