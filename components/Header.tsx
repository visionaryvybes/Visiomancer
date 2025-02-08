'use client'

import React, { useState } from "react"
import Link from "next/link"
import { ShoppingCart, User, Menu, X, Search } from "lucide-react"
import SearchBar from "./SearchBar"
import { useCart } from "../context/CartContext"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Perspective lines decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'rotateX(60deg) translateZ(0)',
            transformOrigin: '50% 0%',
            maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          }}
        />
      </div>

      {/* Glowing border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="relative border-b border-white/10 bg-[#0B1120]/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between gap-4">
            <Link href="/" className="flex-shrink-0 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            VISIONMANCER
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden flex-1 items-center gap-6 md:flex">
            <div className="flex-1 px-4">
                <div className="group relative">
                  <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 blur transition group-hover:opacity-100" />
                  <div className="relative flex items-center rounded-lg border border-white/10 bg-black/20">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                      className="w-full rounded-lg bg-transparent px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>
              </div>
              <Link href="/products" className="text-sm font-medium text-gray-300 transition-all hover:text-white hover:shadow-lg hover:shadow-blue-500/10">
              Products
            </Link>
              <Link href="/categories" className="text-sm font-medium text-gray-300 transition-all hover:text-white hover:shadow-lg hover:shadow-blue-500/10">
              Categories
            </Link>
              <Link href="/account" className="group relative text-gray-300 transition-all hover:text-white">
                <div className="absolute -inset-2 rounded-full bg-blue-500/20 opacity-0 blur transition group-hover:opacity-100" />
                <User className="relative h-5 w-5" />
            </Link>
              <Link href="/cart" className="group relative text-gray-300 transition-all hover:text-white">
                <div className="absolute -inset-2 rounded-full bg-blue-500/20 opacity-0 blur transition group-hover:opacity-100" />
                <ShoppingCart className="relative h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
              className="relative text-gray-300 hover:text-white md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-white/10 md:hidden">
              <div className="space-y-4 p-4">
                <div className="relative">
                  <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-75 blur" />
                  <div className="relative">
                <SearchBar />
                  </div>
              </div>
              <div className="flex flex-col space-y-4">
                <Link
                  href="/products"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-blue-500/10 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/categories"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-blue-500/10 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  href="/account"
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-blue-500/10 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Account</span>
                </Link>
                <Link
                  href="/cart"
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-blue-500/10 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
                        {itemCount}
                      </span>
                    )}
                  </div>
                  <span>Cart</span>
                </Link>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </header>
  )
} 