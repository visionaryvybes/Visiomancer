'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function ProductSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* Breadcrumbs */}
        <div className="mb-8 flex items-center gap-2">
          <div className="h-4 w-12 bg-white/10 rounded" />
          <div className="h-4 w-4 bg-white/10 rounded" />
          <div className="h-4 w-20 bg-white/10 rounded" />
          <div className="h-4 w-4 bg-white/10 rounded" />
          <div className="h-4 w-32 bg-white/10 rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="aspect-square bg-white/10 rounded-lg" />

          {/* Product Info */}
          <div className="space-y-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="h-12 w-3/4 bg-white/10 rounded mb-4" />
                <div className="h-8 w-1/4 bg-white/10 rounded" />
              </div>
              <div className="h-10 w-10 bg-white/10 rounded" />
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <div className="h-8 w-1/3 bg-white/10 rounded" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-white/10 rounded" />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <div className="h-6 w-1/4 bg-white/10 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-white/10 rounded" />
                <div className="h-4 w-5/6 bg-white/10 rounded" />
                <div className="h-4 w-4/6 bg-white/10 rounded" />
              </div>
            </div>

            {/* Add to Cart */}
            <div className="h-12 w-full bg-white/10 rounded" />

            {/* Additional Info */}
            <div className="space-y-6 border-t border-white/10 pt-8">
              <div>
                <div className="h-6 w-1/4 bg-white/10 rounded mb-2" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                </div>
              </div>
              
              <div>
                <div className="h-6 w-1/4 bg-white/10 rounded mb-2" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 space-y-8">
          <div className="h-8 w-1/4 bg-white/10 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-white/10 rounded" />
                <div className="h-6 w-3/4 bg-white/10 rounded" />
                <div className="h-4 w-1/4 bg-white/10 rounded" />
              </div>
            ))}
          </div>
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