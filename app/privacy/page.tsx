import type { Metadata } from 'next'
import StaticPageLayout from '../components/StaticPageLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy - CheckSitePulse',
  description: 'Privacy Policy for CheckSitePulse - Website status monitoring service',
}

const SECTIONS = [
  {
    num: '1',
    title: 'Introduction',
    body: (
      <p>Welcome to CheckSitePulse (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website.</p>
    ),
  },
  {
    num: '2',
    title: 'Information We Collect',
    body: (
      <>
        <p style={{ marginBottom: '0.6rem' }}>We may collect information that you provide directly to us, including:</p>
        <ul>
          <li>Website URLs you search for</li>
          <li>Search history (stored locally in your browser only)</li>
          <li>Cookie preferences</li>
        </ul>
      </>
    ),
  },
  {
    num: '3',
    title: 'Cookies and Tracking Technologies',
    body: (
      <>
        <p style={{ marginBottom: '0.6rem' }}>We use cookies and similar tracking technologies to:</p>
        <ul>
          <li>Remember your preferences (theme, cookie consent)</li>
          <li>Store your search history locally</li>
          <li>Display advertisements (with your consent)</li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>You can control cookies through your browser settings and our cookie consent banner.</p>
      </>
    ),
  },
  {
    num: '4',
    title: 'Google AdSense',
    body: (
      <>
        <p style={{ marginBottom: '0.6rem' }}>We use Google AdSense to display advertisements. Google may use cookies and other tracking technologies to serve personalized ads based on your interests. You can opt out of personalized advertising by visiting{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', fontWeight: 600 }}>Google&apos;s Ad Settings</a>.
        </p>
        <p>For more information, visit{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', fontWeight: 600 }}>Google&apos;s Privacy Policy</a>.
        </p>
      </>
    ),
  },
  {
    num: '5',
    title: 'Data Storage',
    body: (
      <p>All data is stored locally in your browser (localStorage). We do not collect, store, or transmit your personal information to our servers. Your search history and preferences remain on your device.</p>
    ),
  },
  {
    num: '6',
    title: 'Third-Party Services',
    body: (
      <>
        <p style={{ marginBottom: '0.6rem' }}>Our website uses the following third-party services:</p>
        <ul>
          <li><strong>Google AdSense:</strong> For displaying advertisements</li>
          <li><strong>Website Status API:</strong> For checking website status (requests made server-side)</li>
        </ul>
      </>
    ),
  },
  {
    num: '7',
    title: 'Your Rights',
    body: (
      <>
        <p style={{ marginBottom: '0.6rem' }}>You have the right to:</p>
        <ul>
          <li>Access and review your stored data (localStorage)</li>
          <li>Delete your search history at any time</li>
          <li>Control cookie preferences through our consent banner</li>
          <li>Opt out of personalized advertising</li>
        </ul>
      </>
    ),
  },
  {
    num: '8',
    title: "Children's Privacy",
    body: (
      <p>Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
    ),
  },
  {
    num: '9',
    title: 'Changes to This Policy',
    body: (
      <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.</p>
    ),
  },
  {
    num: '10',
    title: 'Contact Us',
    body: (
      <p>If you have any questions about this Privacy Policy, please contact us through our website.</p>
    ),
  },
]

export default function PrivacyPolicy() {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      subtitle={`Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
      icon="🔒"
      tag="Legal"
    >
      <style>{`
        .csp-policy-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1.4rem 1.5rem;
          backdrop-filter: blur(10px);
          margin-bottom: 0.75rem;
        }
        .csp-policy-heading {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }
        .csp-policy-num {
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
        .csp-policy-card p,
        .csp-policy-card ul {
          color: var(--text-secondary);
          line-height: 1.8;
          font-size: 0.9rem;
        }
        .csp-policy-card ul {
          list-style: disc;
          padding-left: 1.25rem;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .csp-policy-card strong {
          color: var(--text-primary);
          font-weight: 600;
        }
        .csp-policy-card a:hover { text-decoration: underline; }
        @media (max-width: 480px) {
          .csp-policy-card { padding: 1rem 1.1rem; }
        }
      `}</style>

      {SECTIONS.map(({ num, title, body }) => (
        <div key={num} className="csp-policy-card">
          <h2 className="csp-policy-heading">
            <span className="csp-policy-num">{num}</span>
            {title}
          </h2>
          {body}
        </div>
      ))}
    </StaticPageLayout>
  )
}
