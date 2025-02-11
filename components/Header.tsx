'use client'

import React, { useState } from "react"
import Link from "next/link"
import { ShoppingCart, User, Menu, X, Search } from "lucide-react"
import SearchBar from "./SearchBar"
import { useCart } from "../context/CartContext"
import { LanguageSelector } from "./ui/language-selector"
import { CurrencySelector } from "./ui/currency-selector"
import { MiniCart } from "./ui/mini-cart"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar with gradient background */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-blue-700 to-indigo-600">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-end gap-4 py-2 text-sm text-white/90">
            <LanguageSelector />
            <div className="w-px h-4 bg-white/20" />
            <CurrencySelector />
          </div>
        </div>
      </div>

      {/* Main header with glass effect */}
      <div className="relative border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <nav className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                VISIOMANCER
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden flex-1 items-center gap-8 md:flex">
              <div className="flex-1 px-4">
                <SearchBar />
              </div>
              <Link href="/products" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
                Products
              </Link>
              <Link href="/categories" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
                Categories
              </Link>
              <Link href="/about" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
                Contact
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden items-center gap-6 md:flex">
              <Link 
                href="/account" 
                className="text-white/90 hover:text-white transition-colors"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>
              <MiniCart />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white/90 hover:text-white md:hidden"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[6.5rem] z-50 bg-black/95 backdrop-blur-xl md:hidden">
          <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
              <SearchBar />
            </div>
            <nav className="space-y-6">
              <Link
                href="/products"
                className="block text-lg font-medium text-white/90 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="block text-lg font-medium text-white/90 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/about"
                className="block text-lg font-medium text-white/90 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block text-lg font-medium text-white/90 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-6 border-t border-white/10">
                <div className="flex flex-col gap-4">
                  <LanguageSelector />
                  <CurrencySelector />
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
} 