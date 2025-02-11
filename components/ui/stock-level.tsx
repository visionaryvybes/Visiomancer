'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'

interface StockLevelProps {
  quantity: number
  lowStockThreshold?: number
}

export function StockLevel({
  quantity,
  lowStockThreshold = 5
}: StockLevelProps) {
  if (quantity <= 0) {
    return (
      <div className="flex items-center text-destructive text-sm">
        <AlertCircle className="w-4 h-4 mr-1" />
        Out of Stock
      </div>
    )
  }

  if (quantity <= lowStockThreshold) {
    return (
      <div className="flex items-center text-accent text-sm">
        <AlertCircle className="w-4 h-4 mr-1" />
        Only {quantity} left in stock
      </div>
    )
  }

  return (
    <div className="text-sm text-foreground/60">
      In Stock
    </div>
  )
} 