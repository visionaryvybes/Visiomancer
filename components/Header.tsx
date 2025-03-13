'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, User, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Header() {
  const { itemCount, setCartOpen } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              VISIOMANCER
            </span>
          </Link>
          
          {/* Desktop Navigation Links */}
          <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
            <Link href="/products" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
              Products
            </Link>
            <Link href="/categories" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
              About
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link 
              href="/account" 
              className="text-white/90 hover:text-white transition-colors"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <button 
              onClick={() => setCartOpen(true)}
              className="relative text-white/90 hover:text-white transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
                  {itemCount}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              className="ml-2 text-white/90 hover:text-white md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 pt-16 md:hidden">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col space-y-6">
              <Link 
                href="/products" 
                className="text-xl font-medium text-white/90 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/categories" 
                className="text-xl font-medium text-white/90 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/about" 
                className="text-xl font-medium text-white/90 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/account" 
                className="text-xl font-medium text-white/90 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 