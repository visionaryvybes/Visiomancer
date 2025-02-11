'use client'

import React from 'react'
import { ThemeProvider } from './theme-provider'
import { CartProvider } from '../../context/CartContext'
import { Toaster } from 'sonner'
import { AnimatePresence } from 'framer-motion'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <CartProvider>
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--background)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
            },
          }}
        />
      </CartProvider>
    </ThemeProvider>
  )
} 