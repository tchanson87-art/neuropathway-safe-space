import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Nunito, Baloo_2 } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { SettingsProvider } from '@/components/providers/settings-provider'
import { DataProvider } from '@/components/providers/data-provider'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const baloo = Baloo_2({
  subsets: ['latin'],
  variable: '--font-baloo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NeuroPathway Safe Space',
  description:
    'A calm, child-led wellbeing space to express feelings, record experiences and share your voice with trusted adults. Part of the NeuroPathway ecosystem by Social Innovation CIC.',
  generator: 'v0.app',
  applicationName: 'NeuroPathway Safe Space',
  manifest: '/manifest.json',
  icons: {
    icon: '/images/neuropathway-logo.jpeg',
    apple: '/images/neuropathway-logo.jpeg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Safe Space',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f6fd' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1a3a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className={`${nunito.variable} ${baloo.variable} font-sans antialiased`}>
        <Suspense fallback={null}>
          <SettingsProvider>
            <DataProvider>{children}</DataProvider>
          </SettingsProvider>
        </Suspense>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
