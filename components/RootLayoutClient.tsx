'use client'

import React from 'react'
import { CartProvider } from '../context/CartContext'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './providers/theme-provider'
import Header from './Header'
import Footer from './Footer'
import Cart from './Cart'
import { ScrollToTop } from './ui/scroll-to-top'
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
      enableSystem
      disableTransitionOnChange
    >
      <CartProvider>
        <div className="relative min-h-screen">
          {/* Announcement Bar */}
          {showAnnouncement && (
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white">
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

          {/* Background Pattern */}
          <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-black to-black" />
          
          {/* Content */}
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <AnimatePresence mode="wait">
              <motion.main
                key={Math.random()} // Force re-render on route change
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1"
              >
                {children}
              </motion.main>
            </AnimatePresence>
            <Footer />
          </div>

          {/* Floating Elements */}
          <Cart />
          <ScrollToTop />
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
        </div>
        <Analytics />
        <SpeedInsights />
      </CartProvider>
    </ThemeProvider>
  )
} 