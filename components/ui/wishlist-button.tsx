'use client'

import React, { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Button } from './button'
import { toast } from 'sonner'

interface Product {
  id: string
  title: string
  images: { src: string }[]
  variants: Array<{
    id: string
    price: number
  }>
}

interface WishlistButtonProps {
  product: Product
}

export function WishlistButton({ product }: WishlistButtonProps) {
  const [mounted, setMounted] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const { getItem, setItem } = useLocalStorage()

  // Only run on client-side
  useEffect(() => {
    setMounted(true)
    // Check wishlist status after component mounts
    const wishlist = getItem<Product[]>('wishlist', [])
    setIsInWishlist(wishlist.some((item: Product) => item.id === product.id))
  }, [product.id, getItem])

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent event bubbling
    if (!mounted) return

    const wishlist = getItem<Product[]>('wishlist', [])
    if (isInWishlist) {
      const newWishlist = wishlist.filter((item: Product) => item.id !== product.id)
      setItem('wishlist', newWishlist)
      setIsInWishlist(false)
      toast.success('Removed from wishlist')
    } else {
      const newWishlist = [...wishlist, product]
      setItem('wishlist', newWishlist)
      setIsInWishlist(true)
      toast.success('Added to wishlist')
    }
  }

  // Return null during server-side rendering and initial mount
  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleWishlist}
      className={`h-11 w-11 ${
        isInWishlist
          ? 'bg-pink-500/90 text-white hover:bg-pink-500 border-transparent'
          : 'bg-white/90 text-black hover:bg-white border-transparent'
      }`}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`h-5 w-5 transition-all ${isInWishlist ? 'fill-current scale-110' : 'scale-100'}`}
      />
    </Button>
  )
} 