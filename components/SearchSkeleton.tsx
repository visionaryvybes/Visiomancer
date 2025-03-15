'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function SearchSkeleton() {
  return (
    <div className="space-y-8">
      {/* Search Header Skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="h-8 w-64 bg-white/10 rounded-lg animate-pulse" />
        <div className="flex items-center gap-4">
          <div className="h-10 w-40 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-10 w-24 bg-white/10 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Filter Panel Skeleton */}
      <div className="p-6 rounded-lg bg-white/5 border border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 w-24 bg-white/10 rounded-lg animate-pulse" />
              <div className="h-10 w-full bg-white/10 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Results Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden bg-white/5 animate-pulse">
            <div className="aspect-square bg-white/10" />
            <div className="p-4 space-y-2">
              <div className="h-5 w-3/4 bg-white/10 rounded-lg" />
              <div className="h-4 w-1/2 bg-white/10 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 