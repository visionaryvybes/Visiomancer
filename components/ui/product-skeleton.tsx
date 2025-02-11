'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function ProductSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-lg bg-white">
      <motion.div
        className="aspect-square bg-white"
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="h-full w-full bg-black/5" />
      </motion.div>
      <div className="bg-black p-4 space-y-3">
        <motion.div
          className="h-4 w-3/4 rounded bg-white/10"
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="h-4 w-1/2 rounded bg-white/10"
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
        />
        <div className="flex items-center justify-between pt-2">
          <motion.div
            className="h-6 w-20 rounded bg-white/10"
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div
            className="h-4 w-16 rounded bg-white/10"
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
} 