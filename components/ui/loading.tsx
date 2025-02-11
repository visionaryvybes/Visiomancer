'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
}

export function Loading({ size = 'md', className = '' }: LoadingProps) {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizes[size]} ${className}`}
        animate={{
          rotate: 360,
          borderRadius: ['25%', '50%', '25%']
        }}
        transition={{
          duration: 2,
          ease: 'linear',
          repeat: Infinity
        }}
        style={{
          border: '3px solid rgba(255, 255, 255, 0.1)',
          borderTopColor: 'rgba(255, 255, 255, 0.9)',
          borderRightColor: 'rgba(255, 255, 255, 0.4)',
          borderBottomColor: 'rgba(255, 255, 255, 0.1)'
        }}
      />
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Loading size="lg" />
    </div>
  )
}

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Loading size="lg" />
    </div>
  )
} 