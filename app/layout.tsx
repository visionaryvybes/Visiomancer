import type { Metadata } from 'next'
import './globals.css'
import RootLayoutClient from '../components/RootLayoutClient'

export const metadata: Metadata = {
  title: 'VISIOMANCER - Unique Art & Design Products',
  description: 'Discover unique art prints, posters, and wall art at VISIOMANCER. Premium quality products with worldwide shipping.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'VISIOMANCER Store',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VISIOMANCER Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@visiomancer',
    creator: '@visiomancer',
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    'art prints',
    'wall art',
    'posters',
    'digital art',
    'home decor',
    'art store',
    'unique designs',
    'premium prints'
  ],
  authors: [{ name: 'VISIOMANCER' }],
  category: 'E-commerce',
  verification: {
    google: 'google-site-verification',
    other: {
      yandex: 'yandex-verification',
      bing: 'bing-verification'
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <RootLayoutClient>{children}</RootLayoutClient>
    </html>
  )
} 