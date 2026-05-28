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
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <RootProvider theme={{ defaultTheme: 'system', enableSystem: true }}>
          {children}
        </RootProvider>
      </body>
    </html>
  )
}
