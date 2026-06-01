import { RootProvider } from 'fumadocs-ui/provider'
import 'fumadocs-ui/style.css'
import './globals.css'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | pro-ui docs',
    default: 'pro-ui — React UI library for admin dashboards',
  },
  description:
    'Documentation for @dangbt/pro-ui — AI-native React component library with ProTable, ProForm, Layout, and 30+ components.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  openGraph: {
    images: [{ url: 'https://pro-ui.pages.dev/og-image.png', width: 1200, height: 630 }],
    url: 'https://pro-ui-docs.pages.dev',
    siteName: 'pro-ui docs',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://pro-ui.pages.dev/og-image.png'],
  },
}

function SiteFooter() {
  const links = [
    { label: 'pro-ui',      href: 'https://pro-ui.pages.dev' },
    { label: 'Docs',        href: 'https://pro-ui-docs.pages.dev' },
    { label: 'Admin Demo',  href: 'https://pro-admin-demo.pages.dev' },
    { label: 'GitHub',      href: 'https://github.com/dangbt/pro-ui' },
    { label: 'npm',         href: 'https://www.npmjs.com/package/@dangbt/pro-ui' },
    { label: 'Sponsor ☕',  href: 'https://github.com/sponsors/dangbt' },
  ]
  return (
    <footer className="border-t border-fd-border mt-auto py-6 px-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
        <p className="text-xs text-fd-muted-foreground shrink-0">
          Built by <a href="https://github.com/dangbt" target="_blank" rel="noopener noreferrer" className="hover:underline">dangbt</a> · MIT
        </p>
      </div>
    </footer>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <RootProvider theme={{ defaultTheme: 'system', enableSystem: true }}>
          {children}
          <SiteFooter />
        </RootProvider>
      </body>
    </html>
  )
}
