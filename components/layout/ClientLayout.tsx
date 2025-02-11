'use client'

import React from 'react'
import Header from '../Header'
import Footer from '../Footer'
import { PageTransition } from "./PageTransition"
import { motion, AnimatePresence } from "framer-motion"
import { CartProvider } from '../../context/CartContext'
import { GlobalUI } from '../GlobalUI'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-foreground antialiased">
      <CartProvider>
        {/* Background Grid */}
        <div 
          className="pointer-events-none fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-20"
          style={{
            mask: 'linear-gradient(to bottom, white, transparent)',
            WebkitMask: 'linear-gradient(to bottom, white, transparent)'
          }}
        />
        
        {/* Global UI Elements */}
        <GlobalUI />
        
        {/* Main Layout */}
        <div className="relative">
          <Header />
          <PageTransition>
            <main className="container mx-auto min-h-screen px-4 pb-16 pt-8">
              <AnimatePresence mode="wait">
                {children}
              </AnimatePresence>
            </main>
          </PageTransition>
          <Footer />
        </div>
      </CartProvider>
    </div>
  )
} 