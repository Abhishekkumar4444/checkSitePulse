import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { ConsentProvider } from './contexts/ConsentContext'
import CookieConsent from './components/CookieConsent'

export const metadata: Metadata = {
  title: '💓 CheckSitePulse',
  description: 'Check if websites are down or experiencing issues in real-time',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        {/* Google AdSense Meta Tag */}
        <meta name="google-adsense-account" content="ca-pub-3522508702369023" />
        {/* Google Consent Mode v2 - Must load before any ads */}
        <Script id="consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Default consent state - deny all until user consents
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'functionality_storage': 'granted',
              'personalization_storage': 'denied',
              'security_storage': 'granted',
              'wait_for_update': 500
            });
            
            // Check for existing consent and update if found
            (function() {
              try {
                var savedConsent = localStorage.getItem('cookie-consent');
                if (savedConsent) {
                  var consent = JSON.parse(savedConsent);
                  gtag('consent', 'update', {
                    'ad_storage': consent.ad_storage,
                    'analytics_storage': consent.analytics_storage,
                    'functionality_storage': consent.functionality_storage,
                    'personalization_storage': consent.personalization_storage,
                    'security_storage': consent.security_storage
                  });
                }
              } catch (e) {
                // Error loading consent, ignore
              }
            })();
          `}
        </Script>
        {/* Google AdSense - Only loads after consent */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3522508702369023"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Theme initialization script - prevents flash */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'system';
                var effectiveTheme = theme === 'system' 
                  ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                  : theme;
                document.documentElement.setAttribute('data-theme', effectiveTheme);
              } catch (e) {}
            })();
          `}
        </Script>
      </head>
      <body>
        <ThemeProvider>
          <ConsentProvider>
            {children}
            <CookieConsent />
          </ConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

