'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, ShoppingBag, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'

const navigationItems = [
  { name: 'Products', href: '/products' },
  { name: 'Categories', href: '/categories' },
  { name: 'About', href: '/about' },
  { name: 'My Account', href: '/account' },
]

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { itemCount } = useCart()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('mobile-menu')
      const menuButton = document.getElementById('menu-button')
      if (isOpen && menu && !menu.contains(event.target as Node) && menuButton && !menuButton.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      // Restore body scroll when menu is closed
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Overlay - Lowest z-index */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}

      {/* Fixed Bottom Navigation - Middle z-index */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/90 backdrop-blur-lg">
        <div className="flex items-center justify-around px-2 py-3">
          <Link href="/" className="flex flex-col items-center">
            <div className={`rounded-full p-2 ${pathname === '/' ? 'text-blue-500' : 'text-white/70'}`}>
              <Home className="h-5 w-5" />
            </div>
            <span className="mt-0.5 text-xs">Home</span>
          </Link>

          <Link href="/cart" className="flex flex-col items-center">
            <div className={`relative rounded-full p-2 ${pathname === '/cart' ? 'text-blue-500' : 'text-white/70'}`}>
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="mt-0.5 text-xs">Cart</span>
          </Link>

          <Link href="/wishlist" className="flex flex-col items-center">
            <div className={`rounded-full p-2 ${pathname === '/wishlist' ? 'text-blue-500' : 'text-white/70'}`}>
              <Heart className="h-5 w-5" />
            </div>
            <span className="mt-0.5 text-xs">Wishlist</span>
          </Link>

          <button
            id="menu-button"
            onClick={toggleMenu}
            className="flex flex-col items-center"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <div className="rounded-full p-2 text-white/70">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </div>
            <span className="mt-0.5 text-xs">{isOpen ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </nav>

      {/* Side Navigation Menu - Highest z-index */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-y-0 right-0 z-50 w-64 transform bg-gradient-to-b from-blue-950 to-black p-6 shadow-xl transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Site Logo/Home Link */}
        <Link 
          href="/" 
          className="mb-8 block text-xl font-bold text-white hover:text-blue-400"
          onClick={() => setIsOpen(false)}
        >
          VISIOMANCER
        </Link>

        <div className="flex flex-col space-y-4">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-lg font-medium transition-colors ${
                pathname === item.href
                  ? 'text-blue-400'
                  : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
} 