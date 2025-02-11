'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface AnnouncementBarProps {
  messages: string[]
  interval?: number
}

export function AnnouncementBar({ messages, interval = 5000 }: AnnouncementBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (messages.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length)
    }, interval)

    return () => clearInterval(timer)
  }, [messages, interval])

  if (!isVisible || messages.length === 0) return null

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 relative">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <p className="text-sm text-center animate-fade-in">
          {messages[currentIndex]}
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground/80 hover:text-primary-foreground"
        >
          <X size={16} />
          <span className="sr-only">Close announcement</span>
        </button>
      </div>
    </div>
  )
} 