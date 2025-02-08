'use client'

import React from "react"

interface AddToCartButtonProps {
  onClick: () => void
}

export default function AddToCartButton({ onClick }: AddToCartButtonProps) {
  return (
    <button 
      className="rounded-lg bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 transition-all hover:bg-blue-500/20 hover:text-blue-300 active:scale-95"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      Add to Cart
    </button>
  )
} 