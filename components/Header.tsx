'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Home, ShoppingBag, Heart, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { usePathname } from 'next/navigation'

const navigationItems = [
  { name: 'Products', href: '/products' },
  { name: 'Categories', href: '/categories' },
  { name: 'About', href: '/about' },
  { name: 'My Account', href: '/account' },
]

export default function Header() {
  const { itemCount } = useCart()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                VISIOMANCER
              </span>
            </Link>

            {/* Main Navigation */}
            <nav className="flex items-center gap-8">
              <Link href="/" className={`flex flex-col items-center ${pathname === '/' ? 'text-blue-500' : 'text-white/70 hover:text-white'}`}>
                <Home className="h-6 w-6" />
                <span className="mt-1 text-xs">Home</span>
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`flex flex-col items-center ${isMenuOpen ? 'text-blue-500' : 'text-white/70 hover:text-white'}`}
              >
                {isMenuOpen ? (
                  <>
                    <X className="h-6 w-6" />
                    <span className="mt-1 text-xs">Close</span>
                  </>
                ) : (
                  <>
                    <Menu className="h-6 w-6" />
                    <span className="mt-1 text-xs">Menu</span>
                  </>
                )}
              </button>

              <Link href="/wishlist" className={`flex flex-col items-center ${pathname === '/wishlist' ? 'text-blue-500' : 'text-white/70 hover:text-white'}`}>
                <Heart className="h-6 w-6" />
                <span className="mt-1 text-xs">Wishlist</span>
              </Link>

              <Link href="/cart" className={`flex flex-col items-center relative ${pathname === '/cart' ? 'text-blue-500' : 'text-white/70 hover:text-white'}`}>
                <ShoppingBag className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
                    {itemCount}
                  </span>
                )}
                <span className="mt-1 text-xs">Cart</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-64 transform bg-gradient-to-b from-blue-950 to-black p-6 shadow-xl">
            <div className="mt-16 flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium text-white/70 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
} 