'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

const categoryKeywords = {
  "posters": ["poster", "print", "art print", "wall art"],
  "apparel": ["shirt", "t-shirt", "hoodie", "sweatshirt", "clothing", "tee", "unisex"],
  "accessories": ["hat", "cap", "bag", "accessory", "patch", "dad hat", "leather"],
  "home-decor": ["home", "decor", "decoration", "wall art", "poster"],
  "automotive": ["ford gt", "car", "racing", "automotive", "vehicle"],
  "minimalist": ["minimalist", "simple", "clean", "awaken"]
}

const categoryDisplayNames = {
  "posters": "Posters",
  "apparel": "Apparel",
  "accessories": "Accessories",
  "home-decor": "Home Decor",
  "automotive": "Automotive",
  "minimalist": "Minimalist"
}

interface MobileCategoryNavProps {
  isLoading?: boolean
  error?: string | null
}

export default function MobileCategoryNav({ isLoading, error }: MobileCategoryNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category')

  const formatCategoryName = (category: string): string => {
    return categoryDisplayNames[category as keyof typeof categoryDisplayNames] || 
      category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'Escape':
          setIsOpen(false)
          buttonRef.current?.focus()
          break
        case 'Tab':
          if (!event.shiftKey && event.target === document.activeElement) {
            const focusableElements = dropdownRef.current?.querySelectorAll(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
            if (focusableElements && focusableElements.length > 0) {
              event.preventDefault()
              ;(focusableElements[0] as HTMLElement).focus()
            }
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  if (error) {
    return (
      <div className="relative mb-4 px-4 md:hidden">
        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500" role="alert">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="relative mb-4 px-4 md:hidden">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex w-full items-center justify-between rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="category-dropdown"
        aria-label="Select category"
      >
        <span className="flex items-center gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {activeCategory ? formatCategoryName(activeCategory) : 'All Categories'}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && !isLoading && (
          <motion.div
            ref={dropdownRef}
            id="category-dropdown"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="category-button"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-4 right-4 top-full z-50 mt-1 overflow-hidden rounded-lg bg-black/90 backdrop-blur-lg"
          >
            <div className="divide-y divide-white/10">
              <Link
                href="/products"
                role="menuitem"
                className={`block px-4 py-2 text-sm ${
                  !activeCategory
                    ? 'bg-blue-500 text-white'
                    : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => setIsOpen(false)}
                tabIndex={isOpen ? 0 : -1}
              >
                All Products
              </Link>
              {Object.keys(categoryKeywords).map((category) => (
                <Link
                  key={category}
                  href={`/products?category=${category}`}
                  role="menuitem"
                  className={`block px-4 py-2 text-sm ${
                    activeCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                  onClick={() => setIsOpen(false)}
                  tabIndex={isOpen ? 0 : -1}
                >
                  {formatCategoryName(category)}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 