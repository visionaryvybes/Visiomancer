import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MobileNavigation from '../components/MobileNavigation'
import BackToTop from '../components/BackToTop'
import Header from '../components/Header'
import { cn } from '@/lib/utils'
import { Toaster } from 'sonner'
import { CartProvider } from '@/context/CartContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VISIOMANCER',
  description: 'Premium art prints and merchandise.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  icons: {
    icon: '/favicon.svg',
  },
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
    <html lang="en" className="dark">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <CartProvider>
          <Header />
          <main className="pt-16">
            {children}
          </main>
          <MobileNavigation />
          <BackToTop />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
} 