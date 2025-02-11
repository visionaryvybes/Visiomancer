'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [hasSubscribed, setHasSubscribed] = useState(false)

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('newsletter-popup-seen')
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 5000) // Show after 5 seconds
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('newsletter-popup-seen', 'true')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter signup API
    setHasSubscribed(true)
    setTimeout(handleClose, 2000) // Close after showing success message
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />
      <div className="relative bg-background rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-foreground/60 hover:text-foreground"
        >
          <X size={20} />
          <span className="sr-only">Close newsletter popup</span>
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Join Our Newsletter</h2>
          <p className="text-foreground/80 mb-6">
            Subscribe to get special offers, free giveaways, and amazing deals.
          </p>

          {hasSubscribed ? (
            <div className="text-green-600 font-medium">
              Thanks for subscribing! 🎉
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
} 