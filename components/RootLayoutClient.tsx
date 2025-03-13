'use client'

import React from 'react'
import { CartProvider } from '../context/CartContext'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from 'next-themes'
import Header from './Header'
import Footer from './Footer'
import Cart from './Cart'
import { ScrollToTop } from './ui/scroll-to-top'
import { TrustBadges } from './ui/trust-badges'
import { NewsletterPopup } from './ui/newsletter-popup'
import { WarpBackground } from './ui/warp-background'
import { Button } from './ui/button'
import { X } from 'lucide-react'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [showAnnouncement, setShowAnnouncement] = React.useState(true)

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
    >
      <CartProvider>
        {/* Announcement Bar */}
        {showAnnouncement && (
          <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white">
            <div className="container mx-auto flex items-center justify-between">
              <p className="text-sm font-medium">
                🎉 Welcome to VISIOMANCER! Free shipping on orders over $50
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setShowAnnouncement(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Header */}
        <Header />

        {/* Main Content */}
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={Math.random()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Trust Badges and Footer */}
        <TrustBadges />
        <Footer />

        {/* Floating Elements */}
        <Cart />
        <ScrollToTop />
        <NewsletterPopup />
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        />
        <Analytics />
        <SpeedInsights />
      </CartProvider>
    </ThemeProvider>
  )
} 