import type { Metadata } from 'next'
import StaticPageLayout from '../components/StaticPageLayout'

export const metadata: Metadata = {
  title: 'About - CheckSitePulse',
  description: 'About CheckSitePulse - Real-time website status monitoring service',
}

export default function About() {
  const sections = [
    {
      icon: '🌐',
      title: 'What is CheckSitePulse?',
      body: (
        <p>
          CheckSitePulse is a free, real-time website status monitoring tool that helps you instantly check if any website is up or down — for everyone or just you. We provide live response times and status monitoring of popular websites worldwide.
        </p>
      ),
    },
    {
      icon: '⚡',
      title: 'Features',
      body: (
        <ul>
          {[
            ['🔍', 'Real-time Status Checks', 'Instant website status updates'],
            ['⚡', 'Response Time Monitoring', 'Track performance metrics in ms'],
            ['🌐', '12 Popular Sites', 'Live monitoring of major websites'],
            ['🔄', 'Auto-refresh', 'Status updates every 60 seconds'],
            ['📱', 'Mobile Friendly', 'Works seamlessly on all devices'],
            ['🌙', 'Dark / Light Mode', 'Comfortable viewing in any lighting'],
          ].map(([icon, label, desc]) => (
            <li key={String(label)}>
              <span className="icon">{icon}</span>
              <span>
                <strong>{label}:</strong> {desc}
              </span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      icon: '🔧',
      title: 'How It Works',
      body: (
        <>
          <p style={{ marginBottom: '0.75rem' }}>
            When you check a website, we make a real HTTP request from our servers to that URL and measure:
          </p>
          <ul>
            {[
              'HTTP status code (200 = Up, 500+ = Down)',
              'Response time in milliseconds',
              'Server response status text',
            ].map(item => (
              <li key={item}>
                <span className="icon" style={{ color: '#22c55e' }}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: '0.75rem' }}>
            All checks are real-time — you always get the most current status information.
          </p>
        </>
      ),
    },
    {
      icon: '🔒',
      title: 'Privacy & Data',
      body: (
        <p>
          Your privacy matters. All search history is stored locally in your browser only — we don't store your personal information on our servers.{' '}
          <a href="/privacy" style={{ color: '#6366f1', fontWeight: 600 }}>Read our Privacy Policy →</a>
        </p>
      ),
    },
    {
      icon: '💬',
      title: 'Contact',
      body: (
        <p>
          Have questions or feedback? We'd love to hear from you! Reach out through our support channels or submit feedback on the site.
        </p>
      ),
    },
  ]

  return (
    <StaticPageLayout
      title="About CheckSitePulse"
      subtitle="Real-time website status monitoring made simple, fast, and free."
      icon="💓"
      tag="About Us"
    >
      <style>{`
        .csp-about-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
          margin-bottom: 1rem;
        }
        .csp-card-heading {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.9rem;
        }
        .csp-card-iconbox {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          flex-shrink: 0;
        }
        .csp-about-card p,
        .csp-about-card ul {
          color: var(--text-secondary);
          line-height: 1.8;
          font-size: 0.93rem;
        }
        .csp-about-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .csp-about-card ul li {
          display: flex;
          align-items: flex-start;
          gap: 0.55rem;
        }
        .csp-about-card ul li .icon {
          flex-shrink: 0;
          margin-top: 2px;
        }
        .csp-about-card strong {
          color: var(--text-primary);
          font-weight: 600;
        }
        .csp-about-card a {
          text-decoration: none;
        }
        .csp-about-card a:hover {
          text-decoration: underline;
        }
        @media (max-width: 480px) {
          .csp-about-card { padding: 1.1rem; }
          .csp-card-heading { font-size: 0.95rem; }
        }
      `}</style>

      {sections.map(({ icon, title, body }) => (
        <div key={title} className="csp-about-card">
          <h2 className="csp-card-heading">
            <span className="csp-card-iconbox">{icon}</span>
            {title}
          </h2>
          {body}
        </div>
      ))}
    </StaticPageLayout>
  )
}
