'use client'

import { ThemeProvider } from 'next-themes'
import { CartProvider } from '@/context/CartContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
    >
      <CartProvider>
        {children}
      </CartProvider>
    </ThemeProvider>
  )
} 