'use client'

import React, { useState } from "react"
import { useCart } from "../context/CartContext"
import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"

interface AddToCartButtonProps {
  product: {
    id: string
    title: string
    images: { src: string }[]
  }
  variant: {
    id: string
    price: number
  }
}

export default function AddToCartButton({ product, variant }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart({
      id: product.id,
      title: product.title,
      price: variant.price,
      image: product.images[0]?.src || '/placeholder.jpg',
      variantId: variant.id
    })
    
    toast.success('Added to cart', {
      description: `${product.title} has been added to your cart.`
    })
    
    setTimeout(() => setIsAdding(false), 500)
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-8 py-4 font-semibold text-white transition-all hover:bg-blue-600 disabled:opacity-50"
    >
      <ShoppingCart className="h-5 w-5" />
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </button>
  )
} 